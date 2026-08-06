"""Analisis de la notacion de opcodes del manual.

El manual escribe la codificacion de cada forma en una notacion compacta que el
propio manual define:

    REX.W + 81 /2 id

Quiere decir prefijo REX con el bit W, byte de opcode `81`, un ModR/M cuyo
campo `reg` vale 2 en lugar de nombrar un registro, y un inmediato de cuatro
bytes. Dejarla como cadena la hace inservible: no se puede dibujar la
disposicion de los bytes, ni buscar por opcode, ni comprobar nada.

Lo que NO se reconoce se conserva en `rest`. Es deliberado: una notacion mal
entendida produce un diagrama de bytes que miente, y publicar eso es peor que
no dibujarlo. `rest` no vacio significa "hay que mirar esto", y el importador
lo cuenta al terminar.
"""

import re

# Marcadores de inmediato y de desplazamiento, con su tamano en bytes.
IMMEDIATE_SIZES = {
    "ib": 1, "iw": 2, "id": 4, "io": 8,
    "cb": 1, "cw": 2, "cd": 4, "cp": 6, "ct": 10,
}

# Sufijos que meten el numero de registro dentro del propio byte de opcode.
# `50+rd` es `PUSH r64`: el registro no va en un ModR/M, va sumado al opcode.
OPCODE_REGISTER = {"+rb": 1, "+rw": 2, "+rd": 4, "+ro": 8}

# `+i` es lo mismo para la pila de x87: `D8 C0+i` suma al segundo byte el
# numero del registro `ST(i)`. Se distingue de los anteriores en que el
# registro no tiene ancho: es una posicion de pila.
STACK_REGISTER = "+i"

# El manual escribe algunos inmediatos con su nombre en vez de su marcador.
IMMEDIATE_ALIASES = {
    "imm8": "ib", "imm16": "iw", "imm32": "id", "imm64": "io",
}

# `/is4`: un inmediato de un byte cuyos cuatro bits altos nombran un registro.
# Lo usan las AVX de cuatro operandos, donde no queda sitio en el ModR/M.
IS4 = "/is4"

# Prefijos obligatorios que el manual escribe como byte suelto delante.
PREFIX_BYTES = {"NP", "NFX", "F2", "F3", "66", "REP", "REPE", "REPNE"}

HEX_BYTE = re.compile(r"^[0-9A-F]{2}$")

# Restriccion sobre el campo `mod` del ModR/M: `11:rrr:bbb` solo admite
# registro, `!(11):rrr:bbb` solo memoria.
# Los campos `reg` y `rm` pueden venir fijados a un valor binario concreto en
# lugar del comodin: `!(11):000:bbb` exige memoria Y que `reg` valga 000.
# Los dos puntos NO son opcionales. Sin ellos el patron casa con `10` y `11`
# a secas, que son bytes de opcode legitimos -- los de `ADC r/m, r` -- y esas
# formas desaparecian de la instruccion sin que nada avisara.
MODRM_CONSTRAINT = re.compile(
    r"^(!)?\(?(?:mod=)?([01]{2})\)?"
    r":([01]{3}|[r?]{3})"
    r"(?::([01]{3}|[b?]{3}))?$",
    re.I,
)

# `(mod=11)` a secas. Va aparte porque los parentesis lo hacen inequivoco: sin
# ellos, `11` es un byte de opcode y no una restriccion.
BARE_MOD = re.compile(r"^\(mod=([01]{2})\)$", re.I)

# La misma restriccion escrita en prosa dentro de una nota entre parentesis,
# con o sin mas texto detras: `(mod!=11,/5,memoryonly)`.
MOD_NOTE = re.compile(r"^\(.*?mod(!?=)([01]{2}).*\)$", re.I)

# Selector de hoja: `(EAX = 0)`. Las funciones de `GETSEC` y de `ENCLS` no se
# distinguen por el opcode, que es el mismo, sino por el valor que se carga en
# EAX antes de ejecutarlas.
LEAF_SELECTOR = re.compile(r"^\(EAX\s*=\s*(\d+)\)$", re.I)

# Llamada al pie pegada a un marcador: `/r1` es `/r` con la nota 1. No se puede
# distinguir por la forma -- `/r1` tambien podria ser un marcador propio -- asi
# que se acepta solo cuando lo que queda es un marcador conocido.
FOOTNOTE_ON_MARKER = re.compile(r"^(/r|/vsib|/\d|i[bwdo]|c[bwdpt])\d$")

# Prefijos vectoriales. Llevan su propia gramatica dentro -- longitud, mapa de
# opcode, ancho -- que ya esta documentada en el manual, asi que se guardan
# enteros en lugar de replicar aqui esa tabla.
VECTOR_PREFIXES = ("VEX.", "EVEX.", "XOP.", "MVEX.")


def tokenize(notation):
    """Parte la notacion en tokens, separando los `+` de dos sentidos.

    El `+` aparece con dos significados. Suelto, entre `REX.W` y el byte de
    opcode, es un separador que no aporta nada. Pegado a un byte, como en
    `50+rd`, dice que el registro va dentro del opcode. Confundirlos hacia que
    `REX.W + 13 /r` perdiera su byte de opcode.
    """
    # El volcado parte a veces el prefijo vectorial por dentro:
    # `VEX.LZ. 0F38.W1` y `VEX.128.66.0F 38.WIG` son un solo prefijo con un
    # espacio de mas. Se vuelve a pegar cuando el trozo de la izquierda acaba
    # en punto o el de la derecha empieza por uno de los campos del prefijo.
    notation = re.sub(
        r"\b((?:E?VEX|XOP|MVEX)\.[A-Za-z0-9.]*)\.\s+([0-9A-Fa-f]{2}[A-Za-z0-9.]*)",
        r"\1.\2", notation)
    # `EVEX.128.66.0F38 30.WIG`: el `.WIG` pertenece al prefijo pero viaja
    # pegado al byte de opcode. Se devuelve a su sitio y el byte queda suelto.
    notation = re.sub(
        r"\b((?:E?VEX|XOP|MVEX)\.[A-Za-z0-9.]*[0-9A-Fa-f])\s+"
        r"([0-9A-Fa-f]{2})(\.W(?:IG|[01]))",
        r"\1\3 \2", notation)

    # `(EAX = 0)`: el selector de hoja llega con espacios dentro y se partiria
    # en tres tokens sin significado.
    notation = re.sub(r"\(\s*EAX\s*=\s*(\d+)\s*\)", r"(EAX=\1)", notation, flags=re.I)

    # Lo demas entre parentesis tambien: `(mod!=11, /5, memory only)` es una
    # nota sobre la forma, y partida por los espacios deja cuatro tokens que no
    # significan nada por separado.
    notation = re.sub(r"\(([^)]*)\)",
                      lambda m: "(" + re.sub(r"\s+", "", m.group(1)) + ")",
                      notation)

    raw = re.split(r"\s+", notation.strip())

    # `B8+ rd`: el manual separa el `+` del sufijo con un espacio. Se vuelven a
    # juntar antes de nada, porque por separado ninguno de los dos significa
    # algo.
    joined = []
    for token in raw:
        if joined and joined[-1].endswith("+") and re.match(r"^r[bwdo]\d?$", token):
            joined[-1] += token
        else:
            joined.append(token)

    out = []
    for token in joined:
        if not token or token == "+":
            continue
        # `40+ rw2`: sufijo con llamada al pie pegada.
        marker = re.match(r"^([0-9A-Fa-f]{2}\+r[bwdo])\d$", token)
        if marker:
            token = marker.group(1)

        # Dos bytes de opcode pegados sin espacio: `0F38`, `0F3A`.
        m = re.match(r"^([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$", token)
        if m and m.group(1).upper() in ("0F",):
            out.extend([m.group(1), m.group(2)])
            continue

        # `50+rd`: el registro va sumado al byte de opcode.
        m = re.match(r"^([0-9A-Fa-f]{2})\+(r[bwdo])$", token)
        if m:
            out.extend([m.group(1), "+" + m.group(2)])
            continue

        # `D8 C0+i`: lo mismo para la pila de x87.
        m = re.match(r"^([0-9A-Fa-f]{2})\+i$", token)
        if m:
            out.extend([m.group(1), "+i"])
            continue

        # `0F B1/r`: el manual pega el marcador al byte sin espacio.
        m = re.match(r"^([0-9A-Fa-f]{2})(/(?:r|vsib|\d))$", token)
        if m:
            out.extend([m.group(1), m.group(2)])
            continue

        out.append(token)
    return out


# Campos del prefijo vectorial, en el orden en que el manual los escribe.
#
# `EVEX.128.66.0F38.W0` no es un nombre: son cinco decisiones distintas, y cada
# una acaba en unos bits concretos del prefijo. Guardarlo como cadena obliga a
# quien lea el fichero a volver a analizarlo, que es exactamente lo que este
# formato existe para evitar.
VECTOR_LENGTHS = {
    "128": 128, "256": 256, "512": 512,
    # `LIG` es "la longitud da igual"; `LZ` y `L0` exigen el bit a cero.
    "LIG": None, "LZ": 0, "L0": 0, "L1": 1,
}

# Prefijo obligatorio que el campo `pp` codifica en dos bits.
VECTOR_PP = {"66": "66", "F2": "F2", "F3": "F3", "NP": None}

# Mapa de opcode que codifica el campo `mm`: que bytes de escape sustituye.
VECTOR_MAPS = {"0F": "0F", "0F38": "0F 38", "0F3A": "0F 3A", "MAP5": "MAP5",
               "MAP6": "MAP6"}


def parse_vector_prefix(token):
    """Descompone `EVEX.128.66.0F38.W0` en los campos que codifica.

    @param token Prefijo tal como lo escribe el manual.
    @returns Diccionario con los campos reconocidos y el texto original.
    """
    parts = token.split(".")
    out = {"type": parts[0].upper(), "text": token}

    for part in parts[1:]:
        key = part.upper()

        if key in VECTOR_LENGTHS:
            length = VECTOR_LENGTHS[key]
            out["length"] = length
            if key in ("LIG", "LZ", "L0", "L1"):
                out["length_note"] = key
            continue

        if key in VECTOR_PP:
            if VECTOR_PP[key]:
                out["prefix"] = VECTOR_PP[key]
            continue

        if key in VECTOR_MAPS:
            out["map"] = VECTOR_MAPS[key]
            continue

        if key in ("W0", "W1"):
            out["w"] = int(key[1])
            continue
        if key == "WIG":
            # "W ignored": la instruccion no mira ese bit.
            out["w"] = None
            out["w_note"] = "WIG"
            continue

        out.setdefault("rest", []).append(part)

    return out


def parse(notation):
    """Descompone la notacion de un opcode en la disposicion de sus bytes.

    @param notation Cadena tal como la publica el manual.
    @returns Diccionario con las partes reconocidas, y `rest` con lo demas.
    """
    out = {}
    rest = []

    for token in tokenize(notation):
        # Una llamada al pie pegada al marcador se aparta antes de clasificar:
        # `/r1` es `/r` con la nota 1, y sin quitarla la forma entera queda sin
        # reconocer. Se hace aqui y no en la tabla porque solo aqui se sabe que
        # `/r` es un marcador y `imm1` no.
        if FOOTNOTE_ON_MARKER.match(token):
            token = token[:-1]

        # El manual escribe algunos inmediatos con barra delante: `/ib`.
        if len(token) > 1 and token[0] == "/" and token[1:] in IMMEDIATE_SIZES:
            token = token[1:]

        # ...y otros por su nombre en vez de por su marcador: `imm8` es `ib`.
        token = IMMEDIATE_ALIASES.get(token.lower(), token)

        # Un byte puede arrastrar la puntuacion de la celda: `E0,`.
        if re.match(r"^[0-9A-Fa-f]{2}[,./]$", token):
            token = token[:-1]

        upper = token.upper()

        # Un prefijo solo lo es DELANTE del opcode. `66`, `F2` y `F3` son
        # tambien bytes de opcode perfectamente validos, y una vez empezado el
        # opcode eso es lo que son: en `NP 0F 66 /r` el `66` es el segundo byte
        # de `PCMPGTB`, no un prefijo. Sin esta condicion la instruccion se
        # quedaba con el opcode `0F` a secas y aparecia en el mapa de un byte,
        # en la casilla de la fuga.
        if upper in PREFIX_BYTES and not out.get("opcode"):
            out.setdefault("prefixes", []).append(upper)
        elif upper == "REX":
            out["rex"] = ""
        elif upper.startswith("REX."):
            out["rex"] = upper[4:]
        elif upper.startswith(VECTOR_PREFIXES):
            out["vector_prefix"] = parse_vector_prefix(token)
        elif token == "/r":
            out["modrm"] = {"kind": "reg"}
        elif token == "/vsib":
            # Indice vectorial: el campo `index` del SIB nombra un registro
            # XMM, YMM o ZMM en lugar de uno entero. Es lo que hace posibles
            # `gather` y `scatter`, y no aparece en ninguna otra fuente del
            # proyecto.
            out["modrm"] = {"kind": "vsib"}
        elif token.startswith("/") and token[1:].isdigit():
            out["modrm"] = {"kind": "digit", "value": int(token[1:])}
        elif BARE_MOD.match(token):
            out["modrm"] = {"kind": "reg", "mod": BARE_MOD.match(token).group(1),
                            "negated": False}
        elif MOD_NOTE.match(token):
            # `(mod!=11,/5,memoryonly)`: la restriccion escrita en prosa en
            # lugar de con la notacion de campos. Dice lo mismo que `!(11)` y
            # hay que quedarse con ello, porque es lo unico que distingue la
            # forma de memoria de la de registro. Del resto de la nota no se
            # pierde nada: `/5` ya viene aparte y "memory only" lo repite.
            note = MOD_NOTE.match(token)
            modrm = out.setdefault("modrm", {"kind": "reg"})
            modrm["mod"] = note.group(2)
            modrm["negated"] = note.group(1) == "!="
        elif token in ("/", ",", ".", "-"):
            # Puntuacion que el volcado deja suelta al cortar una celda.
            continue
        elif LEAF_SELECTOR.match(token):
            # `(EAX = 0)`: las hojas de SMX no se eligen con un opcode distinto
            # sino con un valor en EAX. Es su forma de codificacion, y sin esto
            # quedaba como token desconocido en las nueve entradas de GETSEC.
            out["leaf"] = {"register": "EAX", "value": LEAF_SELECTOR.match(token).group(1)}
        elif token.isdigit() and len(token) == 1:
            # Una llamada al pie que quedo separada del marcador por un
            # espacio. No aporta nada a la codificacion.
            continue
        elif MODRM_CONSTRAINT.match(token):
            # `!(11):rrr:bbb` dice que el campo `mod` NO puede valer 11, o sea
            # que esa forma solo admite operando de memoria. `11:rrr:bbb` es lo
            # contrario: solo registro. Es una restriccion real de la forma, no
            # decoracion, y sin ella dos formas distintas parecen la misma.
            m = MODRM_CONSTRAINT.match(token)
            modrm = {
                "kind": "reg",
                "mod": m.group(2),
                "negated": bool(m.group(1)),
            }
            # Un campo con digitos binarios esta FIJADO a ese valor; con
            # comodines queda libre. La diferencia importa: `!(11):000:bbb` es
            # una forma distinta de `!(11):001:bbb`, y sin guardarla las dos
            # parecen la misma.
            for group, name in ((3, "reg"), (4, "rm")):
                value = m.group(group)
                if value and set(value) <= {"0", "1"}:
                    modrm[name] = value
            out["modrm"] = modrm
        elif token == STACK_REGISTER:
            out["opcode_register"] = {"marker": token, "file": "x87"}
        elif token == IS4:
            out.setdefault("immediates", []).append(
                {"marker": token, "bytes": 1, "selects_register": True}
            )
        elif token in OPCODE_REGISTER:
            out["opcode_register"] = {"marker": token, "width": OPCODE_REGISTER[token]}
        elif token in IMMEDIATE_SIZES:
            out.setdefault("immediates", []).append(
                {"marker": token, "bytes": IMMEDIATE_SIZES[token]}
            )
        elif HEX_BYTE.match(upper):
            out.setdefault("opcode", []).append(upper)
        else:
            rest.append(token)

    if rest:
        out["rest"] = rest
    return out


def summary(layout):
    """Describe en una linea la disposicion de bytes de una forma.

    Sirve para la comprobacion y para el titulo de un diagrama; la pagina
    dibuja la version larga desde los campos.

    @param layout Salida de `parse`.
    @returns Cadena legible.
    """
    parts = []
    if layout.get("prefixes"):
        parts.extend(layout["prefixes"])
    if "rex" in layout:
        parts.append("REX" + ("." + layout["rex"] if layout["rex"] else ""))
    if "vector_prefix" in layout:
        parts.append(layout["vector_prefix"]["text"])
    parts.extend(layout.get("opcode", []))
    if "opcode_register" in layout:
        parts.append(layout["opcode_register"]["marker"])
    modrm = layout.get("modrm")
    if modrm:
        if modrm["kind"] == "digit":
            parts.append("/%d" % modrm["value"])
        elif modrm["kind"] == "vsib":
            parts.append("/vsib")
        elif "mod" in modrm:
            parts.append(("!" if modrm["negated"] else "") + modrm["mod"] + ":rrr:bbb")
        else:
            parts.append("/r")
    for imm in layout.get("immediates", []):
        parts.append(imm["marker"])
    return " ".join(parts)
