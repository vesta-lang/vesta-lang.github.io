/**
 * @file tags.mjs
 * @brief Vocabulario cerrado de etiquetas de la documentacion.
 *
 * Cada entrada de la referencia se etiqueta con lo que el lector necesita
 * saber antes de leerla: si puede usarla hoy, en que modos de ejecucion
 * funciona, que hace con la memoria, de donde sale y que clase de cosa es.
 *
 * El vocabulario esta cerrado a proposito. Una etiqueta escrita a mano en el
 * front matter de cada pagina degenera en un mes: conviven `en-desarrollo`,
 * `En desarrollo` y `wip`, los indices cruzados se parten en tres y nadie se
 * entera, porque ninguna de las tres versiones esta mal escrita. El build
 * rechaza cualquier etiqueta que no este aqui.
 *
 * De este fichero salen ademas los colores y la leyenda, para que no haya que
 * mantener la misma decision en el CSS y en el contenido.
 *
 * @see build.mjs, funcion checkTags
 */

/**
 * Familias de etiquetas, en el orden en que se pintan.
 *
 * El orden importa: una fila de etiquetas siempre empieza por el estado, que
 * es el dato que decide si el lector puede usar eso hoy, y termina por la
 * naturaleza, que es el que menos condiciona.
 *
 * Cada valor lleva:
 *
 * - `hue`, `sat`: color en HSL. Se guarda el tono y no el color final porque
 *   la pagina se sirve en tema claro y oscuro, y cada uno necesita otra
 *   luminosidad. Un solo numero por etiqueta garantiza que las dos variantes
 *   no se desincronicen.
 * - `label`: el texto visible, traducido. La etiqueta se lee, no solo se ve:
 *   el color nunca es el unico portador de la informacion.
 *
 * @type {Array<Object>}
 */
export const TAG_FAMILIES = [
    {
        id: 'status',
        label: { en: 'Status', es: 'Estado' },
        // Exactamente una, y obligatoria: una referencia sin estado es una
        // lista de promesas.
        required: true,
        single: true,
        // La unica familia que va rellena. El ojo encuentra primero "en
        // desarrollo", que es justo lo que hay que ver antes de copiar codigo.
        filled: true,
        values: [
            { id: 'stable', hue: 142, label: { en: 'stable', es: 'estable' } },
            { id: 'wip', hue: 40, label: { en: 'in progress', es: 'en desarrollo' } },
            { id: 'experimental', hue: 288, label: { en: 'experimental', es: 'experimental' } },
            { id: 'deprecated', hue: 220, sat: 8, label: { en: 'deprecated', es: 'obsoleto' } },
        ],
    },
    {
        id: 'modes',
        label: { en: 'Execution modes', es: 'Modos de ejecucion' },
        // Entre una y tres. La ausencia es informacion: una entrada que solo
        // lleva VM y JIT esta diciendo que en AOT no esta, sin necesidad de
        // una etiqueta negativa que alguien pueda olvidarse de poner.
        required: true,
        values: [
            { id: 'vm', hue: 212, label: { en: 'VM', es: 'VM' } },
            { id: 'jit', hue: 190, label: { en: 'JIT', es: 'JIT' } },
            { id: 'aot', hue: 250, label: { en: 'AOT', es: 'AOT' } },
        ],
    },
    {
        id: 'memory',
        label: { en: 'Memory', es: 'Memoria' },
        values: [
            { id: 'gc', hue: 168, label: { en: 'GC', es: 'GC' } },
            { id: 'raii', hue: 88, label: { en: 'RAII', es: 'RAII' } },
            { id: 'manual', hue: 22, label: { en: 'manual', es: 'manual' } },
            // `borrow` responde a otra pregunta que las tres anteriores: no
            // dice quien libera, dice como se accede sin ser dueno. Por eso
            // puede convivir con `raii` sin contradecirla, y por eso va en un
            // azul apagado en lugar del vivo de los modos de ejecucion.
            { id: 'borrow', hue: 200, sat: 18, label: { en: 'borrow', es: 'borrow' } },
        ],
    },
    {
        id: 'origin',
        label: { en: 'Origin', es: 'Origen' },
        required: true,
        single: true,
        values: [
            { id: 'builtin', hue: 350, label: { en: 'builtin', es: 'builtin' } },
            { id: 'stdlib', hue: 325, label: { en: 'stdlib', es: 'stdlib' } },
            { id: 'runtime', hue: 300, label: { en: 'runtime', es: 'runtime' } },
            { id: 'preprocessor', hue: 272, label: { en: 'preprocessor', es: 'preprocesador' } },
        ],
    },
    {
        id: 'kind',
        label: { en: 'Kind', es: 'Naturaleza' },
        single: true,
        // Sin tono: es la familia que menos condiciona la lectura, y darle
        // color le robaria atencion a las que si deciden algo.
        values: [
            { id: 'keyword', neutral: true, label: { en: 'keyword', es: 'palabra clave' } },
            { id: 'operator', neutral: true, label: { en: 'operator', es: 'operador' } },
            { id: 'annotation', neutral: true, label: { en: 'annotation', es: 'anotacion' } },
            { id: 'directive', neutral: true, label: { en: 'directive', es: 'directiva' } },
            { id: 'function', neutral: true, label: { en: 'function', es: 'funcion' } },
            { id: 'type', neutral: true, label: { en: 'type', es: 'tipo' } },
            { id: 'struct', neutral: true, label: { en: 'struct', es: 'struct' } },
            { id: 'class', neutral: true, label: { en: 'class', es: 'class' } },
            { id: 'enum', neutral: true, label: { en: 'enum', es: 'enum' } },
            { id: 'interface', neutral: true, label: { en: 'interface', es: 'interface' } },
            { id: 'instruction', neutral: true, label: { en: 'instruction', es: 'instruccion' } },
            { id: 'syntax', neutral: true, label: { en: 'syntax', es: 'sintaxis' } },
        ],
    },
];

/**
 * Indice plano de identificador de etiqueta a su valor y su familia.
 *
 * Se construye una vez y se reutiliza: la comprobacion del build la consulta
 * por cada etiqueta de cada pagina.
 *
 * @type {Map<string,{family: Object, value: Object}>}
 */
export const TAGS = new Map();
for (const family of TAG_FAMILIES) {
    for (const value of family.values) {
        if (TAGS.has(value.id)) {
            throw new Error(
                `Etiqueta duplicada "${value.id}": la usan las familias ` +
                `"${TAGS.get(value.id).family.id}" y "${family.id}".`
            );
        }
        TAGS.set(value.id, { family, value });
    }
}

/**
 * Saturacion por defecto de una etiqueta con tono.
 *
 * Las etiquetas comparten saturacion salvo que declaren la suya, para que la
 * fila entera tenga el mismo peso visual y ninguna destaque por accidente.
 */
const SAT = 60;

/**
 * Genera la hoja de estilos de las etiquetas.
 *
 * El CSS se genera en lugar de escribirse porque el color de una etiqueta ya
 * esta declarado aqui: mantenerlo tambien a mano en un `.css` seria pedir que
 * las dos copias se separen. Ademas cada etiqueta necesita cuatro reglas
 * (claro y oscuro, relleno y contorno), que a mano son ochenta y tantas
 * lineas de copiar y pegar.
 *
 * @returns {string} Hoja de estilos completa.
 */
export function tagStylesheet() {
    const out = [
        '/* Generado por site/content/tags.mjs. No editar a mano: los colores',
        ' * viven en el vocabulario de etiquetas, que es su unica fuente. */',
        '',
    ];

    for (const family of TAG_FAMILIES) {
        for (const value of family.values) {
            const sel = `.tag-${value.id}`;

            if (value.neutral) {
                out.push(
                    `${sel} { background: var(--bg-soft); color: var(--fg-soft);`,
                    '    border-color: var(--border); }',
                    ''
                );
                continue;
            }

            const h = value.hue;
            const s = value.sat === undefined ? SAT : value.sat;

            if (family.filled) {
                out.push(
                    `${sel} { background: hsl(${h} ${s}% 38%); color: hsl(${h} ${s}% 97%);`,
                    `    border-color: hsl(${h} ${s}% 32%); }`,
                    `@media (prefers-color-scheme: dark) {`,
                    `    ${sel} { background: hsl(${h} ${Math.round(s * 0.8)}% 30%);`,
                    `        color: hsl(${h} ${s}% 92%); border-color: hsl(${h} ${s}% 42%); }`,
                    '}',
                    ''
                );
            } else {
                out.push(
                    `${sel} { background: hsl(${h} ${s}% 97%); color: hsl(${h} ${s}% 30%);`,
                    `    border-color: hsl(${h} ${Math.round(s * 0.7)}% 80%); }`,
                    `@media (prefers-color-scheme: dark) {`,
                    `    ${sel} { background: hsl(${h} ${Math.round(s * 0.5)}% 13%);`,
                    `        color: hsl(${h} ${s}% 74%);`,
                    `        border-color: hsl(${h} ${Math.round(s * 0.5)}% 30%); }`,
                    '}',
                    ''
                );
            }
        }
    }

    return out.join('\n');
}

/**
 * Ordena y valida una lista de etiquetas.
 *
 * Devuelve las etiquetas en el orden de las familias, no en el que las
 * escribio quien redacto la pagina: una fila de etiquetas que cambia de orden
 * entre paginas obliga a releerla cada vez.
 *
 * @param {Array<string>} tags Identificadores declarados en la pagina.
 * @returns {Array<{family: Object, value: Object}>} Etiquetas resueltas.
 * @throws {Error} Si alguna etiqueta no esta en el vocabulario.
 */
export function resolveTags(tags) {
    const resolved = [];
    for (const id of tags) {
        const entry = TAGS.get(id);
        if (!entry) throw new Error(`Etiqueta desconocida: "${id}".`);
        resolved.push(entry);
    }

    const order = new Map(TAG_FAMILIES.map((f, i) => [f.id, i]));
    return resolved.sort(
        (a, b) => order.get(a.family.id) - order.get(b.family.id)
    );
}

/**
 * Explicacion de cada familia, para la leyenda.
 *
 * La leyenda no repite lo que la etiqueta ya dice: dice para que sirve la
 * familia. Sin esto, un lector ve `VM` y `JIT` en una entrada y no sabe si
 * son requisitos, recomendaciones o donde se ha probado.
 */
const FAMILY_HELP = {
    status: {
        en: 'Whether you can rely on it today.',
        es: 'Si puedes contar con ello hoy.',
    },
    modes: {
        en: 'Where it works. A missing mode means it is not available there.',
        es: 'Donde funciona. Un modo ausente significa que alli no esta.',
    },
    memory: {
        en: 'What it does with memory. The first three say who frees; ' +
            'borrow says how it is accessed without owning.',
        es: 'Que hace con la memoria. Las tres primeras dicen quien libera; ' +
            'borrow dice como se accede sin ser dueno.',
    },
    origin: {
        en: 'Where it comes from: the compiler, the library, the runtime or ' +
            'the preprocessor.',
        es: 'De donde sale: el compilador, la biblioteca, el runtime o el ' +
            'preprocesador.',
    },
    kind: {
        en: 'What kind of thing the entry is.',
        es: 'Que clase de cosa es la entrada.',
    },
};

/**
 * Renderiza la leyenda completa de las etiquetas.
 *
 * Se genera desde el vocabulario y no se escribe a mano por el mismo motivo
 * que los colores: una leyenda escrita aparte se queda sin la etiqueta que se
 * anadio la semana pasada, y una leyenda incompleta es peor que ninguna,
 * porque quien la consulta cree haberla consultado.
 *
 * @param {string} lang Idioma.
 * @returns {string} HTML de la leyenda.
 */
export function renderTagLegend(lang) {
    const rows = TAG_FAMILIES.map((family) => {
        const chips = family.values
            .map((value) => {
                const label = value.label[lang] || value.label.en;
                return `<span class="tag tag-${value.id}">${label}</span>`;
            })
            .join('');
        const name = family.label[lang] || family.label.en;
        const help = FAMILY_HELP[family.id];

        return (
            '<div class="tag-legend-row">' +
            `<h3>${name}</h3>` +
            `<p class="tag-row">${chips}</p>` +
            `<p class="tag-legend-help">${help[lang] || help.en}</p>` +
            '</div>'
        );
    });

    return `<div class="tag-legend">${rows.join('')}</div>`;
}

/**
 * Renderiza la fila de etiquetas de una entrada.
 *
 * Cada etiqueta lleva el nombre de su familia en el `title`, porque el color
 * agrupa pero no explica: quien llega por un enlace directo a una entrada no
 * ha visto la leyenda.
 *
 * @param {Array<string>} tags Identificadores declarados.
 * @param {string} lang Idioma.
 * @returns {string} HTML de la fila, o cadena vacia si no hay etiquetas.
 */
export function renderTags(tags, lang) {
    if (!tags || tags.length === 0) return '';

    const items = resolveTags(tags).map(({ family, value }) => {
        const label = value.label[lang] || value.label.en;
        const familyLabel = family.label[lang] || family.label.en;
        return (
            `<span class="tag tag-${value.id}" title="${familyLabel}">` +
            `${label}</span>`
        );
    });

    return `<p class="tag-row">${items.join('')}</p>`;
}
