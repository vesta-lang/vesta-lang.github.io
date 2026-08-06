"""Capitulos que documentan una instruccion desde fuera de su entrada.

El manual no siempre documenta una instruccion en su propia entrada. `CPUID`
es el caso extremo: su entrada ocupa dos paginas y remite al capitulo 21 del
volumen 1, donde estan las noventa y seis paginas que describen cada hoja, con
ochenta y siete tablas. En ediciones anteriores eso vivia dentro de la entrada;
Intel lo movio, y una extraccion que solo mire la entrada publica una pagina
casi vacia sin que nada avise.

Estos capitulos se importan como documento **acompanante**, no como parte de la
entrada. Meterlos dentro daria una pagina de trescientos kilobytes donde lo que
se buscaba -- el opcode -- queda enterrado; y ademas son capitulos, no
descripciones de instruccion: tienen su propia estructura de secciones.

El registro es explicito y corto. Adivinar que capitulo acompana a que
instruccion a partir de las referencias cruzadas del texto produciria falsos
positivos en masa, porque el manual se cita a si mismo constantemente.
"""

import re

# Instruccion -> capitulo que la documenta.
#
# El capitulo se localiza por su cabecera de pagina y no por numero: el manual
# se reedita y las paginas se desplazan, pero la cabecera se mantiene.
#
# El contenido se integra en el documento de la instruccion, no en un fichero
# aparte. Una instruccion es una entrada y una entrada es un documento por
# idioma: partirla obligaria a traducir dos ficheros y a que quien la lea
# sepa que hay un segundo sitio donde mirar.
#
# Que el manual lo publique en otro capitulo es una decision de Intel sobre
# como paginar un PDF, no sobre que documenta que.
COMPANIONS = {
    "cpuid": {
        "header": "PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION",
        "title": "CPUID leaves",
    },
}

# Encabezado de seccion dentro de un capitulo: `21.1.3 CPUID Basic and
# Extended Range`.
HEADING = re.compile(r"^(\d+\.\d+(?:\.\d+)*)\s+(\S.*)$")


def locate(pages_layout, header):
    """Devuelve el rango de paginas de un capitulo, por su cabecera.

    Se busca la cabecera en la parte alta de cada pagina, que es donde el
    manual repite el titulo del capitulo. Aparece tambien en el indice general,
    cientos de paginas antes, y por eso se exige que sea una racha continua: el
    indice son lineas sueltas, el capitulo son decenas de paginas seguidas.

    @param pages_layout Paginas del volcado de prosa.
    @param header Texto de la cabecera del capitulo.
    @returns `(primera, ultima)` con la ultima excluida, o `None`.
    """
    hits = [i for i, page in enumerate(pages_layout) if header in page[:300]]
    if len(hits) < 3:
        return None

    # La racha mas larga de paginas consecutivas es el capitulo.
    best = run = [hits[0]]
    for previous, current in zip(hits, hits[1:]):
        if current - previous <= 2:
            run.append(current)
        else:
            if len(run) > len(best):
                best = run
            run = [current]
    if len(run) > len(best):
        best = run

    return (best[0], best[-1] + 1) if len(best) >= 3 else None


def read(pages_layout, first, last, header):
    """Extrae el capitulo como lista de secciones.

    @returns Lista de `{number, title, lines}`, en orden.
    """
    out = [{"number": None, "title": None, "lines": []}]

    for index in range(first, min(last, len(pages_layout))):
        for line in pages_layout[index].split("\n"):
            text = line.rstrip()
            if not text.strip():
                out[-1]["lines"].append("")
                continue
            # Cabecera y pie de pagina repetidos.
            # Pie de pagina, en cualquiera de sus formas: `Vol. 1 21-7`,
            # `21-6 Vol. 1` o el numero suelto.
            if header in text:
                continue
            if re.search(r"Vol\.\s*\d", text) and len(text.strip()) < 40:
                continue
            if re.match(r"^\s*\d+-\d+\s*$", text):
                continue

            match = HEADING.match(text.strip())
            if match and len(match.group(2)) < 90:
                out.append({"number": match.group(1),
                            "title": match.group(2).strip(),
                            "lines": []})
                continue

            out[-1]["lines"].append(text)

    return [s for s in out if any(l.strip() for l in s["lines"])]


def for_instruction(identifier):
    """Devuelve el capitulo que acompana a una instruccion, si lo tiene."""
    return COMPANIONS.get(identifier)
