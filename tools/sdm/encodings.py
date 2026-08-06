"""Lectura de la tabla de codificaciones que abre cada instruccion.

Esa tabla es lo primero de toda entrada del manual y dice, para cada forma de
la instruccion, con que bytes se codifica y en que modos es valida.

El manual la publica en **dos formas distintas**, y hay que reconocer las dos:

    Opcode          Instruction        Op/En  64-bit Mode  Compat/Leg  Description
    14 ib           ADC AL, imm8       I      Valid        Valid       ...

    Opcode/                            Op/En  64/32 bit    CPUID       Description
    Instruction                               Mode Support Feature

En la segunda, el opcode y la sintaxis comparten columna y se apilan: el
opcode en una linea, la sintaxis debajo. Es la mayoritaria -- unas seiscientas
entradas frente a ciento cuarenta -- y tratarla como si fuera la primera hace
que la sintaxis de los operandos acabe donde deberia ir un opcode. Fue asi como
`xmm3/m128` termino contandose como notacion de opcode que no se reconocia.

La columna de CPUID solo existe en la segunda forma, y es informacion que no
esta en ninguna otra fuente del proyecto: dice que bit de CPUID hay que
comprobar antes de usar la instruccion.
"""

import re

from . import opcode, tables, text

# Encabezados que identifican cada columna, sea cual sea la forma. Se comparan
# en minusculas y sin espacios porque el volcado los parte por falta de
# anchura: `Op/ En`, `64/32 bit Mode Support`.
COLUMN_ALIASES = {
    "opcode": "opcode",
    "opcodeinstruction": "opcode+syntax",
    "instruction": "syntax",
    "open": "operands",
    "op/en": "operands",
    "64bitmode": "mode_long",
    "64/32bitmodesupport": "mode_support",
    "64/32bitmode": "mode_support",
    "64/32mode": "mode_support",
    "compat/legmode": "mode_legacy",
    "compatlegmode": "mode_legacy",
    "cpuidfeatureflag": "cpuid",
    "cpuidfeature": "cpuid",
    "description": "description",
}


def normalize(name):
    """Reduce un encabezado a una clave comparable.

    Se quita la llamada al pie que algunos encabezados arrastran. `Opcode1` es
    `Opcode` con la nota 1, y tomarlo por otro nombre hacia creer que la tabla
    era de la forma apilada: entonces las filas siguientes se fundian como si
    fueran sintaxis, y `PUSH` perdia sus tres formas de `50+rw`.
    """
    key = re.sub(r"[^a-z0-9/]+", "", name.lower())
    return re.sub(r"(?<=[a-z])\d$", "", key)


def classify(head):
    """Asigna a cada columna de la tabla el campo que contiene.

    @param head Fila de encabezados.
    @returns Lista de nombres de campo, con `None` en las no reconocidas.
    """
    out = []
    for name in head:
        key = normalize(name)
        field = COLUMN_ALIASES.get(key)
        if field is None:
            # `Opcode/` a secas es la forma apilada: el encabezado se corta en
            # la barra porque `Instruction` cae en la segunda linea.
            if key.startswith("opcode"):
                field = "opcode+syntax" if key != "opcode" else "opcode"
            elif key.startswith("64/32"):
                field = "mode_support"
            elif key.startswith("64bit"):
                field = "mode_long"
            elif key.startswith("compat"):
                field = "mode_legacy"
            elif key.startswith("cpuid"):
                field = "cpuid"
            elif key.startswith("desc"):
                field = "description"
        out.append(field)
    return out


def is_syntax_only(cells):
    """Indica si una fila solo trae la sintaxis de la forma anterior.

    En la forma apilada, la sintaxis va en una fila propia con las demas
    columnas vacias. Es lo que la distingue de una forma nueva, que siempre
    trae al menos el modo o la descripcion.
    """
    return bool(cells) and bool(cells[0]) and not any(c for c in cells[1:])


def looks_like_opcode(text):
    """Indica si un texto parece notacion de opcode y no sintaxis.

    La notacion empieza por un byte hexadecimal, un prefijo o un marcador de
    prefijo vectorial. La sintaxis empieza por el mnemonico, que es una palabra
    con letras.
    """
    first = text.split()[0].upper() if text.split() else ""
    if re.fullmatch(r"[0-9A-F]{2}", first):
        return True
    return first.startswith(("REX", "VEX.", "EVEX.", "XOP.", "MVEX.", "NP", "NFX",
                             "F2", "F3", "66"))


# Clave de codificacion de operandos: una o dos letras, a veces con un digito.
# Son `A`, `B`, `RM`, `MR`, `MI`, `RVM`, `A1`...
OPERAND_KEY = re.compile(r"^[A-Z]{1,4}\d?$")


# Donde acaba la notacion y empieza el mnemonico: una palabra de dos letras o
# mas, en mayusculas, que no es ninguno de los marcadores de la notacion.
SYNTAX_START = re.compile(r"\s([A-Z][A-Z0-9]{1,})\s")


def _split_syntax(entry):
    """Separa la sintaxis que quedo dentro de la celda del opcode.

    En algunas entradas -- `CRC32` es el caso -- el volcado no encuentra el
    corte entre las dos columnas y deja `F2 0F 38 F0 /r  CRC32 r32, r/m8` en
    una sola celda. La notacion termina donde empieza el mnemonico, y eso se
    reconoce: los marcadores de la notacion son bytes, prefijos y barras, nunca
    una palabra suelta en mayusculas.

    Solo se parte si la columna de sintaxis venia vacia: si trae valor, manda.
    """
    if entry["syntax"]:
        return

    text = entry["opcode"]
    for m in SYNTAX_START.finditer(" " + text + " "):
        word = m.group(1)

        # Cualquier cosa que la notacion sepa leer NO es el mnemonico. No basta
        # con mirar si es un byte de opcode: `F2` y `F3` son prefijos, y
        # tomarlos por el mnemonico dejaba la forma sin un solo byte. Paso en
        # 125 instrucciones.
        parsed = opcode.parse(word)
        if any(k != "rest" for k in parsed):
            continue

        cut = m.start(1) - 1
        # Cortar en el origen dejaria el opcode vacio: entonces no hay
        # separacion que hacer, es todo sintaxis o todo notacion.
        if cut <= 0:
            continue

        entry["opcode"] = text[:cut].strip()
        entry["syntax"] = text[cut:].strip()
        return


def _rescue_operands(entry):
    """Recupera la clave de operandos que quedo pegada al opcode.

    Cuando la columna de `Op/En` es estrecha, el volcado la deja dentro de la
    celda del opcode: `EVEX.128.66.0F38.W0 1E /r  C` termina con una `C` que no
    es notacion, es la clave. Sin esto se perdia la clave Y el analizador
    contaba la letra como un token desconocido.

    Solo se rescata si la columna propia venia vacia: si trae valor, manda ella.
    """
    if entry["operands"]:
        return

    tokens = entry["opcode"].split()
    if len(tokens) < 2:
        return

    last = tokens[-1]

    # Nada que la notacion sepa leer se rescata como clave. `D9 F3` es el
    # opcode entero de `FPATAN`, y `F3` encaja en el patron de clave: se
    # rescataba, la instruccion perdia su segundo byte y ganaba un modo `F3`
    # que no existe. Mirar solo si `opcode` quedaba vacio no bastaba, porque
    # `F3` se lee como prefijo y va a otro campo.
    if any(k != "rest" for k in opcode.parse(last)):
        return

    if OPERAND_KEY.match(last):
        entry["operands"] = last
        entry["opcode"] = " ".join(tokens[:-1])


# Palabra cortada al final de la celda del opcode. Ninguna notacion termina en
# guion, asi que lo que quede ahi pertenece a la columna siguiente.
WORD_FRAGMENT = re.compile(r"\s+([A-Za-z][A-Za-z0-9]*)-$")


def _join_wrapped_mnemonic(entry):
    """Reune el mnemonico que el borde de la columna partio en dos.

    En las cuatro instrucciones `AES...WIDE...KL` el mnemonico no cabe a lo
    ancho y el volcado lo parte: `AES-` se queda al final de la celda del
    opcode y `ENCWIDE128KL m384, <XMM0-7>` empieza la de la sintaxis. Las dos
    mitades juntas son `AESENCWIDE128KL`.

    Sin esto, el `AES-` quedaba en el opcode como token que la notacion no
    sabia leer, y la sintaxis se publicaba sin las tres primeras letras de su
    propio mnemonico.
    """
    match = WORD_FRAGMENT.search(entry["opcode"])
    if not match or not entry["syntax"]:
        return

    entry["opcode"] = entry["opcode"][: match.start()].strip()
    entry["syntax"] = match.group(1) + entry["syntax"].lstrip()


# Clave que se quedo a caballo entre la columna de sintaxis y la suya: un
# tramo de espacios y despues una o dos mayusculas al final de la celda.
SPLIT_KEY = re.compile(r"\s{2,}([A-Z]{1,2})$")


def _join_split_key(entry):
    """Propone la clave de operandos recompuesta, sin aplicarla.

    La columna de `Op/En` es estrecha y el volcado la parte por donde cae, no
    por donde empieza. En `MOV` a registros de control el manual escribe `MR`
    y llega como `M` en la columna de sintaxis y `R` en la suya, asi que la
    instruccion declaraba un modo `R` que su propia tabla no define.

    La reconstruccion NO se aplica aqui. Se deja como candidata y la valida
    quien tiene delante la tabla de modos, en `reconcile`. Aplicarla a ciegas
    tambien acertaba en `MOV`, pero convertia el `RCL r/m8,  CL` correcto en un
    modo `CLMC` inexistente: la sintaxis tambien puede terminar en mayusculas.
    """
    if not entry["operands"] or not entry["syntax"]:
        return

    match = SPLIT_KEY.search(entry["syntax"])
    if not match:
        return

    entry.setdefault("candidates", []).append(
        (match.group(1) + entry["operands"], entry["syntax"][: match.start()].strip()))


def _continue_key(entry, fields, cells):
    """Recoge el final de la clave que cayo en la fila de la sintaxis.

    En la forma apilada la fila de la sintaxis lleva su columna de `Op/En`
    vacia. Si trae algo es porque la clave no cupo a lo ancho y siguio abajo:
    `VPERM2F128` llega como `RV` arriba y `MI` debajo, y su tabla define
    `RVMI`.

    Igual que en `_join_split_key`, se propone y no se aplica: esa fila
    tambien recoge lo que se cuela de la seccion siguiente, y sin validar
    contra la tabla `VMOVMSKPS reg, ymm2 Op/En Operand 1 RM` acababa
    declarando un modo `RMO`.
    """
    for field, value in zip(fields, cells):
        if field != "operands":
            continue
        tail = value.strip().split()
        if tail and OPERAND_KEY.match(tail[0]):
            entry.setdefault("candidates", []).append(
                (entry["operands"] + tail[0], None))
        return


def _append_note(entry, cells):
    """Anade a la descripcion de una forma el texto que continua debajo."""
    for value in cells:
        piece = value.strip()
        if piece:
            entry["note"] = (entry["note"] + " " + piece).strip()


def read(lines):
    """Lee el preambulo de una instruccion como tabla de codificaciones.

    El encabezado se busca por su primera palabra, que en esta tabla es
    siempre `Opcode`. Es lo mas fiable que hay: no se deduce, se sabe.

    @param lines Lineas del preambulo, sin el titulo.
    @returns Lista de formas estructuradas.
    """
    return parse(tables.parse(lines, header=lambda ls: tables.starts_at(ls, "opcode")))


def parse(table):
    """Convierte la tabla de codificaciones en formas estructuradas.

    @param table Salida de `tables.parse` sobre el preambulo.
    @returns Lista de formas, cada una con su disposicion de bytes.
    """
    head = table.get("head") or []
    fields = classify(head)
    if "opcode" not in fields and "opcode+syntax" not in fields:
        return []

    stacked = "opcode+syntax" in fields
    out = []

    for cells in table.get("rows") or []:
        first = cells[0].strip() if cells else ""

        # En la forma apilada, lo que decide si una fila abre una forma nueva
        # es si su primera columna PARECE NOTACION, no si el resto esta vacio.
        #
        # La linea de la sintaxis arrastra ademas la continuacion de la
        # descripcion, que no cupo arriba: exigir que las demas columnas
        # estuvieran vacias hacia que `VADDPS xmm1,xmm2, xmm3/m128` se contara
        # como un opcode. Era el grueso de los tokens sin reconocer.
        if stacked and out and first and not looks_like_opcode(first):
            out[-1]["syntax"] = (out[-1]["syntax"] + " " + first).strip()
            _continue_key(out[-1], fields, cells)
            _append_note(out[-1], cells[1:])
            continue

        if stacked and out and not first:
            # Sin nada en la primera columna es continuacion de la descripcion.
            _append_note(out[-1], cells[1:])
            continue

        entry = {"opcode": "", "syntax": "", "operands": "", "modes": {},
                 "cpuid": "", "note": ""}

        for field, value in zip(fields, cells):
            value = value.strip()
            if not field or not value:
                continue
            if field in ("opcode", "opcode+syntax"):
                entry["opcode"] = value
            elif field == "syntax":
                entry["syntax"] = value
            elif field == "operands":
                # La clave es un token contiguo -- `RM`, `MI`, `ZO` -- y nunca
                # lleva espacios. Cuando la columna es estrecha, el volcado le
                # pega lo que viene detras: `R   N` es la clave `R` mas el
                # principio de `N.E.`, y `R Instruction Operand E` es la clave
                # mas el encabezado de la seccion siguiente.
                entry["operands"] = value.split()[0] if value.split() else ""
            elif field == "mode_long":
                entry["modes"]["long"] = value.lower()
            elif field == "mode_legacy":
                entry["modes"]["legacy"] = value.lower()
            elif field == "mode_support":
                # `V/V`, `V/N.E.`: soporte en 64 bits a la izquierda de la
                # barra y en 32 a la derecha. Se separan porque son dos hechos
                # distintos y juntos no se pueden consultar.
                parts = [p.strip().lower() for p in value.split("/")]
                entry["modes"]["long"] = parts[0]
                if len(parts) > 1:
                    entry["modes"]["legacy"] = parts[1]
            elif field == "cpuid":
                entry["cpuid"] = value
            elif field == "description":
                entry["note"] = value

        if not entry["opcode"]:
            continue
        # Resto del encabezado que se colo como fila. Se compara con la llamada
        # al pie quitada: el manual escribe `Opcode1` cuando la tabla tiene
        # notas, y sin normalizarlo esa fila se publicaba como una forma.
        if normalize(entry["opcode"]) in ("opcode", "instruction"):
            continue

        _split_syntax(entry)
        _rescue_operands(entry)
        _join_split_key(entry)

        # `ZO` es "cero operandos", con la letra O. El volcado devuelve el cero
        # en `UD`, y como clave son cosas distintas: una existe y la otra no.
        if entry["operands"] == "Z0":
            entry["operands"] = "ZO"

        entry["note"] = text.dehyphenate(entry["note"])
        entry["layout"] = opcode.parse(entry["opcode"])
        out.append(entry)

    # El mnemonico partido se reune al final y no dentro del bucle: en la forma
    # apilada la sintaxis llega en una fila POSTERIOR, asi que durante la fila
    # del opcode todavia no hay segunda mitad con la que juntarlo.
    for entry in out:
        before = entry["opcode"]
        _join_wrapped_mnemonic(entry)
        if entry["opcode"] != before:
            entry["layout"] = opcode.parse(entry["opcode"])

    return out
