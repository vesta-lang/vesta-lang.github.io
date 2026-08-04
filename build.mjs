/**
 * @file build.mjs
 * @brief Generador estatico del sitio de Vesta.
 *
 * Recorre `site/content/<idioma>/`, convierte cada Markdown a HTML, inserta los
 * fragmentos de codigo ya resaltados y escribe el resultado en `dist/`, junto
 * con los recursos estaticos, el sitemap y el robots.txt.
 *
 * No hay dependencias externas. La decision es deliberada: el gestor de
 * paquetes de Vesta existe justamente porque la cadena de suministro de npm es
 * un problema, y montar la web del proyecto sobre `npm ci` seria incoherente.
 * Como el contenido lo controlamos nosotros, basta con el subconjunto de
 * Markdown que usamos.
 *
 * Uso:
 *     node build.mjs            construye en dist/
 *     node build.mjs --serve    construye y sirve en http://localhost:8080
 */

import {
    cpSync,
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { pipelineDiagram } from './tools/diagram.mjs';
import { highlight } from './tools/highlight.mjs';
import { renderPage } from './tools/layout.mjs';
import { parseFrontMatter, render } from './tools/markdown.mjs';
import { LANGUAGES, SITE_URL, urlFor } from './tools/site.mjs';
import { renderSnippetFile } from './tools/snippet.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(ROOT, 'site', 'content');
const ASSETS = join(ROOT, 'site', 'assets');
const SNIPPETS = join(ROOT, 'site', 'snippets');
const OUT = join(ROOT, 'dist');

/**
 * Recorre un directorio y devuelve todos los ficheros que cumplen un filtro.
 *
 * @param {string} dir Directorio raiz.
 * @param {(name: string) => boolean} accept Filtro por nombre de fichero.
 * @returns {string[]} Rutas absolutas.
 */
function walk(dir, accept) {
    if (!existsSync(dir)) return [];
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            out.push(...walk(full, accept));
        } else if (accept(entry)) {
            out.push(full);
        }
    }
    return out;
}

/**
 * Deduce la ruta canonica de una pagina a partir de su fichero de origen.
 *
 * `index.md` corresponde a la raiz de su directorio, de modo que las URLs
 * publicadas terminan siempre en barra y no exponen la extension. Una URL sin
 * extension puede cambiar de tecnologia sin romperse.
 *
 * @param {string} file Ruta absoluta del Markdown.
 * @param {string} langDir Directorio del idioma.
 * @returns {string} Ruta canonica, empezando y acabando por `/`.
 */
function canonicalPath(file, langDir) {
    const rel = relative(langDir, file).split(sep).join('/');
    const noExt = rel.replace(/\.md$/, '');
    if (noExt === 'index') return '/';
    if (noExt.endsWith('/index')) return `/${noExt.slice(0, -'/index'.length)}/`;
    return `/${noExt}/`;
}

/**
 * Sustituye los marcadores de fragmento por su HTML resaltado.
 *
 * Los fragmentos no se escriben dentro del Markdown: viven como ficheros `.vx`
 * reales que compilan, y aqui se insertan por referencia. Asi el codigo del
 * sitio es codigo verificado y no una transcripcion que puede quedar obsoleta.
 *
 * @param {string} markdown Contenido de la pagina.
 * @returns {string} Contenido con los marcadores resueltos.
 */
function insertSnippets(markdown) {
    return markdown.replace(/<!--\s*SNIPPET:([A-Za-z0-9_-]+)\s*-->/g, (_, name) => {
        const index = join(SNIPPETS, `${name}.tokens.json`);
        if (!existsSync(index)) {
            throw new Error(
                `El fragmento "${name}" no tiene indice. ` +
                    `Ejecuta: python tools/gen_snippets.py ${name}`
            );
        }
        return renderSnippetFile(index, { source: `site/snippets/${name}.vx` });
    });
}

/**
 * Sustituye los marcadores de diagrama por su SVG.
 *
 * Los diagramas se generan por codigo en lugar de escribirse a mano en cada
 * pagina: asi la geometria es unica y solo cambian las etiquetas segun el
 * idioma, que es lo que evita que las dos versiones se desalineen con el
 * primer retoque.
 *
 * @param {string} markdown Contenido de la pagina.
 * @param {string} lang Idioma de la pagina.
 * @returns {string} Contenido con los marcadores resueltos.
 */
function insertDiagrams(markdown, lang) {
    const diagrams = { pipeline: pipelineDiagram };
    return markdown.replace(/<!--\s*DIAGRAM:([a-z-]+)\s*-->/g, (_, name) => {
        const build = diagrams[name];
        if (!build) throw new Error(`Diagrama desconocido: "${name}"`);
        return build(lang);
    });
}

/**
 * Comprueba que los indices de los fragmentos corresponden a su fuente.
 *
 * Replica en JavaScript la verificacion de `gen_snippets.py --check` para que
 * el build falle solo, sin depender de que alguien recuerde ejecutarla. Publicar
 * un fragmento cuyo resaltado no corresponde a su codigo es peor que no
 * publicar nada.
 */
async function checkSnippets() {
    const { createHash } = await import('node:crypto');
    const stale = [];

    for (const vx of walk(SNIPPETS, (n) => n.endsWith('.vx'))) {
        const index = vx.replace(/\.vx$/, '.tokens.json');
        if (!existsSync(index)) {
            stale.push(`${vx}: sin indice`);
            continue;
        }
        const source = readFileSync(vx, 'utf8').replace(/\r\n/g, '\n');
        const hash = createHash('sha256').update(source, 'utf8').digest('hex');
        if (JSON.parse(readFileSync(index, 'utf8')).hash !== hash) {
            stale.push(`${vx}: indice desactualizado`);
        }
    }

    if (stale.length > 0) {
        throw new Error(
            `Fragmentos sin regenerar:\n  ${stale.join('\n  ')}\n\n` +
                'Ejecuta: python tools/gen_snippets.py'
        );
    }
}

/**
 * Construye el JSON-LD de la portada.
 *
 * Describe Vesta como aplicacion de software para que el buscador pueda
 * presentarlo como tal. Solo se emite en la Home: repetirlo en cada pagina no
 * anade informacion y diluye la senal.
 *
 * @param {string} lang Idioma de la pagina.
 * @returns {string} JSON serializado.
 */
function homeJsonLd(lang) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Vesta',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, Linux, macOS',
        url: `${SITE_URL}${urlFor(lang, '/')}`,
        codeRepository: 'https://github.com/vesta-lang/vesta',
        programmingLanguage: 'Vesta',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });
}

/**
 * Genera el sitemap.
 *
 * Se incluyen todas las variantes de idioma con sus enlaces reciprocos, que es
 * lo que permite al buscador entender que son la misma pagina en dos lenguas y
 * no contenido duplicado.
 *
 * @param {Array<{path: string, available: string[]}>} pages Paginas generadas.
 * @returns {string} XML del sitemap.
 */
function sitemap(pages) {
    const entries = [];
    for (const page of pages) {
        for (const lang of page.available) {
            const links = page.available
                .map(
                    (other) =>
                        `        <xhtml:link rel="alternate" hreflang="${other}" ` +
                        `href="${SITE_URL}${urlFor(other, page.path)}"/>`
                )
                .join('\n');
            entries.push(
                `    <url>\n        <loc>${SITE_URL}${urlFor(lang, page.path)}</loc>\n` +
                    `${links}\n    </url>`
            );
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

/**
 * Escribe un fichero creando los directorios intermedios.
 *
 * @param {string} path Ruta absoluta de destino.
 * @param {string} content Contenido.
 */
function emit(path, content) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, 'utf8');
}

/** Construye el sitio completo. */
async function build() {
    const started = Date.now();
    await checkSnippets();

    rmSync(OUT, { recursive: true, force: true });
    mkdirSync(OUT, { recursive: true });

    // Primera pasada: leer todas las paginas para saber en que idiomas existe
    // cada ruta. Sin esto no se pueden emitir los `hreflang`, que deben ser
    // reciprocos: una pagina solo anuncia las traducciones que existen.
    const pages = new Map();
    for (const lang of Object.keys(LANGUAGES)) {
        const langDir = join(CONTENT, lang);
        for (const file of walk(langDir, (n) => n.endsWith('.md'))) {
            const path = canonicalPath(file, langDir);
            if (!pages.has(path)) pages.set(path, { path, versions: {} });
            pages.get(path).versions[lang] = file;
        }
    }

    let count = 0;
    for (const page of pages.values()) {
        const available = Object.keys(page.versions);

        for (const [lang, file] of Object.entries(page.versions)) {
            const raw = readFileSync(file, 'utf8');
            const { meta, body } = parseFrontMatter(raw);

            const headings = [];
            const html = render(insertDiagrams(insertSnippets(body), lang), {
                highlight,
                headings,
            });

            const document = renderPage({
                lang,
                path: page.path,
                title: meta.title || 'Vesta',
                description: meta.description || '',
                content: html,
                available,
                section: meta.section || '',
                bodyClass: meta.layout ? `layout-${meta.layout}` : '',
                jsonLd: page.path === '/' ? homeJsonLd(lang) : '',
            });

            const outPath = join(OUT, urlFor(lang, page.path).replace(/^\//, ''), 'index.html');
            emit(outPath, document);
            count += 1;
        }
    }

    // Recursos estaticos tal cual.
    if (existsSync(ASSETS)) {
        cpSync(ASSETS, join(OUT, 'assets'), { recursive: true });
    }

    emit(
        join(OUT, 'sitemap.xml'),
        sitemap([...pages.values()].map((p) => ({ path: p.path, available: Object.keys(p.versions) })))
    );
    emit(
        join(OUT, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
    );
    // Pages sirve rutas con guion bajo inicial solo si el sitio no pasa por
    // Jekyll; este fichero lo desactiva.
    emit(join(OUT, '.nojekyll'), '');

    console.log(`${count} paginas en ${Date.now() - started} ms -> dist/`);
}

/** Sirve `dist/` en local, para revisar antes de publicar. */
async function serve() {
    const { createServer } = await import('node:http');
    // La tabla debe cubrir TODAS las extensiones que el sitio sirve. Un tipo
    // incorrecto no es un detalle cosmetico: el navegador rechaza ejecutar un
    // modulo que no llegue como JavaScript, y la pagina se queda sin scripts sin
    // que nada mas falle de forma visible. Faltaba `.mjs` justamente aqui.
    const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.mjs': 'text/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.xml': 'application/xml; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff2': 'font/woff2',
    };

    createServer((req, res) => {
        let path = decodeURIComponent(req.url.split('?')[0]);
        if (path.endsWith('/')) path += 'index.html';
        const file = join(OUT, path);

        if (!existsSync(file) || statSync(file).isDirectory()) {
            res.writeHead(404, { 'content-type': 'text/plain' });
            res.end('404');
            return;
        }
        const ext = path.slice(path.lastIndexOf('.'));
        res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' });
        res.end(readFileSync(file));
    }).listen(8080, () => console.log('http://localhost:8080'));
}

await build();
if (process.argv.includes('--serve')) await serve();
