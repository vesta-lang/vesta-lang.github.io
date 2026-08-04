/**
 * @file tools/diagram.mjs
 * @brief Diagramas informativos del sitio, como SVG en linea.
 *
 * Se generan aqui, y no como imagen, por tres motivos. Un SVG en linea hereda
 * los colores del tema, asi que funciona igual en claro y en oscuro sin
 * duplicar ficheros. Su texto es texto de verdad: se puede seleccionar, buscar
 * y leer con un lector de pantalla. Y no anade una peticion mas ni depende de
 * ninguna herramienta externa.
 *
 * La GEOMETRIA se escribe una sola vez y las ETIQUETAS se pasan por idioma. Con
 * dos copias del SVG, una en cada idioma, la primera correccion de una caja
 * dejaria las versiones desalineadas sin que nadie lo notara.
 */

import { escapeHtml } from './markdown.mjs';

/**
 * Textos del diagrama del pipeline, por idioma.
 *
 * Los nombres tecnicos (`.vx`, `SSA IR`, `JIT`, `PE`, `ELF`) no se traducen:
 * son identificadores, y traducirlos dificultaria buscarlos.
 */
const PIPELINE_TEXT = {
    es: {
        title: 'Del codigo fuente al programa en ejecucion',
        desc:
            'El fuente .vx pasa por el frontend y se convierte en SSA IR. Desde ' +
            'ese mismo IR salen tres caminos: bytecode .velb que ejecuta la ' +
            'maquina virtual y compila el JIT en caliente, compilacion nativa AOT ' +
            'que produce un ejecutable PE o ELF autonomo, y una traduccion a C99 ' +
            'portable.',
        source: 'codigo fuente',
        frontend: 'Frontend',
        frontendSteps: 'preprocesador, lexico,\nsintaxis, tipos',
        ir: 'SSA IR',
        irNote: 'unos 15 pases\nde optimizacion',
        comptime: 'comptime y CTPE se ejecutan aqui, durante la compilacion',
        bytecode: 'bytecode',
        vm: 'VM',
        vmNote: 'interprete',
        jit: 'JIT',
        jitNote: 'nativo en caliente',
        aot: 'AOT',
        aotNote: 'nativo',
        linker: 'Enlazador',
        linkerNote: 'propio, sin ld',
        exe: 'PE / ELF',
        exeNote: 'autonomo, sin runtime',
        portC: 'C99',
        portCNote: 'fuente portable',
        caption:
            'Un mismo fuente, un mismo IR y tres salidas. El JIT y el compilador ' +
            'nativo comparten optimizador y asignador de registros.',
    },
    en: {
        title: 'From source code to a running program',
        desc:
            'A .vx source goes through the frontend and becomes SSA IR. Three ' +
            'paths leave that same IR: .velb bytecode run by the virtual machine ' +
            'and compiled by the JIT once hot, native AOT compilation producing a ' +
            'standalone PE or ELF executable, and a translation to portable C99.',
        source: 'source code',
        frontend: 'Frontend',
        frontendSteps: 'preprocessor, lexing,\nparsing, types',
        ir: 'SSA IR',
        irNote: 'around 15\noptimization passes',
        comptime: 'comptime and CTPE run here, during compilation',
        bytecode: 'bytecode',
        vm: 'VM',
        vmNote: 'interpreter',
        jit: 'JIT',
        jitNote: 'native when hot',
        aot: 'AOT',
        aotNote: 'native',
        linker: 'Linker',
        linkerNote: 'built in, no ld',
        exe: 'PE / ELF',
        exeNote: 'standalone, no runtime',
        portC: 'C99',
        portCNote: 'portable source',
        caption:
            'One source, one IR, three outputs. The JIT and the native compiler ' +
            'share the optimizer and the register allocator.',
    },
};

/**
 * Dibuja una caja con titulo y, opcionalmente, una nota debajo.
 *
 * @param {Object} box
 * @param {number} box.x Esquina izquierda.
 * @param {number} box.y Esquina superior.
 * @param {number} box.w Ancho.
 * @param {number} box.h Alto.
 * @param {string} box.label Texto principal.
 * @param {string} [box.note] Texto secundario, admite saltos con `\n`.
 * @param {boolean} [box.strong] Resalta la caja (se usa para el IR, que es el
 *        punto donde converge todo).
 * @param {boolean} [box.mono] Muestra el texto principal en monoespaciada,
 *        para los nombres de fichero y de formato.
 * @returns {string} Fragmento SVG.
 */
function boxNode({ x, y, w, h, label, note, strong = false, mono = false }) {
    const cx = x + w / 2;
    // Con nota, el titulo sube para dejarle sitio; sin ella, va centrado.
    const labelY = note ? y + h / 2 - 4 : y + h / 2 + 5;

    const noteLines = (note || '').split('\n');
    const notes = noteLines
        .map(
            (line, i) =>
                `<text class="d-note" x="${cx}" y="${labelY + 17 + i * 13}">` +
                `${escapeHtml(line)}</text>`
        )
        .join('');

    return `
    <g>
      <rect class="d-box${strong ? ' is-strong' : ''}" x="${x}" y="${y}"
            width="${w}" height="${h}" rx="6"/>
      <text class="d-label${mono ? ' is-mono' : ''}" x="${cx}" y="${labelY}">${escapeHtml(label)}</text>
      ${note ? notes : ''}
    </g>`;
}

/**
 * Dibuja una flecha horizontal.
 *
 * @param {number} x1 Origen.
 * @param {number} x2 Destino.
 * @param {number} y Altura.
 * @returns {string} Fragmento SVG.
 */
const arrow = (x1, x2, y) =>
    `<line class="d-arrow" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-end="url(#d-head)"/>`;

/**
 * Dibuja una flecha acodada: sale en horizontal, gira y entra en horizontal.
 *
 * Se usa para las tres ramas que salen del IR. Un trazo recto en diagonal
 * cruzaria las cajas vecinas y complicaria la lectura.
 *
 * @param {number} x1 Origen.
 * @param {number} y1 Altura de salida.
 * @param {number} x2 Destino.
 * @param {number} y2 Altura de entrada.
 * @returns {string} Fragmento SVG.
 */
const elbow = (x1, y1, x2, y2) => {
    const mid = x1 + (x2 - x1) / 2;
    return `<path class="d-arrow" d="M ${x1} ${y1} H ${mid} V ${y2} H ${x2}"
            marker-end="url(#d-head)"/>`;
};

/**
 * Genera el diagrama del pipeline de compilacion.
 *
 * @param {string} lang Codigo de idioma.
 * @returns {string} Figura HTML con el SVG en linea.
 */
export function pipelineDiagram(lang) {
    const t = PIPELINE_TEXT[lang] || PIPELINE_TEXT.en;

    // Alturas de las tres ramas y del eje central.
    const TOP = 62;
    const MID = 196;
    const LOW = 320;

    const svg = `
  <svg class="diagram" viewBox="0 0 960 392" role="img"
       aria-labelledby="pipe-t pipe-d" preserveAspectRatio="xMidYMid meet">
    <title id="pipe-t">${escapeHtml(t.title)}</title>
    <desc id="pipe-d">${escapeHtml(t.desc)}</desc>

    <defs>
      <marker id="d-head" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path class="d-headfill" d="M 0 0 L 10 5 L 0 10 z"/>
      </marker>
    </defs>

    ${boxNode({ x: 8, y: MID - 28, w: 92, h: 56, label: '.vx', note: t.source, mono: true })}
    ${arrow(104, 134, MID)}

    ${boxNode({
        x: 138,
        y: MID - 40,
        w: 168,
        h: 80,
        label: t.frontend,
        note: t.frontendSteps,
    })}
    ${arrow(310, 340, MID)}

    ${boxNode({
        x: 344,
        y: MID - 40,
        w: 140,
        h: 80,
        label: t.ir,
        note: t.irNote,
        strong: true,
    })}

    ${elbow(488, MID, 556, TOP)}
    ${elbow(488, MID, 556, MID)}
    ${elbow(488, MID, 556, LOW)}

    ${boxNode({ x: 560, y: TOP - 28, w: 96, h: 56, label: '.velb', note: t.bytecode, mono: true })}
    ${arrow(660, 690, TOP)}
    ${boxNode({ x: 694, y: TOP - 28, w: 92, h: 56, label: t.vm, note: t.vmNote })}
    ${arrow(790, 820, TOP)}
    ${boxNode({ x: 824, y: TOP - 28, w: 128, h: 56, label: t.jit, note: t.jitNote })}

    ${boxNode({ x: 560, y: MID - 28, w: 96, h: 56, label: t.aot, note: t.aotNote })}
    ${arrow(660, 690, MID)}
    ${boxNode({ x: 694, y: MID - 28, w: 120, h: 56, label: t.linker, note: t.linkerNote })}
    ${arrow(818, 848, MID)}
    ${boxNode({ x: 852, y: MID - 28, w: 100, h: 56, label: t.exe, note: t.exeNote, mono: true })}

    ${boxNode({ x: 560, y: LOW - 28, w: 96, h: 56, label: '--port c', note: '', mono: true })}
    ${arrow(660, 690, LOW)}
    ${boxNode({ x: 694, y: LOW - 28, w: 120, h: 56, label: t.portC, note: t.portCNote, mono: true })}

    <text class="d-aside" x="8" y="378">${escapeHtml(t.comptime)}</text>
  </svg>`;

    return `<figure class="diagram-figure">${svg}
  <figcaption>${escapeHtml(t.caption)}</figcaption>
</figure>`;
}
