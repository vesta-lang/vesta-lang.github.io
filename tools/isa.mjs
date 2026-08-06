/**
 * @file tools/isa.mjs
 * @brief Publica la referencia de instrucciones a partir de los ficheros
 *        `isadoc`.
 *
 * El formato esta especificado en `site/data/isa/FORMAT.md`. Cada instruccion
 * es un directorio con `data.json` -- lo consultable: opcodes, excepciones,
 * banderas, enlaces -- y un Markdown por idioma con el documento.
 *
 * Lleva rotulos de interfaz en castellano y en chino, que son ortografia
 * de su idioma y no decoracion:  lint-script: es, zh
 *
 * Aqui no se decide nada sobre que es una instruccion: solo como se ve.
 *
 * ## Lo que no se copia
 *
 * Las codificaciones y el coste los publica `arch-data`, en el mismo dominio,
 * y la pagina se los pide al navegador. Copiarlos en el build crearia una
 * segunda version que envejece en cuanto se corrige la original. Solo se
 * guardan los opcodes de las instrucciones que `arch-data` no cubre, que son
 * las que solo existen en 16 y 32 bits: para esas el manual es la unica fuente
 * que hay.
 *
 * ## Idiomas
 *
 * Se publica el documento del idioma pedido; si no existe, el de la fuente. La
 * pagina no se omite por no estar traducida, porque no estaria vacia: los
 * opcodes, las banderas y las excepciones son iguales en cualquier idioma.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml, parseFrontMatter, render } from './markdown.mjs';
import { highlight } from './highlight.mjs';
import { renderTags } from '../site/content/tags.mjs';

/** Textos de la seccion, por idioma. */
const UI = {
    en: {
        encodings: 'Encodings',
        cost: 'Measured cost',
        flags: 'Flags named',
        exceptions: 'Exceptions',
        sources: 'Sources',
        manual: 'This instruction in the Intel manual',
        timings: 'Latency and throughput per microarchitecture',
        loading: 'Loading measurements from arch-data...',
        encodingsAt: 'Opcodes and operand encodings, in arch-data',
        opcode: 'Opcode',
        syntax: 'Instruction',
        operands: 'Op/En',
        long: '64-bit',
        legacy: 'Compat/Legacy',
        note: 'Description',
        operandEncoding: 'Operand encoding',
        operandIntro:
            'Each mode is a value of the <code>Op/En</code> column above. It '+
            'says which field of the encoded instruction carries each '+
            'operand, in the order they are written, and whether the '+
            'instruction reads it, writes it or both.',
        legacyOnly:
            'This instruction exists only in 16- and 32-bit modes, so it is ' +
            'not in the project measurement database. The encodings below ' +
            'come from the Intel manual.',
        notMeasured: 'Not measured: it does not run on 64-bit processors.',
        prefix:
            'This is a prefix, not an instruction: it modifies the ' +
            'instruction that follows it and has no encoding of its own.',
        leaf:
            'This is a leaf function, not an instruction: it is invoked ' +
            'through another instruction with a leaf number in a register.',
        modes: {
            real: 'Real address mode',
            protected: 'Protected mode',
            virtual8086: 'Virtual-8086 mode',
            compat: 'Compatibility mode',
            long: '64-bit mode',
        },
        index: 'All x86 instructions',
        filterBy: 'Only instructions measured on:',
        viewList: 'Alphabetical list', viewMap: 'Opcode maps',
        allArches: 'every microarchitecture',
        count: (p, m) => `${m} mnemonics across ${p} pages.`,
    },
    es: {
        encodings: 'Codificaciones',
        cost: 'Coste medido',
        flags: 'Banderas nombradas',
        exceptions: 'Excepciones',
        sources: 'Fuentes',
        manual: 'Esta instruccion en el manual de Intel',
        timings: 'Latencia y throughput por microarquitectura',
        loading: 'Cargando las mediciones de arch-data...',
        encodingsAt: 'Opcodes y codificacion de operandos, en arch-data',
        opcode: 'Opcode',
        syntax: 'Instruccion',
        operands: 'Op/En',
        long: '64 bits',
        legacy: 'Compat/Legacy',
        note: 'Descripcion',
        operandEncoding: 'Codificacion de operandos',
        operandIntro:
            'Cada modo es un valor de la columna <code>Op/En</code> de arriba. '+
            'Dice en que campo de la instruccion codificada va cada operando, '+
            'en el orden en que se escriben, y si la instruccion lo lee, lo '+
            'escribe o ambas cosas.',
        legacyOnly:
            'Esta instruccion solo existe en los modos de 16 y 32 bits, asi ' +
            'que no esta en la base de mediciones del proyecto. Las ' +
            'codificaciones salen del manual de Intel.',
        notMeasured: 'Sin medir: no se ejecuta en procesadores de 64 bits.',
        prefix:
            'Esto es un prefijo, no una instruccion: modifica a la ' +
            'instruccion siguiente y no tiene codificacion propia.',
        leaf:
            'Esto es una funcion hoja, no una instruccion: se invoca a traves ' +
            'de otra instruccion con un numero de hoja en un registro.',
        modes: {
            real: 'Modo real',
            protected: 'Modo protegido',
            virtual8086: 'Modo virtual-8086',
            compat: 'Modo de compatibilidad',
            long: 'Modo de 64 bits',
        },
        index: 'Todas las instrucciones x86',
        filterBy: 'Solo las instrucciones medidas en:',
        viewList: 'Lista alfabetica', viewMap: 'Mapas de opcodes',
        allArches: 'cualquier microarquitectura',
        count: (p, m) => `${m} mnemonicos en ${p} paginas.`,
    },
    zh: {
        encodings: '编码',
        cost: '实测开销',
        flags: '涉及的标志位',
        exceptions: '异常',
        sources: '来源',
        manual: '本指令在 Intel 手册中的位置',
        timings: '各微架构的延迟与吞吐',
        loading: '正在从 arch-data 加载实测数据...',
        encodingsAt: '操作码与操作数编码，见 arch-data',
        opcode: '操作码',
        syntax: '指令',
        operands: 'Op/En',
        long: '64 位',
        legacy: '兼容/传统',
        note: '说明',
        operandEncoding: '操作数编码',
        operandIntro:
            '每个模式对应上表 <code>Op/En</code> 列的一个取值，说明各操作数按书写顺序'+
            '分别编码在指令的哪个字段，以及指令对它是读、是写还是两者兼有。',
        legacyOnly:
            '本指令只存在于 16 位和 32 位模式，因此不在本项目的实测数据库中。' +
            '下面的编码来自 Intel 手册。',
        notMeasured: '未实测：不在 64 位处理器上运行。',
        prefix: '这是前缀而非指令：它修饰其后的指令，本身没有编码。',
        leaf: '这是叶函数而非指令：通过另一条指令并在寄存器中给出叶编号来调用。',
        modes: {
            real: '实地址模式',
            protected: '保护模式',
            virtual8086: '虚拟 8086 模式',
            compat: '兼容模式',
            long: '64 位模式',
        },
        index: '全部 x86 指令',
        filterBy: '只显示以下微架构实测过的指令：',
        viewList: '字母列表', viewMap: '操作码映射表',
        allArches: '所有微架构',
        count: (p, m) => `${p} 个页面，共 ${m} 个助记符。`,
    },
};

/** Tabla de latencias del proyecto, en un repositorio aparte. */
const ARCH_DATA = 'https://vesta-lang.github.io/arch-data/';

/** Idioma de los ficheros importados, y respaldo cuando falta traduccion. */
const FALLBACK = 'en';

/**
 * Mnemonicos que el manual documenta pero que no son instrucciones.
 *
 * Son prefijos: modifican a la instruccion siguiente y no se codifican por su
 * cuenta. `arch-data` no los tiene como forma independiente, y con razon, asi
 * que preguntarle por ellos devolveria vacio y la pagina mostraria un hueco
 * donde deberia decir lo que son.
 */
const PREFIXES = new Set([
    'LOCK', 'REP', 'REPE', 'REPZ', 'REPNE', 'REPNZ',
    'XACQUIRE', 'XRELEASE', 'BND',
]);

/**
 * Clasifica una entrada segun lo que documenta.
 *
 * Un prefijo no tiene forma propia, y una hoja como `ENCLS[EADD]` es un valor
 * de registro con el que se invoca a `ENCLS`, no una instruccion distinta.
 * Preguntar a `arch-data` por cualquiera de las dos devuelve vacio, y un vacio
 * sin explicar parece un fallo del sitio.
 *
 * @param {Object} entry Entrada cargada.
 * @returns {string} `prefix`, `leaf` o `instruction`.
 */
function classify(entry) {
    const first = entry.mnemonics[0] || '';
    if (first.includes('[')) return 'leaf';
    if (entry.mnemonics.length > 0 && entry.mnemonics.every((m) => PREFIXES.has(m))) {
        return 'prefix';
    }
    return 'instruction';
}

/**
 * Carga las instrucciones de un juego desde disco.
 *
 * @param {string} dir Directorio del juego, con un subdirectorio por entrada.
 * @returns {Array<Object>} Entradas ordenadas por mnemonico.
 */
export function loadInstructions(dir) {
    if (!existsSync(dir)) return [];

    const out = [];
    for (const name of readdirSync(dir)) {
        const folder = join(dir, name);
        const dataPath = join(folder, 'data.json');
        if (!statSync(folder).isDirectory() || !existsSync(dataPath)) continue;

        const entry = JSON.parse(readFileSync(dataPath, 'utf8'));

        if (entry.format !== 'isadoc') {
            throw new Error(
                `${name}/data.json: no es un fichero isadoc. Vuelve a ` +
                    'importar: python tools/import_sdm.py'
            );
        }

        // El identificador lleva dos puntos cuando una pagina documenta varias
        // instrucciones (`bndcu:bndcn`); el directorio los sustituye por dos
        // guiones bajos y la URL por uno. Se guarda aparte para no confundir
        // el identificador del formato con el segmento de ruta.
        entry.path = entry.id.replace(/:/g, '-');

        // Un documento por idioma. El que falte, falta: la pagina cae al de la
        // fuente en lugar de no publicarse.
        entry.docs = {};
        for (const file of readdirSync(folder)) {
            const match = file.match(/^([a-z]{2})\.md$/);
            if (!match) continue;
            const raw = readFileSync(join(folder, file), 'utf8');
            const { meta, body } = parseFrontMatter(raw);
            entry.docs[match[1]] = { meta, body };
        }

        out.push(entry);
    }

    return out.sort((a, b) =>
        (a.mnemonics[0] || a.path).localeCompare(b.mnemonics[0] || b.path)
    );
}

/**
 * Devuelve el documento del idioma pedido, o el de la fuente.
 *
 * @param {Object} entry Entrada.
 * @param {string} lang Idioma.
 * @returns {{meta: Object, body: string}|null}
 */
function documentFor(entry, lang) {
    return entry.docs[lang] || entry.docs[FALLBACK] || null;
}

/**
 * Memorias de traduccion cargadas, por idioma.
 *
 * No todo el texto de una instruccion esta en su Markdown: la condicion de
 * cada excepcion y la descripcion de cada forma son campos de `data.json`,
 * porque son consultables. Al pintarlos desde los datos se quedaban en
 * ingles dentro de una pagina traducida.
 *
 * Se lee la MISMA memoria que genera los `<idioma>.md`, no una copia: una
 * traduccion corregida a mano tiene que verse en los dos sitios, y dos
 * ficheros con el mismo contenido se desincronizan el dia que alguien toca
 * uno solo.
 */
const memories = new Map();

/**
 * Carga las memorias de traduccion de la referencia.
 *
 * @param {string} dir Directorio que contiene los ficheros de memoria.
 */
export function loadTranslations(dir) {
    memories.clear();
    if (!existsSync(dir)) return;

    for (const file of readdirSync(dir)) {
        const match = file.match(/^x86\.(tm|fix)\.([a-z]{2})\.json$/);
        if (!match) continue;

        const lang = match[2];
        const entries = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        const current = memories.get(lang) || new Map();
        for (const [key, value] of Object.entries(entries)) {
            // Las correcciones a mano mandan sobre la memoria de maquina, sea
            // cual sea el orden en que se lean los ficheros.
            if (match[1] === 'fix' || !current.has(key)) current.set(key, value);
        }
        memories.set(lang, current);
    }
}

/**
 * Traduce una cadena suelta de los datos, si hay traduccion.
 *
 * La clave se normaliza colapsando los espacios, igual que en el lado que
 * escribe la memoria: el volcado del PDF los reparte de cualquier manera y la
 * misma frase llega con uno o con tres.
 *
 * @param {string} text Texto en el idioma de origen.
 * @param {string} lang Idioma pedido.
 * @returns {string} El texto traducido, o el original.
 */
function say(text, lang) {
    if (!text || lang === FALLBACK) return text;
    const found = memories.get(lang)?.get(text.split(/\s+/).join(' ').trim());
    return found || text;
}

/**
 * Envuelve una tabla para que se desplace dentro de si misma.
 *
 * @param {string} head Fila de encabezados.
 * @param {string} body Filas.
 * @returns {string} HTML.
 */
function table(head, body, className) {
    const mark = className ? ` class="${className}"` : '';
    return (
        `<div class="table-scroll"><table${mark}>` +
        `<thead><tr>${head}</tr></thead><tbody>${body}</tbody>` +
        '</table></div>'
    );
}

/**
 * Que es cada bandera de EFLAGS, por idioma.
 *
 * La pagina listaba `CF PF AF ZF SF OF` sin mas. Los seis nombres no dicen
 * nada a quien no se los sabe ya, y el que llega buscando si puede saltar
 * segun el resultado de una instruccion necesita justamente eso. Que le hace
 * ESTA instruccion a cada una lo cuenta la seccion `Flags affected` del
 * manual, que va mas abajo en la propia pagina.
 */
const FLAG_NAMES = {
    en: {
        CF: 'Carry', PF: 'Parity', AF: 'Auxiliary carry', ZF: 'Zero',
        SF: 'Sign', OF: 'Overflow', DF: 'Direction', IF: 'Interrupt enable',
        TF: 'Trap', NT: 'Nested task', RF: 'Resume', VM: 'Virtual-8086',
        AC: 'Alignment check', ID: 'CPUID available',
    },
    es: {
        CF: 'Acarreo', PF: 'Paridad', AF: 'Acarreo auxiliar', ZF: 'Cero',
        SF: 'Signo', OF: 'Desbordamiento', DF: 'Direccion',
        IF: 'Interrupciones', TF: 'Traza', NT: 'Tarea anidada',
        RF: 'Reanudacion', VM: 'Virtual-8086', AC: 'Comprobacion de alineacion',
        ID: 'CPUID disponible',
    },
    zh: {
        CF: '进位', PF: '奇偶', AF: '辅助进位', ZF: '零', SF: '符号',
        OF: '溢出', DF: '方向', IF: '中断允许', TF: '单步', NT: '嵌套任务',
        RF: '恢复', VM: '虚拟 8086', AC: '对齐检查', ID: 'CPUID 可用',
    },
};

/**
 * Que es cada campo donde puede ir un operando, por idioma.
 *
 * Sin esto la seccion de codificacion de operandos no sirve para lo que
 * existe: `modrm.reg` no le dice a nadie donde escribir el registro, y montar
 * la instruccion a mano era imposible con esa lista. Aqui se dice en que byte
 * y en que bits vive cada campo.
 */
const FIELD_NAMES = {
    en: {
        'modrm.reg': 'ModRM byte, reg field (bits 5-3)',
        'modrm.rm': 'ModRM byte, r/m field (bits 2-0); with the SIB byte and ' +
            'the displacement when the mod field asks for them',
        'vex.vvvv': 'VEX prefix, vvvv field (inverted)',
        'evex.vvvv': 'EVEX prefix, vvvv field (inverted)',
        'opcode.reg': 'low three bits of the opcode byte itself',
        imm8: 'immediate byte after the instruction',
        'imm8.high': 'high nibble of the immediate byte',
        'imm8/16/32': 'immediate after the instruction, as wide as the operand',
        'imm8/16/32/64': 'immediate after the instruction, as wide as the operand',
        moffs: 'absolute address that follows the opcode',
        offset: 'displacement that follows the opcode',
    },
    es: {
        'modrm.reg': 'byte ModRM, campo reg (bits 5-3)',
        'modrm.rm': 'byte ModRM, campo r/m (bits 2-0); con el byte SIB y el ' +
            'desplazamiento cuando el campo mod los pide',
        'vex.vvvv': 'prefijo VEX, campo vvvv (invertido)',
        'evex.vvvv': 'prefijo EVEX, campo vvvv (invertido)',
        'opcode.reg': 'los tres bits bajos del propio byte de opcode',
        imm8: 'byte inmediato que sigue a la instruccion',
        'imm8.high': 'nibble alto del byte inmediato',
        'imm8/16/32': 'inmediato que sigue a la instruccion, del ancho del operando',
        'imm8/16/32/64': 'inmediato que sigue a la instruccion, del ancho del operando',
        moffs: 'direccion absoluta que sigue al opcode',
        offset: 'desplazamiento que sigue al opcode',
    },
    zh: {
        'modrm.reg': 'ModRM 字节的 reg 字段（第 5-3 位）',
        'modrm.rm': 'ModRM 字节的 r/m 字段（第 2-0 位）；当 mod 字段要求时，' +
            '还包括 SIB 字节和位移',
        'vex.vvvv': 'VEX 前缀的 vvvv 字段（按位取反）',
        'evex.vvvv': 'EVEX 前缀的 vvvv 字段（按位取反）',
        'opcode.reg': '操作码字节自身的低三位',
        imm8: '指令后的立即数字节',
        'imm8.high': '立即数字节的高四位',
        'imm8/16/32': '指令后的立即数，宽度与操作数相同',
        'imm8/16/32/64': '指令后的立即数，宽度与操作数相同',
        moffs: '操作码后的绝对地址',
        offset: '操作码后的位移',
    },
};

/**
 * Describe un campo de operando, si se sabe que es.
 *
 * Lo que no esta en la tabla se deja como viene: son registros fijos como
 * `AL/AX/EAX/RAX`, que no se codifican en ningun campo porque la propia forma
 * de la instruccion ya los nombra, y explicarlos seria repetir el nombre.
 *
 * @param {string} field Nombre del campo.
 * @param {string} lang Idioma.
 * @returns {string} Descripcion, o cadena vacia.
 */
function fieldName(field, lang) {
    const table = FIELD_NAMES[lang] || FIELD_NAMES.en;
    return table[field] || '';
}

/**
 * Rotulos de los valores de modo, por idioma.
 *
 * El manual los abrevia, y en la columna de dos caracteres del volcado quedan
 * en una letra: `V/V` se lee como `v` y `v`. Publicar esa letra no dice nada a
 * quien consulta la pagina, y es justo el dato que decide si una forma se
 * puede usar en el modo en que esta compilando.
 */
const MODE_VALUES = {
    en: { v: 'Valid', i: 'Invalid', 'n.e.': 'Not encodable', 'n.s.': 'Not supported',
          'n/a': '-', valid: 'Valid', invalid: 'Invalid' },
    es: { v: 'Valido', i: 'No valido', 'n.e.': 'No codificable',
          'n.s.': 'No soportado', 'n/a': '-', valid: 'Valido', invalid: 'No valido' },
    zh: { v: '有效', i: '无效', 'n.e.': '不可编码', 'n.s.': '不支持', 'n/a': '-',
          valid: '有效', invalid: '无效' },
};

/**
 * Traduce el valor de un modo a algo legible.
 *
 * @param {string} value Valor tal como viene del manual.
 * @param {string} lang Idioma.
 * @returns {string} Rotulo, o el valor original si no se reconoce.
 */
function modeLabel(value, lang) {
    if (!value) return '';
    const table = MODE_VALUES[lang] || MODE_VALUES.en;
    return table[value.toLowerCase()] || value;
}

/**
 * Renderiza la tabla de codificaciones guardada en los datos.
 *
 * Solo la tienen las instrucciones que `arch-data` no cubre.
 *
 * @param {Array<Object>} encodings Codificaciones.
 * @param {Object} t Textos del idioma.
 * @returns {string} HTML.
 */
/**
 * Reduce la sintaxis del manual a un patron de operandos comparable.
 *
 * Es la mitad del emparejamiento con `arch-data`: alli una forma se identifica
 * por sus operandos concretos (`ADD (M16, R16)`), y aqui el manual escribe la
 * familia (`ADD r/m16, r16`). El patron conserva lo que decide la
 * correspondencia -- que puede ir en cada sitio y de que ancho -- y descarta el
 * mnemonico, que ya lo da la pagina.
 *
 * @param {string} syntax Sintaxis tal como la publica el manual.
 * @returns {string} Patron separado por comas, o cadena vacia.
 */
function operandPattern(syntax) {
    const text = (syntax || '').trim();
    const space = text.indexOf(' ');
    if (space < 0) return '';

    return text
        .slice(space + 1)
        .split(',')
        .map((piece) => piece.trim().replace(/[<>]/g, '').toLowerCase())
        .filter(Boolean)
        .join(',');
}

function encodingsTable(encodings, t, lang) {
    const head = [t.opcode, t.syntax, t.operands, t.long, t.legacy, t.note]
        .map((h) => `<th>${h}</th>`)
        .join('');

    const rows = encodings
        .map((e, index) => {
            // Los bytes del opcode y el patron de operandos viajan en la fila
            // para que el script pueda emparejarla con las formas medidas sin
            // volver a interpretar la notacion en el navegador.
            const bytes = (e.layout?.opcode || []).join('');
            const pattern = operandPattern(e.syntax);
            const keys = bytes && pattern
                ? ` data-op="${escapeHtml(bytes)}" data-ops="${escapeHtml(pattern)}"`
                : '';

            return (
                `<tr id="form-${index}"${keys}>` +
                `<td><code>${escapeHtml(e.opcode || '')}</code></td>` +
                `<td><code>${escapeHtml(e.syntax || '')}</code></td>` +
                `<td>${escapeHtml(e.operands || '')}</td>` +
                `<td>${escapeHtml(modeLabel(e.modes?.long, lang))}</td>` +
                `<td>${escapeHtml(modeLabel(e.modes?.legacy, lang))}</td>` +
                `<td>${escapeHtml(say(e.note || '', lang))}</td>` +
                '</tr>'
            );
        })
        .join('');

    return table(head, rows, 'isa-encodings');
}

/**
 * Renderiza la codificacion de operandos como tarjetas, no como tabla.
 *
 * El manual la publica en cinco columnas donde tres suelen decir `N/A`: ancho
 * gastado en huecos. Cada modo tiene entre uno y cuatro operandos y se lee
 * mejor como una definicion por modo.
 *
 * @param {Array<Object>} rows Modos de codificacion.
 * @returns {string} HTML.
 */
function operandAccess(operand) {
    if (operand.read && operand.write) return 'lectura y escritura';
    if (operand.write) return 'escritura';
    if (operand.read) return 'lectura';
    return '';
}

function operandCards(rows, lang) {
    const items = rows
        .map((r) => {
            const ops = (r.operands || [])
                .map((o) => {
                    // El campo es lo que hace falta para ensamblar: dice en
                    // que parte de la instruccion se escribe este operando.
                    // La posicion la pone la lista, no un numero escrito a
                    // mano: con los dos salia "1. 1".
                    const field = escapeHtml(o.field || '');
                    const access = operandAccess(o);
                    const what = fieldName(o.field || '', lang);
                    return (
                        `<li><code>${field}</code>` +
                        (access ? ` <em>${access}</em>` : '') +
                        (what ? `<span class="isa-field">${escapeHtml(what)}</span>` : '') +
                        '</li>'
                    );
                })
                .join('');
            const tuple = r.tuple_type
                ? `<p class="isa-tuple">Tupla: ${escapeHtml(r.tuple_type)}</p>`
                : '';
            return (
                '<div class="isa-openc">' +
                `<h3>${escapeHtml(r.id)}</h3>` +
                (ops ? `<ol>${ops}</ol>` : '') +
                tuple +
                '</div>'
            );
        })
        .join('');

    return `<div class="isa-openc-grid">${items}</div>`;
}

/**
 * Renderiza las excepciones, agrupadas por modo y plegadas.
 *
 * Son cinco listas y juntas son mas largas que el resto de la pagina. Plegadas
 * siguen estando y dejan de empujar todo lo demas fuera de la vista.
 *
 * @param {Array<Object>} exceptions Excepciones estructuradas.
 * @param {Object} t Textos del idioma.
 * @param {string} lang Idioma, para traducir la condicion.
 * @returns {string} HTML.
 */
function exceptionsList(exceptions, t, lang) {
    const byMode = new Map();
    for (const exc of exceptions) {
        if (!byMode.has(exc.mode)) byMode.set(exc.mode, []);
        byMode.get(exc.mode).push(exc);
    }

    return [...byMode]
        .map(([mode, list]) => {
            const rows = list
                .map((e) => {
                    const vector = e.vector
                        ? `<code>${escapeHtml(e.vector)}</code>`
                        : '';
                    return (
                        `<tr><td>${vector}</td>` +
                        `<td>${escapeHtml(say(e.when, lang))}</td></tr>`
                    );
                })
                .join('');
            return (
                '<details class="isa-exc">' +
                `<summary>${escapeHtml(t.modes[mode] || mode)}</summary>` +
                `<div class="table-scroll"><table><tbody>${rows}</tbody></table></div>` +
                '</details>'
            );
        })
        .join('');
}

/**
 * Renderiza la pagina de una instruccion.
 *
 * @param {Object} entry Entrada cargada.
 * @param {string} lang Idioma.
 * @returns {{title: string, description: string, html: string}}
 */
export function renderInstruction(entry, lang) {
    const t = UI[lang] || UI.en;
    const name = entry.mnemonics.join(', ') || entry.path.toUpperCase();
    const doc = documentFor(entry, lang);
    const summary = doc?.meta?.summary || '';

    const parts = [
        `<h1 id="${entry.path}">${escapeHtml(name)}</h1>`,
        summary ? `<p class="isa-summary">${escapeHtml(summary)}</p>` : '',
        // Las etiquetas salen del vocabulario, no se pintan aqui. Los tres
        // modos porque un bloque de `asm` se ensambla a codigo nativo y corre
        // igual en interprete, JIT y compilacion nativa.
        renderTags(['stable', 'vm', 'jit', 'aot', 'instruction'], lang),
    ].filter(Boolean);

    const kind = classify(entry);
    const keys = (entry.links?.arch_data || []).join(',');

    if (kind === 'instruction') {
        // La codificacion se pinta SIEMPRE desde los datos propios, esten o no
        // en arch-data. El reparto era al reves cuando esta pagina se escribio,
        // y ya no tiene sentido: arch-data no publica notacion de codificacion
        // -- ni un solo `/r` en sus 22252 formas -- y el manual da los bytes,
        // el ModRM, el prefijo vectorial y el bit de CPUID que hay que mirar.
        // Delegar en el bloque remoto dejaba la seccion en un enlace.
        parts.push(`<h2 id="encodings">${t.encodings}</h2>`);
        if (entry.encodings?.length) {
            parts.push(encodingsTable(entry.encodings, t, lang));
        } else if (keys.length > 0) {
            // Sin formas propias queda el enlace, que es lo que habria de
            // todos modos. Va DENTRO del contenedor porque es lo que se ve sin
            // JavaScript.
            parts.push(
                `<div class="isa-remote" data-isa="${escapeHtml(keys)}" ` +
                    'data-isa-kind="forms">' +
                    `<p><a href="${ARCH_DATA}" rel="noopener">${t.encodingsAt}</a></p>` +
                    '</div>'
            );
        } else {
            parts.push(`<p class="isa-note">${t.legacyOnly}</p>`);
        }

        if (entry.operand_encodings?.length) {
            parts.push(`<h2 id="operand-encoding">${t.operandEncoding}</h2>`);
            parts.push(`<p class="isa-lead">${t.operandIntro}</p>`);
            parts.push(operandCards(entry.operand_encodings, lang));
        }

        // El coste si es de arch-data y solo de ahi: la latencia y el
        // throughput dependen de la microarquitectura, y el manual no los da.
        //
        // La tabla la trae el navegador al entrar, no un boton: el coste es
        // parte de lo que se viene a consultar, y no se copia aqui porque una
        // copia envejece en cuanto se corrige la original. El enlace queda
        // dentro de `noscript`, que es donde sirve de algo.
        parts.push(`<h2 id="cost">${t.cost}</h2>`);
        if (keys.length > 0) {
            parts.push(
                `<div class="isa-remote" data-isa="${escapeHtml(keys)}" ` +
                    'data-isa-kind="cost">' +
                    // Algo visible desde el HTML servido, que el script
                    // sustituye por la tabla. Dejar el contenedor vacio hacia
                    // que la seccion apareciera en blanco cuando el script no
                    // llegaba a ejecutarse, y una seccion en blanco no dice si
                    // falta el dato o falla la pagina.
                    `<p class="isa-loading">${t.loading}</p>` +
                    `<noscript><a href="${ARCH_DATA}" rel="noopener">${t.timings}</a>` +
                    '</noscript>' +
                    '</div>'
            );
        } else {
            parts.push(`<p class="isa-note">${t.notMeasured}</p>`);
        }
    } else {
        parts.push(`<p class="isa-note">${t[kind]}</p>`);
    }

    if (entry.flags?.length) {
        parts.push(`<h2 id="flags">${t.flags}</h2>`);
        parts.push(
            '<ul class="isa-flag-row">' +
                entry.flags
                    .map((f) => {
                        // El nombre, no solo la sigla: la seccion `Flags
                        // affected` de mas abajo cuenta que le hace ESTA
                        // instruccion a cada una, pero primero hay que saber
                        // cual es cual.
                        const named = (FLAG_NAMES[lang] || FLAG_NAMES.en)[f];
                        return (
                            `<li><code>${escapeHtml(f)}</code>` +
                            (named ? ` <span>${escapeHtml(named)}</span>` : '') +
                            '</li>'
                        );
                    })
                    .join('') +
                '</ul>'
        );
    }

    // El documento se convierte con el mismo Markdown que el resto del sitio,
    // de modo que admite lo mismo: HTML en linea, bloques de codigo con
    // resaltado y los marcadores de diagrama.
    if (doc?.body) {
        parts.push(render(doc.body, { highlight }));
    }

    if (entry.exceptions?.length) {
        parts.push(`<h2 id="exceptions">${t.exceptions}</h2>`);
        parts.push(exceptionsList(entry.exceptions, t, lang));
    }

    parts.push(`<h2 id="sources">${t.sources}</h2>`);
    const links = (entry.sources || [])
        .map((s) => `<li><a href="${s.url}" rel="noopener">${t.manual}</a></li>`)
        .concat(
            keys.length > 0
                ? [`<li><a href="${ARCH_DATA}" rel="noopener">${t.timings}</a></li>`]
                : []
        );
    parts.push(`<ul>${links.join('')}</ul>`);

    return {
        title: `${name} - ${summary}`,
        description: `${name}: ${summary}`,
        html: parts.join('\n'),
    };
}

/**
 * Renderiza el indice de un juego de instrucciones.
 *
 * Ochocientas paginas no caben en una barra lateral, asi que el indice es la
 * via de entrada: agrupado por inicial, con el resumen de cada mnemonico al
 * lado para poder elegir sin abrir.
 *
 * @param {Array<Object>} entries Entradas cargadas.
 * @param {string} lang Idioma.
 * @param {Function} hrefFor Constructor de la ruta de una instruccion.
 * @returns {string} HTML del indice.
 */
export function renderInstructionIndex(entries, lang, hrefFor, map) {
    const t = UI[lang] || UI.en;

    const groups = new Map();
    let mnemonics = 0;
    for (const entry of entries) {
        mnemonics += entry.mnemonics.length || 1;
        const letter = (entry.mnemonics[0] || entry.path)[0].toUpperCase();
        if (!groups.has(letter)) groups.set(letter, []);
        groups.get(letter).push(entry);
    }

    const letters = [...groups.keys()].sort();
    const jump = letters.map((l) => `<a href="#letter-${l}">${l}</a>`).join('');

    const sections = letters.map((letter) => {
        const items = groups
            .get(letter)
            .map((entry) => {
                const name = entry.mnemonics.join(', ') || entry.path.toUpperCase();
                const summary = documentFor(entry, lang)?.meta?.summary || '';
                // Los mnemonicos viajan en la entrada para que el filtro por
                // microarquitectura los cruce con la base sin tener que
                // deducirlos del texto del enlace.
                return (
                    `<li data-mnemonics="${escapeHtml(entry.mnemonics.join(','))}">` +
                    `<a href="${hrefFor(entry.path, lang)}">` +
                    `<code>${escapeHtml(name)}</code></a>` +
                    ` <span>${escapeHtml(summary)}</span></li>`
                );
            })
            .join('');
        return (
            `<h2 id="letter-${letter}">${letter}</h2>` +
            `<ul class="isa-index">${items}</ul>`
        );
    });

    // El filtro lo rellena el script con las microarquitecturas de la base:
    // cuales hay, y que instrucciones mide cada una, solo lo sabe `arch-data`.
    // Llega oculto y se muestra cuando la base responde, para no ofrecer un
    // desplegable vacio a quien no tenga JavaScript o no pueda alcanzarla.
    const filter =
        '<div class="isa-filter" data-isa-kind="filter" hidden>' +
        `<label for="isa-arch">${t.filterBy}</label>` +
        '<select id="isa-arch"></select>' +
        '<span class="isa-filter-count"></span>' +
        '</div>';

    // Las dos vistas van en la MISMA pagina y se cambian con un conmutador.
    // Son la misma informacion mirada al reves -- por nombre y por byte -- y
    // separarlas en dos paginas obliga a navegar para comparar.
    //
    // El conmutador son dos botones de radio y una regla de CSS: funciona sin
    // JavaScript, y las dos vistas viajan en el HTML servido, de modo que el
    // buscador indexa las dos.
    const views =
        '<div class="isa-views">' +
        '<input type="radio" id="view-list" name="isa-view" class="view-toggle" checked>' +
        '<input type="radio" id="view-map" name="isa-view" class="view-toggle">' +
        '<p class="view-switch">' +
        `<label for="view-list">${t.viewList}</label>` +
        `<label for="view-map">${t.viewMap}</label>` +
        '</p>' +
        filter +
        '<div class="isa-view isa-view-list">' +
        `<nav class="isa-jump" aria-label="${t.index}">${jump}</nav>` +
        sections.join('\n') +
        '</div>' +
        `<div class="isa-view isa-view-map">${map || ''}</div>` +
        '</div>';

    return `<p>${t.count(entries.length, mnemonics)}</p>` + views;
}
