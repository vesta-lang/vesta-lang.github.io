/**
 * @file tools/markdown.mjs
 * @brief Conversor de Markdown a HTML para las paginas del sitio.
 *
 * Se implementa aqui en lugar de usar una libreria externa por dos razones:
 * el contenido lo controlamos nosotros (basta con el subconjunto que usamos, no
 * con CommonMark entero), y el build queda sin dependencias, de modo que el
 * workflow de Pages solo necesita ejecutar node sin instalar nada.
 *
 * Subconjunto soportado: front matter, encabezados ATX, parrafos, enfasis,
 * codigo en linea y en bloque, enlaces, imagenes, listas ordenadas y sin
 * ordenar (con anidamiento), citas, tablas GFM, reglas horizontales y HTML
 * crudo a nivel de bloque.
 *
 * El resaltado de sintaxis no vive aqui: los bloques de codigo se delegan al
 * callback `highlight` que recibe `render`, para que este modulo no dependa del
 * tokenizador y se pueda probar por separado.
 */

/**
 * Contenedores TRANSPARENTES: su etiqueta se emite tal cual y lo que hay dentro
 * se sigue procesando como Markdown.
 *
 * Son envoltorios de maquetacion. Tratarlos como opacos fue un error que costo
 * dos veces la misma correccion: dentro de un `<details>` la tabla y las
 * negritas salian escritas a pelo, porque nadie las convertia.
 *
 * Solo se reconocen cuando la linea contiene UNICAMENTE la etiqueta. Asi
 * `<div class="x">` abre un envoltorio, pero `<div>texto</div>` en medio de un
 * parrafo no altera nada.
 */
const TRANSPARENT_TAGS = new Set([
    'div',
    'section',
    'aside',
    'nav',
    'header',
    'footer',
    'details',
    'form',
    'picture',
    'video',
    'ul',
    'ol',
    'dl',
    'table',
    'tbody',
    'thead',
    'tr',
]);

/**
 * Etiquetas OPACAS: se consumen enteras, con su contenido, sin interpretarlo.
 *
 * Son las que llevan texto ya escrito en HTML, donde aplicar Markdown encima
 * estropearia el marcado en lugar de mejorarlo.
 */
const RAW_TAGS = new Set([
    'p',
    'article',
    'figure',
    'blockquote',
    'pre',
    'summary',
    'li',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'svg',
]);

/**
 * Elementos HTML sin contenido, que se cierran solos.
 *
 * Cuando aparecen solos en una linea se emiten verbatim: no tienen etiqueta de
 * cierre que contar, asi que el algoritmo de anidamiento no les sirve.
 */
const VOID_TAGS = new Set(['img', 'hr', 'br', 'source', 'input', 'iframe']);

/**
 * Escapa los caracteres con significado en HTML.
 *
 * @param {string} text Texto crudo.
 * @returns {string} Texto seguro para insertar en el documento.
 */
export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Separa el front matter del cuerpo del documento.
 *
 * El front matter es un bloque delimitado por lineas `---` al principio del
 * fichero, con pares `clave: valor`. Se admite un subconjunto deliberadamente
 * pequeno de YAML: valores escalares y listas en linea con corchetes. No se usa
 * un parser de YAML completo porque los metadatos de una pagina son siempre
 * planos, y aceptar mas invitaria a meter logica en los datos.
 *
 * @param {string} source Contenido completo del fichero .md.
 * @returns {{meta: Object<string,(string|string[])>, body: string}}
 */
export function parseFrontMatter(source) {
    const normalized = source.replace(/\r\n/g, '\n');
    if (!normalized.startsWith('---\n')) {
        return { meta: {}, body: normalized };
    }
    const end = normalized.indexOf('\n---', 4);
    if (end === -1) {
        return { meta: {}, body: normalized };
    }

    const meta = {};
    for (const line of normalized.slice(4, end).split('\n')) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) continue;

        let value = match[2].trim();
        // Las comillas son opcionales; se retiran para que el valor no las
        // arrastre hasta el HTML.
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (value.startsWith('[') && value.endsWith(']')) {
            meta[match[1]] = value
                .slice(1, -1)
                .split(',')
                .map((item) => item.trim().replace(/^["']|["']$/g, ''))
                .filter(Boolean);
        } else {
            meta[match[1]] = value;
        }
    }

    // El cuerpo empieza tras la linea de cierre del front matter.
    const bodyStart = normalized.indexOf('\n', end + 1);
    return { meta, body: bodyStart === -1 ? '' : normalized.slice(bodyStart + 1) };
}

/**
 * Convierte a un identificador apto para `id` de encabezado y para anclas.
 *
 * Se translitera lo minimo (acentos del castellano) en lugar de recortar a los
 * caracteres ASCII directamente, para que un titulo en espanol no acabe con
 * huecos en el ancla.
 *
 * @param {string} text Texto del encabezado.
 * @returns {string} Slug en minusculas separado por guiones.
 */
export function slugify(text) {
    const from = 'aaaaaeeeeiiiioooooquuuunc';
    const to = 'aaaaaeeeeiiiioooooquuuunc';
    void from;
    void to;
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // marcas diacriticas
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Aplica las construcciones de nivel de linea (enfasis, codigo, enlaces).
 *
 * El codigo en linea se procesa primero y su contenido se aparta a marcadores,
 * porque dentro de un `code` no deben interpretarse ni el enfasis ni los
 * enlaces: `*ptr` es un puntero, no cursiva.
 *
 * @param {string} text Fragmento de Markdown en linea.
 * @returns {string} HTML.
 */
export function renderInline(text) {
    // Marcador con el que se apartan los tramos de codigo en linea. Se usa
    // texto plano y no un byte de control porque un fichero con caracteres
    // nulos deja de ser texto para git y para las herramientas de busqueda:
    // los diffs se vuelven ilegibles y `grep` lo trata como binario.
    const codeSpans = [];
    let out = text.replace(/`([^`]+)`/g, (_, code) => {
        codeSpans.push(`<code>${escapeHtml(code)}</code>`);
        return `@@CODE${codeSpans.length - 1}@@`;
    });

    out = escapeHtml(out);

    // Imagenes antes que enlaces: comparten sintaxis salvo el '!' inicial.
    out = out.replace(
        /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
        (_, alt, src, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<img src="${src}" alt="${alt}"${titleAttr} loading="lazy">`;
        }
    );

    out = out.replace(
        /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
        (_, label, href, title) => {
            const titleAttr = title ? ` title="${title}"` : '';
            // Los enlaces salientes se marcan para poder distinguirlos en CSS y
            // para anadirles rel de seguridad sin repetirlo en cada pagina.
            const external = /^https?:\/\//.test(href);
            const extra = external
                ? ' target="_blank" rel="noopener noreferrer" class="external"'
                : '';
            return `<a href="${href}"${titleAttr}${extra}>${label}</a>`;
        }
    );

    out = out
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

    return out.replace(/@@CODE(\d+)@@/g, (_, i) => codeSpans[Number(i)]);
}

/**
 * Detecta el nivel de indentacion de una linea de lista, en niveles logicos.
 *
 * Se cuenta en bloques de dos espacios porque es la convencion del contenido
 * del sitio; los tabuladores se normalizan antes de llamar aqui.
 *
 * @param {string} line Linea completa.
 * @returns {number} Nivel de anidamiento, empezando en 0.
 */
function indentLevel(line) {
    const spaces = line.match(/^ */)[0].length;
    return Math.floor(spaces / 2);
}

/**
 * Renderiza una lista (ordenada o no) a partir de las lineas que la componen.
 *
 * Se construye de forma recursiva por nivel de indentacion en lugar de con una
 * pila explicita: las listas del sitio no pasan de dos o tres niveles y la
 * version recursiva es mucho mas facil de seguir.
 *
 * @param {string[]} lines Lineas de la lista, ya recortadas del documento.
 * @param {number} level Nivel de indentacion que corresponde a esta lista.
 * @returns {string} HTML de la lista.
 */
function renderList(lines, level) {
    const ordered = /^\s*\d+\./.test(lines[0]);
    const items = [];

    for (let i = 0; i < lines.length; i += 1) {
        const marker = lines[i].match(/^\s*(?:[-*+]|\d+\.)\s+/);
        if (!marker) continue;

        const content = [lines[i].slice(marker[0].length)];
        const children = [];

        // Todo lo que venga mas indentado pertenece a este item: o es una
        // sublista, o es la continuacion del parrafo del item.
        let j = i + 1;
        while (j < lines.length && indentLevel(lines[j]) > level) {
            children.push(lines[j]);
            j += 1;
        }
        i = j - 1;

        let html = renderInline(content.join(' ').trim());
        if (children.length > 0) {
            const isNestedList = /^\s*(?:[-*+]|\d+\.)\s+/.test(children[0]);
            html += isNestedList
                ? renderList(children, level + 1)
                : ` ${renderInline(children.map((l) => l.trim()).join(' '))}`;
        }
        items.push(`<li>${html}</li>`);
    }

    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>\n${items.join('\n')}\n</${tag}>`;
}

/**
 * Renderiza una tabla GFM.
 *
 * La fila de separacion define la alineacion de cada columna; se respeta porque
 * las tablas de datos numericos (benchmarks) se leen mucho mejor alineadas a la
 * derecha. La tabla se envuelve en un contenedor con scroll propio para que en
 * pantallas estrechas se desplace la tabla y no la pagina entera.
 *
 * @param {string[]} rows Lineas de la tabla, incluida la de separacion.
 * @returns {string} HTML de la tabla.
 */
function renderTable(rows) {
    const split = (row) =>
        row
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((cell) => cell.trim());

    const header = split(rows[0]);
    const aligns = split(rows[1]).map((spec) => {
        const left = spec.startsWith(':');
        const right = spec.endsWith(':');
        if (left && right) return 'center';
        if (right) return 'right';
        return '';
    });

    const cell = (tag, value, align) => {
        const style = align ? ` style="text-align:${align}"` : '';
        return `<${tag}${style}>${renderInline(value)}</${tag}>`;
    };

    const head = header.map((h, i) => cell('th', h, aligns[i])).join('');
    const body = rows
        .slice(2)
        .map((row) => {
            const cells = split(row).map((c, i) => cell('td', c, aligns[i]));
            return `<tr>${cells.join('')}</tr>`;
        })
        .join('\n');

    return [
        '<div class="table-scroll">',
        '<table>',
        `<thead><tr>${head}</tr></thead>`,
        `<tbody>\n${body}\n</tbody>`,
        '</table>',
        '</div>',
    ].join('\n');
}

/**
 * Convierte un documento Markdown completo a HTML.
 *
 * @param {string} markdown Cuerpo del documento, sin front matter.
 * @param {Object} [options]
 * @param {(code: string, lang: string) => string} [options.highlight]
 *        Resaltador de bloques de codigo. Recibe el codigo crudo y el lenguaje
 *        declarado en la valla, y devuelve HTML ya escapado. Si no se pasa, el
 *        codigo se emite escapado y sin marcar.
 * @param {Array<{level: number, text: string, id: string}>} [options.headings]
 *        Array donde se acumulan los encabezados encontrados, para construir
 *        indices de contenido sin recorrer el HTML resultante.
 * @returns {string} HTML del documento.
 */
export function render(markdown, options = {}) {
    const highlight = options.highlight || ((code) => escapeHtml(code));
    const headings = options.headings;

    const lines = markdown.replace(/\r\n/g, '\n').replace(/\t/g, '  ').split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Lineas en blanco: no generan nada por si mismas.
        if (line.trim() === '') {
            i += 1;
            continue;
        }

        // Bloque de codigo con vallas.
        const fence = line.match(/^```\s*([A-Za-z0-9_+-]*)\s*$/);
        if (fence) {
            const lang = fence[1] || 'text';
            const code = [];
            i += 1;
            while (i < lines.length && !/^```\s*$/.test(lines[i])) {
                code.push(lines[i]);
                i += 1;
            }
            i += 1; // valla de cierre
            const body = highlight(code.join('\n'), lang);
            out.push(
                `<div class="code-block" data-lang="${lang}">` +
                    `<pre><code class="language-${lang}">${body}</code></pre>` +
                    '</div>'
            );
            continue;
        }

        // Comentario HTML: se emite tal cual.
        //
        // Sirve para los marcadores que el build resuelve despues de convertir
        // el Markdown (pestanas, por ejemplo). Sin esto se escaparian y
        // acabarian visibles en la pagina como texto.
        if (line.trim().startsWith('<!--')) {
            const raw = [];
            while (i < lines.length) {
                raw.push(lines[i]);
                if (lines[i].includes('-->')) {
                    i += 1;
                    break;
                }
                i += 1;
            }
            out.push(raw.join(String.fromCharCode(10)));
            continue;
        }

        // Regla horizontal.
        if (/^(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            out.push('<hr>');
            i += 1;
            continue;
        }

        // Encabezado ATX.
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            const level = heading[1].length;
            const text = heading[2].trim();
            const id = slugify(text);
            if (headings) headings.push({ level, text, id });
            // El ancla permanente permite enlazar a una seccion concreta desde
            // fuera; se emite siempre para que las URLs no dependan de que
            // alguien se acuerde de anadirla.
            out.push(
                `<h${level} id="${id}">${renderInline(text)}` +
                    `<a class="anchor" href="#${id}" aria-hidden="true">#</a></h${level}>`
            );
            i += 1;
            continue;
        }

        // Cita.
        if (line.startsWith('>')) {
            const quote = [];
            while (i < lines.length && lines[i].startsWith('>')) {
                quote.push(lines[i].replace(/^>\s?/, ''));
                i += 1;
            }
            out.push(
                `<blockquote>${render(quote.join('\n'), options)}</blockquote>`
            );
            continue;
        }

        // Tabla: cabecera seguida de la fila de separacion.
        if (
            line.includes('|') &&
            i + 1 < lines.length &&
            /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])
        ) {
            const rows = [];
            while (i < lines.length && lines[i].includes('|')) {
                rows.push(lines[i]);
                i += 1;
            }
            out.push(renderTable(rows));
            continue;
        }

        // Lista.
        if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
            const base = indentLevel(line);
            const block = [];
            while (i < lines.length) {
                const current = lines[i];
                const isItem = /^\s*(?:[-*+]|\d+\.)\s+/.test(current);
                const isContinuation =
                    current.trim() !== '' && indentLevel(current) > base;
                if (!isItem && !isContinuation) break;
                block.push(current);
                i += 1;
            }
            out.push(renderList(block, base));
            continue;
        }

        // HTML crudo a nivel de bloque, para los pocos casos (hero, rejilla de
        // tarjetas) donde el Markdown no da la estructura que pide el diseno.
        //
        // El bloque se consume contando la ANIDACION de su etiqueta, no hasta
        // la siguiente linea en blanco. Cortar en la linea en blanco parecia
        // suficiente y no lo es: en cuanto el bloque contiene elementos
        // separados por lineas vacias -- que es justo como se escribe una
        // rejilla legible -- el resto se trata como parrafos y se publica el
        // marcado escapado, visible como texto.
        const blockTag = line.trim().match(/^<(\/?)([a-zA-Z][a-zA-Z0-9]*)/);
        const tagName = blockTag ? blockTag[2].toLowerCase() : '';

        // Elemento vacio suelto en su propia linea (una imagen de cabecera, un
        // separador). No tiene cierre que contar, asi que se emite tal cual.
        if (blockTag && VOID_TAGS.has(tagName)) {
            out.push(line.trim());
            i += 1;
            continue;
        }

        // Envoltorio TRANSPARENTE: la linea contiene solo la etiqueta, asi que
        // se emite y se sigue procesando su interior como Markdown.
        if (
            blockTag &&
            TRANSPARENT_TAGS.has(tagName) &&
            /^<\/?[^<>]+>$/.test(line.trim())
        ) {
            out.push(line.trim());
            i += 1;
            continue;
        }

        // Linea que YA es un elemento HTML completo: se emite tal cual.
        //
        // Cubre los hijos de un envoltorio transparente que no son etiquetas de
        // bloque -- un `<a>` dentro de un `<nav>`, por ejemplo. Sin esta regla
        // caian al parrafo y se publicaban escapados, con el marcado a la
        // vista.
        //
        // La condicion es estricta: la linea empieza por una etiqueta de
        // apertura y termina en `>`. Un parrafo que empiece con `<` pero acabe
        // en otra cosa sigue tratandose como texto.
        if (
            blockTag &&
            !blockTag[1] &&
            line.trim().endsWith('>') &&
            new RegExp(`</${tagName}\s*>$`, 'i').test(line.trim())
        ) {
            out.push(line.trim());
            i += 1;
            continue;
        }

        // Etiqueta OPACA: se consume entera, con su contenido.
        if (blockTag && RAW_TAGS.has(tagName)) {
            const tag = tagName;
            const open = new RegExp(`<${tag}\\b`, 'gi');
            const close = new RegExp(`</${tag}\\s*>`, 'gi');

            const raw = [];
            let depth = 0;
            while (i < lines.length) {
                const current = lines[i];
                raw.push(current);
                depth += (current.match(open) || []).length;
                depth -= (current.match(close) || []).length;
                i += 1;
                if (depth <= 0) break;
            }
            out.push(raw.join('\n'));
            continue;
        }

        // Parrafo: se acumula hasta la siguiente linea en blanco o construccion
        // de bloque.
        const paragraph = [];
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !/^(?:#{1,6}\s|>|```|\s*(?:[-*+]|\d+\.)\s)/.test(lines[i])
        ) {
            paragraph.push(lines[i].trim());
            i += 1;
        }
        if (paragraph.length > 0) {
            out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
        }
    }

    return out.join('\n');
}
