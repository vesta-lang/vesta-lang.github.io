#!/usr/bin/env python3
"""Comprueba que lo importado del manual esta bien formado y no falta nada.

Un importador que lee una fuente ajena falla en silencio. La extraccion puede
salir sintacticamente valida y estar mal: una tabla que se traga el parrafo
siguiente, un documento sin descripcion, una forma cuya notacion no se
entendio. Nada de eso revienta; simplemente se publica.

Este script busca esos casos. No comprueba que el contenido sea CIERTO -- para
eso hay que contrastar con otra fuente -- sino que este completo y bien
formado, que es lo que si se puede verificar sin salir del repositorio.

Uso:
    python tools/verify_sdm.py            informe completo
    python tools/verify_sdm.py --quiet    solo el resumen
"""

import argparse
import collections
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "site", "data", "isa", "x86")

# Restos del PDF que no deberian llegar al documento.
PAGE_FURNITURE = (
    (re.compile(r"Vol\.\s*\d[A-D]?\s+\d+-\d+"), "pie de pagina"),
    (re.compile(r"^\s*\d+-\d+\s*$"), "numero de pagina"),
    (re.compile(r"INSTRUCTION SET REFERENCE"), "cabecera de capitulo"),
    (re.compile(r"THIS UNOFFICIAL", re.I), "descargo de la fuente"),
)

# Secciones que toda instruccion deberia traer. La ausencia no siempre es un
# fallo -- `TESTUI` no tiene descripcion en el manual -- pero es lo primero que
# hay que mirar cuando algo sale vacio.
EXPECTED = ("## Description", "## Operation")


def check_markdown(text):
    """Devuelve los problemas de forma de un documento."""
    problems = []
    lines = text.split("\n")

    # Vallas de codigo sin cerrar: el resto de la pagina se publicaria como
    # codigo.
    if text.count("```") % 2:
        problems.append("valla de codigo sin cerrar")

    inside_fence = False
    for number, line in enumerate(lines, 1):
        if line.startswith("```"):
            inside_fence = not inside_fence
            continue
        if inside_fence:
            continue

        # El `h1` lo pone la plantilla, asi que ninguno debe salir del cuerpo.
        # Dentro de una valla no cuenta: el pseudocodigo de Intel comenta con
        # almohadilla, y `# src1 and src2 elements are pairs of bfloat16` se
        # senalaba como titulo en las tres instrucciones de AMX.
        if line.startswith("# "):
            problems.append("titulo de primer nivel en la linea %d" % number)

        for pattern, name in PAGE_FURNITURE:
            if pattern.search(line):
                problems.append("%s en la linea %d" % (name, number))
                break

    # Un documento partido caracter a caracter sigue siendo Markdown valido y
    # no lo caza ninguna otra regla. Paso de verdad: al extender una lista con
    # una cadena en lugar de con lineas, `CPUID` salio con 185.000 lineas de un
    # caracter. Se mide por la longitud media, que en prosa nunca baja de diez.
    body = [l for l in lines if l.strip()]
    if len(body) > 50:
        average = sum(len(l) for l in body) / float(len(body))
        if average < 6:
            problems.append("lineas de %.1f caracteres de media: el documento "
                            "parece partido" % average)

    problems.extend(check_tables(lines))
    return problems


def check_tables(lines):
    """Comprueba que las tablas de Markdown estan bien formadas."""
    problems = []
    inside_fence = False
    columns = None

    for number, line in enumerate(lines, 1):
        if line.startswith("```"):
            inside_fence = not inside_fence
            continue
        if inside_fence:
            continue

        if not line.startswith("|"):
            columns = None
            continue

        # Solo cuentan las barras que separan celdas. Una escapada, `\|`, es
        # contenido: `[E\|R]BX` es un operando, no dos columnas. Contarlas
        # daba tablas descuadradas que estaban perfectamente bien.
        count = len(re.findall(r"(?<!\\)\|", line)) - 1
        if columns is None:
            columns = count
            continue

        # Una fila con distinto numero de columnas que su cabecera no se
        # renderiza como fila: se sale de la tabla.
        if count != columns:
            problems.append("tabla descuadrada en la linea %d (%d columnas, "
                            "la cabecera tiene %d)" % (number, count, columns))
            columns = count

    return problems


def check_data(data):
    """Devuelve los problemas de los datos de una instruccion."""
    problems = []

    if data.get("format") != "isadoc":
        problems.append("no declara el formato isadoc")
    if not data.get("mnemonics"):
        problems.append("sin mnemonicos")

    defined = {m["id"] for m in data.get("operand_encodings", [])}
    undefined = set()

    for form in data.get("encodings", []):
        layout = form.get("layout", {})
        if "rest" in layout:
            problems.append("notacion sin reconocer: %s" % form["opcode"])

        # `XACQUIRE` y `XRELEASE` son un prefijo y nada mas: su forma entera es
        # `F2` o `F3`. No tener byte de opcode ES la instruccion, no un fallo.
        if not layout.get("opcode") and not layout.get("vector_prefix") \
                and not layout.get("leaf") and not layout.get("prefixes"):
            problems.append("forma sin bytes de opcode: %s" % form["opcode"])

        # Una clave `Op/En` sin tabla que la defina no lleva a ninguna parte...
        # pero solo cuando hay operandos que ubicar. `PCONFIG` y `TILERELEASE`
        # declaran clave y no llevan operandos; a x87 le pasa al reves, tiene
        # operandos y no tiene tabla porque son la pila, implicita. En los dos
        # casos el manual esta bien y exigirle la tabla senalaba mas de cien
        # instrucciones correctas.
        # `ZO` es "cero operandos codificados": la instruccion puede escribirse
        # con operandos y no llevar ninguno en los bytes. `CMPS m8, m8` los
        # nombra para que se lea, pero van implicitos en DS:SI y ES:DI y no hay
        # campo que rellenar, asi que el manual no le pone fila.
        key = form.get("operands")
        if key and key != "ZO" and key not in defined \
                and "," in (form.get("syntax") or ""):
            undefined.add(key)

    for key in sorted(undefined):
        problems.append("la forma dice usar el modo %s y no esta definido" % key)

    return problems


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--quiet", action="store_true", help="solo el resumen")
    args = parser.parse_args()

    if not os.path.isdir(DATA_DIR):
        print("no hay nada importado en %s" % DATA_DIR, file=sys.stderr)
        return 1

    kinds = collections.Counter()
    affected = 0
    total = 0
    missing_sections = []

    for name in sorted(os.listdir(DATA_DIR)):
        folder = os.path.join(DATA_DIR, name)
        data_path = os.path.join(folder, "data.json")
        if not os.path.isfile(data_path):
            continue
        total += 1

        with io.open(data_path, encoding="utf-8") as f:
            data = json.load(f)

        problems = check_data(data)

        for document in sorted(os.listdir(folder)):
            if not document.endswith(".md"):
                continue
            with io.open(os.path.join(folder, document), encoding="utf-8") as f:
                text = f.read()
            problems.extend("%s: %s" % (document, p) for p in check_markdown(text))

            if document == "en.md":
                absent = [s for s in EXPECTED if s not in text]
                if absent:
                    missing_sections.append((name, " ".join(absent)))

        if problems:
            affected += 1
            for problem in problems:
                kinds[re.sub(r"\d+", "N", problem.split(":")[0])] += 1
            if not args.quiet:
                print("%s:" % name)
                for problem in problems[:6]:
                    print("   %s" % problem)

    if not args.quiet and missing_sections:
        print()
        print("sin alguna seccion esperada: %d" % len(missing_sections))
        for name, absent in missing_sections[:10]:
            print("   %-16s falta %s" % (name, absent))

    print()
    print("instrucciones revisadas: %d" % total)
    print("con algun problema     : %d (%.1f%%)"
          % (affected, 100.0 * affected / total if total else 0.0))
    for kind, count in kinds.most_common(10):
        print("   %-46s %d" % (kind[:46], count))

    return 1 if affected else 0


if __name__ == "__main__":
    sys.exit(main())
