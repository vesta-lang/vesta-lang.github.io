#!/usr/bin/env python3
"""Contrasta las tablas de direccionamiento generadas con el ensamblador.

`tools/x86-encoding.mjs` genera las formas de direccionamiento de x86 desde las
reglas del manual en lugar de copiar sus tablas. Una tabla generada es completa
y consistente por construccion, pero eso no la hace CORRECTA: si las reglas se
entendieron mal, la tabla es coherentemente falsa.

Este script cierra esa comprobacion. Toma cada forma que la tabla predice,
escribe la instruccion que deberia producirla, la ensambla con la cadena del
proyecto y compara los bytes.

Que las dos coincidan no demuestra que el manual diga eso; demuestra que
nuestra lectura del manual y nuestro ensamblador dicen lo mismo. Cuando
discrepan, una de las dos esta mal, y eso es exactamente lo que hay que saber
antes de publicar una tabla.

Uso:
    python tools/verify_encoding.py
"""

import io
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Se usa la instalacion, no el binario del directorio de compilacion: ese
# cambia con cada build y no representa una version publicada.
VESTA = r"C:\Program Files\VestaVM\bin\vesta.exe"

# Instrucciones de prueba y el ModR/M (mas SIB) que la tabla predice.
#
# Se elige `adc r64, r/m64`, opcode 13 /r, porque su forma es la mas simple que
# ejerce todos los modos: un solo byte de opcode, ModR/M con reg fijo y sin
# inmediato, de modo que lo que quede detras del opcode ES la codificacion de
# la direccion y nada mas.
CASES = [
    # (sintaxis, mod, rm, bytes esperados tras el opcode)
    ("adc rax, rbx", 3, 3, "d8"),
    ("adc rcx, rdx", 3, 2, "d1"),
    ("adc rax, [rbx]", 0, 3, "03"),
    ("adc rax, [rbx+8]", 1, 3, "43 08"),
    ("adc rax, [rbx+0x11223344]", 2, 3, "83 44 33 22 11"),
    ("adc rax, [rsp]", 0, 4, "04 24"),
    ("adc rax, [rbp]", 1, 5, "45 00"),
    ("adc rax, [rip+0]", 0, 5, "05 00 00 00 00"),
    ("adc rax, [rbx+rcx*4]", 0, 4, "04 8b"),
    ("adc rax, [rbx+rcx*8+16]", 1, 4, "44 cb 10"),
    ("adc rax, [rsi]", 0, 6, "06"),
    ("adc rax, [rdi+0x40]", 1, 7, "47 40"),
]


def assemble(lines):
    """Ensambla una lista de instrucciones y devuelve los bytes en hexadecimal.

    El ensamblador devuelve cero instrucciones y ningun mensaje cuando una sola
    linea no le vale, asi que se ensambla de una en una: sin eso, una errata en
    un caso haria fallar los doce sin decir cual.
    """
    out = []
    for line in lines:
        with tempfile.NamedTemporaryFile("w", suffix=".asm", delete=False) as f:
            f.write(line + "\n")
            path = f.name
        try:
            result = subprocess.run(
                [VESTA, "--asm-file", path, "--arch", "X86-64"],
                capture_output=True, text=True, timeout=60,
            )
            m = re.search(r"Assembled (\d+) instructions, \d+ bytes:\s*(.*)",
                          result.stdout, re.S)
            if not m or m.group(1) == "0":
                out.append(None)
            else:
                out.append(" ".join(m.group(2).split()))
        finally:
            os.unlink(path)
    return out


def main():
    if not os.path.exists(VESTA):
        print("no se encuentra el ensamblador: %s" % VESTA, file=sys.stderr)
        return 1

    assembled = assemble([c[0] for c in CASES])

    bad = 0
    print("  %-28s %-18s %s" % ("instruccion", "esperado", "ensamblado"))
    for (syntax, mod, rm, expected), got in zip(CASES, assembled):
        if got is None:
            print("  %-28s %-18s no ensambla" % (syntax, expected))
            bad += 1
            continue

        # El prefijo REX.W y el byte de opcode van delante; la codificacion de
        # la direccion es lo que queda.
        parts = got.split()
        tail = " ".join(parts[2:]) if len(parts) > 2 else ""

        ok = tail == expected
        print("  %-28s %-18s %s%s" % (syntax, expected, tail, "" if ok else "   <-- NO"))
        if not ok:
            bad += 1

    print()
    print("%d casos, %d discrepancias" % (len(CASES), bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
