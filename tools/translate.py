#!/usr/bin/env python3
"""Traduce la referencia de instrucciones a partir de una memoria de frases.

La traduccion NO se escribe sobre el Markdown. Se guarda en una memoria de
frases y `es.md` se genera aplicandola sobre `en.md`, de modo que reimportar el
manual no destruye nada.

    tools/translate.py extract           saca las frases que faltan por traducir
    tools/translate.py translate         las traduce con el motor elegido
    tools/translate.py apply             genera los `<idioma>.md`
    tools/translate.py coverage          informa de cuanto esta cubierto

POR QUE COMPENSA
----------------
La mitad del corpus es repeticion: 7422 frases, 3675 distintas. Traducir por
frase significa que `#UD If the LOCK prefix is used.` se traduce una vez y
cubre sus 218 apariciones.

MOTORES
-------
El motor es intercambiable y ninguno es obligatorio. Se eligen por coste cero:

    argos       Argos Translate. Offline, sin clave, sin limite de peticiones.
                Es el recomendado: reproducible y no depende de que un servicio
                siga en pie.  pip install argostranslate
    libre       Una instancia de LibreTranslate, propia o publica.
                pip install requests
    manual      No traduce: solo vuelca lo que falta a un fichero para
                traducirlo por otros medios y volver a cargarlo.

Sin ninguno instalado, `extract`, `apply` y `coverage` siguen funcionando: lo
unico que no se puede es traducir automaticamente.
"""

import argparse
import collections
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sdm import engine  # noqa: E402
from sdm import translate as tm  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "site", "data", "isa", "x86")


ISA_DIR = os.path.join(ROOT, "site", "data", "isa")


def memory_path(lang):
    """Devuelve donde vive la memoria de maquina de un idioma."""
    return os.path.join(ISA_DIR, "x86.tm.%s.json" % lang)


def fixes_path(lang):
    """Devuelve donde viven las correcciones a mano de un idioma."""
    return os.path.join(ISA_DIR, "x86.fix.%s.json" % lang)


def open_memory(lang):
    """Abre la memoria de un idioma con sus correcciones humanas encima."""
    return tm.Memory(memory_path(lang), fixes_path(lang))


def documents():
    """Recorre los documentos en el idioma de origen."""
    for name in sorted(os.listdir(DATA_DIR)):
        path = os.path.join(DATA_DIR, name, "en.md")
        if os.path.isfile(path):
            with io.open(path, encoding="utf-8") as f:
                yield name, f.read()


def data_documents():
    """Recorre los `data.json` de la referencia."""
    for name in sorted(os.listdir(DATA_DIR)):
        path = os.path.join(DATA_DIR, name, "data.json")
        if os.path.isfile(path):
            with io.open(path, encoding="utf-8") as f:
                yield name, json.load(f)


def data_strings(data):
    """Devuelve la prosa que vive en los datos y no en el documento.

    No todo el texto de una instruccion esta en su Markdown. La condicion de
    cada excepcion y la descripcion de cada forma son campos de `data.json`,
    porque son consultables y el sitio los pinta el mismo. Al quedar fuera del
    documento tampoco entraban al corpus: la pagina castellana mostraba las
    excepciones en ingles con el resto traducido alrededor.

    Se devuelven **enteras**, sin trocear en frases. La otra mitad de la
    busqueda la hace el renderizador, que esta en JavaScript, y dos troceos
    escritos en dos lenguajes distintos son dos troceos que acabaran
    discrepando. Una cadena, una consulta.
    """
    out = []
    for exception in data.get("exceptions", []):
        if exception.get("when"):
            out.append(exception["when"])
    for form in data.get("encodings", []):
        if form.get("note"):
            out.append(form["note"])
    return out


def collect_units():
    """Devuelve las unidades traducibles del corpus con cuantas veces salen.

    El peso importa: una unidad que aparece en cuarenta instrucciones no
    cuesta lo mismo que una que sale una vez, y ordenar por el numero de
    apariciones es lo que hace accionable cualquier informe.
    """
    counts = collections.Counter()
    for _, text in documents():
        for unit in tm.extract(text):
            counts[tm.Memory.key(unit)] += 1
    for _, data in data_documents():
        for unit in data_strings(data):
            counts[tm.Memory.key(unit)] += 1
    return counts


def collect_missing(memory):
    """Devuelve las frases sin traducir, de la mas repetida a la menos.

    El orden importa mas de lo que parece: traducir primero las veinte mas
    frecuentes cubre una quinta parte del volumen. Empezar por orden
    alfabetico haria el mismo trabajo con una fraccion del efecto.
    """
    counts = {}
    for key, count in collect_units().items():
        if not memory.get(key):
            counts[key] = count
    return sorted(counts.items(), key=lambda item: -item[1])


class LibreEngine:
    """Adaptador de LibreTranslate a la interfaz por lotes.

    El servicio atiende una frase por peticion, asi que aqui el lote es una
    formalidad: se recorre. Existe para que el resto del programa no tenga que
    saber con que motor esta hablando.
    """

    device = "http"
    compute_type = "libretranslate"

    def __init__(self, target):
        import requests

        self.requests = requests
        self.target = target
        self.url = os.environ.get("LIBRETRANSLATE_URL", "http://localhost:5000")

    def translate_all(self, texts, progress=None):
        out = []
        for text in texts:
            response = self.requests.post(
                self.url.rstrip("/") + "/translate",
                json={"q": text, "source": "en", "target": self.target,
                      "format": "text"},
                timeout=60,
            )
            response.raise_for_status()
            out.append(response.json()["translatedText"])
            if progress and len(out) % 50 == 0:
                progress(len(out), len(texts))
        return out


def load_engine(name, target, device=None):
    """Devuelve un motor con `translate_all`, o `None` si no se puede.

    @param name Nombre del motor: `argos`, `libre` o `manual`.
    @param target Codigo del idioma de destino.
    @param device Dispositivo forzado, o `None` para decidirlo solo.
    """
    if name == "manual":
        return None

    if name == "argos":
        try:
            import argostranslate.package
            import argostranslate.translate
        except ImportError:
            print("falta argostranslate.  pip install argostranslate",
                  file=sys.stderr)
            return None

        # El paquete de idioma se descarga una vez y queda en el disco.
        if not any(p.from_code == "en" and p.to_code == target
                   for p in argostranslate.package.get_installed_packages()):
            argostranslate.package.update_package_index()
            match = [p for p in argostranslate.package.get_available_packages()
                     if p.from_code == "en" and p.to_code == target]
            if not match:
                print("no hay modelo de en -> %s" % target, file=sys.stderr)
                return None
            argostranslate.package.install_from_path(match[0].download())

        return engine.Engine("en", target, device=device)

    if name == "libre":
        try:
            return LibreEngine(target)
        except ImportError:
            print("falta requests.  pip install requests", file=sys.stderr)
            return None

    print("motor desconocido: %s" % name, file=sys.stderr)
    return None


def cmd_extract(args):
    memory = open_memory(args.lang)
    missing = collect_missing(memory)

    total = sum(count for _, count in missing)
    print("frases sin traducir: %d distintas, %d apariciones" % (len(missing), total))

    if args.out:
        with io.open(args.out, "w", encoding="utf-8", newline="\n") as f:
            json.dump([{"count": c, "en": s, "es": ""} for s, c in missing],
                      f, ensure_ascii=False, indent=1)
            f.write("\n")
        print("volcadas en %s" % args.out)
    else:
        for sentence, count in missing[:20]:
            print("  %4dx  %s" % (count, sentence[:88]))

    return 0


def run_pass(motor, sentences, language, protector):
    """Traduce una tanda entera y devuelve lo que sobrevivio a la restauracion.

    Las frases se enmascaran, y **las mascaras iguales se traducen una sola
    vez**. Dos frases que solo se diferencian en un numero o un registro dan
    el mismo texto enmascarado, y devolver cada traduccion a su frase con la
    lista de fragmentos de esa frase reconstruye las dos correctamente.

    @param motor Motor con `translate_all`.
    @param sentences Frases inglesas.
    @param language Paquete del idioma de destino.
    @param protector Funcion que enmascara una frase.
    @returns `(traducciones por frase, frases que se perdieron)`.
    """
    prepared = {}
    order = []
    order_seen = set()
    for sentence in sentences:
        text, kept = protector(sentence)
        prepared[sentence] = (text, kept)
        if text not in order_seen:
            order_seen.add(text)
            order.append(text)

    def progress(done, total):
        print("  %d/%d" % (done, total), flush=True)

    results = motor.translate_all(order, progress=progress)
    translated = dict(zip(order, results))

    out, lost = {}, []
    for sentence in sentences:
        text, kept = prepared[sentence]
        value = tm.restore(translated[text], kept)
        value = tm.finalize(value, sentence, language) if value else None
        if value:
            out[sentence] = value
        else:
            # El motor se comio un marcador, o se desvio del texto. La frase
            # quedaria incompleta y no se publica a medias: se devuelve para
            # intentarlo de otro modo.
            lost.append(sentence)

    return out, lost


def pass_variants(motor, sentences, language, protector, variants=4):
    """Reintenta pidiendo varias traducciones y quedandose con la que sirve.

    El motor devuelve sus mejores hipotesis ordenadas. Que la primera se coma
    un marcador no significa que la segunda tambien: son caminos distintos del
    mismo modelo. Se toma la mejor de las que restauran completa.
    """
    prepared = [protector(s) for s in sentences]
    results = motor.translate_all([text for text, _ in prepared],
                                  variants=variants)

    out, lost = {}, []
    for sentence, (_, kept), options in zip(sentences, prepared, results):
        for option in options:
            value = tm.restore(option, kept)
            value = tm.finalize(value, sentence, language) if value else None
            if value:
                out[sentence] = value
                break
        else:
            lost.append(sentence)

    return out, lost


def pass_piecewise(motor, sentences, language, protector):
    """Traduce solo la prosa de entre marcadores y los vuelve a intercalar.

    Es el ultimo recurso y **no puede fallar por marcador perdido**, porque el
    motor no llega a verlos. A cambio traduce cada tramo sin el contexto de la
    frase, asi que se usa solo con lo que no salio de ninguna otra manera.
    """
    prepared = [protector(s) for s in sentences]

    # Todos los tramos de todas las frases van en un solo lote: son cortos y
    # muchos, que es justo lo que el lote aprovecha.
    layout, batch = [], []
    for text, _ in prepared:
        parts = tm.prose_runs(text)
        indexes = []
        for index, part in enumerate(parts):
            if index % 2 == 0 and re.search(r"[A-Za-z]{2,}", part):
                indexes.append((index, len(batch)))
                batch.append(part)
        layout.append((parts, indexes))

    results = motor.translate_all(batch) if batch else []

    out, lost = {}, []
    for sentence, (_, kept), (parts, indexes) in zip(sentences, prepared, layout):
        rebuilt = list(parts)
        for index, position in indexes:
            rebuilt[index] = results[position]
        value = tm.restore("".join(rebuilt), kept)
        value = tm.finalize(value, sentence, language) if value else None
        if value:
            out[sentence] = value
        else:
            lost.append(sentence)

    return out, lost


def cmd_translate(args):
    memory = open_memory(args.lang)
    motor = load_engine(args.engine, args.lang, device=args.device)
    if motor is None:
        return 1

    language = tm.Language.load(args.lang, ISA_DIR)
    if not language.glossary:
        print("aviso: no hay glosario para '%s'; se traduce sin terminologia "
              "fijada" % args.lang, file=sys.stderr)

    # La memoria se revisa antes de usarla. Las reglas de lo publicable pueden
    # endurecerse -- pasa cada vez que se descubre algo que el motor hace y no
    # deberia -- y lo que se guardo con las reglas de ayer no vale hoy. Lo que
    # no pasa se olvida, y vuelve a la lista de lo que falta.
    # Ampliar el glosario no cambia por si solo lo ya traducido: la memoria
    # guarda el resultado, no la receta. `--refresh` la vacia para que se
    # rehaga con la terminologia nueva, y se pide a mano porque **descarta
    # tambien cualquier correccion escrita a mano**. Con el corpus entero en
    # segundos, rehacerlo sale mas barato que decidir que entrada sobrevive.
    if args.refresh:
        print("se descartan %d traducciones para rehacerlas"
              % len(memory.entries))
        memory.entries.clear()
        memory.save()

    # Lo que se puede arreglar se arregla en el sitio -- el motor escribe el
    # simbolo de menor o igual donde el original pone `<=`, y para eso hay
    # tabla -- y solo se olvida lo que no tiene arreglo.
    stale, fixed = [], 0
    for key, value in list(memory.entries.items()):
        corrected = tm.finalize(value, key, language)
        if not corrected:
            stale.append(key)
        elif corrected != value:
            memory.entries[key] = corrected
            fixed += 1

    for key in stale:
        del memory.entries[key]

    if stale or fixed:
        print("memoria: %d traducciones corregidas, %d descartadas"
              % (fixed, len(stale)))
        memory.save()

    missing = [sentence for sentence, _ in collect_missing(memory)]
    if args.limit:
        missing = missing[: args.limit]
    if not missing:
        print("no falta nada por traducir")
        return 0

    print("motor: %s / %s" % (motor.device, motor.compute_type))
    print("frases: %d" % len(missing))

    # Primera pasada, con todo apartado: lo tecnico para que vuelva igual y la
    # terminologia para que vuelva fijada.
    done, lost = run_pass(motor, missing, language,
                          lambda s: tm.protect(s, language))
    for sentence, value in done.items():
        memory.put(sentence, value)
    memory.save()

    # Segunda pasada para lo que se perdio. Se reintenta con el glosario
    # desactivado: cuantos menos marcadores lleve la frase, menos ocasiones
    # tiene el motor de comerse uno. Sale peor terminologia, pero sale, y
    # dejarla en ingles seria peor.
    # Lo que se perdio pasa por una escalera de reintentos, de menos a mas
    # agresiva. Cada peldano recupera lo que el anterior no pudo, y el ultimo
    # no puede fallar por esta causa. Es lo que hace que el resultado sea
    # completo y no "casi": una frase en ingles en mitad de un parrafo
    # traducido se lee como un error, no como una traduccion parcial.
    empty = tm.Language(args.lang)
    ladder = (
        ("sin glosario", lambda ls: run_pass(
            motor, ls, language, lambda s: tm.protect(s, empty))),
        ("con hipotesis alternativas", lambda ls: pass_variants(
            motor, ls, language, lambda s: tm.protect(s, language))),
        ("por tramos", lambda ls: pass_piecewise(
            motor, ls, language, lambda s: tm.protect(s, language))),
    )

    recovered = 0
    for label, attempt in ladder:
        if not lost:
            break
        print("recuperando %d, %s" % (len(lost), label))
        found, lost = attempt(lost)
        for sentence, value in found.items():
            memory.put(sentence, value)
        memory.save()
        recovered += len(found)

    print("traducidas %d (%d recuperadas), sin traducir %d"
          % (len(done) + recovered, recovered, len(lost)))

    if lost:
        # Se nombran para que se puedan traducir a mano: una lista de frases
        # concretas es accionable, un numero no.
        print("quedan por traducir a mano:", file=sys.stderr)
        for sentence in lost[:20]:
            print("   %s" % sentence[:88], file=sys.stderr)

    return 0


def cmd_apply(args):
    memory = open_memory(args.lang)
    if not memory.entries:
        print("la memoria esta vacia: no hay nada que aplicar", file=sys.stderr)
        return 1

    written = done = total = 0
    for name, text in documents():
        translated, covered, count = tm.apply(text, memory)
        done += covered
        total += count
        if covered == 0:
            # Sin una sola frase traducida, el fichero seria una copia del
            # ingles con otro nombre: eso no es una traduccion, es ruido.
            continue
        path = os.path.join(DATA_DIR, name, "%s.md" % args.lang)
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(translated)
        written += 1

    print("documentos escritos: %d" % written)
    print("cobertura: %d de %d frases (%.1f%%)"
          % (done, total, 100.0 * done / total if total else 0.0))
    return 0


# Tramo en alfabeto latino dentro de una traduccion. Tres letras o mas para no
# senalar una inicial suelta.
LATIN_RUN = re.compile(r"[A-Za-z][A-Za-z'\-]{2,}(?:\s+[A-Za-z][A-Za-z'\-]{2,})*")


def cmd_residue(args):
    """Busca texto sin traducir sondeando con un idioma de otro alfabeto.

    ## Por que hace falta

    Medir lo que falta comparando con el ingles solo encuentra lo que vuelve
    **identico**. Una unidad traducida a medias -- `el Native Model ID
    Enumeration Leaf` -- no es identica al ingles y se cuela: la metrica dice
    que esta traducida y en la pagina se lee media frase en cada idioma. En
    dos idiomas del mismo alfabeto no hay manera de distinguirlas.

    ## Como lo resuelve

    Se traduce el corpus a un idioma de **otro alfabeto**. Ahi lo que el motor
    no tradujo se ve por la escritura, no por comparacion: cualquier tramo en
    letras latinas dentro de una frase en chino es texto que el motor dejo
    intacto. Es la misma informacion, pero visible.

    Lo que encuentra el sondeo es un **candidato**, no un veredicto: un motor
    puede copiar un nombre propio que otro si traduce. Por eso se confirma
    contra la traduccion real -- el candidato solo se reporta si aparece
    tambien tal cual en el castellano publicado -- y lo que queda es texto
    ingles que hoy esta en la pagina.
    """
    memory = open_memory(args.lang)
    if not memory.entries:
        print("no hay traduccion que auditar", file=sys.stderr)
        return 1

    units = collect_units()
    keys = sorted(units)
    if args.limit:
        keys = keys[: args.limit]

    # Si el idioma de la sonda ya esta traducido, la sonda sale gratis: se lee
    # su memoria en lugar de volver a pasar el corpus por el motor.
    probe_memory = open_memory(args.via)
    ready = [key for key in keys if probe_memory.get(key)]

    if len(ready) == len(keys):
        print("sonda: %s, desde su memoria" % args.via)
        probed = [probe_memory.get(key) for key in keys]
    else:
        motor = load_engine("argos", args.via, device=args.device)
        if motor is None:
            return 1
        print("sonda: en -> %s, %s / %s"
              % (args.via, motor.device, motor.compute_type))
        # Se enmascara sin glosario: aqui se mide que hace el motor con el
        # texto, no con la terminologia de un idioma concreto.
        plain = tm.Language(args.via)
        masked = [tm.protect(key, plain)[0] for key in keys]
        probed = motor.translate_all(masked, progress=lambda d, t: None)

    print("unidades: %d" % len(keys))

    residues = collections.Counter()
    examples = {}
    untouched = 0
    plain = tm.Language(args.via)

    for key, probe in zip(keys, probed):
        # Los marcadores son latinos por construccion y no cuentan.
        stripped = tm.PLACEHOLDER_RE.sub(" ", probe)
        found = LATIN_RUN.findall(stripped)
        if not found:
            continue

        # La notacion que se aparto a proposito -- `XMM`, `VEX`, `CPUID` -- es
        # latina y sigue siendolo en la traduccion, que es justo lo que se
        # queria. Si no se excluye, encabeza el informe y entierra lo que si
        # es un fallo: los primeros veinte puestos eran nombres de registro.
        protected = tm.protect(key, plain)[1]
        found = [run for run in found
                 if not any(run in fragment for fragment in protected)]
        if not found:
            continue

        spanish = memory.get(key)
        if not spanish:
            continue
        if tm.Memory.key(spanish) == tm.Memory.key(key):
            untouched += units[key]

        for run in found:
            # Confirmacion: solo cuenta si el castellano publicado tambien lo
            # tiene tal cual. Si el sondeo lo dejo pero el castellano no, el
            # problema era del idioma de la sonda, no del texto.
            if re.search(r"\b%s\b" % re.escape(run), spanish):
                residues[run] += units[key]
                examples.setdefault(run, key)

    print()
    print("unidades enteras sin traducir: %d apariciones" % untouched)
    print("fragmentos ingleses confirmados en el castellano publicado: %d"
          % len(residues))
    print()
    for run, weight in residues.most_common(args.top):
        print("  %4dx  %-38s  %s" % (weight, run[:38], examples[run][:44]))

    return 0


def cmd_coverage(args):
    memory = open_memory(args.lang)
    done = total = 0
    complete = partial = empty = 0

    for _, text in documents():
        _, covered, count = tm.apply(text, memory)
        done += covered
        total += count
        if count and covered == count:
            complete += 1
        elif covered:
            partial += 1
        else:
            empty += 1

    print("memoria: %d frases" % len(memory.entries))
    print("cobertura: %d de %d (%.1f%%)"
          % (done, total, 100.0 * done / total if total else 0.0))
    print("documentos: %d completos, %d a medias, %d sin empezar"
          % (complete, partial, empty))
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lang", default="es", help="idioma de destino")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("extract", help="listar lo que falta por traducir")
    p.add_argument("--out", help="volcar a un fichero JSON")
    p.set_defaults(func=cmd_extract)

    p = sub.add_parser("translate", help="traducir con un motor")
    p.add_argument("--engine", default="argos", choices=("argos", "libre", "manual"))
    p.add_argument("--device", choices=("cuda", "cpu"),
                   help="forzar dispositivo; por omision se usa la GPU si la hay")
    p.add_argument("--limit", type=int, default=0, help="solo las N mas repetidas")
    p.add_argument("--refresh", action="store_true",
                   help="vaciar la memoria y rehacerla con el glosario actual")
    p.set_defaults(func=cmd_translate)

    p = sub.add_parser("apply", help="generar los documentos traducidos")
    p.set_defaults(func=cmd_apply)

    p = sub.add_parser("residue", help="buscar texto sin traducir con una sonda")
    p.add_argument("--via", default="zh",
                   help="idioma de la sonda; debe ser de otro alfabeto")
    p.add_argument("--device", choices=("cuda", "cpu"))
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--top", type=int, default=25, help="cuantos fragmentos listar")
    p.set_defaults(func=cmd_residue)

    p = sub.add_parser("coverage", help="informar de la cobertura")
    p.set_defaults(func=cmd_coverage)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
