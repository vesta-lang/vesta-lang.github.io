#!/usr/bin/env python3
"""Importa la referencia de instrucciones x86 al formato `isadoc`.

Fuente: https://www.felixcloutier.com/x86/, una separacion mecanica del manual
del desarrollador de Intel en una pagina por instruccion.

La especificacion del formato de salida esta en `site/data/isa/FORMAT.md`. Este
script es un importador entre muchos posibles: cualquier otra fuente -- las
guias de ARM, el manual de RISC-V, la base del propio compilador -- produce el
mismo formato y el resto de la cadena no cambia.

QUE SE IMPORTA Y POR QUE
------------------------
La **prosa** siempre: descripcion, pseudocodigo, banderas y excepciones. Es lo
unico que no se puede leer desde el navegador, porque `felixcloutier.com` no
envia `Access-Control-Allow-Origin` y con GitHub Pages no hay servidor donde
montar un proxy.

Las **codificaciones solo cuando arch-data no cubre la instruccion**. Los
opcodes ya estan publicados alli, en un repositorio del propio proyecto servido
desde el mismo dominio, y la pagina los pide en el navegador. Pero arch-data
mide sobre procesadores actuales, y hay unas veinticinco instrucciones que solo
existen en 16 y 32 bits (`AAA`, `DAA`, `BOUND`, `POPA`) y que por tanto no
aparecen y no van a aparecer: para esas el manual es la unica fuente que hay.

EL EMPAREJADO ENTRE LAS DOS FUENTES SE RESUELVE AQUI
-----------------------------------------------------
Los dos lados nombran distinto lo mismo. El manual documenta familias con un
comodin (`CMOVcc`, `Jcc`, `SETcc`), las operaciones de cadena sin sufijo de
tamano (`CMPS`, `MOVS`) y algunas familias vectoriales por su nombre generico
(`VBROADCAST`); arch-data guarda los nombres concretos (`CMOVZ`, `JZ`,
`CMPSB`, `VBROADCASTSS`).

La correspondencia se calcula una vez y viaja en el fichero, en
`links.arch_data`. El navegador filtra por esa lista y no conoce ninguna regla:
si la regla viviera tambien en el JavaScript, las dos copias divergirian en
cuanto una se afinara.

REIMPORTAR NO PISA LO TRADUCIDO
-------------------------------
El importador es dueno de un solo idioma, el de la fuente. Al reimportar
fusiona: sobrescribe ese idioma y conserva los demas, mas cualquier campo que
no genere el.

Uso:
    python tools/fetch_isa.py            importa lo que falte
    python tools/fetch_isa.py --force    vuelve a importar todo
    python tools/fetch_isa.py --limit 20 solo las primeras N (para probar)
"""

import argparse
import io
import json
import os
import re
import sys
import time
import urllib.request
from html import unescape

BASE = "https://www.felixcloutier.com/x86/"
ARCH_DB = "https://vesta-lang.github.io/arch-data/assets/db.js"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "site", "data", "isa", "x86")

USER_AGENT = "vesta-lang.github.io site build (+https://github.com/vesta-lang)"

# Pausa entre peticiones. La fuente es un sitio personal servido gratis; medio
# segundo por pagina es lo que cuesta no ser una molestia.
DELAY = 0.5

FORMAT = "isadoc"
VERSION = 1
ISA = "x86"

# Idioma de la fuente, y el unico del que este script es dueno.
SOURCE_LANG = "en"

# Identificador de la fuente dentro del fichero, para la procedencia.
SOURCE_ID = "intel-sdm"


# --- Descarga y limpieza ---------------------------------------------------


def get(url, timeout=30):
    """Descarga una URL y devuelve su texto decodificado."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


# Caracteres que el proyecto no admite, con su equivalente en ASCII. Se
# normalizan al importar y no al publicar, para que el dato guardado ya cumpla
# la regla y no haya que volver a mirarlo mas adelante.
SUBSTITUTIONS = (
    ("—", "-"), ("–", "-"),
    ("’", "'"), ("‘", "'"),
    ("“", '"'), ("”", '"'),
    ("…", "..."), (" ", " "),
    ("←", "<-"), ("→", "->"), ("↔", "<->"),
    ("≤", "<="), ("≥", ">="), ("≠", "!="),
    ("×", "x"), ("·", "*"), ("±", "+/-"),
    ("®", "(R)"), ("™", "(TM)"), ("©", "(C)"),
    ("µ", "u"), ("°", " grados"),
    # Los siguientes salieron de contar los no-ASCII del corpus importado, no
    # de imaginar cuales podrian aparecer. El manual usa el signo menos
    # tipografico y el asterisco de operador donde el teclado tiene los suyos.
    ("−", "-"), ("∗", "*"), ("∞", "infinito"),
    ("«", "<<"), ("‚", ","), ("μ", "u"),
    # Superposicion de barra: en el manual tacha el operador anterior para
    # negarlo. Se pierde la forma y se conserva el sentido.
    ("̸", "/"),
    # Griegas de las paginas de x87: aparecen en formulas, y borrarlas
    # cambiaria lo que dice el texto. Se transliteran.
    ("π", "pi"), ("σ", "sigma"), ("ε", "epsilon"),
    ("Σ", "Sigma"), ("Ι", "I"), ("μ", "u"),
    ("⁄", "/"), ("•", "-"), ("̌", ""),
    # El origen trae bytes invalidos que llegan como caracter de reemplazo.
    ("�", ""),
)


def normalize(text):
    """Sustituye los caracteres prohibidos por su equivalente ASCII."""
    for bad, good in SUBSTITUTIONS:
        text = text.replace(bad, good)
    return text


def text_of(html):
    """Convierte un fragmento de HTML en texto plano de una linea."""
    return " ".join(normalize(unescape(re.sub(r"<[^>]+>", " ", html))).split())


def strip_chrome(html):
    """Quita del documento lo que no es documentacion de la instruccion.

    El pie del sitio de origen lleva un descargo de responsabilidad, y las
    anclas de los encabezados llevan un caracter mal codificado. Sin quitar el
    pie, la ULTIMA seccion de cada pagina se lo traga entero, porque el troceo
    va de un `h2` al siguiente y el pie no abre ninguno: salia en las 828
    paginas y solo se noto al contar frases repetidas.
    """
    html = re.sub(r'<a class="anchor".*?</a>', "", html, flags=re.S)
    cut = html.find("<footer")
    return html[:cut] if cut != -1 else html


# --- Documento en Markdown -------------------------------------------------


def inline(html):
    """Convierte el marcado de una linea a Markdown.

    Los enlaces se conservan porque el manual remite de una instruccion a otra
    constantemente, y perder esas referencias deja frases que no se entienden.
    Se hacen absolutos: en el origen son relativos a su propio sitio.
    """
    def link(m):
        url = m.group(1)
        if url.startswith("/"):
            url = "https://www.felixcloutier.com" + url
        elif url.startswith("./"):
            url = BASE + url[2:]
        return "[%s](%s)" % (text_of(m.group(2)), url)

    html = re.sub(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', link, html, flags=re.S)
    html = re.sub(r"<code[^>]*>(.*?)</code>", lambda m: "`%s`" % text_of(m.group(1)),
                  html, flags=re.S | re.I)
    html = re.sub(r"<(strong|b)[^>]*>(.*?)</\1>", lambda m: "**%s**" % text_of(m.group(2)),
                  html, flags=re.S | re.I)
    html = re.sub(r"<(em|i)[^>]*>(.*?)</\1>", lambda m: "*%s*" % text_of(m.group(2)),
                  html, flags=re.S | re.I)
    return text_of(html)


def to_markdown(html):
    """Convierte un fragmento de HTML del manual a Markdown.

    Se reconocen las cuatro formas que el origen usa de verdad. Lo que no encaja
    en ninguna se recoge como parrafo en lugar de descartarse: el manual tiene
    paginas con estructuras que no se parecen a las demas, y perderlas sin
    avisar seria peor que publicarlas con menos forma de la que tenian.
    """
    out = []
    pos = 0

    def loose(text):
        if text:
            out.append(text)

    for m in re.finditer(r"<(p|pre|ul|ol|table)\b[^>]*>(.*?)</\1>", html, re.S | re.I):
        loose(text_of(html[pos:m.start()]))
        pos = m.end()

        tag, body = m.group(1).lower(), m.group(2)

        if tag == "p":
            loose(inline(body))

        elif tag == "pre":
            code = normalize(unescape(re.sub(r"<[^>]+>", "", body))).strip()
            if code:
                out.append("```text\n%s\n```" % code)

        elif tag in ("ul", "ol"):
            items = [inline(li) for li in
                     re.findall(r"<li[^>]*>(.*?)</li>", body, re.S | re.I)]
            items = [i for i in items if i]
            if items:
                mark = (lambda i: "%d." % (i + 1)) if tag == "ol" else (lambda i: "-")
                out.append("\n".join("%s %s" % (mark(i), t) for i, t in enumerate(items)))

        elif tag == "table":
            rendered = markdown_table(body)
            if rendered:
                out.append(rendered)

    loose(text_of(html[pos:]))
    return "\n\n".join(out)


def markdown_table(body):
    """Convierte una tabla de HTML en una tabla de Markdown."""
    head, rows = table_of(body)
    if not rows:
        return ""

    width = max([len(head)] + [len(r) for r in rows])
    # El manual publica las excepciones en tablas SIN encabezado. Markdown
    # exige uno, asi que se pone vacio en lugar de inventarle nombres a unas
    # columnas cuyo significado ya se explica en el titulo de la seccion.
    names = [h for h in head] + [""] * (width - len(head))

    def escape_cell(text):
        # Una barra vertical dentro de una celda parte la fila en dos.
        return text.replace("|", "\\|")

    lines = ["| " + " | ".join(escape_cell(n) for n in names) + " |",
             "| " + " | ".join("---" for _ in names) + " |"]
    for row in rows:
        cells = row + [""] * (width - len(row))
        lines.append("| " + " | ".join(escape_cell(c) for c in cells) + " |")
    return "\n".join(lines)


def table_of(body):
    """Devuelve la cabecera y las filas de una tabla, ya en Markdown en linea."""
    head = [text_of(h) for h in re.findall(r"<th[^>]*>(.*?)</th>", body, re.S | re.I)]
    rows = []
    for row in re.finditer(r"<tr[^>]*>(.*?)</tr>", body, re.S | re.I):
        cells = [
            inline(c)
            for c in re.findall(r"<td[^>]*>(.*?)</td>", row.group(1), re.S | re.I)
        ]
        if cells:
            rows.append(cells)
    return head, rows


# --- Secciones de la pagina de origen --------------------------------------


def raw_sections(html):
    """Devuelve `(titulo, html)` de cada seccion `h2` del documento."""
    return [
        (text_of(m.group(1)), m.group(2))
        for m in re.finditer(r"<h2[^>]*>(.*?)</h2>(.*?)(?=<h2|\Z)", html, re.S | re.I)
    ]


# Nombres neutros de los modos de operacion. El manual los escribe en su
# titulo; el formato usa nombres que un lector de otro juego de instrucciones
# puede mapear a los suyos.
MODES = {
    "protected mode": "protected",
    "real-address mode": "real",
    "virtual-8086 mode": "virtual8086",
    "compatibility mode": "compat",
    "64-bit mode": "long",
    "compatibility and 64-bit mode": "long",
    "compatibility mode and 64-bit mode": "long",
}

# Vector de excepcion: `#GP(0)`, `#UD`, `#PF(fault-code)`.
VECTOR = re.compile(r"^#[A-Z]{2,4}(\([^)]*\))?$")


def exceptions_of(title, body):
    """Extrae las excepciones de una seccion como lista de objetos.

    El manual las publica en una tabla de dos columnas donde la primera es el
    vector y la segunda la condicion, salvo que una condicion ocupe varias
    filas: entonces las siguientes traen solo la condicion y heredan el vector
    de la anterior. Eso hay que reconstruirlo aqui, porque en el fichero cada
    excepcion tiene que valer por si sola.
    """
    mode = MODES.get(re.sub(r"\s*exceptions$", "", title.lower()).strip())
    if not mode:
        return None

    out = []
    last = None
    _, rows = table_of(body)
    for values in rows:
        if len(values) >= 2 and VECTOR.match(values[0]):
            last = values[0]
            out.append({"mode": mode, "vector": last, "when": values[1]})
        elif values and last:
            out.append({"mode": mode, "vector": last, "when": values[-1]})

    if out:
        return out

    # Algunas paginas lo resuelven con una frase en lugar de una tabla:
    # "Same exceptions as in protected mode."
    text = text_of(body)
    return [{"mode": mode, "vector": None, "when": text}] if text else None


# Nombres de bandera de x86 que el texto puede mencionar.
FLAG_NAMES = ["CF", "PF", "AF", "ZF", "SF", "TF", "IF", "DF", "OF", "IOPL", "NT", "RF", "AC"]


def flags_mentioned(body):
    """Devuelve las banderas que el texto NOMBRA.

    Se lista lo que se puede extraer sin interpretar. Decir ademas que le pasa
    a cada una -- modificada, indefinida, sin tocar -- exigiria analizar la
    frase, y una promesa de ese tipo mal extraida es peor que no darla. El
    texto completo va al documento, donde se lee entero.
    """
    text = text_of(body)
    return [f for f in FLAG_NAMES if re.search(r"\b%s\b" % f, text)]


# Marcadores de la notacion de opcodes del manual.
#
# La notacion es compacta y esta definida en el propio manual: `REX.W + 81 /2
# id` quiere decir prefijo REX con W, byte de opcode 81, un ModRM cuyo campo
# reg vale 2, y un inmediato de cuatro bytes. Analizarla es lo que convierte
# una cadena opaca en la disposicion real de los bytes.
IMMEDIATE_SIZES = {
    "ib": 1, "iw": 2, "id": 4, "io": 8,
    "cb": 1, "cw": 2, "cd": 4, "cp": 6, "ct": 10,
}

# Sufijos que meten el registro dentro del propio byte de opcode.
OPCODE_REGISTER = {"+rb": 1, "+rw": 2, "+rd": 4, "+ro": 8}

HEX_BYTE = re.compile(r"^[0-9A-F]{2}$")


def parse_opcode(notation):
    """Descompone la notacion de un opcode en la disposicion de sus bytes.

    Reconoce lo que el manual usa de verdad: prefijos obligatorios, `REX` con
    sus sufijos, los prefijos vectoriales `VEX` y `EVEX`, los bytes de opcode,
    el `/r` o `/digit` del ModRM, el registro embebido en el opcode y el
    inmediato.

    Lo que no reconoce se conserva en `rest`, sin inventar: una notacion mal
    entendida produciria un diagrama de bytes que miente, y eso es peor que no
    dibujarlo.

    @param notation Cadena tal como la publica el manual.
    @returns Diccionario con las partes reconocidas.
    """
    out = {}
    rest = []

    # El `+` aparece con dos sentidos distintos. Suelto, entre `REX.W` y el
    # byte de opcode, es un separador que no aporta nada. Pegado a un byte,
    # como en `50+rd`, dice que el registro va dentro del propio opcode. Se
    # separan antes de trocear para no confundir uno con otro.
    tokens = []
    for token in re.split(r"\s+", notation.strip()):
        if token == "+":
            continue
        m = re.match(r"^([0-9A-Fa-f]{2})\+(r[bwdo])$", token)
        if m:
            tokens.extend([m.group(1), "+" + m.group(2)])
        else:
            tokens.append(token)

    for token in tokens:
        upper = token.upper()

        if upper in ("NP", "NFX", "F2", "F3", "66", "REP", "REPE", "REPNE"):
            out.setdefault("prefixes", []).append(upper)
        elif upper == "REX":
            out["rex"] = ""
        elif upper.startswith("REX."):
            out["rex"] = upper[4:]
        elif upper.startswith(("VEX.", "EVEX.", "XOP.", "MVEX.")):
            # Los prefijos vectoriales llevan su propia gramatica dentro
            # (longitud, mapa de opcode, ancho). Se guarda entera: partirla
            # aqui exigiria replicar una tabla que ya esta documentada.
            out["vector_prefix"] = token
        elif token.startswith("/") and token[1:].isdigit():
            out["modrm"] = {"kind": "digit", "value": int(token[1:])}
        elif token == "/r":
            out["modrm"] = {"kind": "reg"}
        elif token in OPCODE_REGISTER:
            out["opcode_register"] = {"marker": token, "width": OPCODE_REGISTER[token]}
        elif token in IMMEDIATE_SIZES:
            out.setdefault("immediates", []).append(
                {"marker": token, "bytes": IMMEDIATE_SIZES[token]}
            )
        elif HEX_BYTE.match(upper):
            out.setdefault("opcode", []).append(upper)
        elif upper.startswith("+"):
            rest.append(token)
        else:
            rest.append(token)

    if rest:
        out["rest"] = rest
    return out


def encodings_of(html):
    """Extrae la tabla de codificaciones y la de operandos, estructuradas."""
    encodings, operand_encodings = [], []

    for m in re.finditer(r"<table[^>]*>(.*?)</table>", html, re.S | re.I):
        head, rows = table_of(m.group(1))
        names = [h.lower() for h in head]
        if not names:
            continue

        if names[0] == "opcode":
            index = {name: i for i, name in enumerate(names)}
            for values in rows:

                def at(key, values=values):
                    i = index.get(key)
                    return values[i] if i is not None and i < len(values) else ""

                notation = at("opcode")
                entry = {
                    "opcode": notation,
                    # La disposicion de bytes se analiza al importar y no al
                    # publicar: es una gramatica del manual, no una decision de
                    # presentacion, y asi la aprovecha cualquier consumidor del
                    # formato y no solo esta web.
                    "layout": parse_opcode(notation),
                    "syntax": at("instruction"),
                    "operands": at("op/en"),
                    "modes": {
                        "long": at("64-bit mode").lower(),
                        "legacy": at("compat/leg mode").lower(),
                    },
                }
                note = at("description")
                if note:
                    entry["note"] = note
                encodings.append(entry)

        elif names[0] == "op/en":
            for values in rows:
                operands = [v for v in values[1:] if v and v.upper() != "N/A"]
                operand_encodings.append({"id": values[0], "operands": operands})

    return encodings, operand_encodings


# --- Emparejado con arch-data ----------------------------------------------


# Sufijos de condicion que el manual resume como `cc`.
CONDITIONS = [
    "A", "AE", "B", "BE", "C", "E", "G", "GE", "L", "LE",
    "NA", "NAE", "NB", "NBE", "NC", "NE", "NG", "NGE", "NL", "NLE",
    "NO", "NP", "NS", "NZ", "O", "P", "PE", "PO", "S", "Z",
]

# Sufijos de tamano de las operaciones de cadena, que el manual omite.
SIZES = ["B", "W", "D", "Q"]


def arch_iclasses():
    """Devuelve los mnemonicos que arch-data conoce.

    Se consulta la base PUBLICADA y no la copia local del compilador: es la
    misma que leera el navegador, de modo que el emparejado se calcula contra
    exactamente lo que el lector va a ver.
    """
    raw = get(ARCH_DB, timeout=180)
    data = json.loads(raw[raw.index("=") + 1 :].rstrip().rstrip(";"))
    return {form[2] for form in data["isas"][ISA]["forms"]}


def candidates(mnemonic):
    """Devuelve los nombres con que arch-data podria guardar un mnemonico."""
    out = [mnemonic]
    if mnemonic.endswith("CC"):
        out.extend(mnemonic[:-2] + cc for cc in CONDITIONS)
    out.extend(mnemonic + size for size in SIZES)
    if not mnemonic.startswith("V"):
        out.append("V" + mnemonic)
    return out


def link_to_arch(mnemonics, known):
    """Devuelve los mnemonicos de arch-data que corresponden a una pagina."""
    out = []
    for mnemonic in mnemonics:
        for name in candidates(mnemonic):
            if name in known and name not in out:
                out.append(name)
    return out


# --- Composicion de la entrada ---------------------------------------------


# Titulo con que se publica cada seccion del documento. El del origen no se
# conserva: el sitio lo traduce una vez en su plantilla, no ochocientas veces
# en los ficheros.
DOC_SECTIONS = {
    "description": "Description",
    "operation": "Operation",
    "flags affected": "Flags affected",
}


def parse_page(slug, html, known):
    """Convierte una pagina del manual en datos mas documento.

    @returns Una tupla `(data, markdown)`.
    """
    html = strip_chrome(html)

    title = ""
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    if m:
        title = text_of(m.group(1))

    # El titulo es "MNEMONICO/MNEMONICO - Resumen".
    mnemonics, summary = [], title
    if " - " in title:
        left, summary = title.split(" - ", 1)
        mnemonics = [x.strip() for x in left.split("/") if x.strip()]

    data = {
        "format": FORMAT,
        "version": VERSION,
        "isa": ISA,
        "id": slug,
        "mnemonics": mnemonics,
        "links": {"arch_data": link_to_arch(mnemonics, known)},
        "sources": [{"id": SOURCE_ID, "url": BASE + slug}],
    }

    doc = []

    for title, body in raw_sections(html):
        low = title.lower()

        # Esta la publica arch-data en forma consultable.
        if low == "instruction operand encoding":
            continue

        if low == "flags affected":
            data["flags"] = flags_mentioned(body)

        found = exceptions_of(title, body)
        if found is not None:
            # Las excepciones van SOLO a los datos: son una lista de vectores y
            # condiciones, se consultan mas que se leen, y en el documento
            # ocuparian mas que todo lo demas junto.
            data.setdefault("exceptions", []).extend(found)
            continue

        doc.append((DOC_SECTIONS.get(low, title), to_markdown(body)))

    # La tabla de codificaciones se guarda SIEMPRE, y no duplica a arch-data.
    #
    # Se comprobo: en las 22.252 formas de arch-data el campo de opcode son
    # solo los bytes (`10`), sin un `/r`, sin un `/digit`, sin `ib` y sin
    # `REX`. La notacion que dice COMO se componen los bytes -- que es lo que
    # hace falta para ensamblar o para leer un volcado -- no esta alli.
    #
    # arch-data sigue siendo la fuente de la enumeracion de formas y del coste;
    # esto es lo otro, y son cosas distintas que se complementan.
    encodings, operand_encodings = encodings_of(html)
    if encodings:
        data["encodings"] = encodings
    if operand_encodings:
        data["operand_encodings"] = operand_encodings

    return data, render_document(summary, doc)


def render_document(summary, sections):
    """Compone el Markdown de una instruccion.

    El front matter lleva lo que la plantilla necesita antes de leer el cuerpo.
    El cuerpo empieza en `##` porque el `h1` lo pone la pagina con el
    mnemonico: dos titulos de primer nivel en la misma pagina es justo lo que
    el linter del proyecto rechaza.
    """
    out = ["---", "summary: %s" % summary, "---", ""]
    for title, markdown in sections:
        if not markdown:
            continue
        out.append("## " + title)
        out.append("")
        out.append(markdown)
        out.append("")
    return "\n".join(out).rstrip() + "\n"


# --- Orquestacion ----------------------------------------------------------


def index_entries(html):
    """Devuelve (slug, mnemonico, resumen) de cada fila del indice."""
    return re.findall(
        r"<td><a href='/x86/([^']+)'>([^<]+)</a></td><td>([^<]*)</td>", html
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="reimportar lo ya guardado")
    parser.add_argument("--limit", type=int, default=0, help="solo las primeras N paginas")
    args = parser.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)

    print("arch-data: " + ARCH_DB)
    known = arch_iclasses()
    print("  %d mnemonicos conocidos" % len(known))

    print("indice: " + BASE)
    entries = index_entries(get(BASE))
    if not entries:
        print("error: el indice no devolvio nada; cambio el formato", file=sys.stderr)
        return 1

    slugs, seen = [], set()
    for slug, _, _ in entries:
        if slug not in seen:
            seen.add(slug)
            slugs.append(slug)
    print("  %d mnemonicos en %d paginas" % (len(entries), len(slugs)))

    if args.limit:
        slugs = slugs[: args.limit]

    written = skipped = failed = 0
    for i, slug in enumerate(slugs, 1):
        # El slug lleva dos puntos cuando la pagina documenta varias
        # instrucciones, y eso no vale como nombre de directorio en Windows.
        folder = os.path.join(OUT_DIR, slug.replace(":", "__"))
        data_path = os.path.join(folder, "data.json")
        doc_path = os.path.join(folder, SOURCE_LANG + ".md")

        if os.path.exists(data_path) and not args.force:
            skipped += 1
            continue

        try:
            data, document = parse_page(slug, get(BASE + slug), known)
        except Exception as exc:  # noqa: BLE001 - se registra y se sigue
            print("  fallo %s: %s" % (slug, exc), file=sys.stderr)
            failed += 1
            time.sleep(DELAY)
            continue

        # Se escriben solo estos dos ficheros. Cualquier `<idioma>.md` que haya
        # al lado es una traduccion, y el importador no la toca: esa es toda la
        # proteccion que hace falta, y no depende de acordarse de nada.
        os.makedirs(folder, exist_ok=True)
        with io.open(data_path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write("\n")
        with io.open(doc_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(document)
        written += 1

        if written % 50 == 0:
            print("  %d/%d" % (i, len(slugs)))
        time.sleep(DELAY)

    print("importadas %d, ya estaban %d, fallidas %d" % (written, skipped, failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
