"""Composicion del formato `isadoc` a partir de lo extraido del manual.

La especificacion esta en `site/data/isa/FORMAT.md`. Cada instruccion sale como
dos ficheros:

    data.json    lo consultable: opcodes, excepciones, banderas, enlaces
    en.md        el documento, en el idioma de la fuente

El reparto no es de comodidad. Los datos se regeneran enteros en cada
importacion y nadie los edita; el documento se traduce y se corrige a mano, y
por eso vive en su propio fichero, donde una reimportacion no puede pisarlo.

Este modulo no lee nada del manual: recibe lo que los modulos de extraccion ya
entendieron y decide como se guarda.
"""

import re

from . import companion, embedded, operands, sections, text

# Rotulo con que se publica cada seccion conocida. El titulo del manual no se
# conserva: el sitio lo traduce una vez en su plantilla, no ochocientas veces
# en los ficheros.
SECTION_TITLES = {
    "description": "Description",
    "operation": "Operation",
    "flags": "Flags affected",
    "intrinsics": "Intel C/C++ compiler intrinsics",
    "compatibility": "IA-32 architecture compatibility",
}

# Secciones que NO van al documento porque su contenido se guarda estructurado
# en `data.json`: publicarlas ademas como prosa seria decir lo mismo dos veces.
STRUCTURED = ("operand-encoding",)

# Nombres de bandera de x86 que el texto puede nombrar.
FLAG_NAMES = ("CF", "PF", "AF", "ZF", "SF", "TF", "IF", "DF", "OF",
              "IOPL", "NT", "RF", "AC", "VM", "ID")


def flags_named(section_lines):
    """Devuelve las banderas que el texto NOMBRA.

    Se lista lo que se puede extraer sin interpretar. Decir ademas que le pasa
    a cada una -- modificada, indefinida, sin tocar -- exigiria analizar la
    frase, y una promesa de ese tipo mal extraida es peor que no darla.
    """
    text = " ".join(section_lines)
    return [f for f in FLAG_NAMES if re.search(r"\b%s\b" % f, text)]


def exceptions_of(section, modes):
    """Convierte una seccion de excepciones en una lista de objetos.

    El manual las publica como una tabla de dos columnas -- vector y condicion
    -- salvo que una condicion ocupe varias filas: entonces las siguientes
    traen solo el texto y heredan el vector de la anterior. Eso hay que
    reconstruirlo, porque en el fichero cada excepcion tiene que valer sola.

    Algunas paginas lo resuelven con una frase en lugar de una tabla ("Same
    exceptions as in protected mode"), y entonces se guarda sin vector.
    """
    vector = re.compile(r"^#[A-Z]{2,4}(\([^)]*\))?$")
    out, last = [], None

    for line in section["lines"]:
        joined = " ".join(line.split())
        if not joined:
            continue

        parts = re.split(r"\s{2,}", line.strip(), maxsplit=1)
        if len(parts) == 2 and vector.match(parts[0].strip()):
            last = parts[0].strip()
            for mode in modes:
                out.append({"mode": mode, "vector": last,
                            "when": parts[1].strip()})
        elif last and not vector.match(joined):
            # Continuacion de la condicion anterior.
            for entry in out[-len(modes):]:
                entry["when"] = (entry["when"] + " " + joined).strip()
        elif not out:
            for mode in modes:
                out.append({"mode": mode, "vector": None, "when": joined})

    # Las palabras partidas se reunen al final, cuando la condicion ya esta
    # completa: el guion y su continuacion pueden caer en lineas distintas, y
    # entonces no hay nada que unir todavia.
    for entry in out:
        entry["when"] = text.dehyphenate(entry["when"])

    return out


def markdown_of(section, table_pages, first, last):
    """Convierte una seccion en Markdown, con sus tablas ya recuperadas.

    Las tablas se sustituyen por la version bien alineada del otro volcado. La
    prosa se junta en parrafos: el volcado la parte por anchura de pagina, y
    publicarla linea a linea daria un texto cortado a lo ancho de un PDF.

    La seccion `Operation` es una excepcion y va entera en bloque de codigo. Su
    contenido es pseudocodigo de principio a fin, y decidir linea a linea si lo
    parece produce lo peor de los dos mundos: `IF 64-Bit Mode THEN` dentro del
    bloque y el `#UD;` de la linea siguiente fuera.
    """
    if section["id"] == "operation":
        code = [l.rstrip() for l in section["lines"]]  # sin relleno de columna
        while code and not code[0].strip():
            code.pop(0)
        while code and not code[-1].strip():
            code.pop()
        return "```text\n" + "\n".join(code) + "\n```" if code else ""

    out = []

    for piece in embedded.replace(section["lines"], table_pages, first, last):
        if piece["kind"] == "table":
            out.append(_markdown_table(piece))
            continue

        for block in _paragraphs(piece["lines"]):
            out.append(block)

    return "\n\n".join(b for b in out if b.strip())


def _paragraphs(lines):
    """Une las lineas de prosa en parrafos.

    Una linea que empieza con sangria y contiene varios espacios seguidos es
    pseudocodigo o una lista alineada: se conserva tal cual, en bloque de
    codigo, porque reflowarla la destruye.
    """
    out, buffer, verbatim = [], [], []

    def flush_text():
        if buffer:
            out.append(text.dehyphenate(" ".join(buffer)))
            buffer.clear()

    def flush_code():
        if verbatim:
            # Sin recortar el final, el bloque arrastra el relleno con que el
            # volcado completa cada linea hasta el ancho de su columna: son
            # cuarenta mil lineas con espacio sobrante.
            out.append("```text\n" +
                       "\n".join(l.rstrip() for l in verbatim) + "\n```")
            verbatim.clear()

    for line in lines:
        stripped = line.rstrip()
        if not stripped.strip():
            flush_text()
            flush_code()
            continue

        if _is_verbatim(stripped):
            flush_text()
            verbatim.append(stripped)
        else:
            flush_code()
            buffer.append(stripped.strip())

    flush_text()
    flush_code()
    return out


def _is_verbatim(line):
    """Indica si una linea debe conservarse tal cual."""
    if re.match(r"^\s{4,}\S", line) and re.search(r"\S\s{2,}\S", line):
        return True
    # Una almohadilla al principio es un comentario del pseudocodigo. Publicada
    # como prosa, Markdown la lee como titulo de primer nivel: `LDTILECFG`
    # salia con tres `h1` y una pagina no puede tener mas de uno.
    if line.lstrip().startswith("#"):
        return True
    # El pseudocodigo del manual usa `:=` y bloques con sangria.
    return ":=" in line or re.match(r"^\s*(IF|THEN|ELSE|FI;|ENDIF|FOR|WHILE)\b", line)


def _markdown_table(piece):
    """Renderiza una tabla recuperada como tabla de Markdown."""
    head = piece.get("head") or []
    rows = piece.get("rows") or []
    if not rows:
        return ""

    width = max([len(head)] + [len(r) for r in rows])
    names = list(head) + [""] * (width - len(head))

    def cell(text):
        # Una barra vertical dentro de una celda parte la fila en dos.
        return (text or "").replace("|", "\\|")

    lines = ["| " + " | ".join(cell(n) for n in names) + " |",
             "| " + " | ".join("---" for _ in names) + " |"]
    for row in rows:
        cells = list(row) + [""] * (width - len(row))
        lines.append("| " + " | ".join(cell(c) for c in cells) + " |")

    title = piece.get("title")
    return (("**%s**\n\n" % title) if title else "") + "\n".join(lines)


def intrinsics_block(lines):
    """Emite la seccion de intrinsics como codigo C, una por linea.

    El manual las publica seguidas y el volcado las deja en un solo parrafo de
    mas de mil caracteres. Son declaraciones de C, no prosa, y tratarlas como
    prosa costaba tres cosas a la vez: se enviaban al traductor -- que devolvia
    `int`, `const int rounding` y `__m128i` sin tocar, porque no hay nada que
    traducir ahi --, se renderizaban como texto corrido y no habia manera de
    leerlas.

    Se cortan por el punto y coma, que es donde termina cada declaracion.

    @param lines Lineas de la seccion.
    @returns Bloque de codigo en Markdown, o cadena vacia.
    """
    # La seccion termina donde empieza la primera nota al pie. El manual las
    # numera, y sin cortar ahi la nota entera -- con su URL -- se publicaba
    # como si fuera otra declaracion de C.
    kept = []
    for line in lines:
        if re.match(r"^\s*\d+\.\s+\S", line):
            break
        if line.strip():
            kept.append(line.strip())

    text = " ".join(kept)
    declarations = [part.strip() for part in text.split(";") if part.strip()]
    # Una declaracion lleva parentesis. Lo que no los tenga es texto que se
    # colo detras del ultimo punto y coma.
    declarations = [d for d in declarations if "(" in d and ")" in d]
    if not declarations:
        return ""

    out = ["```c"]
    out.extend(declaration + ";" for declaration in declarations)
    out.append("```")
    return "\n".join(out)


def build(entry, layout_pages, table_pages, encodings_read, arch_link):
    """Compone los dos ficheros de una instruccion.

    @param entry Instruccion localizada por `titles`.
    @param layout_pages Paginas del volcado de prosa.
    @param table_pages Paginas del volcado en modo tabla.
    @param encodings_read Funcion que lee la tabla de codificaciones.
    @param arch_link Funcion que devuelve los mnemonicos de arch-data.
    @returns Tupla `(data, markdown)`.
    """
    first, last = entry["pages"]

    # El manual repite el titulo de la entrada arriba de cada pagina, y el
    # volcado lo deja en medio del texto. Se quita de TODAS las lineas y no
    # solo del preambulo: en `AESENC128KL` acababa dentro del bloque de
    # intrinsics, pegado a la ultima declaracion de C.
    title = re.compile(r"^%s\s*--" % re.escape(entry["title"]))
    body = sections.split([
        line for line in sections.clean_pages(layout_pages, first, last)
        if not title.match(line.strip())
    ])

    data = {
        "format": "isadoc",
        "version": 1,
        "isa": "x86",
        "id": entry.get("identifier") or _identifier(entry),
        "mnemonics": entry["mnemonics"],
        "links": {"arch_data": arch_link(entry["mnemonics"])},
        "sources": [{
            "id": "intel-sdm",
            "edition": "325462-091US",
            "pages": [first + 1, last],
        }],
    }

    # Las codificaciones salen del volcado en modo tabla: el de prosa las
    # desincroniza.
    table_body = sections.split(sections.clean_pages(table_pages, first, last))

    # El mismo filtro que arriba. Tiene que reconocer el titulo por su forma
    # completa -- `MNEMONICO--Descripcion` -- y no por el mnemonico a secas: la
    # fila de la sintaxis empieza tambien por el, y descartarla dejaba sin
    # sintaxis a la forma apilada, que es la mayoritaria.
    preamble = [l for l in table_body[0]["lines"] if not title.match(l.strip())]
    forms = encodings_read(preamble)

    # La tabla que dice donde va cada operando. Sin ella se sabe cuantos bytes
    # ocupa una instruccion pero no que poner en ellos, asi que es lo que
    # separa una referencia consultable de una que sirve para ensamblar.
    modes = operands.read(operands.locate(table_pages, first, last))

    # Las dos tablas se leen por separado y se comprueban juntas: una clave de
    # `Op/En` que la columna corto se recompone solo si la tabla de modos la
    # reconoce. Es la unica manera de reparar sin arriesgarse a inventar.
    operands.reconcile(forms, modes)

    if forms:
        data["encodings"] = forms
    if modes:
        data["operand_encodings"] = modes

    document = ["---", "summary: %s" % entry["summary"], "---", ""]

    for section in body:
        if section["id"] in ("preamble",) or section["id"] in STRUCTURED:
            continue

        modes = sections.modes_of(section)
        if modes:
            data.setdefault("exceptions", []).extend(exceptions_of(section, modes))
            continue

        if section["id"] == "flags":
            named = flags_named(section["lines"])
            if named:
                data["flags"] = named

        title = SECTION_TITLES.get(section["id"]) or section["title"] or section["id"]

        if section["id"] == "intrinsics":
            markdown = intrinsics_block(section["lines"])
        else:
            markdown = markdown_of(section, table_pages, first, last)
        if not markdown.strip():
            continue

        document.append("## " + title)
        document.append("")
        document.append(markdown)
        document.append("")

    # Capitulo que documenta esta instruccion desde otro sitio del manual.
    # `CPUID` es el caso: su entrada son dos paginas y remite al capitulo 21,
    # donde estan las noventa y seis que describen cada hoja.
    chapter = companion.for_instruction(data["id"])
    if chapter:
        span = companion.locate(layout_pages, chapter["header"])
        if span:
            document.extend(companion_sections(
                layout_pages, table_pages, chapter["header"], span,
                chapter["title"]))

    return data, "\n".join(document).rstrip() + "\n"


def companion_sections(pages_layout, table_pages, header, span, title):
    """Compone las secciones del capitulo que documenta una instruccion.

    Se devuelven para incrustarlas en el documento de la instruccion, no como
    fichero aparte: una instruccion es una entrada y una entrada es un
    documento por idioma. Que el manual lo publique en otro capitulo es una
    decision sobre como paginar un PDF, no sobre que documenta que.

    Los titulos bajan un nivel respecto a los del capitulo, para que cuelguen
    de la seccion que los introduce en lugar de competir con las de la propia
    instruccion.

    @param pages_layout Paginas del volcado de prosa.
    @param table_pages Paginas del volcado en modo tabla.
    @param header Cabecera del capitulo.
    @param span Rango de paginas del capitulo.
    @param title Rotulo con que se introduce el capitulo.
    @returns Lista de lineas de Markdown.
    """
    first, last = span
    out = ["## " + title, ""]

    for section in companion.read(pages_layout, first, last, header):
        if section["title"]:
            # El numero de seccion se conserva: es como el manual y todo el
            # mundo se refieren a ella.
            level = "###" if section["number"].count(".") < 2 else "####"
            out.append("%s %s %s" % (level, section["number"], section["title"]))
            out.append("")

        markdown = markdown_of({"id": "chapter", "lines": section["lines"]},
                               table_pages, first, last)
        if markdown.strip():
            out.append(markdown)
            out.append("")

    # Se devuelven LINEAS, no un texto. `document.extend()` sobre una cadena
    # la recorre caracter a caracter: el capitulo salia con una letra por
    # linea, 185.000 lineas para 360 KB.
    return out


def _identifier(entry):
    """Devuelve el identificador de la instruccion, valido como ruta."""
    name = entry["mnemonics"][0] if entry["mnemonics"] else entry["title"]
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def assign_identifiers(entries):
    """Da a cada instruccion un identificador unico.

    El mnemonico no basta: el manual tiene tres entradas tituladas `MOV` -- la
    normal, la de registros de control y la de depuracion -- y dos parejas de
    `gather` que empiezan por el mismo nombre. Con el mnemonico a secas, la
    segunda pisaba a la primera y se publicaba una sola.

    Cuando hay choque se distingue con el resumen, que es lo que de verdad las
    separa: `mov`, `mov-move-to-from-control-registers`. Se deja intacto el
    identificador de la PRIMERA para no cambiar una URL ya publicada por el
    hecho de que aparezca una entrada nueva.

    @param entries Instrucciones localizadas, en orden de aparicion.
    @returns Las mismas entradas con `identifier` anadido.
    """
    seen = {}
    for entry in entries:
        base = _identifier(entry)
        if base not in seen:
            seen[base] = entry
            entry["identifier"] = base
            continue

        extra = re.sub(r"[^a-z0-9]+", "-", entry["summary"].lower()).strip("-")
        candidate = ("%s-%s" % (base, extra))[:80].rstrip("-")
        # Si ni con el resumen se distinguen, se numera: es preferible un
        # sufijo feo a que una entrada desaparezca en silencio.
        n = 2
        while candidate in seen:
            candidate = "%s-%d" % (base, n)
            n += 1
        seen[candidate] = entry
        entry["identifier"] = candidate

    return entries
