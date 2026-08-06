"""Lectura de la tabla que dice donde va cada operando.

Es la pieza sin la cual la referencia no sirve para ensamblar. La tabla de
codificaciones dice que una forma se escribe `11 /r`; esta dice que, en el modo
`MR`, el primer operando va en el campo `r/m` del ModR/M y el segundo en el
campo `reg`. Sin las dos, se sabe cuantos bytes ocupa la instruccion pero no
que poner en ellos.

    Op/En   Operand 1           Operand 2        Operand 3   Operand 4
    RM      ModRM:reg (r, w)    ModRM:r/m (r)    N/A         N/A
    MR      ModRM:r/m (r, w)    ModRM:reg (r)    N/A         N/A

Las de AVX anaden una columna, `Tuple Type`, que no es un operando: es la regla
con que se escala el desplazamiento comprimido de EVEX.

Cada celda se descompone en tres cosas:

- **Donde vive** el operando: `ModRM:reg`, `ModRM:r/m`, `VEX.vvvv`, `imm8`,
  `Implicit XMM0`, o un registro fijo como `AL`.
- **Como se accede**: `(r)` lee, `(w)` escribe, `(r, w)` ambas.
- Si es **implicito**, es decir, si no se escribe en la sintaxis.

Guardarlo descompuesto y no como el texto de la celda es lo que permite
generar codigo desde estos datos en lugar de leerlos.
"""

import re

from . import tables

# Encabezados de la tabla, normalizados igual que en `encodings`.
OPEN_HEADER = "op/en"
TUPLE_HEADER = "tupletype"

# `ModRM:reg (r, w)` -> campo y modo de acceso.
CELL = re.compile(r"^(?P<field>[^()]+?)\s*(?:\((?P<access>[^)]*)\))?$")

# Campos conocidos, con el nombre neutro con que se guardan. Lo que no este
# aqui se conserva tal cual: el manual introduce campos nuevos en cada
# extension, y perder uno por no reconocerlo seria peor que publicarlo crudo.
FIELDS = {
    "modrm:reg": "modrm.reg",
    "modrm:r/m": "modrm.rm",
    "modrm:rm": "modrm.rm",
    "vex.vvvv": "vex.vvvv",
    "evex.vvvv": "evex.vvvv",
    "xop.vvvv": "xop.vvvv",
    "vex.1vvvv": "vex.vvvv",
    "imm8": "imm8",
    "imm8[7:4]": "imm8.high",
    "imm8[3:0]": "imm8.low",
    "sib.base": "sib.base",
    "sib.index": "sib.index",
    "vsib": "sib.index.vector",
    "moffs": "moffs",
    "offset": "offset",
    "opcode": "opcode.reg",
    "opcode + rd": "opcode.reg",
    "opcode + rd (r)": "opcode.reg",
    "opcode + rb": "opcode.reg",
    "opcode + rw": "opcode.reg",
    "opcode + ro": "opcode.reg",
    # El manual escribe mal `VEX.vvvv` en unas pocas entradas.
    "vex.1vvv": "vex.vvvv",
    "vex.vvv": "vex.vvvv",
    "evex.vvv": "evex.vvvv",
    "basereg (r): vsib:base": "sib.base",
    "vsib:base": "sib.base",
    "vsib:index": "sib.index.vector",
}


def normalize(name):
    """Reduce un encabezado a una clave comparable."""
    return re.sub(r"[^a-z0-9/]+", "", name.lower())


def parse_cell(text):
    """Descompone una celda en campo, acceso y si es implicito.

    @param text Contenido de la celda, ya sin espacios sobrantes.
    @returns Diccionario, o `None` si la celda esta vacia o dice `N/A`.
    """
    value = " ".join((text or "").split())
    if not value or value.upper() in ("N/A", "NA", "-"):
        return None

    implicit = False
    if value.lower().startswith("implicit "):
        implicit = True
        value = value[len("implicit "):].strip()

    match = CELL.match(value)
    field = (match.group("field") if match else value).strip()
    access = (match.group("access") or "") if match else ""

    out = {"field": FIELDS.get(field.lower(), field)}
    if FIELDS.get(field.lower()) is None:
        # Se conserva ademas el texto original cuando el campo no se reconoce,
        # para que quien lea el fichero pueda decidir por su cuenta en vez de
        # quedarse sin el dato.
        out["raw"] = field

    letters = {c for c in access.lower() if c.isalpha()}
    out["read"] = "r" in letters
    out["write"] = "w" in letters
    if implicit:
        out["implicit"] = True

    return out


def locate(table_pages, first, last):
    """Encuentra las lineas de la tabla dentro del volcado en modo tabla.

    No se busca por el encabezado de seccion sino por la fila `Op/En`. El
    volcado en modo tabla pega los encabezados de seccion a la primera fila de
    su tabla, asi que "Instruction Operand Encoding" no se reconoce ahi; la
    fila de la tabla, en cambio, es inconfundible.

    @param table_pages Paginas del volcado en modo tabla.
    @param first Primera pagina de la instruccion.
    @param last Pagina siguiente a la ultima.
    @returns Lineas de la tabla, de su encabezado en adelante.
    """
    body = []
    for index in range(first, min(last, len(table_pages))):
        body.extend(table_pages[index].split("\n"))

    start = None
    for i, line in enumerate(body):
        if re.match(r"^\s*Op\s*/\s*En\b", line, re.I):
            start = i
            break
    if start is None:
        return []

    out = []
    for line in body[start:]:
        text = line.strip()
        if not text:
            if len(out) > 1:
                # Una linea en blanco despues de haber leido filas cierra la
                # tabla: la siguiente seccion empieza ahi.
                continue
            continue
        if out and re.match(r"^(Description|Operation|Flags Affected)\b", text):
            break
        out.append(line.rstrip())

    return out


# Tipos de tupla que declara EVEX. Son la regla con que se escala el
# desplazamiento comprimido, y forman un vocabulario cerrado y corto.
TUPLE_TYPES = re.compile(
    r"^(N/A|None|Full|Half|Full\s*Mem|Half\s*Mem|Quarter\s*Mem|Eighth\s*Mem|"
    r"Tuple\d*(\s+\w+)?|Scalar|Mem\d+|Movddup|"
    r"Tuple1\s*(Scalar|Fixed)|Tuple[248]|Tuple\d+x\d+)$",
    re.I,
)


def _is_tuple_type(value):
    """Indica si una celda es un tipo de tupla y no un operando.

    Un operando siempre nombra donde vive -- `ModRM:reg`, `VEX.vvvv`, `imm8` --
    y un tipo de tupla es una palabra del vocabulario de EVEX. La distincion
    importa porque la columna puede venir vacia.
    """
    text = " ".join((value or "").split())
    if ":" in text or "(" in text:
        return False
    return bool(TUPLE_TYPES.match(text))


def split_cells(line):
    """Parte una fila por sus separaciones de dos espacios o mas.

    Se prefiere esto a cortar por la posicion de las columnas del encabezado.
    Las celdas de esta tabla -- `ModRM:reg (r, w)` -- no llevan dobles espacios
    dentro, y en cambio el encabezado es mas estrecho que los datos: cortando
    por su posicion, `ModRM:reg` se partia en `ModRM:r` y `eg`.
    """
    return [c.strip() for c in re.split(r"\s{2,}", line.strip()) if c.strip()]


def read(lines):
    """Lee la tabla de codificacion de operandos de una instruccion.

    @param lines Lineas de la tabla, de su encabezado en adelante.
    @returns Lista de modos, cada uno con sus operandos descompuestos.
    """
    rows = [split_cells(l) for l in lines if l.strip()]
    if not rows:
        return []

    head = [normalize(h) for h in rows[0]]
    if not head or head[0] != OPEN_HEADER:
        return []

    # La columna de tipo de tupla se reconoce por su comienzo, no por su
    # nombre completo: el volcado la parte a veces en `Tuple` y `Type`, y
    # exigiendo el nombre entero sus valores -- `Full`, `Scalar`, `Tuple1` --
    # se colaban en la lista de operandos como si fueran campos.
    has_tuple = any(h.startswith("tuple") for h in head)
    out = []

    for cells in rows[1:]:
        key = cells[0]
        # La clave es corta y en mayusculas: `RM`, `MI`, `A`, `RVMI`. Cualquier
        # otra cosa es una continuacion o el principio de la seccion siguiente.
        if not re.fullmatch(r"[A-Z]{1,5}\d?", key):
            continue

        entry = {"id": key, "operands": []}
        values = cells[1:]

        if has_tuple and values and _is_tuple_type(values[0]):
            # Solo se consume la celda si de verdad es un tipo de tupla. Con la
            # columna vacia, `split_cells` la colapsa y el primer operando pasa
            # a ocupar su sitio: descartandolo a ciegas se perdia el operando
            # de mil formas.
            tuple_type = values.pop(0)
            if tuple_type.upper() != "N/A":
                entry["tuple_type"] = tuple_type

        for value in values:
            operand = parse_cell(value)
            if operand:
                entry["operands"].append(operand)

        if entry["operands"] or entry.get("tuple_type"):
            out.append(entry)

    return out


def reconcile(forms, modes):
    """Aplica las claves de `Op/En` recompuestas que esta tabla confirma.

    El lector de codificaciones no puede decidir solo si una clave corta es la
    verdadera o el resto de una que la columna partio: no tiene delante los
    modos. Deja las dos lecturas como candidatas y aqui se elige.

    Una clave solo se sustituye cuando la leida NO esta definida y la
    recompuesta SI, de modo que la reparacion no puede estropear una lectura
    correcta. En el peor caso no hace nada y el validador sigue senalando el
    hueco, que es preferible a taparlo.

    @param forms Formas de codificacion, tal como las devuelve `encodings`.
    @param modes Modos leidos de la tabla de codificacion de operandos.
    """
    defined = {mode["id"] for mode in modes}

    for entry in forms:
        candidates = entry.pop("candidates", None)
        if not candidates or entry.get("operands") in defined:
            continue
        for key, syntax in candidates:
            if key in defined:
                entry["operands"] = key
                # La sintaxis solo cambia cuando la clave venia de ella: la
                # continuacion de debajo no le quita nada.
                if syntax is not None:
                    entry["syntax"] = syntax
                break
