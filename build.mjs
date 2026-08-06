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
import { socialCard } from './tools/og-image.mjs';
import { insertTabs, tabStyles } from './tools/tabs.mjs';
import {
    bookIndex,
    pager,
    referenceSidebar,
    sidebar,
    tableOfContents,
} from './tools/docs.mjs';
import { LEARN, chapterHref, flatChapters } from './site/content/learn.mjs';
import { DOCS, bookHref, docsHref, flatPages } from './site/content/docs.mjs';
import { renderTagLegend, renderTags, tagStylesheet } from './site/content/tags.mjs';
import { parseFrontMatter, render } from './tools/markdown.mjs';
import { pageSource, sourceUrlFor } from './tools/page-source.mjs';
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
    // La pagina de error es la excepcion: GitHub Pages la sirve desde
    // `/404.html` exactamente, no desde un directorio con indice.
    if (noExt === '404') return '/404.html';
    if (noExt.endsWith('/index')) return `/${noExt.slice(0, -'/index'.length)}/`;
    return `/${noExt}/`;
}

/**
 * Construye el indice de rutas equivalentes entre idiomas.
 *
 * Devuelve, para cada ruta canonica, la identidad de la pagina a la que
 * pertenece. Dos rutas con la misma identidad son la misma pagina escrita en
 * dos idiomas, aunque su ultimo segmento no se parezca en nada.
 *
 * La informacion no se inventa aqui: los indices de Learn y de la referencia
 * ya declaran el slug de cada idioma, de modo que ellos son quienes emparejan.
 * Deducirlo del nombre del fichero era el defecto que esto corrige, porque un
 * slug traducido dejaba a cada version huerfana de la otra.
 *
 * Las paginas que no estan en ningun indice (portada, descarga, error) usan su
 * propia ruta como identidad, que es correcto: su ultimo segmento no se
 * traduce.
 *
 * @returns {Map<string,string>} Ruta canonica -> identidad.
 */
function translationIndex() {
    const map = new Map();
    const langs = Object.keys(LANGUAGES);

    for (const { chapter } of flatChapters()) {
        // Los capitulos que apuntan a otra seccion no tienen pagina propia.
        if (chapter.path) continue;
        for (const lang of langs) {
            map.set(chapterHref(chapter, lang).href, `learn:${chapter.id}`);
        }
    }

    for (const book of DOCS) {
        for (const lang of langs) {
            map.set(bookHref(book, lang), `docs:${book.id}`);
        }
        for (const page of book.pages) {
            for (const lang of langs) {
                map.set(docsHref(book, page, lang), `docs:${book.id}/${page.id}`);
            }
        }
    }

    return map;
}

/**
 * Indica si una ruta corresponde a la pagina de error.
 *
 * Se comprueba en varios sitios (nombre del fichero de salida, sitemap,
 * hreflang) y merece un nombre en lugar de repetir la comparacion.
 *
 * @param {string} path Ruta canonica.
 * @returns {boolean}
 */
const isErrorPage = (path) => path === '/404.html';

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
 * Sustituye los marcadores de etiquetas por su fila.
 *
 * Las etiquetas van en un marcador dentro del texto y no en el front matter
 * porque **cada entrada tiene las suyas**. Una pagina de la referencia agrupa
 * muchas construcciones, y decir que la pagina entera es `estable` cuando una
 * de sus entradas no lo es seria justo el tipo de afirmacion que la seccion no
 * puede permitirse.
 *
 * El vocabulario esta cerrado: `renderTags` lanza ante una etiqueta que no
 * conozca, y eso detiene el build. Es deliberado. Una etiqueta mal escrita no
 * se ve en la pagina -- sale una mas o sale una menos -- pero parte en dos los
 * indices cruzados, que es donde se nota cuando ya nadie recuerda por que.
 *
 * @param {string} markdown Contenido de la pagina.
 * @param {string} lang Idioma de la pagina.
 * @param {string} file Fichero de origen, para el mensaje de error.
 * @returns {string} Contenido con los marcadores resueltos.
 */
function insertTags(markdown, lang, file) {
    return markdown
        .replace(/<!--\s*TAGLEGEND\s*-->/g, () => renderTagLegend(lang))
        .replace(/<!--\s*TAGS:([^>]*?)-->/g, (_, list) => {
            const tags = list.trim().split(/[\s,]+/).filter(Boolean);
            try {
                return renderTags(tags, lang);
            } catch (error) {
                throw new Error(`${file}: ${error.message}`);
            }
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
 * Se listan todas las variantes de idioma como URLs independientes, sin mas.
 *
 * NO se anotan aqui los `hreflang`. Habia dos motivos para quitarlos. El
 * esquema oficial de sitemaps.org define `<url>` como una secuencia cerrada de
 * `loc`, `lastmod`, `changefreq` y `priority`, sin punto de extension, asi que
 * los `<xhtml:link>` -- pese a estar documentados por Google -- hacen que el
 * fichero no valide. Y ademas sobran: cada pagina ya declara sus `hreflang`
 * reciprocos en su propia cabecera, que es uno de los metodos admitidos.
 * Anotarlos tambien aqui seria mantener la misma verdad en dos sitios.
 *
 * Tampoco se emite `lastmod`: sin fechas reales de cambio por pagina, poner la
 * del build haria que todas las URLs se declararan modificadas en cada
 * publicacion, que es peor que no decir nada.
 *
 * @param {Array<Object<string,string>>} pages Rutas por idioma de cada pagina.
 * @returns {string} XML del sitemap.
 */
function sitemap(pages) {
    const entries = [];
    for (const versions of pages) {
        for (const [lang, path] of Object.entries(versions)) {
            entries.push(
                `    <url>\n        <loc>${SITE_URL}${urlFor(lang, path)}</loc>\n    </url>`
            );
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

/**
 * Comprueba que todos los enlaces internos apuntan a algo que existe.
 *
 * Un enlace roto no rompe el build ni aparece en ningun registro: simplemente
 * lleva al visitante a una pagina de error. Sin esta comprobacion el unico modo
 * de encontrarlos es que alguien los pise, y para entonces ya estan publicados.
 *
 * Hoy AVISA en lugar de fallar, porque la portada enlaza a secciones que
 * todavia se estan escribiendo. Cuando existan, este mismo recorrido debe pasar
 * a lanzar y a cortar la publicacion: un enlace roto en un sitio terminado es
 * un defecto, no un trabajo pendiente.
 *
 * @param {Map<string, {path: string}>} pages Paginas generadas.
 * @returns {number} Numero de destinos distintos que no resuelven.
 */
function checkLinks(pages) {
    // Rutas que el sitio sirve de verdad, en la forma en que se escriben en un
    // enlace.
    const known = new Set(['/404.html']);
    for (const page of pages.values()) {
        for (const [lang, { path }] of Object.entries(page.versions)) {
            known.add(urlFor(lang, path));
        }
    }

    const missing = new Map();
    for (const file of walk(OUT, (n) => n.endsWith('.html'))) {
        const html = readFileSync(file, 'utf8');
        const from = `/${relative(OUT, file).split(sep).join('/')}`;

        for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
            const href = match[1].split('#')[0];
            if (known.has(href)) continue;
            // Los recursos (hojas de estilo, imagenes, scripts) se comprueban
            // contra el disco; las paginas, contra la lista de rutas servidas.
            if (/\.[a-z0-9]+$/i.test(href)) {
                if (existsSync(join(OUT, href.replace(/^\//, '')))) continue;
            }
            if (!missing.has(href)) missing.set(href, new Set());
            missing.get(href).add(from);
        }
    }

    if (missing.size > 0) {
        console.warn(`
${missing.size} enlaces internos sin destino:`);
        for (const [href, sources] of [...missing].sort()) {
            console.warn(`  ${href}  <- ${[...sources].join(', ')}`);
        }
        console.warn('');
    }
    return missing.size;
}

/**
 * Contrasta el estado declarado de cada capitulo con lo que hay escrito.
 *
 * El indice de Learn marca con `draft` los capitulos aun por escribir, y la
 * barra lateral los muestra como texto muerto en lugar de enlazarlos. Eso hace
 * que las dos formas de equivocarse sean invisibles, cada una a su manera:
 *
 * - Un capitulo escrito que sigue marcado como borrador **se publica pero no
 *   se enlaza desde ninguna parte**. La pagina existe, responde 200 y nadie
 *   llega a ella. Es el fallo que motivo esta comprobacion.
 * - Un capitulo sin marcar del que no hay texto se enlaza hacia el vacio. Eso
 *   lo caza `checkLinks`, pero lo dice como un `href` roto mas, sin explicar
 *   que el problema esta en el indice.
 *
 * Avisa en lugar de fallar porque escribir un capitulo primero en un idioma y
 * luego en el otro es trabajo normal, y el estado intermedio es legitimo.
 *
 * @param {Map} pages Paginas encontradas, indexadas por ruta canonica.
 * @returns {void}
 */
function checkChapters(pages) {
    const huerfanos = [];
    const vacios = [];

    // Dos capitulos con el mismo slug producen la misma URL, y el segundo
    // sobrescribe al primero sin que nada lo diga. Ademas el `pager` localiza
    // el capitulo actual comparando rutas, asi que la navegacion de la pagina
    // afectada apunta al vecino equivocado. Salio de un slug copiado y pegado
    // entre dos capitulos que hablan de control de flujo.
    // Un capitulo cuyo slug no se traduce genera la misma ruta en los dos
    // idiomas, y eso es correcto: la ruta canonica es una sola. Solo importa
    // que dos capitulos DISTINTOS acaben en la misma.
    const vistos = new Map();
    for (const { chapter } of flatChapters()) {
        if (chapter.path) continue;
        for (const lang of Object.keys(LANGUAGES)) {
            const { href } = chapterHref(chapter, lang);
            const duenyo = vistos.get(href);
            if (duenyo && duenyo !== chapter.id) {
                console.warn(
                    `Slug duplicado: ${href} lo usan "${duenyo}" y "${chapter.id}".`
                );
            }
            vistos.set(href, chapter.id);
        }
    }

    for (const { chapter } of flatChapters()) {
        // Los capitulos que apuntan a una pagina de otra seccion, como la de
        // instalacion, no tienen fuente propia en Learn.
        if (chapter.path) continue;

        const versions = pages.get(`learn:${chapter.id}`)?.versions || {};
        for (const lang of Object.keys(LANGUAGES)) {
            const { href } = chapterHref(chapter, lang);
            const escrito = Boolean(versions[lang]);

            if (escrito && chapter.draft) huerfanos.push(`${href} [${lang}]`);
            if (!escrito && !chapter.draft) vacios.push(`${href} [${lang}]`);
        }
    }

    if (huerfanos.length > 0) {
        console.warn(`
${huerfanos.length} capitulos escritos que siguen marcados como borrador ` +
            '(se publican sin enlace):');
        for (const entry of huerfanos) console.warn(`  ${entry}`);
        console.warn('');
    }
    if (vacios.length > 0) {
        console.warn(`
${vacios.length} capitulos enlazados sin texto (quitar el enlace o escribirlos):`);
        for (const entry of vacios) console.warn(`  ${entry}`);
        console.warn('');
    }
}

/**
 * Contrasta el indice de la referencia con las paginas escritas.
 *
 * Es la misma comprobacion que `checkChapters` hace sobre Learn, y existe por
 * el mismo motivo: la barra lateral no enlaza lo marcado como borrador, asi
 * que una pagina escrita a la que se le olvido quitar la marca se publica sin
 * que nada apunte a ella.
 *
 * Comprueba ademas la portada de cada libro. Un libro sin portada deja un
 * agujero en la navegacion justo en el nivel intermedio, que es el que el
 * lector usa para orientarse entre los cuatro.
 *
 * @param {Map} pages Paginas encontradas, indexadas por ruta canonica.
 * @returns {void}
 */
function checkReference(pages) {
    const problemas = [];

    for (const lang of Object.keys(LANGUAGES)) {
        for (const book of DOCS) {
            const home = bookHref(book, lang);
            if (!pages.get(`docs:${book.id}`)?.versions[lang]) {
                problemas.push(`${home} [${lang}]: portada del libro sin escribir`);
            }
        }

        for (const { book, page } of flatPages()) {
            const href = docsHref(book, page, lang);
            const id = `docs:${book.id}/${page.id}`;
            const escrita = Boolean(pages.get(id)?.versions[lang]);

            if (escrita && page.draft) {
                problemas.push(`${href} [${lang}]: escrita pero marcada como borrador`);
            }
            if (!escrita && !page.draft) {
                problemas.push(`${href} [${lang}]: enlazada pero sin texto`);
            }
        }
    }

    if (problemas.length > 0) {
        console.warn(`\n${problemas.length} paginas de la referencia sin cuadrar:`);
        for (const p of problemas) console.warn(`  ${p}`);
        console.warn('');
    }
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

    // Primera pasada: agrupar las versiones de cada pagina para saber en que
    // idiomas existe. Sin esto no se pueden emitir los `hreflang`, que deben
    // ser reciprocos: una pagina solo anuncia las traducciones que existen.
    //
    // Se agrupa por IDENTIDAD y no por ruta. La diferencia importa en cuanto
    // un ultimo segmento se traduce: `/learn/control-flow/` y
    // `/learn/control-de-flujo/` son la misma pagina en dos idiomas, pero
    // como rutas no se parecen en nada. Agrupando por ruta, cada una quedaba
    // sola y se publicaba sin `hreflang` a su traduccion ni `x-default`, de
    // modo que un buscador las tomaba por dos paginas distintas y el selector
    // de idioma desaparecia justamente donde mas falta hace.
    const identities = translationIndex();
    const pages = new Map();
    for (const lang of Object.keys(LANGUAGES)) {
        const langDir = join(CONTENT, lang);
        for (const file of walk(langDir, (n) => n.endsWith('.md'))) {
            const path = canonicalPath(file, langDir);
            const id = identities.get(path) || path;
            if (!pages.has(id)) pages.set(id, { id, versions: {} });
            pages.get(id).versions[lang] = { file, path };
        }
    }

    let count = 0;
    for (const page of pages.values()) {
        // Rutas por idioma, para los `hreflang` y el selector: cada idioma
        // enlaza a SU ruta, no a la del idioma que se este generando.
        const versions = Object.fromEntries(
            Object.entries(page.versions).map(([code, v]) => [code, v.path])
        );

        for (const [lang, { file, path }] of Object.entries(page.versions)) {
            const raw = readFileSync(file, 'utf8');
            const { meta, body } = parseFrontMatter(raw);

            const headings = [];
            // Las pestanas se montan DESPUES de convertir el Markdown: sus
            // marcadores son comentarios, de modo que el contenido de cada una
            // se procesa como texto normal y conserva encabezados, listas y
            // bloques de codigo resaltados.
            // La portada de un libro lista sus paginas desde el indice, para
            // que no haya que mantener la misma lista en dos sitios.
            const libro = DOCS.find((b) => bookHref(b, lang) === path);
            const conIndice = libro
                ? body.replace(
                      /<!--\s*BOOKINDEX\s*-->/g,
                      () => bookIndex(libro, lang, docsHref)
                  )
                : body;

            const html = insertTabs(
                render(insertTags(insertDiagrams(insertSnippets(conIndice), lang), lang, file), {
                    highlight,
                    headings,
                })
            );

            // Las paginas de la referencia llevan la barra lateral de tres
            // niveles y el indice de la propia pagina, pero NO navegacion de
            // anterior y siguiente: la referencia no se lee en orden, y un pie
            // que invita a continuar sugiere un recorrido que no existe.
            let docs = null;
            if (path.startsWith('/docs/')) {
                docs = {
                    sidebar: referenceSidebar(
                        DOCS, lang, path, bookHref, docsHref
                    ),
                    toc: tableOfContents(headings, lang),
                    pager: '',
                };
            }

            // Las paginas de Learn llevan barra lateral, indice y navegacion
            // de anterior y siguiente. Las tres salen del mismo indice, asi que
            // no pueden contradecirse entre si.
            if (path.startsWith('/learn/')) {
                const flat = flatChapters();
                const position = flat.findIndex(
                    (entry) => chapterHref(entry.chapter, lang).href === path
                );

                // El fuente descargable se emite junto a la pagina. Solo en
                // Learn: son capitulos que se leen enteros y que alguien puede
                // querer llevarse para anotarlos o traducirlos. Una pagina de
                // consulta o la portada no tienen ese uso.
                const url = urlFor(lang, path);
                const sourceUrl = sourceUrlFor(url);
                emit(
                    join(OUT, sourceUrl.replace(/^\//, '')),
                    pageSource({
                        body,
                        title: meta.title || 'Vesta',
                        url: `${SITE_URL}${url}`,
                        lang,
                        snippetsDir: SNIPPETS,
                        siteUrl: SITE_URL,
                    })
                );

                docs = {
                    sidebar: sidebar(LEARN, lang, path),
                    toc: tableOfContents(headings, lang),
                    pager: position === -1 ? '' : pager(flat, position, lang),
                    sourceUrl,
                };
            }

            const document = renderPage({
                lang,
                path: path,
                title: meta.title || 'Vesta',
                description: meta.description || '',
                content: html,
                versions,
                section: meta.section || '',
                bodyClass: meta.layout ? `layout-${meta.layout}` : '',
                robots: meta.robots || '',
                jsonLd: path === '/' ? homeJsonLd(lang) : '',
                head: tabStyles(html),
                docs,
            });

            // La pagina de error se escribe como fichero suelto; el resto, como
            // indice de su directorio, para que las URLs acaben en barra.
            const target = urlFor(lang, path).replace(/^\//, '');
            const outPath = isErrorPage(path)
                ? join(OUT, target)
                : join(OUT, target, 'index.html');
            emit(outPath, document);
            count += 1;
        }
    }

    // Recursos estaticos tal cual.
    if (existsSync(ASSETS)) {
        cpSync(ASSETS, join(OUT, 'assets'), { recursive: true });
    }

    // Colores de las etiquetas. Se generan desde el vocabulario en lugar de
    // escribirse a mano porque el color de una etiqueta ya esta declarado
    // alli: mantenerlo tambien en un `.css` seria pedir que las dos copias se
    // separen a la primera etiqueta nueva.
    emit(join(OUT, 'assets', 'css', 'tags.css'), tagStylesheet());

    // Tarjeta social por idioma. Se genera en cada build para que no pueda
    // quedarse diciendo un titular que la portada ya cambio.
    for (const lang of Object.keys(LANGUAGES)) {
        emit(
            join(OUT, 'assets', `og-${lang}.svg`),
            socialCard(lang, join(ASSETS, 'img', 'logo.png'))
        );
    }

    emit(
        join(OUT, 'sitemap.xml'),
        sitemap(
            [...pages.values()]
                .map((p) =>
                    Object.fromEntries(
                        Object.entries(p.versions).map(([lang, v]) => [lang, v.path])
                    )
                )
                // La pagina de error no se indexa: anunciarla en el sitemap
                // invitaria al buscador a rastrear justamente lo que no existe.
                .filter((v) => !Object.values(v).some(isErrorPage))
        )
    );
    // El fichero se GENERA y no se versiona, porque lleva el dominio dentro:
    // escrito a mano se quedaria desactualizado en cuanto cambiara.
    //
    // La pagina de error se excluye del rastreo. Ya lleva `noindex`, pero eso
    // solo evita que se indexe DESPUES de pedirla; decirlo aqui ahorra la
    // peticion y, sobre todo, evita que el buscador la trate como una pagina
    // mas del sitio.
    emit(
        join(OUT, 'robots.txt'),
        [
            'User-agent: *',
            'Allow: /',
            'Disallow: /404.html',
            'Disallow: /es/404.html',
            // Los `.md` descargables son el mismo texto que su pagina HTML.
            // Rastrearlos no aporta nada al buscador y le da dos direcciones
            // para el mismo contenido, que es justo lo que hay que evitar.
            'Disallow: /*.md$',
            '',
            `Sitemap: ${SITE_URL}/sitemap.xml`,
            '',
        ].join('\n')
    );
    // Pages sirve rutas con guion bajo inicial solo si el sitio no pasa por
    // Jekyll; este fichero lo desactiva.
    emit(join(OUT, '.nojekyll'), '');

    checkChapters(pages);
    checkReference(pages);
    const broken = checkLinks(pages);
    console.log(
        `${count} paginas en ${Date.now() - started} ms -> dist/` +
            (broken > 0 ? ` (${broken} enlaces pendientes)` : '')
    );
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
        '.md': 'text/markdown; charset=utf-8',
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
            // Se sirve la misma pagina de error que servira Pages, para poder
            // revisarla igual que cualquier otra en lugar de a ciegas.
            const notFound = join(OUT, '404.html');
            res.writeHead(404, {
                'content-type': existsSync(notFound)
                    ? 'text/html; charset=utf-8'
                    : 'text/plain',
            });
            res.end(existsSync(notFound) ? readFileSync(notFound) : '404');
            return;
        }
        const ext = path.slice(path.lastIndexOf('.'));
        res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' });
        res.end(readFileSync(file));
    }).listen(8080, () => console.log('http://localhost:8080'));
}

await build();
if (process.argv.includes('--serve')) await serve();
