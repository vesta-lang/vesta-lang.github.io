"""Memoria de traduccion de la referencia de instrucciones.

## Por que una memoria y no un fichero traducido

`en.md` se regenera en cada importacion. Una traduccion escrita a mano al lado
se desincroniza con la primera reimportacion y nadie se entera hasta leerla.

La memoria le da la vuelta al problema: guarda **frase inglesa -> frase
castellana**, y `es.md` se GENERA aplicandola sobre `en.md`. Reimportar no
rompe nada, porque la traduccion no vive en el Markdown.

## Por que por frase y no por documento

La mitad del corpus es repeticion. Medido sobre el manual entero: 7422 frases,
de las cuales 3675 son distintas. Las mas frecuentes aparecen cientos de veces:

    218x  #UD If the LOCK prefix is used.
    173x  Same exceptions as in protected mode.
    121x  #PF(fault-code) If a page fault occurs.

Traducir por frase significa que cada una se traduce UNA vez y cubre todas sus
apariciones. Traducir por documento repetiria ese trabajo ochocientas veces.

## Lo que no se traduce

Un traductor automatico destroza el contenido tecnico: convierte `ModRM` en
palabras, traduce nombres de registro y reordena pseudocodigo. Antes de
traducir, esos fragmentos se sustituyen por marcadores y se restauran despues.

Se protegen los bloques de codigo enteros, los tramos entre comillas
invertidas, los vectores de excepcion, los nombres de registro y los
mnemonicos. Es la diferencia entre una traduccion util y una que hay que
revisar entera.
"""

import io
import json
import os
import re

from . import text

# Fragmentos que nunca se traducen. El orden importa: lo mas especifico
# primero, para que un patron general no parta lo que otro reconoce entero.
#
# Lo que va marcado como codigo se aparta ANTES que nada, incluido el
# glosario: dentro de un tramo de codigo, `operand` es texto literal y
# traducirlo lo estropea.
CODE = (re.compile(r"`[^`]+`"),)

PROTECTED = (
    # Vectores de excepcion: `#GP(0)`, `#UD`, `#PF(fault-code)`.
    re.compile(r"#[A-Z]{2,4}(?:\([^)]*\))?"),
    # Referencias a bits y campos: `CR0.EM[bit 2]`, `CPUID.01H:ECX.SSE3[bit 0]`.
    re.compile(r"\b[A-Z][A-Z0-9_]*(?:\.[A-Za-z0-9_]+)+(?:\[[^\]]*\])?"),
    # Operandos y tipos: `r/m64`, `imm8`, `xmm1`, `ymm2/m256`.
    re.compile(r"\b(?:r/m|r|m|imm|rel|moffs|xmm|ymm|zmm|mm|st|bnd|k)\d+"
               r"(?:/[a-z]+\d+)?\b"),
    # Valores hexadecimales del manual: `0FH`, `80000000H`.
    re.compile(r"\b[0-9A-F]+H\b"),
    # Operadores de comparacion. No son prosa y el motor no sabe que hacer con
    # ellos: ante `<>` llego a escribir una palabra en cirilico, que es de las
    # pocas averias que se ven a simple vista.
    re.compile(r"(?:<=|>=|<>|!=|==|<|>)"),
    # Mnemonicos: dos o mas mayusculas seguidas, con digitos opcionales.
    re.compile(r"\b[A-Z][A-Z0-9]{2,}\b"),
)

# Marcador con que se sustituye cada fragmento protegido. Se elige algo que
# ningun traductor toque ni reordene: letras y digitos sin espacios.
#
# **No puede ir en mayusculas.** El patron de mnemonicos reconoce cualquier
# palabra en mayusculas, incluido un marcador ya puesto, y lo envolvia en otro:
# `VEX.256` se guardaba en el 0, y el 0 se guardaba en el 1. Al restaurar
# salia el marcador en vez del texto, la frase se descartaba por incompleta y
# se perdian cinco de cada cuarenta sin que se viera por que.
#
# La forma mixta es inmune a los patrones de arriba: no lleva punto, no es un
# hexadecimal y no es una palabra en mayusculas.
PLACEHOLDER = "Zqx%dqz"

# Se compara sin distinguir mayusculas porque el motor capitaliza lo que abre
# la frase, y ahi el marcador dejaria de reconocerse.
PLACEHOLDER_RE = re.compile(r"Zqx(\d+)qz", re.I)

# El mismo marcador para partir por el. Va aparte y **sin el grupo del indice**
# a proposito: `re.split` devuelve un elemento por cada grupo de captura, asi
# que reutilizar el de arriba daba tres elementos por marcador en lugar de dos
# y desalineaba la alternancia texto/separador. El efecto no se veia: el tramo
# siguiente se quedaba sin traducir y el numero del marcador se traducia en su
# lugar.
PLACEHOLDER_SPLIT = re.compile(r"((?:Zqx\d+qz))", re.I)

# Donde se corta una linea en unidades traducibles. El separador se captura
# para poder devolverlo tal cual: sin el, reconstruir la linea la cambiaria.
#
# Dos cortes, y el segundo hace falta de verdad. El manual encadena vinetas en
# una sola linea sin punto en medio -- `* SMSW r16 ... * SMSW r32 ...` -- y sin
# partirlas quedaban unidades de cincuenta y dos palabras de media. A esa
# longitud el motor no solo traduce peor: se come marcadores, y la frase se
# descartaba entera. Eran las 139 que no habia manera de traducir.
SPLIT = re.compile(r"((?<=[.:;])\s+(?=[A-Z(#])|\s+\*\s+)")


def segments(line):
    """Parte una linea en trozos y separadores, alternados.

    Los indices pares son texto y los impares el separador que iba detras, tal
    como los devuelve `re.split` con un grupo de captura. Reconstruir la linea
    es concatenar la lista.
    """
    return SPLIT.split(line)


class Language:
    """Lo que hay que saber de un idioma para traducirle esta referencia.

    ## Por que existe

    El motor acierta la prosa y falla el vocabulario, que es justo lo que se
    repite. Medido sobre las cuarenta frases mas frecuentes del manual con
    Argos: `operand` salia como "el operado", "opera" y "los operadores", y
    `writemask` como "la mascarilla". Y lo peor no era el error: tres frases
    inglesas casi iguales salian con tres redacciones distintas, que en una
    referencia estorba mas.

    Un glosario lo arregla, pero **el glosario no es del programa, es del
    idioma**: los terminos y sus reglas cambian con cada destino, y cablearlos
    ata la herramienta a uno solo. Por eso viven en un fichero de datos por
    idioma y esta clase solo sabe aplicarlos.

    ## Que declara un paquete de idioma

        {
          "articles": {"el": ["el", "un"], "la": ["la", "una"], ...},
          "definite": ["el", "la", "los", "las"],
          "glossary": [
            {"en": "destination operand", "term": "operando de destino",
             "article": "el"}
          ]
        }

    `articles` da, para cada articulo determinado, su pareja indeterminada.
    Un idioma sin articulos -- o sin genero que concordar -- lo deja vacio y
    todo lo demas sigue funcionando: entonces `article` sobra en las entradas
    y no se generan variantes ni concordancia.

    Las entradas se aplican **en el orden del fichero**, asi que van de la
    expresion mas larga a la mas corta: si `operand` fuera antes que
    `destination operand`, la segunda quedaria traducida a medias.
    """

    def __init__(self, code, data=None):
        data = data or {}
        self.code = code
        self.articles = data.get("articles") or {}
        self.definite = set(data.get("definite") or self.articles.keys())
        self.glossary = data.get("glossary") or []
        self.patterns = self._patterns()
        self.agreement = self._agreement()

        # Contracciones obligatorias del idioma. Hacen falta porque el termino
        # se sustituye despues de traducir: el motor escribio "el" delante de
        # un marcador y no pudo contraerlo con la preposicion anterior, asi que
        # sale "el signo de el resultado".
        self.contractions = tuple(
            (re.compile(r"\b%s\b" % re.escape(a), re.I), b)
            for a, b in (data.get("contractions") or [])
        )

        # Que caracteres son ortografia de este idioma. Lo declara el idioma
        # porque solo el lo sabe: la enye es castellano y el ideograma es
        # chino, y en el fichero del otro los dos serian ruido del motor.
        self.letters = set(data.get("letters") or "")
        self.ranges = tuple(tuple(r) for r in (data.get("script") or []))

    @classmethod
    def load(cls, code, directory):
        """Carga el paquete de un idioma, o uno vacio si no lo hay.

        La ausencia no es un error: sin paquete se traduce igual, solo que sin
        terminologia fijada. Exigirlo impediria empezar un idioma nuevo hasta
        tener el glosario escrito, que es justo al reves de como se hace.
        """
        path = os.path.join(directory, "glossary.%s.json" % code)
        if not os.path.exists(path):
            return cls(code)
        with io.open(path, encoding="utf-8") as f:
            return cls(code, json.load(f))

    def accepts(self, char):
        """Indica si un caracter puede aparecer en una traduccion a este idioma.

        Sirve de deteccion, no de estilo. El motor se desvia del texto de
        formas que se ven a simple vista -- escribio una palabra en cirilico
        ante un `<>` -- y un caracter que no es ni ASCII ni del idioma es la
        senal mas barata de que eso ha pasado.
        """
        code = ord(char)
        if code < 128 or char in self.letters:
            return True
        return any(low <= code <= high for low, high in self.ranges)

    def _patterns(self):
        """Desarrolla el glosario en patrones de busqueda.

        De cada entrada con articulo salen tres: con determinado, con
        indeterminado y a secas. Las dos primeras van delante para que `the
        operand` se lleve su articulo por delante en lugar de dejar un `the`
        suelto delante de la sustitucion.
        """
        out = []
        for item in self.glossary:
            english, term = item["en"], item["term"]
            pair = self.articles.get(item.get("article"))
            if pair:
                out.append((r"the\s+" + english, pair[0] + " " + term))
                out.append((r"an?\s+" + english, pair[1] + " " + term))
            out.append((english, term))
        return tuple(
            (re.compile(r"\b" + p + r"\b", re.I), s) for p, s in out
        )

    def _agreement(self):
        """Prepara la busqueda del articulo que quedo delante de cada termino."""
        if not self.articles:
            return ()

        forms = sorted({f for pair in self.articles.values() for f in pair}
                       | set(self.articles))
        any_article = "|".join(re.escape(f) for f in forms)

        out = []
        for item in self.glossary:
            article = item.get("article")
            if article in self.articles:
                out.append((
                    re.compile(r"\b(%s)\s+(%s)\b"
                               % (any_article, re.escape(item["term"])), re.I),
                    article,
                ))
        return tuple(out)


def protect(text, language):
    """Sustituye por marcadores lo que no debe pasar por el motor.

    Dos cosas se apartan, por motivos distintos. Lo tecnico -- registros,
    mnemonicos, vectores de excepcion -- para que vuelva **igual**, porque
    traducirlo lo destruye. Los terminos del glosario, para que vuelva
    **fijado**, porque el motor los traduce mal y ademas de forma distinta cada
    vez.

    El mecanismo es el mismo: lo que se guarda no es el texto original sino lo
    que hay que escribir al restaurar.

    @param text Frase en ingles.
    @param language Paquete del idioma de destino.
    @returns `(texto con marcadores, lista de sustituciones)`.
    """
    kept = []

    def keep(value):
        kept.append(value)
        return PLACEHOLDER % (len(kept) - 1)

    for pattern in CODE:
        text = pattern.sub(lambda m: keep(m.group(0)), text)

    # El glosario va ANTES de apartar la notacion, porque algunos terminos la
    # llevan dentro: el manual escribe `the carry (CF) flag`, y con `CF` ya
    # convertido en marcador la expresion deja de reconocerse. Salia "la
    # bandera de carga" en lugar de "la bandera de acarreo".
    for pattern, term in language.patterns:
        text = pattern.sub(lambda m, t=term: keep(t), text)

    for pattern in PROTECTED:
        text = pattern.sub(lambda m: keep(m.group(0)), text)

    return text, kept


def restore(text, kept):
    """Devuelve los fragmentos protegidos a su sitio.

    Un traductor puede alterar el marcador -- separarlo, cambiarle la caja --
    y entonces el fragmento se perderia. Lo que no se pueda restaurar se
    devuelve como `None` para que la frase se descarte en lugar de publicarse
    incompleta.
    """
    used = set()

    def replace(match):
        index = int(match.group(1))
        if index >= len(kept):
            return match.group(0)
        used.add(index)
        return kept[index]

    out = PLACEHOLDER_RE.sub(replace, text)
    if len(used) != len(kept):
        return None
    return out


def polish(text, source, language):
    """Corrige lo que el motor no puede saber de una expresion apartada.

    Dos arreglos, los dos por la misma causa: el termino se sustituye despues
    de traducir, asi que el motor decidio lo de alrededor sin haberlo visto.

    - **Concordancia.** Cuando el articulo no viaja pegado al termino -- `a
      128-bit memory location` lleva el modificador en medio -- se queda el que
      pedia el ingles, y en castellano salia "un ubicacion de memoria". El
      idioma declara a que articulo pertenece cada termino y aqui se impone.
    - **Mayuscula inicial.** Si el termino abria la frase, la sustitucion entra
      en minuscula y la frase empieza mal. Esto vale para cualquier idioma que
      escriba con mayuscula inicial, que es por lo que se decide mirando el
      original en vez de con una regla propia.

    @param text Frase ya restaurada.
    @param source Frase inglesa de la que salio.
    @param language Paquete del idioma de destino.
    @returns La frase corregida.
    """
    for pattern, article in language.agreement:
        forms = language.articles[article]

        def fix(match, forms=forms):
            found = match.group(1).lower()
            return "%s %s" % (forms[0] if found in language.definite else forms[1],
                              match.group(2))

        text = pattern.sub(fix, text)

    for pattern, joined in language.contractions:
        text = pattern.sub(joined, text)

    if source[:1].isupper() and text[:1].islower():
        text = text[0].upper() + text[1:]

    return text


# Palabras funcionales inglesas que ningun idioma de destino escribe. Si
# sobreviven a la traduccion es que la frase no se tradujo.
#
# Se apartan a proposito las que coinciden con otro idioma -- `no`, `a`, `en`,
# `son` -- para no marcar como fallida una traduccion correcta. Y se exigen dos
# distintas: una sola puede venir dentro de un fragmento protegido.
LEFTOVER_ENGLISH = re.compile(
    r"\b(?:the|of|to|and|is|are|with|from|that|this|which|when|into|by|be|"
    r"as|if|then|must|can|may|will|each|both|same|first|second|copies|"
    r"stores|store|using|used|following|there|where|while|would|should)\b",
    re.I,
)


def looks_untranslated(value):
    """Indica si una traduccion sigue siendo, en realidad, el original.

    Pasa cuando el glosario aparta tanto de la frase que al motor le queda muy
    poco que traducir: devuelve el armazon ingles intacto y, como los terminos
    si se sustituyen, el resultado no coincide con el original y ninguna
    comparacion lo detecta. Sale texto mezclado -- "Copies the second operando
    de origen to the operando de destino" -- que es peor que dejarlo en ingles,
    porque parece traducido.
    """
    found = {m.group(0).lower() for m in LEFTOVER_ENGLISH.finditer(value)}
    return len(found) >= 2


def finalize(value, source, language):
    """Deja una traduccion lista para guardar, o la rechaza.

    El motor emite de su cosecha caracteres que el proyecto no admite: cambia
    `<=` por el simbolo de menor o igual, y en alguna frase se inventa una raiz
    cuadrada o una vocal con macron que no estaban en el original. Lo previsto
    se convierte con la misma tabla que usa el importador; lo demas significa
    que la traduccion se ha desviado del texto, y entonces **no se guarda**:
    vuelve a la escalera de reintentos, que para eso esta.

    @param value Traduccion ya restaurada.
    @param source Frase inglesa de la que salio.
    @param language Paquete del idioma de destino.
    @returns La traduccion, o `None` si no es publicable.
    """
    value = text.normalize(value).strip()
    if not value:
        return None
    if any(not language.accepts(c) for c in value):
        return None
    # El original en ingles pasa: es la fuente, y lo que se comprueba aqui es
    # que la traduccion no se haya quedado a medias.
    if language.code != "en" and looks_untranslated(value):
        return None
    return polish(value, source, language)


def prose_runs(masked):
    """Parte un texto enmascarado en tramos, separando los marcadores.

    Devuelve la lista alternada de `re.split` con captura: los indices impares
    son los marcadores y los pares el texto de alrededor.

    Sirve para el ultimo recurso de la traduccion. Si el motor se come un
    marcador por muchas vueltas que se le den, se le deja de ensenar: se le
    manda solo la prosa de entre marcador y marcador, y estos se vuelven a
    intercalar despues. Pierde el contexto de la frase entera y se nota, pero
    **no puede perder un marcador que nunca ha visto**, y publicar una frase
    torpe es mejor que dejarla en ingles en mitad de un parrafo traducido.
    """
    return PLACEHOLDER_SPLIT.split(masked)


def sentences(paragraph):
    """Parte un parrafo en las unidades que se traducen."""
    return [part.strip() for index, part in enumerate(segments(paragraph))
            if index % 2 == 0 and part.strip()]


def is_translatable(line):
    """Indica si una linea de Markdown lleva prosa que traducir.

    Quedan fuera las tablas, los encabezados con numero de seccion del manual,
    el front matter y todo lo que sea estructura. Traducir una fila de tabla
    de opcodes no aporta nada y estropea el dato.
    """
    text = line.strip()
    if not text or text.startswith(("|", "```", "---", ">")):
        return False
    if text.startswith("#"):
        return False
    # Una linea sin ninguna palabra de cuatro letras seguidas es notacion, no
    # prosa: `EAX[31:0] MAX_LEAF`.
    return bool(re.search(r"[A-Za-z]{4,}\s+[A-Za-z]{3,}", text))


# Palabra normal: tres letras o mas, y no toda en mayusculas. Lo que va todo en
# mayusculas es un nombre del manual -- `OSXSAVE`, `MAX_LEAF` -- y no se
# traduce.
COMMON_WORD = re.compile(r"\b(?![A-Z]+\b)[A-Za-z]{3,}\b")


def is_cell_prose(cell):
    """Indica si una celda de tabla lleva texto que traducir.

    Se mide distinto que una linea suelta. `is_translatable` exige dos
    palabras seguidas, y en una tabla eso deja fuera justo los encabezados de
    columna: `Leaf`, `Register`, `Sub-Leaf`. En `CPUID`, que es casi toda
    tablas, se quedaban en ingles encabezando columnas cuyo contenido si
    estaba traducido.

    Basta una palabra normal. Los datos no la tienen: `01H`, `ECX[27]` y
    `OSXSAVE` no pasan, que es lo que hay que conseguir.
    """
    text = cell.strip()
    if not text or text.startswith(("```", "---")):
        return False
    return bool(COMMON_WORD.search(text))


class Memory:
    """Memoria de traduccion, indexada por frase inglesa normalizada.

    Son **dos** ficheros y la diferencia entre ellos es la que importa:

    - La memoria es salida del motor. Es desechable y se rehace entera cuando
      cambia el glosario, que es una operacion de un minuto.
    - Las correcciones son trabajo humano. No las toca nadie y mandan sobre la
      memoria.

    Sin esa separacion no hay forma de corregir a mano: el primer `--refresh`
    que hiciera falta para el glosario se llevaria por delante las
    correcciones, y una traduccion revisada no se puede rehacer con un
    comando. Aparte de proteger, tenerlas en su propio fichero las hace
    visibles: lo revisado por una persona se lee de un vistazo y se compara en
    un diff, en lugar de estar disuelto entre once mil frases de maquina.
    """

    def __init__(self, path, fixes=None):
        self.path = path
        self.entries = {}
        self.fixes = {}

        if os.path.exists(path):
            with io.open(path, encoding="utf-8") as f:
                self.entries = json.load(f)

        if fixes and os.path.exists(fixes):
            with io.open(fixes, encoding="utf-8") as f:
                self.fixes = json.load(f)

    @staticmethod
    def key(sentence):
        """Normaliza una frase para usarla como clave.

        Se colapsan los espacios porque el volcado del PDF los reparte de
        cualquier manera: la misma frase llega con uno o con tres segun donde
        cayera el salto de linea.
        """
        return " ".join(sentence.split())

    def get(self, sentence):
        """Devuelve la traduccion, con la correccion humana por delante."""
        key = self.key(sentence)
        return self.fixes.get(key) or self.entries.get(key)

    def put(self, sentence, translation):
        self.entries[self.key(sentence)] = translation

    def save(self):
        directory = os.path.dirname(self.path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        with io.open(self.path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(self.entries, f, ensure_ascii=False, indent=1,
                      sort_keys=True)
            f.write("\n")


# Encabezado de seccion, con la numeracion del manual si la trae. El numero no
# se traduce: `21.1.3` es la misma referencia en todos los idiomas.
HEADING = re.compile(r"^(#{1,6}\s+(?:\d+(?:\.\d+)*\.?\s+)?)(.*)$")

# Marcador de lista al principio de la linea, con su sangria.
BULLET = re.compile(r"^(\s*[*+-]\s+)(.*)$")

# Separador de celdas. Una barra escapada es contenido, no columna: `[E\|R]BX`
# es un operando.
CELL = re.compile(r"((?<!\\)\|)")


def _prose_units(chunk):
    """Parte un tramo de prosa en unidades traducibles y separadores.

    Es el mismo corte en todas partes -- linea suelta, titulo de seccion o
    celda de tabla -- para que la unidad que se traduce y la que se busca
    despues sean siempre la misma. Cuando no lo eran, la cobertura contaba
    unas frases y el documento generado buscaba otras.
    """
    return [(part, index % 2 == 0 and bool(part.strip()))
            for index, part in enumerate(segments(chunk))]


def _line_units(line):
    """Descompone una linea en piezas, marcando cuales se traducen.

    @param line Linea del documento, sin el salto.
    @returns Lista de `(texto, se_traduce)`.
    """
    # Encabezado. El manual trae los suyos -- `21.1.4 CPUID Domains` -- y son
    # prosa como cualquier otra: dejarlos en ingles partia la pagina en dos
    # idiomas justo en lo que mas se ve.
    heading = HEADING.match(line)
    if heading:
        prefix, title = heading.groups()
        return [(prefix, False)] + _prose_units(title)

    # Fila de tabla. La ultima columna suele ser una descripcion entera, y en
    # `CPUID` las tablas son la mayor parte del documento: sin esto quedaban
    # novecientas lineas en ingles. Se traduce celda a celda, y solo las que
    # son prosa: `ECX[27]` y `OSXSAVE` son datos, no texto.
    if line.lstrip().startswith("|"):
        out = []
        for part in CELL.split(line):
            if part.startswith("|") or not is_cell_prose(part):
                out.append((part, False))
            else:
                out.extend(_prose_units(part))
        return out

    if not is_translatable(line):
        return [(line, False)]

    # El marcador de lista se aparta del texto. Es sintaxis de Markdown, no
    # prosa, y el motor lo trata como si lo fuera: convirtio el `*` de una
    # vinneta en `#`, que Markdown lee como titulo de primer nivel.
    bullet = BULLET.match(line)
    if bullet:
        return [(bullet.group(1), False)] + _prose_units(bullet.group(2))

    return _prose_units(line)


def units(text):
    """Descompone un documento entero en piezas traducibles y fijas.

    Es la unica descripcion de que se traduce y que no. `extract` y `apply`
    salen las dos de aqui, y por eso no pueden discrepar: cuando lo hacian, la
    cobertura contaba unas frases y el documento generado usaba otras.

    @param text Documento en el idioma de origen.
    @returns Lista de `(texto, se_traduce)`, que concatenada da el original.
    """
    out = []
    inside_fence = False

    for line in text.split("\n"):
        # El resumen del front matter se traduce como campo, no como frase
        # suelta: lleva su etiqueta delante y hay que conservarla.
        if line.startswith("summary:"):
            out.append(("summary: ", False))
            out.append((line[len("summary:"):].strip(), True))
        elif line.startswith("```"):
            inside_fence = not inside_fence
            out.append((line, False))
        elif inside_fence:
            out.append((line, False))
        else:
            out.extend(_line_units(line))
        out.append(("\n", False))

    # El ultimo salto lo anade el bucle y no estaba en el original.
    return out[:-1]


def extract(text):
    """Devuelve las frases traducibles de un documento, en orden."""
    return [piece.strip() for piece, translatable in units(text)
            if translatable and piece.strip()]


def apply(text, memory):
    """Genera la version traducida de un documento.

    Lo que no este en la memoria se deja en el idioma de origen. Es
    deliberado: una traduccion que publica lo que tiene es util, y una que
    espera a estar completa no se publica nunca.

    @returns `(texto, traducidas, totales)`.
    """
    out = []
    done = total = 0

    for piece, translatable in units(text):
        if not translatable:
            out.append(piece)
            continue

        total += 1
        translated = memory.get(piece.strip())
        if translated:
            done += 1
            # La sangria de la pieza no es traduccion: se devuelve tal cual,
            # que en una celda de tabla es lo que la mantiene alineada.
            lead = piece[:len(piece) - len(piece.lstrip())]
            tail = piece[len(piece.rstrip()):]
            out.append(lead + translated + tail)
        else:
            out.append(piece)

    return "".join(out), done, total
