/**
 * @file tools/highlight.mjs
 * @brief Resaltado de sintaxis en tiempo de compilacion.
 *
 * El resaltado se resuelve durante el build y se emite como HTML ya coloreado.
 * No se envia ningun resaltador al navegador: el codigo es contenido y debe
 * estar completo en el HTML servido, tanto por SEO como para que la pagina se
 * lea igual con JavaScript desactivado.
 *
 * El tokenizador es propio y deliberadamente modesto. Un resaltador de calidad
 * industrial (gramaticas TextMate) exige arrastrar un motor de expresiones
 * regulares Oniguruma y varios megabytes de gramaticas; para bloques de codigo
 * de documentacion basta con distinguir comentarios, cadenas, numeros, palabras
 * clave, tipos y anotaciones. Lo que no se reconoce se emite como texto normal,
 * nunca como error.
 *
 * La gramatica TextMate de `.vx` para el editor es un artefacto distinto, con
 * otro consumidor (VSCode), y no se implementa aqui.
 */

import { escapeHtml } from './markdown.mjs';

/**
 * Construye el conjunto de palabras de una cadena separada por espacios.
 *
 * Se escriben como texto plano por legibilidad: las listas de palabras clave
 * son largas y en forma de array ocuparian el triple.
 *
 * @param {string} words Palabras separadas por espacios.
 * @returns {Set<string>}
 */
const set = (words) => new Set(words.trim().split(/\s+/));

/**
 * Palabras clave de Vesta.
 *
 * Incluye las de control de flujo, las de declaracion y las propias del
 * lenguaje que no existen en C/Java (comptime, borrow, spawn, rspawn, match,
 * overlay, namespace, extension, impl). Verificadas contra examples_codes_vx/
 * y stdlib/vx/.
 */
const VESTA_KEYWORDS = set(`
    if else while do for foreach in break continue return goto switch case
    default match try catch finally throw panic assert static_assert
    class struct enum union interface typedef namespace import export extern
    public private protected internal static final abstract virtual override
    const comptime new delete sizeof typeof offsetof this self super
    unique shared borrow borrow_mut lend lend_mut move
    async await spawn rspawn synchronized yield resume msgsend msgrecv
    asm register volatile nomem preserves_flags pure clobbers naked
    overlay bytes section stride element endian parent
    extension impl concept requires where when
    true false null nullptr auto var let fn cfn
    implicit explicit from to opaque
`);

/**
 * Tipos PRIMITIVOS de Vesta: los que implementa el compilador.
 *
 * Esta lista se mantiene corta a proposito. Todo lo demas que se comporta como
 * un tipo -- los enteros de ancho multiple (u128..i512), usize/uintptr,
 * Optional, Result, y cualquier tipo que el usuario o la stdlib definan manana
 * -- vive en biblioteca y cambia constantemente. Enumerarlos aqui seria una
 * lista desactualizada desde el primer dia.
 *
 * Los tipos de biblioteca se detectan por POSICION SINTACTICA (ver
 * `looksLikeTypePosition`), lo que funciona para tipos que todavia no existen.
 */
const VESTA_PRIMITIVES = set(`
    void bool char string
    i8 i16 i32 i64 u8 u16 u32 u64 f32 f64
`);

/**
 * Definicion de un lenguaje para el tokenizador.
 *
 * @typedef {Object} LanguageSpec
 * @property {Set<string>} keywords Palabras clave.
 * @property {Set<string>} [types] Tipos, resaltados de forma distinta.
 * @property {string[]} [lineComment] Prefijos de comentario de linea.
 * @property {[string,string][]} [blockComment] Pares de apertura y cierre.
 * @property {string[]} [strings] Delimitadores de cadena.
 * @property {boolean} [annotations] Si `@nombre` se resalta como anotacion.
 * @property {boolean} [preprocessor] Si `#nombre` se resalta como directiva.
 * @property {boolean} [structuralTypes] Si los tipos se deducen por posicion
 *           sintactica ademas de por la lista de primitivos.
 */

/** @type {Object<string, LanguageSpec>} */
const LANGUAGES = {
    vx: {
        keywords: VESTA_KEYWORDS,
        types: VESTA_PRIMITIVES,
        structuralTypes: true,
        lineComment: ['//'],
        blockComment: [['/*', '*/']],
        strings: ['"', "'", '`'],
        annotations: true,
        preprocessor: true,
    },
    c: {
        keywords: set(`
            auto break case char const continue default do double else enum
            extern float for goto if inline int long register restrict return
            short signed sizeof static struct switch typedef union unsigned
            void volatile while _Bool NULL
        `),
        types: set('int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t size_t ssize_t'),
        lineComment: ['//'],
        blockComment: [['/*', '*/']],
        strings: ['"', "'"],
        preprocessor: true,
    },
    rust: {
        keywords: set(`
            as async await break const continue crate dyn else enum extern
            false fn for if impl in let loop match mod move mut pub ref return
            self Self static struct super trait true type unsafe use where while
        `),
        types: set('i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str String Vec Option Result Box'),
        lineComment: ['//'],
        blockComment: [['/*', '*/']],
        strings: ['"', "'"],
        annotations: true,
    },
    go: {
        keywords: set(`
            break case chan const continue default defer else fallthrough for
            func go goto if import interface map package range return select
            struct switch type var nil true false
        `),
        types: set('bool byte complex64 complex128 error float32 float64 int int8 int16 int32 int64 rune string uint uint8 uint16 uint32 uint64 uintptr'),
        lineComment: ['//'],
        blockComment: [['/*', '*/']],
        strings: ['"', '`', "'"],
    },
    python: {
        keywords: set(`
            and as assert async await break class continue def del elif else
            except finally for from global if import in is lambda None nonlocal
            not or pass raise return True False try while with yield
        `),
        types: set('int float str bool bytes list dict set tuple object'),
        lineComment: ['#'],
        strings: ['"', "'"],
        annotations: true,
    },
    java: {
        keywords: set(`
            abstract assert boolean break byte case catch char class const
            continue default do double else enum extends final finally float
            for goto if implements import instanceof int interface long native
            new package private protected public return short static strictfp
            super switch synchronized this throw throws transient try void
            volatile while true false null var record sealed
        `),
        types: set('String Object Integer Long Double Boolean List Map Set'),
        lineComment: ['//'],
        blockComment: [['/*', '*/']],
        strings: ['"', "'"],
        annotations: true,
    },
    bash: {
        keywords: set(`
            if then else elif fi for while until do done case esac function
            return in select time coproc local export readonly declare unset
            echo cd exit source alias set sudo
        `),
        lineComment: ['#'],
        strings: ['"', "'"],
        // Una orden de consola casi nunca contiene palabras clave: `vesta --vx
        // hola.vx -o hola` no tiene ni una. Sin un trato propio, el bloque
        // entero sale sin marcar y se lee como texto plano.
        shell: true,
    },
    json: {
        keywords: set('true false null'),
        strings: ['"'],
    },
};

// Alias habituales, para que el autor del contenido no tenga que recordar la
// clave exacta de cada lenguaje.
const ALIASES = {
    vesta: 'vx',
    cpp: 'c',
    'c++': 'c',
    h: 'c',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    console: 'bash',
    rs: 'rust',
    golang: 'go',
    yml: 'json',
    yaml: 'json',
};

/**
 * Envuelve un fragmento en un span con la clase del tipo de token.
 *
 * @param {string} kind Nombre corto del token (kw, typ, str, num, com, ann, pre).
 * @param {string} text Texto crudo, sin escapar.
 * @returns {string} HTML.
 */
const span = (kind, text) => `<span class="tok-${kind}">${escapeHtml(text)}</span>`;

/**
 * Decide si un identificador ocupa una posicion de TIPO.
 *
 * Vesta declara al estilo C/Java, con el tipo delante del nombre:
 *
 *     Contador c = Contador();     // Contador es tipo
 *     unique<Nodo> raiz;           // Nodo es tipo
 *     Reparto reparte(i64[] xs)    // Reparto e i64 son tipos
 *     u512 total;                  // u512 es tipo, y no esta en ninguna lista
 *
 * La regla es: un identificador seguido -- saltando parametros genericos,
 * corchetes de array y modificadores de puntero -- de otro identificador, esta
 * en posicion de tipo. Asi se resalta cualquier tipo que la stdlib o el usuario
 * definan sin tener que mantener un inventario.
 *
 * Es una heuristica, no un analizador sintactico, y se equivoca en los mismos
 * casos que se equivoca un lector humano leyendo una linea aislada. Cuando duda
 * no marca nada: un identificador sin resaltar se lee bien, uno mal resaltado
 * confunde.
 *
 * @param {string} code Codigo completo del bloque.
 * @param {number} pos Indice del primer caracter TRAS el identificador.
 * @returns {boolean} true si el identificador anterior es un tipo.
 */
function looksLikeTypePosition(code, pos) {
    let i = pos;

    // Parametros genericos: unique<T>, HashMap<string, i64>. Se salta el par
    // equilibrado. Si no cierra en la misma linea no es un generico, sino una
    // comparacion, y entonces no hay tipo.
    if (code[i] === '<') {
        let depth = 0;
        let j = i;
        while (j < code.length) {
            if (code[j] === '\n') return false;
            if (code[j] === '<') depth += 1;
            else if (code[j] === '>') {
                depth -= 1;
                if (depth === 0) {
                    j += 1;
                    break;
                }
            }
            j += 1;
        }
        if (depth !== 0) return false;
        i = j;
    }

    // Array (i64[], i64[4]) y punteros o referencias (Nodo*, Nodo**).
    while (i < code.length) {
        if (code[i] === '[') {
            const close = code.indexOf(']', i);
            if (close === -1 || code.slice(i, close).includes('\n')) return false;
            i = close + 1;
        } else if (code[i] === '*' || code[i] === '&') {
            i += 1;
        } else {
            break;
        }
    }

    // Espacios entre el tipo y el nombre, sin cruzar a la linea siguiente: una
    // declaracion parte el tipo y el nombre con espacios, no con saltos.
    let sawSpace = false;
    while (i < code.length && (code[i] === ' ' || code[i] === '\t')) {
        sawSpace = true;
        i += 1;
    }
    if (!sawSpace) return false;

    // Lo que sigue debe empezar un identificador (el nombre declarado).
    return /[A-Za-z_]/.test(code[i] || '');
}

/**
 * Resalta un bloque de codigo.
 *
 * El recorrido es un unico barrido de izquierda a derecha, sin retroceso: en
 * cada posicion se prueba que construccion empieza ahi y se consume entera.
 * Esto evita el problema clasico de aplicar expresiones regulares en cadena
 * (resaltar dentro de un comentario, o romper una cadena que contiene //).
 *
 * @param {string} code Codigo crudo.
 * @param {string} lang Lenguaje declarado en la valla del bloque.
 * @returns {string} HTML con los tokens marcados y el resto escapado.
 */
export function highlight(code, lang) {
    const key = ALIASES[lang] || lang;
    const spec = LANGUAGES[key];

    // Lenguaje desconocido o texto plano: se escapa y se deja tal cual. Es
    // preferible a adivinar y colorear mal.
    if (!spec) return escapeHtml(code);

    const out = [];
    let i = 0;
    let plain = '';

    /** Vuelca el texto sin marcar acumulado hasta ahora. */
    const flush = () => {
        if (plain) {
            out.push(escapeHtml(plain));
            plain = '';
        }
    };

    while (i < code.length) {
        const rest = code.slice(i);

        // Comentario de bloque.
        const block = (spec.blockComment || []).find((pair) =>
            rest.startsWith(pair[0])
        );
        if (block) {
            const end = code.indexOf(block[1], i + block[0].length);
            const stop = end === -1 ? code.length : end + block[1].length;
            flush();
            out.push(span('com', code.slice(i, stop)));
            i = stop;
            continue;
        }

        // Comentario de linea.
        const line = (spec.lineComment || []).find((prefix) =>
            rest.startsWith(prefix)
        );
        if (line) {
            const end = code.indexOf('\n', i);
            const stop = end === -1 ? code.length : end;
            flush();
            out.push(span('com', code.slice(i, stop)));
            i = stop;
            continue;
        }

        // Cadena. Se respetan los escapes con barra invertida para que un
        // \" no cierre la cadena antes de tiempo.
        const quote = (spec.strings || []).find((q) => rest.startsWith(q));
        if (quote) {
            let j = i + quote.length;
            while (j < code.length) {
                if (code[j] === '\\') {
                    j += 2;
                    continue;
                }
                if (code.startsWith(quote, j)) {
                    j += quote.length;
                    break;
                }
                // Una cadena sin cerrar no debe tragarse el resto del fichero.
                if (code[j] === '\n' && quote !== '`') break;
                j += 1;
            }
            flush();
            out.push(span('str', code.slice(i, j)));
            i = j;
            continue;
        }

        // Shell: la primera palabra de cada orden es el programa que se
        // invoca, y lo que empieza por guion es una opcion. Son las dos cosas
        // que la vista busca al leer una orden.
        if (spec.shell) {
            let back = i - 1;
            while (back >= 0 && (code[back] === ' ' || code[back] === '	')) back -= 1;
            const atLineStart = back < 0 || code[back] === String.fromCharCode(10);
            const command = atLineStart && rest.match(/^[A-Za-z_][\w.\/-]*/);
            if (command && !spec.keywords.has(command[0])) {
                flush();
                out.push(span('fn', command[0]));
                i += command[0].length;
                continue;
            }

            const option = rest.match(/^--?[A-Za-z][\w-]*/);
            if (option) {
                flush();
                out.push(span('opt', option[0]));
                i += option[0].length;
                continue;
            }
        }

        // Directiva de preprocesador, al principio de linea.
        if (spec.preprocessor && code[i] === '#') {
            const atLineStart = i === 0 || /\n\s*$/.test(code.slice(0, i));
            if (atLineStart) {
                const match = rest.match(/^#[A-Za-z_]*/);
                if (match) {
                    flush();
                    out.push(span('pre', match[0]));
                    i += match[0].length;
                    continue;
                }
            }
        }

        // Anotacion o atributo.
        if (spec.annotations && code[i] === '@') {
            const match = rest.match(/^@[A-Za-z_][A-Za-z0-9_]*/);
            if (match) {
                flush();
                out.push(span('ann', match[0]));
                i += match[0].length;
                continue;
            }
        }

        // Numero: decimal, hexadecimal, binario, octal, flotante y sufijos.
        const number = rest.match(
            /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)[uUlLfF]*/
        );
        if (number && !/[A-Za-z0-9_]/.test(code[i - 1] || '')) {
            flush();
            out.push(span('num', number[0]));
            i += number[0].length;
            continue;
        }

        // Identificador: puede ser palabra clave, tipo o texto normal.
        const word = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
        if (word) {
            const value = word[0];
            const isPrimitive = spec.types && spec.types.has(value);
            const isStructuralType =
                spec.structuralTypes &&
                !isPrimitive &&
                looksLikeTypePosition(code, i + value.length);

            if (spec.keywords.has(value)) {
                flush();
                out.push(span('kw', value));
            } else if (isPrimitive || isStructuralType) {
                flush();
                out.push(span('typ', value));
            } else {
                plain += value;
            }
            i += value.length;
            continue;
        }

        plain += code[i];
        i += 1;
    }

    flush();
    return out.join('');
}

/**
 * Lista de lenguajes reconocidos, para validar el contenido durante el build.
 *
 * @returns {string[]} Claves y alias admitidos.
 */
export function supportedLanguages() {
    return [...Object.keys(LANGUAGES), ...Object.keys(ALIASES), 'text'].sort();
}
