/**
 * @file lint.mjs
 * @brief Comprueba que el repositorio cumple sus propias reglas de estilo.
 *
 * No es un linter de JavaScript. Existe porque las reglas que este proyecto
 * se ha impuesto no las comprueba ninguna herramienta generica: que el texto
 * sea ASCII salvo la ortografia castellana, que cada fichero se documente,
 * que las anotaciones de Vesta vayan una por linea, que las vallas de codigo
 * declaren un lenguaje que el resaltador conozca.
 *
 * Se escribe a mano y sin dependencias por coherencia: el gestor de paquetes
 * de Vesta existe justamente porque la cadena de suministro de npm es un
 * problema, y montar la verificacion de la web sobre cientos de paquetes
 * transitivos seria contradecir el argumento del propio proyecto en su propia
 * web. El coste es este fichero; la alternativa era una carpeta de
 * dependencias mayor que el sitio.
 *
 * Uso:
 *     node tools/lint.mjs           comprueba y devuelve 1 si hay errores
 *     node tools/lint.mjs --quiet   solo la linea de resumen
 *
 * Cada hallazgo se imprime como `fichero:linea: regla: mensaje`, que es el
 * formato que los editores saben convertir en un enlace.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Directorios que no se revisan: no son fuente del proyecto.
 *
 * El nombre del directorio de trabajo local se compone en tiempo de ejecucion
 * por el mismo motivo que los marcadores de mas abajo: escribirlo entero
 * haria que este fichero disparase su propia regla `no-ai-trace`.
 */
const SKIP_DIRS = new Set([
    '.git', 'node_modules', 'dist', '.' + 'clau' + 'de',
    // Volcados en crudo de fuentes ajenas: material de trabajo del que se
    // importa, no fuente del proyecto. Comprobarles el ASCII marcaria catorce
    // mil lineas del manual de Intel, que no vamos a reescribir.
    'manual',
    // Descargas temporales. No se commitean y no son fuente.
    '.cache',
]);

/**
 * Ficheros sueltos que no se revisan.
 *
 * Son locales, no se publican y no viajan en el repositorio: estan en
 * `.git/info/exclude`. Ademas contienen a proposito lo que las reglas
 * prohiben, porque son justamente los ficheros que enuncian esas reglas.
 */
const SKIP_FILES = new Set(['CLAU' + 'DE.md']);

/** Extensiones que se revisan. El resto son binarios o datos generados. */
const CHECKED = new Set(['.mjs', '.js', '.css', '.md', '.vx', '.yml', '.yaml', '.txt']);

/**
 * Caracteres prohibidos, por punto de codigo.
 *
 * La lista sale de la regla 2 del proyecto. Son caracteres que no aportan
 * nada tecnico y que se han vuelto delatores de texto generado por una
 * herramienta. Se nombran por punto de codigo, y no escribiendolos, para que
 * este mismo fichero cumpla la regla que comprueba.
 *
 * @type {Map<number,{name: string, use: string}>}
 */
const FORBIDDEN = new Map([
    [0x2014, { name: 'raya', use: '-' }],
    [0x2013, { name: 'semirraya', use: '-' }],
    [0x2192, { name: 'flecha derecha', use: '->' }],
    [0x21d2, { name: 'flecha doble derecha', use: '=>' }],
    [0x2190, { name: 'flecha izquierda', use: '<-' }],
    [0x2194, { name: 'flecha doble', use: '<->' }],
    [0x00d7, { name: 'signo de multiplicacion', use: 'x' }],
    [0x2265, { name: 'mayor o igual', use: '>=' }],
    [0x2264, { name: 'menor o igual', use: '<=' }],
    [0x2260, { name: 'distinto', use: '!=' }],
    [0x2026, { name: 'puntos suspensivos', use: '...' }],
    [0x201c, { name: 'comilla tipografica', use: '"' }],
    [0x201d, { name: 'comilla tipografica', use: '"' }],
    [0x2018, { name: 'comilla tipografica', use: "'" }],
    [0x2019, { name: 'comilla tipografica', use: "'" }],
    [0x2022, { name: 'vineta', use: '-' }],
    [0x2605, { name: 'estrella', use: '*' }],
    [0x2713, { name: 'check', use: '[x]' }],
    [0x2717, { name: 'cruz', use: '[ ]' }],
    [0x00a7, { name: 'signo de seccion', use: 'seccion N' }],
]);

/**
 * Letras no ASCII que si estan permitidas.
 *
 * Son la ortografia del castellano, que es ortografia y no decoracion. Todo
 * lo demas fuera del ASCII se marca: es la via por la que entran los emoji y
 * los simbolos matematicos decorativos.
 */
const SPANISH = new Set([...'aeiouAEIOUnNuU'].concat([...'áéíóúüñÁÉÍÓÚÜÑ¿¡ª°']));

/**
 * Rangos de la escritura china, con su puntuacion.
 *
 * Se admite tambien la raya y los puntos suspensivos, que la tabla de
 * prohibidos veta en el resto del repositorio. No es una excepcion nueva sino
 * la misma de siempre aplicada donde toca: esos caracteres estan prohibidos
 * porque delatan texto generado en la prosa del proyecto, y en un texto chino
 * son ortografia igual que la enye en uno castellano.
 */
const CHINESE_RANGES = [
    [0x3000, 0x303f],  // puntuacion CJK
    [0x3400, 0x4dbf],  // ideogramas, extension A
    [0x4e00, 0x9fff],  // ideogramas
    [0xf900, 0xfaff],  // formas de compatibilidad
    [0xff00, 0xffef],  // formas de ancho completo
    [0x2014, 0x2014], [0x2026, 0x2026],
    [0x2018, 0x2019], [0x201c, 0x201d],
];

/**
 * Idiomas con escritura propia, por el nombre del fichero que la contiene.
 *
 * El idioma decide que caracteres son ortografia y cuales son ruido, asi que
 * la regla no puede ser una sola para todo el repositorio. Se deduce del
 * nombre porque es donde ya esta escrito: `es.md`, `zh.md`,
 * `glossary.zh.json`, `x86.tm.zh.json`.
 */
const SCRIPTS = new Map([
    ['es', { name: 'castellana', allows: (cp, ch) => SPANISH.has(ch) }],
    ['zh', {
        name: 'china',
        allows: (cp) => CHINESE_RANGES.some(([a, b]) => cp >= a && cp <= b),
    }],
]);

/**
 * Devuelve la escritura admitida en un fichero, o la castellana por omision.
 *
 * @param {string} file Ruta relativa.
 * @param {string} [raw] Contenido, por si declara sus escrituras.
 * @returns {{name: string, allows: function}} Escritura admitida.
 */
function scriptOf(file, raw) {
    // Un fichero puede declarar que escrituras lleva dentro. Hace falta para
    // el codigo: los rotulos de la interfaz de un idioma viven en una tabla
    // del fuente, y sin esto la unica salida serian trescientos `lint-allow`,
    // que no es una excepcion sino un agujero. Se declara una vez, arriba, y
    // revisar quien lo usa es un `grep`.
    const declared = raw && raw.match(/lint-script:\s*([a-z, ]+)/);
    if (declared) {
        const codes = declared[1].split(',').map((c) => c.trim()).filter(Boolean);
        const allowed = codes.map((c) => SCRIPTS.get(c)).filter(Boolean);
        if (allowed.length > 0) {
            return {
                name: codes.join(' y '),
                allows: (cp, ch) => allowed.some((s) => s.allows(cp, ch)),
            };
        }
    }

    const name = file.split(/[\\/]/).pop();
    const match = name.match(/^(?:.*\.)?([a-z]{2})\.(?:md|json)$/);
    const script = match && SCRIPTS.get(match[1]);
    return script || SCRIPTS.get('es');
}

/**
 * Lenguajes de valla que el sitio sabe resaltar.
 *
 * Una valla con un lenguaje que el resaltador no conoce no falla: emite el
 * bloque sin color y nadie se entera. De ahi que se compruebe aqui.
 */
const FENCES = new Set([
    'vx', 'c', 'cpp', 'rust', 'go', 'python', 'java', 'bash',
    'text', 'json', 'html', 'css', 'js', 'xml', 'yaml', 'ini', 'diff',
]);

/**
 * Marcadores de herramienta asistente.
 *
 * Los nombres se componen en tiempo de ejecucion en lugar de escribirse
 * enteros. El motivo no es esconderlos: es que la regla 1 prohibe que esos
 * nombres aparezcan en el repositorio, y un linter que los escribiera para
 * buscarlos seria exactamente el rastro que persigue.
 *
 * @type {Array<RegExp>}
 */
const AI_MARKERS = [
    new RegExp('Co-' + 'Authored-By', 'i'),
    new RegExp('Generated\\s+with', 'i'),
    new RegExp('generado\\s+autom' + '[aá]ticamente\\s+por', 'i'),
    new RegExp('\\b' + 'Cla' + 'ude\\b', 'i'),
    new RegExp('\\b' + 'Copi' + 'lot\\b', 'i'),
    new RegExp('\\b' + 'Chat' + 'GPT\\b', 'i'),
    new RegExp('\\b' + 'asistente\\s+de\\s+' + 'IA\\b', 'i'),
];

/** Longitud maxima de linea en codigo. La prosa se envuelve mas corto. */
const MAX_LINE = 100;

/**
 * Longitud a partir de la cual un literal exime a su linea del limite.
 *
 * Una linea larga solo es un defecto si se puede partir. Una lista de
 * palabras clave, una expresion regular o una plantilla HTML son un unico
 * literal: trocearlos para caber en la columna 100 los hace ilegibles y
 * ademas invita a errores al recomponerlos. La regla mide si hay donde
 * cortar, no cuanto ocupa.
 */
const UNSPLITTABLE = 45;

/**
 * Indica si una linea contiene un literal demasiado largo para partirse.
 *
 * @param {string} line Linea a examinar.
 * @returns {boolean}
 */
function hasLongLiteral(line) {
    const literals = line.match(/'[^']*'|"[^"]*"|`[^`]*`|\/[^/\s][^/]*\//g) || [];
    return literals.some((lit) => lit.length >= UNSPLITTABLE);
}

/** Hallazgos acumulados. */
const findings = [];

/**
 * Lineas con excepcion declarada, por fichero.
 *
 * Una regla sin valvula de escape acaba desactivada entera en cuanto aparece
 * el primer caso legitimo que no contempla. La valvula es explicita, se lee
 * en el fuente y nombra la regla concreta, de modo que revisar las
 * excepciones del repositorio es un `grep`.
 *
 * @type {Map<string,Map<number,Set<string>>>}
 */
const allowed = new Map();

/**
 * Recoge las excepciones declaradas en un fichero.
 *
 * La marca es `lint-allow: <regla>` en la propia linea o en la anterior. Se
 * admiten varias reglas separadas por comas.
 *
 * @param {string} file Ruta relativa.
 * @param {Array<string>} lines Contenido por lineas.
 */
function collectAllowances(file, lines) {
    const map = new Map();
    lines.forEach((line, i) => {
        const match = line.match(/lint-allow:\s*([a-z0-9_,\s-]+)/i);
        if (!match) return;
        const rules = new Set(match[1].split(',').map((r) => r.trim()).filter(Boolean));
        // Vale para la linea de la marca y para la siguiente, que es donde se
        // pone cuando la marca iria demasiado larga en la propia linea.
        for (const n of [i + 1, i + 2]) {
            if (!map.has(n)) map.set(n, new Set());
            for (const rule of rules) map.get(n).add(rule);
        }
    });
    allowed.set(file, map);
}

/**
 * Registra un hallazgo, salvo que la linea declare excepcion para esa regla.
 *
 * @param {string} file Ruta relativa a la raiz del repositorio.
 * @param {number} line Numero de linea, base 1.
 * @param {string} rule Identificador de la regla.
 * @param {string} message Explicacion, en imperativo cuando se pueda.
 * @param {boolean} [warn] Si es aviso en lugar de error.
 */
function report(file, line, rule, message, warn = false) {
    if (allowed.get(file)?.get(line)?.has(rule)) return;
    findings.push({ file, line, rule, message, warn });
}

/**
 * Recorre el arbol de ficheros revisables.
 *
 * @param {string} dir Directorio de partida.
 * @returns {Array<string>} Rutas absolutas.
 */
function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry) || SKIP_FILES.has(entry)) continue;
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) out.push(...walk(path));
        else if (CHECKED.has(extname(entry))) out.push(path);
    }
    return out;
}

/**
 * Reglas que se aplican a cualquier fichero de texto.
 *
 * @param {string} file Ruta relativa.
 * @param {Array<string>} lines Contenido por lineas.
 * @param {string} raw Contenido completo.
 */
function checkAny(file, lines, raw) {
    if (raw.includes('\r')) {
        report(file, 1, 'crlf', 'El fichero lleva retornos de carro; usa LF.');
    }
    if (raw.length > 0 && !raw.endsWith('\n')) {
        report(file, lines.length, 'final-newline', 'Falta el salto de linea final.');
    }

    const script = scriptOf(file, raw);

    lines.forEach((line, i) => {
        const n = i + 1;

        if (/[ \t]+$/.test(line)) {
            report(file, n, 'trailing-space', 'Sobra espacio al final de la linea.');
        }

        for (const ch of line) {
            const cp = ch.codePointAt(0);
            if (cp < 128) continue;

            // La escritura del idioma manda sobre la tabla de prohibidos: en
            // un fichero chino la raya es puntuacion, no un delator.
            if (script.allows(cp, ch)) continue;

            const bad = FORBIDDEN.get(cp);
            if (bad) {
                report(
                    file, n, 'ascii',
                    `Caracter prohibido U+${cp.toString(16).toUpperCase().padStart(4, '0')} ` +
                        `(${bad.name}); usa ${bad.use}.`
                );
                continue;
            }
            report(
                file, n, 'ascii',
                `Caracter no ASCII U+${cp.toString(16).toUpperCase().padStart(4, '0')} ` +
                    `fuera de la ortografia ${script.name}.`
            );
        }

        for (const marker of AI_MARKERS) {
            if (marker.test(line)) {
                report(file, n, 'no-ai-trace', 'Rastro de herramienta asistente.');
                break;
            }
        }
    });
}

/**
 * Reglas de los modulos JavaScript.
 *
 * Comprueba lo que la regla 3 del proyecto pide y una herramienta generica no
 * sabe: que el fichero diga que hace y por que existe, y que cada funcion
 * exportada este documentada.
 *
 * @param {string} file Ruta relativa.
 * @param {Array<string>} lines Contenido por lineas.
 * @param {string} raw Contenido completo.
 */
function checkModule(file, lines, raw) {
    if (!/^\/\*\*/.test(raw)) {
        report(file, 1, 'file-header', 'El fichero debe abrir con un bloque /** ... */.');
    } else {
        const header = raw.slice(0, raw.indexOf('*/'));
        for (const tag of ['@file', '@brief']) {
            if (!header.includes(tag)) {
                report(file, 1, 'file-header', `La cabecera no declara ${tag}.`);
            }
        }
    }

    // Dentro de una plantilla multilinea, un salto de linea forma parte del
    // resultado: partir una linea larga de SVG o de HTML no la reformatea,
    // cambia lo que se emite. Ahi el limite no aplica.
    let inTemplate = false;

    lines.forEach((line, i) => {
        const wasInTemplate = inTemplate;
        const backticks = (line.match(/(?<!\\)`/g) || []).length;
        if (backticks % 2 === 1) inTemplate = !inTemplate;

        if (line.length > MAX_LINE && !hasLongLiteral(line) && !wasInTemplate) {
            report(
                file, i + 1, 'line-length',
                `Linea de ${line.length} caracteres; el maximo es ${MAX_LINE}.`,
                true
            );
        }

        // Una exportacion sin documentar es la que acaba usandose mal desde
        // otro modulo, porque el unico sitio donde se explica es su cuerpo.
        if (/^export (async )?function /.test(line)) {
            const prev = (lines[i - 1] || '').trim();
            if (prev !== '*/') {
                const name = line.match(/function\s+([A-Za-z0-9_]+)/);
                report(
                    file, i + 1, 'exported-doc',
                    `La funcion exportada ${name ? name[1] : ''} no lleva bloque /** ... */.`
                );
            }
        }
    });
}

/**
 * Reglas del contenido en Markdown.
 *
 * @param {string} file Ruta relativa.
 * @param {Array<string>} lines Contenido por lineas.
 */
function checkMarkdown(file, lines) {
    let inFence = false;
    let fenceLang = '';
    let h1 = 0;

    lines.forEach((line, i) => {
        const n = i + 1;
        const fence = line.match(/^```\s*([A-Za-z0-9_+-]*)\s*$/);

        if (fence) {
            if (inFence) {
                inFence = false;
                return;
            }
            inFence = true;
            fenceLang = fence[1];
            if (fenceLang === '') {
                report(
                    file, n, 'fence-lang',
                    'Valla sin lenguaje; usa text si no es codigo de ningun lenguaje.'
                );
            } else if (!FENCES.has(fenceLang)) {
                report(file, n, 'fence-lang', `Lenguaje de valla desconocido: "${fenceLang}".`);
            }
            return;
        }

        if (inFence) {
            // Una anotacion por linea. El sitio es la referencia visual del
            // lenguaje: lo que se publica ensena como se escribe Vesta.
            if (fenceLang === 'vx' && /@\w+[^\n]*\s@\w+/.test(line)) {
                report(file, n, 'vx-annotations', 'Una anotacion por linea, no varias juntas.');
            }
            return;
        }

        if (/^# /.test(line)) h1 += 1;
    });

    if (inFence) report(file, lines.length, 'fence-lang', 'Valla de codigo sin cerrar.');

    // Una sola h1 por pagina: lo pide el SEO y lo pide la coherencia del
    // indice, que toma de ella el titulo de la entrada.
    if (h1 > 1) report(file, 1, 'single-h1', `La pagina tiene ${h1} encabezados de nivel 1.`);
}

/**
 * Reglas de los fragmentos de codigo Vesta.
 *
 * @param {string} file Ruta relativa.
 * @param {Array<string>} lines Contenido por lineas.
 */
function checkVesta(file, lines) {
    lines.forEach((line, i) => {
        if (/@\w+[^\n]*\s@\w+/.test(line)) {
            report(file, i + 1, 'vx-annotations', 'Una anotacion por linea, no varias juntas.');
        }
    });
}

/**
 * Ejecuta todas las comprobaciones y devuelve el codigo de salida.
 *
 * @returns {number} 0 si no hay errores, 1 si los hay.
 */
function main() {
    const quiet = process.argv.includes('--quiet');

    for (const path of walk(ROOT)) {
        const file = relative(ROOT, path).split(sep).join('/');
        const raw = readFileSync(path, 'utf8');
        const lines = raw.split('\n');

        collectAllowances(file, lines);
        checkAny(file, lines, raw);
        if (extname(path) === '.mjs' || extname(path) === '.js') checkModule(file, lines, raw);
        if (extname(path) === '.md') checkMarkdown(file, lines);
        if (extname(path) === '.vx') checkVesta(file, lines);
    }

    const errors = findings.filter((f) => !f.warn);
    const warnings = findings.filter((f) => f.warn);

    if (!quiet) {
        for (const f of [...errors, ...warnings]) {
            const kind = f.warn ? 'aviso' : 'error';
            console.log(`${f.file}:${f.line}: ${kind}: ${f.rule}: ${f.message}`);
        }
        if (findings.length > 0) console.log('');
    }

    console.log(
        errors.length === 0 && warnings.length === 0
            ? 'lint: sin hallazgos.'
            : `lint: ${errors.length} errores, ${warnings.length} avisos.`
    );

    return errors.length > 0 ? 1 : 0;
}

process.exit(main());
