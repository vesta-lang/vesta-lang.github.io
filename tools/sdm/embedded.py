"""Recuperacion de las tablas incrustadas en la prosa.

Noventa descripciones del manual llevan una tabla dentro, rotulada como
`Table 3-17. Operation of PEXTRB`. Esas tablas llegan mal en el volcado que se
usa para la prosa -- las columnas se descuadran y las filas se desincronizan --
y bien en el volcado en modo tabla, que a cambio destroza los parrafos.

Este modulo es el puente entre los dos: localiza la tabla por su rotulo en el
texto de la prosa, la busca por el MISMO rotulo en el volcado de tablas, y
devuelve sus filas ya leidas.

El rotulo es lo que hace posible el emparejamiento. Es unico dentro del manual,
aparece literal en los dos volcados y no depende de posiciones ni de contar
lineas, que es lo que se romperia con cualquier reedicion.
"""

import re

from . import tables

# Rotulo de tabla del manual: `Table 3-17. Operation of PEXTRB`.
CAPTION = re.compile(r"^\s*(Table\s+\d+-\d+\.)\s*(.*)$")

# Un rotulo de figura marca el final de una tabla tan bien como otra tabla.
FIGURE = re.compile(r"^\s*Figure\s+\d+-\d+\.")

# Lineas en blanco seguidas que dan una tabla por terminada. Con menos, se
# corta en el hueco que el manual deja entre el encabezado y las filas.
BLANK_RUN = 3


def captions(lines):
    """Devuelve los rotulos de tabla que aparecen en unas lineas.

    @param lines Lineas de una seccion, del volcado de prosa.
    @returns Lista de `(indice, rotulo, titulo)`.
    """
    out = []
    for i, line in enumerate(lines):
        m = CAPTION.match(line)
        if m:
            out.append((i, m.group(1).strip(), m.group(2).strip()))
    return out


# Paginas de mas que se miran despues del final de la instruccion.
#
# Una tabla que no cabe en su pagina FLOTA a la siguiente, y si la instruccion
# termina ahi, la tabla acaba impresa dentro del rango de la entrada siguiente.
# Sin este margen se pierden las de `CMPPS`, `CMPSS` y `FSCALE`, que es
# exactamente el caso.
#
# Ampliar no confunde una tabla con otra: el rotulo `Table 3-20.` es unico en
# el manual, de modo que lo que se encuentre con ese nombre es lo que se busca
# venga de la pagina que venga.
FLOAT_SLACK = 3


def locate(table_pages, first, last, label):
    """Encuentra las lineas de una tabla en el volcado de tablas.

    La busqueda arranca en la primera pagina de la instruccion y se extiende
    un poco mas alla del final, por las tablas que flotan. No se busca en todo
    el manual para que una referencia cruzada desde otra entrada no gane a la
    tabla de verdad.

    @param table_pages Paginas del volcado en modo tabla.
    @param first Primera pagina de la instruccion.
    @param last Pagina siguiente a la ultima.
    @param label Rotulo, por ejemplo `Table 3-17.`.
    @returns Lineas de la tabla, o lista vacia si no aparece.
    """
    body = []
    for index in range(first, min(last + FLOAT_SLACK, len(table_pages))):
        body.extend(table_pages[index].split("\n"))

    # El rotulo se compara con los espacios normalizados. El volcado en modo
    # tabla trata la linea del rotulo como una fila mas y le ajusta las
    # columnas, de modo que `Table 3-12.` se imprime `Table  3-12.` con doble
    # espacio. Comparar el texto literal fallaba en dieciseis tablas que si
    # estaban donde debian.
    wanted = " ".join(label.split())

    # Primera pasada: el rotulo abre la linea, que es el caso normal.
    start = None
    for i, line in enumerate(body):
        if " ".join(line.split()).startswith(wanted):
            start = i + 1
            break

    # Segunda pasada: el rotulo va incrustado en mitad de la linea. Pasa cuando
    # el volcado en modo tabla fusiona el numero de seccion con el rotulo, como
    # en `4.1.3 Aggregation Operation Table 4-2. Aggregation Operation`.
    #
    # Va DESPUES y no antes por precaucion: una referencia cruzada desde otra
    # frase ("listed in Table 3-12.") tambien casa en mitad de linea, y solo se
    # acepta cuando no hay ninguna aparicion mejor.
    if start is None:
        for i, line in enumerate(body):
            if wanted in " ".join(line.split()):
                start = i + 1
                break

    if start is None:
        return []

    out, blanks = [], 0
    for line in body[start:]:
        text = line.strip()

        if not text:
            blanks += 1
            # Una racha larga de lineas vacias significa que la tabla acabo o
            # que cambio de pagina; en cualquier caso, ya no hay filas.
            if blanks >= BLANK_RUN and out:
                break
            continue

        blanks = 0

        # Otro rotulo, una figura o un encabezado de seccion cierran la tabla.
        if CAPTION.match(line) or FIGURE.match(line):
            break
        if _looks_like_heading(text):
            break

        out.append(line.rstrip())

    return out


def _looks_like_heading(text):
    """Indica si una linea parece un encabezado de seccion del manual."""
    from . import sections
    return sections.is_heading(text)


def extract(table_pages, first, last, label):
    """Devuelve una tabla incrustada, ya leida en cabecera y filas.

    @returns `{head, rows}`, o `None` si la tabla no se pudo recuperar.
    """
    lines = locate(table_pages, first, last, label)
    if not lines:
        return None

    # Las tablas de la prosa incluyen matrices cuyo encabezado es la linea
    # con mas columnas, no la primera.
    # Sin absorcion: en una matriz las lineas de debajo del encabezado son
    # datos, y absorberlas se come las primeras filas.
    # La tabla termina donde empieza la prosa: en un capitulo, el parrafo
    # siguiente viene pegado sin linea en blanco de por medio.
    parsed = tables.parse(lines, header=tables.widest, absorb=False,
                          stop_on_prose=True)
    return parsed if parsed["rows"] else None


def replace(lines, table_pages, first, last):
    """Sustituye los rotulos de tabla por la tabla que nombran.

    Devuelve una lista de piezas, cada una prosa o tabla, en el orden en que
    aparecen. Las lineas del volcado de prosa que pertenecian a la tabla se
    descartan: son la version desalineada de lo que se acaba de recuperar bien.

    @param lines Lineas de una seccion, del volcado de prosa.
    @param table_pages Paginas del volcado en modo tabla.
    @param first Primera pagina de la instruccion.
    @param last Pagina siguiente a la ultima.
    @returns Lista de `{"kind": "prose"|"table", ...}`.
    """
    marks = captions(lines)
    if not marks:
        return [{"kind": "prose", "lines": lines}]

    out = []
    cursor = 0

    for index, label, title in marks:
        if index > cursor:
            out.append({"kind": "prose", "lines": lines[cursor:index]})

        table = extract(table_pages, first, last, label)
        if table:
            out.append({"kind": "table", "label": label, "title": title, **table})
            cursor = _skip_table(lines, index + 1)
        else:
            # Sin recuperacion no se descarta nada: es preferible publicar la
            # version desalineada, que se ve mal, que perder el contenido, que
            # no se ve en absoluto.
            out.append({"kind": "prose", "lines": lines[index:index + 1]})
            cursor = index + 1

    if cursor < len(lines):
        out.append({"kind": "prose", "lines": lines[cursor:]})

    return out


def _skip_table(lines, start):
    """Devuelve donde termina, en la prosa, la tabla que empieza en `start`."""
    blanks = 0
    for i in range(start, len(lines)):
        text = lines[i].strip()
        if not text:
            blanks += 1
            if blanks >= BLANK_RUN:
                return i
            continue
        blanks = 0
        if CAPTION.match(lines[i]) or FIGURE.match(lines[i]):
            return i
    return len(lines)
