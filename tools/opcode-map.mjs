/**
 * @file tools/opcode-map.mjs
 * @brief Construye los mapas de opcodes de x86 a partir de lo importado.
 *
 * Lleva rotulos de interfaz en castellano y en chino, que son ortografia de su
 * idioma y no decoracion:  lint-script: es, zh
 *
 * ## Que es un mapa de opcodes
 *
 * La lista alfabetica responde "que hace esta instruccion". El mapa responde la
 * pregunta contraria, que es la que se hace quien lee bytes: "que instruccion
 * es el byte 0x8B". Son dos formas de mirar lo mismo y ninguna sustituye a la
 * otra.
 *
 * ## Por que son varios mapas y no uno
 *
 * Un byte no identifica una instruccion por si solo. x86 usa **espacios de
 * opcode**: el byte `0F` no es una instruccion, es una fuga que abre otro mapa
 * entero de 256 posiciones, y `0F 38` y `0F 3A` abren dos mas. Los prefijos
 * vectoriales (VEX, EVEX, XOP) declaran su espacio como un campo, de modo que
 * `VEX.128.0F 58` cae en el mismo mapa `0F` que el `0F 58` heredado.
 *
 * Dentro de una casilla puede haber varias instrucciones, y lo que las
 * distingue tambien se publica, porque sin eso el mapa no sirve para decodificar:
 *
 * - El **prefijo obligatorio** (`66`, `F2`, `F3`, o ninguno). `0F 58` es
 *   `ADDPS`; con `66` delante es `ADDPD`; con `F3`, `ADDSS`.
 * - El **campo `reg` del ModRM** cuando el opcode se extiende con el (`/0` a
 *   `/7`). Es lo que reparte `80 /0` a `80 /7` entre ocho instrucciones
 *   distintas.
 * - `REX.W` no abre espacio: cambia el tamano de operando de una forma que ya
 *   esta en la casilla, asi que no divide el mapa.
 */

import { escapeHtml } from './markdown.mjs';

/** Textos del mapa, por idioma. */
const UI = {
    en: {
        title: 'x86 opcode maps',
        intro:
            'The alphabetical index answers "what does this instruction do". ' +
            'A map answers the opposite question, the one you have when you ' +
            'are reading bytes: "what is opcode 8B".',
        legacy: 'One-byte opcodes',
        escape: (name) => `Opcodes after ${name}`,
        vector: 'This space is also reached through a VEX, EVEX or XOP prefix.',
        low: 'Low nibble',
        high: 'High',
        empty: 'unused',
        howto:
            'A cell can hold more than one instruction. What tells them apart ' +
            'is shown with it: the mandatory prefix (66, F2, F3) and the ModRM ' +
            'reg field when the opcode extends through it (/0 to /7). REX.W ' +
            'does not split the map: it changes the operand size of a form ' +
            'that is already in the cell.',
        counts: (cells, forms) =>
            `${cells} occupied cells, ${forms} encoding forms.`,
    },
    es: {
        title: 'Mapas de opcodes de x86',
        intro:
            'El indice alfabetico responde "que hace esta instruccion". Un mapa ' +
            'responde la pregunta contraria, la que se tiene delante cuando se ' +
            'leen bytes: "que es el opcode 8B".',
        legacy: 'Opcodes de un byte',
        escape: (name) => `Opcodes despues de ${name}`,
        vector: 'A este espacio se llega tambien con un prefijo VEX, EVEX o XOP.',
        low: 'Nibble bajo',
        high: 'Alto',
        empty: 'sin usar',
        howto:
            'Una casilla puede tener mas de una instruccion. Lo que las ' +
            'distingue se publica con ellas: el prefijo obligatorio (66, F2, ' +
            'F3) y el campo reg del ModRM cuando el opcode se extiende con el ' +
            '(/0 a /7). REX.W no divide el mapa: cambia el tamano de operando ' +
            'de una forma que ya esta en la casilla.',
        counts: (cells, forms) =>
            `${cells} casillas ocupadas, ${forms} formas de codificacion.`,
    },
    zh: {
        title: 'x86 操作码映射表',
        intro:
            '字母索引回答“这条指令做什么”，而映射表回答相反的问题，也就是读字节时' +
            '面对的问题：“操作码 8B 是什么”。',
        legacy: '单字节操作码',
        escape: (name) => `${name} 之后的操作码`,
        vector: '通过 VEX、EVEX 或 XOP 前缀也会进入该空间。',
        low: '低半字节',
        high: '高',
        empty: '未使用',
        howto:
            '一个格子可能有多条指令。区分它们的信息一并给出：强制前缀（66、F2、' +
            'F3），以及操作码通过 ModRM 的 reg 字段扩展时的 /0 到 /7。REX.W 不会' +
            '划分映射表：它只改变格子中已有形式的操作数宽度。',
        counts: (cells, forms) => `${cells} 个已占用格子，共 ${forms} 种编码形式。`,
    },
};

/** Nibbles, para las cabeceras de fila y columna. */
const NIBBLES = ['0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Orden en que se publican los espacios de opcode.
 *
 * El de un byte primero porque es donde empieza cualquier decodificador, y los
 * demas por profundidad de fuga. Un espacio que no aparezca aqui se publica
 * detras, por nombre: la lista no puede quedarse corta en silencio cuando el
 * manual anada un mapa nuevo.
 */
const ORDER = ['', '0F', '0F38', '0F3A'];

/**
 * Devuelve el espacio de opcode y el byte final de una forma.
 *
 * @param {Object} layout Disposicion analizada de la forma.
 * @returns {{space: string, byte: string}|null} `null` si no tiene opcode.
 */
function placeOf(layout) {
    const bytes = layout.opcode || [];
    if (bytes.length === 0) return null;

    // Con prefijo vectorial el espacio lo declara el propio prefijo, y el byte
    // que queda es el ultimo: `VEX.128.0F 58` es la casilla 58 del mapa `0F`.
    if (layout.vector_prefix && layout.vector_prefix.map) {
        // El prefijo escribe el mapa con espacios (`0F 38`) y la ruta heredada
        // sin ellos. Sin normalizar, el mismo espacio salia dos veces en la
        // pagina, una por cada forma de escribirlo.
        return {
            space: layout.vector_prefix.map.replace(/\s+/g, '').toUpperCase(),
            byte: bytes[bytes.length - 1].toUpperCase(),
        };
    }

    const upper = bytes.map((b) => b.toUpperCase());
    if (upper[0] === '0F' && upper.length >= 3 && (upper[1] === '38' || upper[1] === '3A')) {
        return { space: '0F' + upper[1], byte: upper[2] };
    }
    if (upper[0] === '0F' && upper.length >= 2) {
        return { space: '0F', byte: upper[1] };
    }
    return { space: '', byte: upper[0] };
}

/**
 * Devuelve todas las casillas que ocupa una forma.
 *
 * Casi siempre es una, pero `50+rw` no es la casilla `50`: el numero de
 * registro va en los tres bits bajos del propio byte de opcode, asi que
 * `PUSH` ocupa de `50` a `57` -- una por registro -- e `INC` de `40` a `47`.
 * Publicando solo la base, el mapa dejaba siete huecos por cada una de estas
 * instrucciones y parecia que ahi no habia nada codificado.
 *
 * @param {string} base Byte de la forma.
 * @param {Object} layout Disposicion analizada.
 * @returns {Array<string>} Bytes que ocupa, en hexadecimal de dos digitos.
 */
function spanOf(base, layout) {
    if (!layout.opcode_register) return [base];

    const start = parseInt(base, 16);
    if (Number.isNaN(start)) return [base];

    const out = [];
    for (let i = 0; i < 8; i += 1) {
        out.push(((start & 0xf8) + i).toString(16).toUpperCase().padStart(2, '0'));
    }
    return out;
}


/**
 * Devuelve lo que distingue a una forma dentro de su casilla.
 *
 * @param {Object} form Forma de codificacion.
 * @returns {string} Marca corta, o cadena vacia.
 */
function markOf(form) {
    const layout = form.layout || {};
    const marks = [];

    for (const prefix of layout.prefixes || []) {
        // `NP` significa "sin prefijo", que es la ausencia de marca.
        if (prefix.toUpperCase() !== 'NP') marks.push(prefix.toUpperCase());
    }
    if (layout.vector_prefix && layout.vector_prefix.type) {
        marks.push(layout.vector_prefix.type);
    }
    if (layout.modrm && layout.modrm.kind === 'digit') {
        marks.push('/' + layout.modrm.value);
    }

    return marks.join(' ');
}

/**
 * Construye los mapas de opcode de un juego de instrucciones.
 *
 * @param {Array<Object>} entries Instrucciones cargadas.
 * @returns {Map<string, Map<string, Array<Object>>>} Espacio -> byte -> formas.
 */
export function buildMaps(entries) {
    const maps = new Map();

    for (const entry of entries) {
        const name = entry.mnemonics[0] || entry.path.toUpperCase();
        for (const form of entry.encodings || []) {
            const place = placeOf(form.layout || {});
            if (!place) continue;

            if (!maps.has(place.space)) maps.set(place.space, new Map());
            const space = maps.get(place.space);
            const mark = markOf(form);

            for (const byte of spanOf(place.byte, form.layout || {})) {
                if (!space.has(byte)) space.set(byte, []);
                const cell = space.get(byte);
                // Una instruccion con doce formas en la misma casilla se
                // publica una vez por marca distinta: repetirla doce veces no
                // anade nada y deja la casilla ilegible.
                if (!cell.some((c) => c.name === name && c.mark === mark)) {
                    cell.push({ name, path: entry.path, mark });
                }
            }
        }
    }

    return maps;
}

/**
 * Renderiza una casilla del mapa.
 *
 * @param {Array<Object>} cell Formas de la casilla.
 * @param {string} lang Idioma.
 * @param {Function} hrefFor Constructor del enlace de una instruccion.
 * @returns {string} HTML.
 */
function renderCell(cell, lang, hrefFor) {
    if (!cell || cell.length === 0) return '<td class="is-empty"></td>';

    // El mnemonico viaja en el enlace para que el script pueda colorearlo por
    // la categoria que le da `arch-data`. El color no se decide aqui: se
    // decide con un dato de la base, y sin ella el mapa se queda monocromo
    // pero legible.
    const items = cell
        .map((c) =>
            `<span class="op-entry" data-mnemonic="${escapeHtml(c.name)}">` +
            `<a href="${hrefFor(c.path, lang)}" data-mnemonic="${escapeHtml(c.name)}">` +
            `${escapeHtml(c.name)}</a>` +
            (c.mark ? ` <span class="op-mark">${escapeHtml(c.mark)}</span>` : '') +
            '</span>'
        )
        .join('');

    return `<td>${items}</td>`;
}

/**
 * Renderiza un espacio de opcode como tabla de 16 por 16.
 *
 * Las filas son el nibble alto y las columnas el bajo, que es como se publica
 * cualquier mapa de opcodes desde el 8051: quien ya ha leido uno encuentra el
 * byte sin tener que aprenderse esta tabla en concreto.
 *
 * @param {string} space Nombre del espacio.
 * @param {Map<string, Array<Object>>} cells Casillas del espacio.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 * @param {Function} hrefFor Constructor del enlace de una instruccion.
 * @returns {string} HTML.
 */
function renderSpace(space, cells, t, lang, hrefFor) {
    const head = ['<th class="op-corner">' + t.high + '</th>']
        .concat(NIBBLES.map((n) => `<th>${n}</th>`))
        .join('');

    const rows = NIBBLES.map((high) => {
        const columns = NIBBLES.map((low) =>
            renderCell(cells.get(high + low), lang, hrefFor)).join('');
        return `<tr><th>${high}</th>${columns}</tr>`;
    }).join('');

    const forms = [...cells.values()].reduce((n, c) => n + c.length, 0);
    // El nombre del espacio se separa en bytes solo si ES una fuga de bytes:
    // `0F38` se lee `0F 38`, pero `MAP5` es un nombre y partirlo daba `MA P5`.
    const label = /^[0-9A-F]+$/.test(space)
        ? space.replace(/(..)/g, '$1 ').trim()
        : space;
    const title = space === '' ? t.legacy : t.escape(label);

    return (
        `<h2 id="map-${space || 'one-byte'}">${escapeHtml(title)}</h2>` +
        `<p class="isa-note">${escapeHtml(t.counts(cells.size, forms))}</p>` +
        '<div class="table-scroll"><table class="op-map">' +
        `<thead><tr>${head}</tr></thead><tbody>${rows}</tbody>` +
        '</table></div>'
    );
}

/**
 * Renderiza la pagina completa de mapas de opcode.
 *
 * @param {Array<Object>} entries Instrucciones cargadas.
 * @param {string} lang Idioma.
 * @param {Function} hrefFor Constructor del enlace de una instruccion.
 * @returns {string} HTML del cuerpo del mapa.
 */
export function renderOpcodeMap(entries, lang, hrefFor) {
    const t = UI[lang] || UI.en;
    const maps = buildMaps(entries);

    const spaces = [...maps.keys()].sort((a, b) => {
        const ia = ORDER.indexOf(a);
        const ib = ORDER.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    const body = spaces
        .map((space) => renderSpace(space, maps.get(space), t, lang, hrefFor))
        .join('\n');

    // Devuelve solo el cuerpo: el mapa no es una pagina aparte sino la otra
    // vista del mismo indice, y quien lo llama ya ha puesto el titulo.
    return (
        `<p>${escapeHtml(t.intro)}</p>` +
        `<p class="isa-note">${escapeHtml(t.howto)}</p>` +
        '<div class="op-legend" data-isa-kind="legend" hidden></div>' +
        body
    );
}
