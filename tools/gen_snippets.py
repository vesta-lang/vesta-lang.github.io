#!/usr/bin/env python3
"""Genera el indice semantico de los fragmentos de codigo Vesta del sitio.

Este script se ejecuta EN LOCAL, nunca en CI ni en el servidor. Toma cada
fragmento `.vx` de `site/snippets/`, lo pasa por el servidor LSP de Vesta y
escribe un `.tokens.json` al lado. El build del sitio consume ese JSON; ni
GitHub Actions ni GitHub Pages necesitan el compilador.

El reparto de responsabilidades es deliberado:

  - El LSP decide QUE es cada token. Usa el lexer real del lenguaje, asi que el
    resaltado del sitio no puede contradecir a lo que el compilador acepta.
  - Este script solo transporta esa informacion a un formato estable.
  - El build decide COMO se pinta. Aqui no hay colores ni HTML.

Ademas de los tokens se capturan el hover y la definicion de cada simbolo, que
es lo que permite que en la web un tipo o una funcion muestren su descripcion y
enlacen al fichero de la stdlib donde estan definidos.

Uso:

    python tools/gen_snippets.py              # regenera todos los fragmentos
    python tools/gen_snippets.py hello        # solo site/snippets/hello.vx
    python tools/gen_snippets.py --check      # verifica que estan al dia

El modo `--check` es el que se ejecuta antes de publicar: compara el hash del
`.vx` con el guardado en el JSON y falla si alguien edito un fragmento sin
regenerar su indice. Es preferible romper el build a publicar un fragmento
cuyo resaltado no corresponde a su codigo.
"""

from __future__ import annotations

import hashlib
import json
import os
import sys

# El cliente LSP vive en el repositorio del compilador. Se localiza por
# variable de entorno para no fijar una ruta de disco en el codigo: cada
# maquina tiene el proyecto donde le conviene.
VM_ROOT = os.environ.get("VESTA_VM_ROOT", r"F:\C\VM")
sys.path.insert(0, os.path.join(VM_ROOT, "tools", "vesta_lsp_client"))

try:
    from vesta_lsp_client import (  # noqa: E402
        VestaLspClient,
        decode_semantic_tokens,
        discover_lsp,
    )
except ImportError as exc:  # pragma: no cover - depende del entorno local
    sys.exit(
        f"No se encuentra vesta_lsp_client en {VM_ROOT}.\n"
        f"Define VESTA_VM_ROOT con la ruta del repositorio VestaVM.\n"
        f"Detalle: {exc}"
    )

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNIPPETS = os.path.join(ROOT, "site", "snippets")

# Tipos de token que representan un simbolo con identidad propia: para estos se
# pide hover y definicion. Los demas (keyword, operator, comment) no llevan a
# ninguna parte y pedirlo solo alargaria la generacion.
LINKABLE = {
    "type",
    "class",
    "enum",
    "interface",
    "struct",
    "function",
    "method",
    "property",
    "enumMember",
    "namespace",
}


def discover_compiler() -> str:
    """Localiza el compilador de Vesta.

    Se prefiere SIEMPRE la instalacion del sistema sobre el binario del
    directorio de build del proyecto: ese ultimo cambia con cada compilacion y
    no representa ninguna version publicada, de modo que un fragmento validado
    contra el no dice nada sobre lo que puede usar un lector del sitio.

    :returns: Ruta del ejecutable, o cadena vacia si no se encuentra.
    """
    explicit = os.environ.get("VESTA_COMPILER")
    if explicit and os.path.isfile(explicit):
        return explicit

    candidates = [
        r"C:\Program Files\VestaVM\bin\vesta.exe",
        r"C:\Program Files (x86)\VestaVM\bin\vesta.exe",
        "/usr/local/bin/vesta",
        "/usr/bin/vesta",
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return ""


def verify_compiles(compiler: str, path: str) -> dict:
    """Comprueba con el COMPILADOR que un fragmento es valido.

    Esta es la unica verificacion que cuenta. El servidor LSP tambien publica
    diagnosticos, pero se ha comprobado que discrepa: para un fragmento que
    importa `std.wideint`, el LSP reporta siete errores dentro de la stdlib
    (`parse_int_lit` "no comptime-evaluable") mientras el compilador termina con
    exit 0 y emite el `.velb`. Tratar esos diagnosticos como bloqueantes
    impediria publicar codigo que funciona.

    Reparto, otra vez: el compilador dice si el codigo es valido; el LSP, como
    se pinta.

    :param compiler: Ruta del ejecutable del compilador.
    :param path: Fichero `.vx` a verificar.
    :returns: Diccionario con `ok`, `exit` y las lineas de error si las hay.
    """
    if not compiler:
        return {"ok": None, "reason": "compilador no encontrado"}

    import subprocess
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "snippet")
        try:
            proc = subprocess.run(
                [compiler, "--vx", path, "-o", out],
                capture_output=True,
                text=True,
                timeout=180,
                encoding="utf-8",
                errors="replace",
            )
        except (OSError, subprocess.SubprocessError) as exc:
            return {"ok": None, "reason": str(exc)}

    combined = f"{proc.stdout}\n{proc.stderr}"
    errors = [
        line.strip()
        for line in combined.split("\n")
        if line.strip().lower().startswith("error")
    ]
    return {"ok": proc.returncode == 0 and not errors, "exit": proc.returncode,
            "errors": errors[:5]}


def file_hash(text: str) -> str:
    """Devuelve el hash del contenido de un fragmento.

    Se calcula sobre el texto normalizado a saltos de linea Unix para que el
    indice no se invalide solo por clonar el repositorio en otro sistema.

    :param text: Contenido del fichero `.vx`.
    :returns: Hash hexadecimal SHA-256.
    """
    return hashlib.sha256(text.replace("\r\n", "\n").encode("utf-8")).hexdigest()


def clean_hover(raw) -> str:
    """Extrae el texto legible de una respuesta `textDocument/hover`.

    El LSP devuelve el contenido en varias formas posibles segun el metodo
    (cadena suelta, objeto `MarkupContent`, o lista de fragmentos). Se
    normalizan todas a texto plano porque el bocadillo de la web no renderiza
    Markdown: es un atributo del HTML.

    :param raw: Respuesta cruda del servidor.
    :returns: Texto plano, o cadena vacia si no hay documentacion.
    """
    if not raw:
        return ""
    contents = raw.get("contents") if isinstance(raw, dict) else raw
    if isinstance(contents, dict):
        contents = contents.get("value", "")
    if isinstance(contents, list):
        parts = []
        for item in contents:
            parts.append(item.get("value", "") if isinstance(item, dict) else str(item))
        contents = "\n".join(parts)
    text = str(contents or "")
    # Las vallas de codigo y los encabezados sobran en un atributo de texto.
    text = text.replace("```vx", "").replace("```", "").strip()

    # Se descarta la complejidad INFERIDA. El analizador la reporta con
    # `confidence: 0` y hoy se equivoca de forma observable: una funcion con un
    # unico `while` sale como O(n^2) porque el detector de bucles anade un
    # bucle fantasma en la linea 0, y un `main` con dos `println` tambien sale
    # cuadratico porque cuenta los bucles en que se baja la interpolacion de
    # cadenas. Publicar eso seria afirmar algo falso sobre el codigo del
    # ejemplo, justo en la pagina que presume de que el compilador no miente.
    #
    # La complejidad se publica unicamente cuando esta DECLARADA en el fuente
    # con `@complexity(...)` y el compilador la ha verificado; de eso se ocupa
    # `declared_complexity`, no esta funcion.
    lines = [
        line
        for line in text.split("\n")
        if not line.strip().lower().startswith("complejidad")
    ]
    return " ".join(" ".join(lines).split())


def declared_complexity(client: VestaLspClient, uri: str) -> dict:
    """Recoge la complejidad DECLARADA y verificada de cada funcion.

    Se consulta el metodo `vesta/complexity` y se conserva solo lo que el
    programador escribio como contrato `@complexity(...)` y el compilador no
    marco como discrepancia. La complejidad inferida se ignora a proposito:
    ver el comentario de `clean_hover`.

    :param client: Cliente LSP conectado.
    :param uri: URI del documento abierto.
    :returns: Mapa nombre de funcion -> complejidad declarada.
    """
    try:
        report = client.complexity(uri) or {}
    except Exception:  # pragma: no cover - depende de la version del servidor
        return {}

    out = {}
    for fn in report.get("functions", []):
        declared = (fn.get("declared") or "").strip()
        if declared and not fn.get("contract_mismatch"):
            out[fn.get("name", "")] = declared
    return out


def definition_of(raw, vm_root: str):
    """Normaliza una respuesta `textDocument/definition` a fichero y linea.

    Devuelve la ruta RELATIVA al repositorio del compilador cuando la
    definicion cae dentro de el, porque es lo que despues se convierte en un
    enlace a la stdlib publicada. Una definicion en el propio fragmento no
    interesa: no aporta navegacion.

    :param raw: Respuesta cruda del servidor.
    :param vm_root: Raiz del repositorio VestaVM.
    :returns: Diccionario con `file` y `line`, o None.
    """
    if not raw:
        return None
    entry = raw[0] if isinstance(raw, list) else raw
    if not isinstance(entry, dict):
        return None

    uri = entry.get("uri") or entry.get("targetUri") or ""
    rng = entry.get("range") or entry.get("targetSelectionRange") or {}
    line = (rng.get("start") or {}).get("line")
    if not uri or line is None:
        return None

    path = uri[len("file:///") :] if uri.startswith("file:///") else uri
    path = path.replace("%3A", ":").replace("/", os.sep)
    try:
        rel = os.path.relpath(path, vm_root)
    except ValueError:
        # Unidades distintas en Windows: la definicion no esta en el proyecto.
        return None
    if rel.startswith(".."):
        return None

    return {"file": rel.replace(os.sep, "/"), "line": int(line) + 1}


def audit_coverage(source: str, tokens) -> dict:
    """Mide cuanto del fragmento ha sabido clasificar el LSP.

    El servidor LSP acompana al lenguaje, y el lenguaje esta en desarrollo: al
    anadir una construccion nueva es normal que el LSP tarde en reconocerla.
    Cuando eso pasa no falla ruidosamente, simplemente devuelve menos tokens, y
    el fragmento se publicaria con trozos sin resaltar sin que nadie lo note.

    Esta funcion detecta justo eso: recorre el fuente marcando que caracteres
    quedaron cubiertos por algun token y reporta los identificadores que se
    quedaron fuera. No decide nada; solo da la informacion para que el operador
    juzgue si el indice es utilizable.

    :param source: Codigo fuente del fragmento.
    :param tokens: Tokens decodificados (linea, columna, longitud, tipo, mods).
    :returns: Diccionario con el porcentaje de cobertura y los identificadores
        no reconocidos, sin repetir.
    """
    lines = source.split("\n")
    covered = [bytearray(len(line)) for line in lines]

    for (line, col, length, _ttype, _mods) in tokens:
        if line >= len(covered):
            continue
        for i in range(col, min(col + length, len(covered[line]))):
            covered[line][i] = 1

    total = 0
    marked = 0
    unknown = []

    for li, line in enumerate(lines):
        # Los comentarios se cubren enteros o no se cubren; contarlos caracter a
        # caracter distorsionaria el porcentaje sin aportar nada.
        current = ""
        start = 0
        for ci, char in enumerate(line):
            is_ident = char.isalnum() or char == "_"
            # Se mide solo sobre caracteres de identificador. La puntuacion
            # (llaves, parentesis, comas) no produce tokens, y contarla rebajaria
            # el porcentaje sin que hubiera nada mal: el numero dejaria de
            # significar algo y se acabaria ignorando.
            if is_ident:
                total += 1
                if covered[li][ci]:
                    marked += 1

            if is_ident and not covered[li][ci]:
                if not current:
                    start = ci
                current += char
            else:
                # Un identificador sin cubrir es sospechoso; un numero suelto
                # dentro de otro token no lo es.
                if current and not current[0].isdigit():
                    unknown.append({"text": current, "line": li + 1, "col": start})
                current = ""
        if current and not current[0].isdigit():
            unknown.append({"text": current, "line": li + 1, "col": start})

    # Se deduplica por nombre: que un tipo desconocido aparezca ocho veces es un
    # solo problema, no ocho.
    seen = set()
    unique = []
    for item in unknown:
        if item["text"] in seen:
            continue
        seen.add(item["text"])
        unique.append(item)

    return {
        "percent": round(100.0 * marked / total, 1) if total else 100.0,
        "unclassified": unique,
    }


def generate(client: VestaLspClient, path: str, legend, compiler: str) -> dict:
    """Construye el indice semantico de un fragmento.

    :param client: Cliente LSP ya conectado.
    :param path: Ruta absoluta del fichero `.vx`.
    :param legend: Leyenda de tipos de token del servidor.
    :returns: Estructura serializable con el codigo, sus tokens y sus simbolos.
    """
    with open(path, "r", encoding="utf-8") as fh:
        source = fh.read().replace("\r\n", "\n")

    uri = client.open(path, text=source)
    diagnostics = client.diagnostics(uri)
    tokens = decode_semantic_tokens(client.semantic_tokens(uri)["data"])
    declared = declared_complexity(client, uri)

    lines = source.split("\n")
    out_tokens = []
    # El hover se cachea por nombre: en un fragmento el mismo tipo aparece
    # muchas veces y su documentacion no cambia entre apariciones.
    cache: dict = {}

    for (line, col, length, ttype, _mods) in tokens:
        kind = legend[ttype] if 0 <= ttype < len(legend) else ""
        text = lines[line][col : col + length] if line < len(lines) else ""

        entry = {"line": line, "col": col, "len": length, "kind": kind}

        # Las anotaciones llegan del servidor como `variable` porque el `@` no
        # forma parte del token. Se reclasifican aqui mirando el caracter
        # anterior: en la web un contrato debe verse como un contrato.
        if col > 0 and line < len(lines) and lines[line][col - 1] == "@":
            entry["kind"] = "annotation"

        if kind in LINKABLE and text:
            if text not in cache:
                cache[text] = {
                    "doc": clean_hover(client.hover(uri, line, col)),
                    "def": definition_of(client.definition(uri, line, col), VM_ROOT),
                }
            info = cache[text]
            doc = info["doc"]
            # La complejidad solo acompana al simbolo si el programador la
            # declaro y el compilador la verifico.
            if text in declared:
                doc = f"{doc} Complejidad declarada: {declared[text]}".strip()
            if doc:
                entry["doc"] = doc
            if info["def"]:
                entry["def"] = info["def"]

        out_tokens.append(entry)

    client.close_document(uri)

    return {
        "source": source,
        "hash": file_hash(source),
        "legend": list(legend),
        "tokens": out_tokens,
        # Cuanto supo clasificar el LSP. Si el lenguaje incorpora una
        # construccion que el servidor todavia no reconoce, se vera aqui como
        # una caida de cobertura y una lista de identificadores sin clasificar.
        "coverage": audit_coverage(source, tokens),
        # Veredicto del COMPILADOR: es lo que decide si el fragmento se puede
        # publicar.
        "compiles": verify_compiles(compiler, path),
        # Diagnosticos del LSP, solo informativos: discrepan del compilador y
        # no pueden bloquear la publicacion.
        "lsp_diagnostics": [
            {
                "severity": d.get("severity"),
                "message": d.get("message", ""),
                "line": (d.get("range", {}).get("start", {}) or {}).get("line"),
            }
            for d in (diagnostics or [])
        ],
    }


def main(argv) -> int:
    """Punto de entrada.

    :param argv: Argumentos de linea de comandos sin el nombre del programa.
    :returns: Codigo de salida del proceso.
    """
    check_only = "--check" in argv
    names = [a for a in argv if not a.startswith("-")]

    if not os.path.isdir(SNIPPETS):
        print(f"No existe {SNIPPETS}")
        return 1

    files = sorted(
        os.path.join(SNIPPETS, f)
        for f in os.listdir(SNIPPETS)
        if f.endswith(".vx") and (not names or os.path.splitext(f)[0] in names)
    )
    if not files:
        print("No hay fragmentos que procesar.")
        return 0

    # En modo verificacion no hace falta arrancar el servidor: basta comparar
    # el hash guardado con el del fuente actual.
    if check_only:
        stale = []
        for path in files:
            index = os.path.splitext(path)[0] + ".tokens.json"
            if not os.path.exists(index):
                stale.append(f"{os.path.basename(path)}: sin indice")
                continue
            with open(path, "r", encoding="utf-8") as fh:
                current = file_hash(fh.read())
            with open(index, "r", encoding="utf-8") as fh:
                stored = json.load(fh).get("hash")
            if current != stored:
                stale.append(f"{os.path.basename(path)}: indice desactualizado")
        if stale:
            print("Fragmentos sin regenerar:")
            for item in stale:
                print(f"  {item}")
            print("\nEjecuta: python tools/gen_snippets.py")
            return 1
        print(f"{len(files)} fragmentos al dia.")
        return 0

    warnings = 0
    compiler = discover_compiler()
    exe = discover_lsp()
    if not exe:
        print("No se encuentra vesta_lsp. Instala VestaVM o define VESTA_LSP.")
        return 1
    print(f"LSP        : {exe}")
    print(f"Compilador : {compiler or 'NO ENCONTRADO'}")

    with VestaLspClient(exe) as client:
        legend = client.semantic_token_legend()
        for path in files:
            data = generate(client, path, legend, compiler)
            index = os.path.splitext(path)[0] + ".tokens.json"
            with open(index, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=1)

            errors = [d for d in data["lsp_diagnostics"] if d.get("severity") == 1]
            linked = sum(1 for t in data["tokens"] if "def" in t)
            cover = data["coverage"]
            status = (
                f"{len(data['tokens']):3} tokens, {linked} enlazados, "
                f"{cover['percent']}% clasificado"
            )
            print(f"  {os.path.basename(path):28} {status}")

            # El compilador es la autoridad sobre si el codigo es valido; el
            # LSP solo sobre como se pinta. Por eso un error de diagnostico es
            # grave y una laguna de clasificacion es un aviso.
            build = data["compiles"]
            if build.get("ok") is False:
                warnings += 1
                print(f"    ERROR: el compilador rechaza el fragmento")
                for err in build.get("errors", [])[:3]:
                    print(f"      {err}")
            elif build.get("ok") is None:
                print(f"    sin verificar: {build.get('reason')}")
            elif errors:
                # El compilador acepta el fragmento y el LSP no: es el LSP quien
                # se equivoca, y conviene saberlo sin que bloquee nada.
                print(
                    f"    nota: el LSP reporta {len(errors)} errores que el "
                    f"compilador no confirma"
                )

            if cover["unclassified"]:
                warnings += 1
                names = ", ".join(u["text"] for u in cover["unclassified"][:8])
                print(f"    AVISO: el LSP no clasifico: {names}")
                print(
                    "      Suele significar que el lenguaje incorporo algo que "
                    "el LSP aun no reconoce."
                )

    if warnings:
        print(
            f"\n{warnings} avisos. Revisa antes de publicar: el resaltado sale "
            "del LSP, y el LSP va por detras del lenguaje."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
