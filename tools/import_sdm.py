#!/usr/bin/env python3
"""Importa la referencia de instrucciones desde el manual de Intel.

Lee los volcados de texto del PDF y escribe un directorio por instruccion en
`site/data/isa/x86/`, en el formato `isadoc` que especifica
`site/data/isa/FORMAT.md`.

COMO SE PREPARA
---------------
El manual es un PDF y hay que volcarlo a texto UNA vez, en dos modos, dentro de
`manual/` o de donde diga la variable `VESTA_SDM_DIR`:

    pdftotext -layout <manual.pdf> manual/sdm.txt
    pdftotext -table  <manual.pdf> manual/sdm.table.txt

Los dos hacen falta y no es redundancia. El modo normal respeta los parrafos
pero desincroniza las tablas: la columna de descripcion se desplaza una fila y
`r/m8` sale como `r/m81`. El modo tabla alinea las columnas y a cambio destroza
la prosa. De ahi la regla de todo el importador: **la prosa sale del volcado
normal y las tablas del de modo tabla**.

QUE PRODUCE
-----------
Por instruccion, dos ficheros:

    data.json    opcodes, excepciones, banderas y enlaces. Se regenera entero
    en.md        el documento. Una reimportacion lo reescribe

Cualquier `<idioma>.md` que haya al lado es una traduccion y no se toca. Esa es
toda la proteccion que hace falta, y no depende de acordarse de nada.

COMO SE COMPRUEBA
-----------------
El importador cuenta lo que no entendio y lo dice al terminar. Un parser sobre
una fuente que no controlamos falla en silencio si no se le pide cuentas.

Para contrastar con otras fuentes:

    python tools/verify_sdm.py

Uso:
    python tools/import_sdm.py            importa todo
    python tools/import_sdm.py --limit 20 solo las primeras N
    python tools/import_sdm.py --dry-run  cuenta sin escribir
"""

import argparse
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sdm import encodings, isadoc, pages, titles  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "site", "data", "isa", "x86")

ARCH_DB = "https://vesta-lang.github.io/arch-data/assets/db.js"

# Sufijos de condicion que el manual resume como `cc`, y de tamano que omite en
# las operaciones de cadena. Sirven para emparejar con arch-data, que guarda
# los nombres concretos.
CONDITIONS = [
    "A", "AE", "B", "BE", "C", "E", "G", "GE", "L", "LE",
    "NA", "NAE", "NB", "NBE", "NC", "NE", "NG", "NGE", "NL", "NLE",
    "NO", "NP", "NS", "NZ", "O", "P", "PE", "PO", "S", "Z",
]
SIZES = ["B", "W", "D", "Q"]


def arch_iclasses():
    """Devuelve los mnemonicos que arch-data conoce, o un conjunto vacio.

    Se consulta la base PUBLICADA porque es la misma que leera el navegador: el
    emparejado se calcula contra exactamente lo que el lector va a ver. Si no
    hay red, se sigue sin el enlace en lugar de fallar: la importacion del
    manual no depende de eso.
    """
    import urllib.request

    try:
        req = urllib.request.Request(
            ARCH_DB, headers={"User-Agent": "vesta-lang.github.io site build"})
        with urllib.request.urlopen(req, timeout=180) as resp:
            raw = resp.read().decode("utf-8")
        data = json.loads(raw[raw.index("=") + 1:].rstrip().rstrip(";"))
        return {form[2] for form in data["isas"]["x86"]["forms"]}
    except Exception as exc:  # noqa: BLE001 - se avisa y se sigue
        print("  aviso: no se pudo leer arch-data (%s); sin enlace" % exc,
              file=sys.stderr)
        return set()


def linker(known):
    """Devuelve la funcion que empareja mnemonicos con arch-data."""
    def candidates(mnemonic):
        out = [mnemonic]
        if mnemonic.endswith("CC"):
            out.extend(mnemonic[:-2] + cc for cc in CONDITIONS)
        out.extend(mnemonic + size for size in SIZES)
        if not mnemonic.startswith("V"):
            out.append("V" + mnemonic)
        return out

    def link(mnemonics):
        out = []
        for mnemonic in mnemonics:
            for name in candidates(mnemonic.upper()):
                if name in known and name not in out:
                    out.append(name)
        return out

    return link


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, default=0, help="solo las primeras N")
    parser.add_argument("--dry-run", action="store_true", help="contar sin escribir")
    args = parser.parse_args()

    try:
        layout = pages.load_layout()
        table = pages.load_tables()
    except pages.DumpMissing as exc:
        print(exc, file=sys.stderr)
        return 1

    start, end = pages.reference_range(layout)
    found = isadoc.assign_identifiers(
        titles.page_ranges(titles.find(layout, start, end), end))
    print("referencia: paginas %d a %d, %d instrucciones" % (start, end, len(found)))

    suspicious = titles.suspicious(found)
    if suspicious:
        print("  aviso: %d mnemonicos sospechosos" % len(suspicious), file=sys.stderr)
        for mnemonic, title in suspicious[:10]:
            print("    %r de %r" % (mnemonic, title), file=sys.stderr)

    link = linker(arch_iclasses())

    entries = found[: args.limit] if args.limit else found
    written = forms = unknown = 0

    for entry in entries:
        data, document = isadoc.build(entry, layout, table, encodings.read, link)

        for form in data.get("encodings", []):
            forms += 1
            if "rest" in form.get("layout", {}):
                unknown += 1

        if args.dry_run:
            written += 1
            continue

        folder = os.path.join(OUT_DIR, data["id"])
        os.makedirs(folder, exist_ok=True)

        with io.open(os.path.join(folder, "data.json"), "w",
                     encoding="utf-8", newline="\n") as f:
            json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
            f.write("\n")

        with io.open(os.path.join(folder, "en.md"), "w",
                     encoding="utf-8", newline="\n") as f:
            f.write(document)

        written += 1

    print("instrucciones: %d" % written)
    print("formas de codificacion: %d" % forms)
    print("notacion sin reconocer: %d (%.2f%%)"
          % (unknown, 100.0 * unknown / forms if forms else 0.0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
