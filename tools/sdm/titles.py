"""Deteccion de instrucciones y expansion de sus mnemonicos.

Cada instruccion del manual abre con una linea `MNEMONICO--Resumen`. La misma
linea se repite como pie en las paginas siguientes de la seccion, con el
volumen y la pagina pegados detras, y eso es lo unico que las distingue.

El mnemonico casi nunca es uno solo. El manual comprime las familias
escribiendo unicamente lo que cambia respecto al anterior:

    MOVDQA/VMOVDQA32/64          son MOVDQA, VMOVDQA32 y VMOVDQA64
    VPERMI2W/D/Q/PS/PD           son VPERMI2W, VPERMI2D, VPERMI2Q, VPERMI2PS
                                 y VPERMI2PD
    VPMOVSXBW/BD/BQ/WD/WQ/DQ     seis, todas sobre la raiz VPMOVSX

Expandirlos importa: con la forma comprimida no se puede buscar una
instruccion por su nombre, que es exactamente lo que alguien hace al llegar a
una referencia.
"""

import re

# `MNEMONICO--Resumen`. El mnemonico admite minusculas porque el manual las usa
# en los comodines de familia (`CMOVcc`, `Jcc`, `SETcc`), y corchetes porque
# las hojas de SMX se escriben `GETSEC[SENTER]`.
#
# El ultimo caracter antes de los dos guiones NO puede ser un espacio. Es lo
# que separa un titulo de las leyendas de los diagramas de registro, que se
# escriben `P -- Precision Mask (SPE)` y por lo demas encajan perfectamente.
TITLE = re.compile(r"^([A-Z][A-Za-z0-9/\[\]:,. _-]{0,39}?[A-Za-z0-9\]])--(.+)$")

# Alternativa entre corchetes: `VF[,N]MADD[132,213,231]PH` son seis
# instrucciones, no una. La coma inicial de `[,N]` significa "vacio o N".
BRACKET = re.compile(r"\[([^\]]*)\]")

# El pie lleva el volumen y el numero de pagina; el titulo, no.
FOOTER = re.compile(r"Vol\.\s*2[A-D]\s")

# Un sufijo de familia: corto y sin minusculas.
SUFFIX = re.compile(r"^[A-Z0-9]{1,3}$")

# Cuantas lineas del principio de la pagina se miran. El titulo va en la
# primera o segunda; mirar mas lejos empieza a recoger prosa.
HEAD_LINES = 6

# Proporcion minima de mayusculas para considerar que algo es un mnemonico y no
# una frase que casualmente lleva dos guiones.
UPPER_RATIO = 0.5


def split_title(title):
    """Parte un titulo por `/` y `,` sin romper lo que va entre corchetes.

    Los corchetes importan: `GETSEC[CAPABILITIES]` es un nombre entero, y
    partirlo por cualquier separador que lleve dentro produciria fragmentos.
    """
    parts, current, depth = [], "", 0
    for ch in title:
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth = max(0, depth - 1)

        if ch in "/," and depth == 0:
            parts.append(current)
            current = ""
        else:
            current += ch
    parts.append(current)
    return [p.strip() for p in parts if p.strip()]


def expand(title):
    """Devuelve los mnemonicos completos que documenta un titulo.

    La raiz se fija en el PRIMER sufijo de la familia y se reutiliza para los
    siguientes. Recalcularla en cada paso desde el mnemonico anterior es lo que
    hacia que `VPERMI2W/D/Q/PS/PD` terminara en `VPERMIPS`: al llegar a un
    sufijo de dos caracteres recortaba dos del anterior y se comia el `2` de la
    raiz.

    @param title Texto del titulo, sin el resumen.
    @returns Lista de mnemonicos, en el orden en que aparecen.
    """
    out, stem = [], None

    for part in split_title(title):
        previous = out[-1] if out else None

        is_suffix = (
            previous is not None
            and SUFFIX.match(part)
            and " " not in previous
            and len(previous) > len(part)
        )

        if not is_suffix:
            out.append(part)
            # Un mnemonico completo cierra la familia anterior: lo que venga
            # despues cuelga de este y no del de antes.
            stem = None
            continue

        if stem is None:
            # Un sufijo numerico reemplaza la cola de digitos del anterior, sea
            # del largo que sea: `VMOVDQU8` con `16` da `VMOVDQU16`, no
            # `VMOVDQ16`.
            stem = (
                re.sub(r"\d+$", "", previous)
                if part.isdigit()
                else previous[: -len(part)]
            )

        out.append(stem + part)

    return out


def expand_brackets(mnemonic):
    """Despliega las alternativas entre corchetes en mnemonicos completos.

    `VF[,N]MADD[132,213,231]PH` son seis instrucciones: el primer corchete
    elige entre nada y `N`, el segundo entre tres numeros, y el producto de
    ambos da las seis. Dejarlo sin desplegar publicaria una entrada con un
    nombre que no existe y ninguna de las seis seria localizable por el suyo.

    Las hojas de SMX, `GETSEC[SENTER]`, tienen un solo valor y salen intactas,
    que es lo correcto: ahi el corchete forma parte del nombre.

    @param mnemonic Mnemonico posiblemente con alternativas.
    @returns Lista de mnemonicos concretos.
    """
    match = BRACKET.search(mnemonic)
    if not match:
        return [mnemonic]

    inside = match.group(1)
    # Un corchete sin comas no es una alternativa: es parte del nombre.
    if "," not in inside:
        rest = expand_brackets(mnemonic[match.end():])
        return [mnemonic[: match.end()] + tail for tail in rest]

    out = []
    for option in inside.split(","):
        replaced = mnemonic[: match.start()] + option.strip() + mnemonic[match.end():]
        out.extend(expand_brackets(replaced))
    return out


def looks_like_mnemonic(text):
    """Indica si un texto puede ser el mnemonico de un titulo.

    El sufijo `cc` no cuenta. Es la convencion del manual para "codigo de
    condicion" -- `Jcc`, `SETcc`, `CMOVcc` -- y son minusculas que forman parte
    del nombre, no prosa. Contandolas, `Jcc` daba un tercio de mayusculas y se
    descartaba: la pagina de los saltos condicionales, con sus dieciseis
    opcodes de `70` a `7F`, no llegaba a la referencia.
    """
    name = text[:-2] if text.endswith("cc") and len(text) > 2 else text
    letters = [c for c in name if c.isalpha()]
    if not letters:
        return False
    return sum(c.isupper() for c in letters) / len(letters) >= UPPER_RATIO


def find(pages, start, end):
    """Localiza el comienzo de cada instruccion dentro de un rango.

    @param pages Paginas de un volcado.
    @param start Primera pagina del rango.
    @param end Pagina siguiente a la ultima del rango.
    @returns Lista de `{page, title, summary, mnemonics}`, en orden.
    """
    found = []

    for index in range(start, end):
        for line in pages[index].split("\n")[:HEAD_LINES]:
            line = line.strip()
            match = TITLE.match(line)
            if not match:
                continue
            if FOOTER.search(line):
                # Es el pie repetido de una instruccion que empezo antes.
                break

            title = match.group(1).strip()
            if not looks_like_mnemonic(title):
                break

            # Primero se separa la familia por sus barras y se reconstruyen
            # los sufijos; despues se despliegan las alternativas entre
            # corchetes de cada resultado.
            mnemonics = []
            for name in expand(title):
                mnemonics.extend(expand_brackets(name))

            found.append({
                "page": index,
                "title": title,
                # El titulo comparte linea con la cabecera de la tabla de
                # codificaciones cuando el volcado las junta, y entonces el
                # resumen sale como "Add Instruction Op/ 64-bit Compat/
                # Description". Se corta por el primer hueco ancho: un resumen
                # de verdad no lleva tres espacios seguidos, y una cabecera de
                # tabla no lleva otra cosa. Pasaba en 28 instrucciones.
                "summary": re.split(r"\s{3,}", match.group(2).strip())[0].strip(),
                "mnemonics": mnemonics,
            })
            break

    return found


def page_ranges(entries, end):
    """Asigna a cada instruccion el rango de paginas que ocupa.

    Una instruccion llega hasta donde empieza la siguiente. La ultima llega
    hasta el final del rango de la referencia.

    @param entries Salida de `find`.
    @param end Pagina siguiente a la ultima de la referencia.
    @returns Las mismas entradas con `pages` anadido.
    """
    for i, entry in enumerate(entries):
        entry["pages"] = (
            entry["page"],
            entries[i + 1]["page"] if i + 1 < len(entries) else end,
        )
    return entries


def suspicious(entries):
    """Devuelve los mnemonicos que no parecen validos.

    Un parser de una fuente que no controlamos falla en silencio si no se le
    pide cuentas: la expansion de familias puede producir fragmentos como `P`
    o `S]` sin que nada reviente. Esto los saca a la luz para que se miren, en
    lugar de publicarlos como si fueran instrucciones.

    @param entries Salida de `find`.
    @returns Lista de `(mnemonico, titulo)` sospechosos.
    """
    out = []
    for entry in entries:
        for mnemonic in entry["mnemonics"]:
            too_short = len(mnemonic.strip()) <= 1
            has_junk = any(c in mnemonic for c in "[]().,")and not (
                mnemonic.endswith("]") and "[" in mnemonic
            )
            if too_short or has_junk:
                out.append((mnemonic, entry["title"]))
    return out
