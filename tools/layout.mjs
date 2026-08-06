/**
 * @file tools/layout.mjs
 * @brief Plantilla HTML de las paginas del sitio.
 *
 * Produce el documento completo: cabecera con los metadatos que necesitan los
 * buscadores, navegacion, contenido y pie. Todo se resuelve en tiempo de
 * compilacion; el HTML servido esta completo antes de que corra una sola linea
 * de JavaScript.
 *
 * Los metadatos no son adorno. Una pagina sin `canonical` compite consigo
 * misma cuando se sirve en dos idiomas, y una sin `hreflang` reciproco hace que
 * el buscador elija por su cuenta que version mostrar.
 */

import { escapeHtml } from './markdown.mjs';
import {
    LANGUAGES,
    LICENSE_URL,
    NAV,
    RESOURCES,
    SITE_URL,
    REPO_URL,
    UI,
    urlFor,
} from './site.mjs';

/**
 * Genera los enlaces alternos entre idiomas de una pagina.
 *
 * Solo se declaran las variantes que EXISTEN. Anunciar un `hreflang` hacia una
 * traduccion que no se ha escrito manda al buscador a un 404 y perjudica a las
 * dos versiones.
 *
 * Recibe la ruta de CADA idioma y no una sola, porque el ultimo segmento se
 * traduce: `/learn/control-flow/` y `/learn/control-de-flujo/` son la misma
 * pagina, y construir la segunda anteponiendo el prefijo a la primera daria
 * una URL que no existe.
 *
 * @param {Object<string,string>} versions Ruta canonica por idioma.
 * @returns {string} Etiquetas `<link rel="alternate">`.
 */
function alternates(versions) {
    const links = [];
    for (const [lang, path] of Object.entries(versions)) {
        links.push(
            `<link rel="alternate" hreflang="${lang}" href="${SITE_URL}${urlFor(lang, path)}">`
        );
    }
    // El ingles hace de version por defecto para cualquier otro idioma.
    if (versions.en) {
        links.push(
            `<link rel="alternate" hreflang="x-default" ` +
                `href="${SITE_URL}${urlFor('en', versions.en)}">`
        );
    }
    return links.join('\n    ');
}

/**
 * Construye la barra de navegacion.
 *
 * @param {string} lang Idioma actual.
 * @param {string} current Identificador de la seccion activa, si la hay.
 * @returns {string} HTML de la navegacion.
 */
function nav(lang, current) {
    const items = NAV.map((item) => {
        const active = item.id === current ? ' aria-current="page"' : '';
        return `<a href="${urlFor(lang, item.path)}"${active}>${item[lang]}</a>`;
    });
    return items.join('\n            ');
}

/**
 * Construye el selector de idioma.
 *
 * Enlaza a la pagina EQUIVALENTE en el otro idioma, no a su portada: mandar al
 * home a quien esta leyendo una pagina concreta le obliga a volver a buscarla.
 * Si la traduccion no existe, el enlace no se muestra.
 *
 * @param {string} lang Idioma actual.
 * @param {Object<string,string>} versions Ruta canonica por idioma.
 * @returns {string} HTML del selector.
 */
function languageSwitch(lang, versions) {
    const others = Object.keys(versions).filter((code) => code !== lang);
    if (others.length === 0) return '';

    const links = others.map(
        (code) =>
            `<a href="${urlFor(code, versions[code])}" hreflang="${code}" lang="${code}">` +
            `${LANGUAGES[code].label}</a>`
    );
    return `<span class="lang-switch" aria-label="${UI[lang].langLabel}">${links.join('')}</span>`;
}

/**
 * Renderiza una pagina completa.
 *
 * @param {Object} page
 * @param {string} page.lang Codigo de idioma.
 * @param {string} page.path Ruta canonica, empezando y acabando por `/`.
 * @param {string} page.title Titulo unico de la pagina.
 * @param {string} page.description Descripcion para buscadores y redes.
 * @param {string} page.content HTML del cuerpo.
 * @param {Object<string,string>} page.versions Ruta canonica por idioma.
 * @param {string} [page.section] Identificador de la seccion activa.
 * @param {string} [page.bodyClass] Clase extra para el `<body>`.
 * @param {string} [page.jsonLd] Bloque JSON-LD ya serializado.
 * @returns {string} Documento HTML completo.
 */
export function renderPage(page) {
    const {
        lang,
        path,
        title,
        description,
        content,
        versions,
        section = '',
        bodyClass = '',
        jsonLd = '',
        robots = '',
        head = '',
        docs = null,
    } = page;

    const ui = UI[lang];
    const canonical = `${SITE_URL}${urlFor(lang, path)}`;
    // Imagen de la vista previa al compartir el enlace.
    //
    // La principal es un PNG porque varias plataformas grandes rechazan SVG en
    // `og:image` y, ante la duda, es mejor una imagen sencilla que se vea
    // siempre que una bonita que a veces no aparezca. La tarjeta compuesta se
    // declara detras, para los clientes que si la admiten.
    const ogImage = `${SITE_URL}/assets/img/logo.png`;
    const ogCard = `${SITE_URL}/assets/og-${lang}.svg`;

    return `<!doctype html>
<html lang="${lang}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    ${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ''}
    ${alternates(versions)}

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Vesta">
    <meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_US'}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="900">
    <meta property="og:image:height" content="900">
    <meta property="og:image:alt" content="${escapeHtml(title)}">
    <meta property="og:image" content="${ogCard}">
    <meta name="twitter:card" content="summary">

    <link rel="icon" href="/assets/img/logo.png" type="image/png">
    <link rel="apple-touch-icon" href="/assets/img/logo.png">
    <link rel="stylesheet" href="/assets/css/site.css">
    <link rel="stylesheet" href="/assets/css/code.css">
    <link rel="stylesheet" href="/assets/css/tags.css">
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
    ${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
    <a class="skip-link" href="#content">${ui.skip}</a>

    <header class="site-header">
        <a class="brand" href="${urlFor(lang, '/')}">
            <img src="/assets/img/logo.png" alt="" width="32" height="32">
            <span>Vesta</span>
        </a>
        <nav class="site-nav" aria-label="${lang === 'es' ? 'Principal' : 'Main'}">
            ${nav(lang, section)}
        </nav>
        <div class="header-aux">
            ${languageSwitch(lang, versions)}
            <a class="repo-link" href="${REPO_URL}" rel="noopener">${ui.repo}</a>
        </div>
    </header>

${docs
        ? `    <div class="doc-layout">
        ${docs.sidebar}
        <main id="content" class="doc-main">
${content}
${docs.pager}
        </main>
        <aside class="doc-aside">
${docs.toc}
${docs.sourceUrl
              ? `            <a class="doc-source" href="${docs.sourceUrl}" download>${ui.downloadMd}</a>`
              : ''}
        </aside>
    </div>`
        : `    <main id="content">
${content}
    </main>`}

    <footer class="site-footer">
        <div class="footer-grid">
            <div>
                <p>${ui.footer}</p>
                <ul class="footer-resources">
                    ${RESOURCES.map((r) => {
                        const note = r[`${lang}_note`];
                        return (
                            `<li><a href="${r.url}" rel="noopener">${r[lang]}</a>` +
                            (note ? ` <span>${escapeHtml(note)}</span>` : '') +
                            '</li>'
                        );
                    }).join('')}
                </ul>
            </div>
            <p class="footer-license"><strong>${ui.licenseTitle}</strong><br>
               ${ui.licenseBody}
               <a href="${LICENSE_URL}" rel="noopener">${ui.licenseLink}</a></p>
        </div>
    </footer>

    <script type="module" src="/assets/js/lang.mjs"></script>
    <script type="module" src="/assets/js/flame.mjs"></script>
    <script type="module" src="/assets/js/copy-code.mjs"></script>
    ${bodyClass.includes('layout-error')
        ? '<script type="module" src="/assets/js/error-path.mjs"></script>'
        : ''}
</body>
</html>
`;
}
