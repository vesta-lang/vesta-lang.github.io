/**
 * @file tools/snippet.mjs
 * @brief Convierte el indice semantico de un fragmento Vesta en HTML.
 *
 * Consume los `.tokens.json` que genera `tools/gen_snippets.py` a partir del
 * servidor LSP del compilador. Aqui no se decide QUE es cada token -- eso ya
 * viene resuelto por el lexer real del lenguaje -- sino unicamente como se
 * pinta y que informacion adicional se cuelga de cada simbolo.
 *
 * El HTML resultante es autosuficiente: el color va en clases CSS, el texto del
 * bocadillo va en un atributo `data-doc`, y el enlace a la definicion es un
 * `<a href>` corriente. Sin JavaScript la pagina se lee igual; el bocadillo es
 * lo unico que se pierde, y es un adorno.
 */

import { readFileSync } from 'node:fs';
import { escapeHtml } from './markdown.mjs';

/**
 * Construye la URL publica de la definicion de un simbolo.
 *
 * Las definiciones llegan como ruta relativa al repositorio del compilador
 * (`stdlib/vx/std/atomic.vx`). Se traducen a una URL del sitio cuando el
 * fichero pertenece a la stdlib, porque esa parte si esta documentada aqui; en
 * cualquier otro caso se enlaza al codigo fuente publicado, que es preferible a
 * no enlazar nada.
 *
 * @param {{file: string, line: number}} def Definicion del simbolo.
 * @param {string} repoUrl Base del repositorio del compilador.
 * @returns {string} URL absoluta o relativa al sitio.
 */
export function definitionUrl(def, repoUrl = 'https://github.com/vesta-lang/vesta') {
    const stdlib = def.file.match(/^stdlib\/vx\/(?:std\/)?(.+)\.vx$/);
    if (stdlib) {
        // `std/syscall/windows.vx` -> `/stdlib/syscall/windows/`
        return `/stdlib/${stdlib[1].replace(/\./g, '/')}/`;
    }
    return `${repoUrl}/blob/main/${def.file}#L${def.line}`;
}

/**
 * Renderiza un fragmento a HTML a partir de su indice semantico.
 *
 * El recorrido va por posiciones absolutas del fuente y emite tanto los tramos
 * con token como los huecos entre ellos, de modo que el texto resultante es
 * identico al original caracter a caracter. Es importante: un fragmento de
 * codigo que no se puede copiar y pegar tal cual no sirve de nada.
 *
 * @param {Object} index Contenido de un `.tokens.json`.
 * @param {Object} [options]
 * @param {string} [options.title] Titulo mostrado en la cabecera del bloque.
 * @param {string} [options.source] Ruta del ejemplo de origen, si procede.
 * @returns {string} HTML del bloque de codigo.
 */
export function renderSnippet(index, options = {}) {
    const lines = index.source.split('\n');
    const byLine = new Map();
    for (const token of index.tokens) {
        if (!byLine.has(token.line)) byLine.set(token.line, []);
        byLine.get(token.line).push(token);
    }

    const out = [];
    lines.forEach((line, number) => {
        const tokens = (byLine.get(number) || []).sort((a, b) => a.col - b.col);
        let cursor = 0;
        let html = '';

        for (const token of tokens) {
            // Solape defensivo: si dos tokens se pisan, se ignora el segundo en
            // lugar de duplicar texto.
            if (token.col < cursor) continue;
            if (token.col > cursor) {
                html += escapeHtml(line.slice(cursor, token.col));
            }

            const text = line.slice(token.col, token.col + token.len);
            const attrs = [`class="t-${token.kind || 'plain'}"`];
            if (token.doc) attrs.push(`data-doc="${escapeHtml(token.doc)}"`);

            if (token.def) {
                const href = definitionUrl(token.def);
                attrs.push(`href="${href}"`);
                html += `<a ${attrs.join(' ')}>${escapeHtml(text)}</a>`;
            } else {
                html += `<span ${attrs.join(' ')}>${escapeHtml(text)}</span>`;
            }
            cursor = token.col + token.len;
        }

        html += escapeHtml(line.slice(cursor));
        out.push(html);
    });

    const header = [];
    if (options.title) {
        header.push(`<span class="snippet-title">${escapeHtml(options.title)}</span>`);
    }
    if (options.source) {
        header.push(`<span class="snippet-source">${escapeHtml(options.source)}</span>`);
    }

    return [
        '<figure class="snippet" data-lang="vx">',
        header.length ? `<figcaption>${header.join('')}</figcaption>` : '',
        `<pre><code class="language-vx">${out.join('\n')}</code></pre>`,
        '</figure>',
    ]
        .filter(Boolean)
        .join('\n');
}

/**
 * Carga un indice desde disco y lo renderiza.
 *
 * @param {string} path Ruta del fichero `.tokens.json`.
 * @param {Object} [options] Opciones de `renderSnippet`.
 * @returns {string} HTML del bloque.
 */
export function renderSnippetFile(path, options = {}) {
    const index = JSON.parse(readFileSync(path, 'utf8'));

    // Un fragmento que no compila no se publica: la regla editorial exige que
    // todo bloque de codigo del sitio sea codigo real y valido.
    //
    // El veredicto lo da el COMPILADOR (`compiles`), nunca los diagnosticos del
    // LSP. Se ha comprobado que el servidor reporta errores dentro de la stdlib
    // que el compilador no confirma; bloquear con ellos impediria publicar
    // codigo que funciona. Los diagnosticos del LSP quedan en el JSON como
    // informacion, no como veredicto.
    const build = index.compiles || {};
    if (build.ok === false) {
        const detail = (build.errors || []).join('; ');
        throw new Error(`El fragmento ${path} no compila: ${detail}`);
    }
    if (build.ok !== true) {
        // Sin compilador disponible no se puede afirmar que el fragmento sea
        // valido. Se avisa y se continua: romper el build de la web por no
        // tener el compilador instalado seria peor que publicar con la duda.
        console.warn(
            `  aviso: ${path} no se ha podido verificar con el compilador ` +
                `(${build.reason || 'motivo desconocido'})`
        );
    }

    return renderSnippet(index, options);
}
