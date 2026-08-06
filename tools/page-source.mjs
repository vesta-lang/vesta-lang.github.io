/**
 * @file page-source.mjs
 * @brief Construye la version descargable en Markdown de una pagina.
 *
 * El fuente de una pagina no se puede servir tal cual. Lleva front matter, que
 * es configuracion del sitio y no contenido, y lleva marcadores como
 * `<!-- SNIPPET:control -->` que solo significan algo dentro del build: quien
 * descargara el fichero se encontraria un hueco donde deberia estar el codigo.
 *
 * Este modulo resuelve esos marcadores contra las mismas fuentes que usa el
 * HTML, de modo que el `.md` descargado y la pagina publicada dicen lo mismo.
 * Es la razon de que la expansion se haga aqui y no copiando el `.vx` a mano:
 * una copia se desincroniza en cuanto alguien toca el fragmento.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Textos que el fichero descargado anade por su cuenta.
 *
 * Van traducidos porque el `.md` sobrevive a la pagina: alguien lo abrira
 * meses despues, fuera del sitio, y el idioma del contenido tiene que
 * corresponderse con el de la nota al pie.
 */
const NOTES = {
    en: {
        from: 'Source',
        footer: 'This page is part of the Vesta documentation',
        license: 'Text under the same license as the project',
    },
    es: {
        from: 'Fuente',
        footer: 'Esta pagina forma parte de la documentacion de Vesta',
        license: 'Texto bajo la misma licencia que el proyecto',
    },
};

/**
 * Expande los marcadores de fragmento a bloques de codigo reales.
 *
 * Toma el codigo del indice `.tokens.json` y no del `.vx`, porque el indice es
 * lo que el build ya ha verificado: guarda el fuente junto a su hash y junto al
 * veredicto del compilador. Si los dos ficheros discreparan, el build habria
 * fallado antes de llegar aqui.
 *
 * @param {string} markdown Cuerpo de la pagina.
 * @param {string} snippetsDir Directorio de los fragmentos.
 * @param {{from: string}} notes Textos traducidos.
 * @returns {string} Cuerpo con los fragmentos incrustados.
 */
function expandSnippets(markdown, snippetsDir, notes) {
    return markdown.replace(/<!--\s*SNIPPET:([A-Za-z0-9_-]+)\s*-->/g, (_, name) => {
        const indexPath = join(snippetsDir, `${name}.tokens.json`);
        if (!existsSync(indexPath)) {
            throw new Error(`El fragmento "${name}" no tiene indice.`);
        }
        const index = JSON.parse(readFileSync(indexPath, 'utf8'));

        // La cita de origen acompana al codigo por el mismo motivo que en la
        // pagina: el lector puede ir al repositorio, abrir ese fichero y
        // comprobar que compila. Sin ella, el bloque es solo una afirmacion.
        return [
            `${notes.from}: \`site/snippets/${name}.vx\``,
            '',
            '```vx',
            index.source.replace(/\s+$/, ''),
            '```',
        ].join('\n');
    });
}

/**
 * Elimina los marcadores que no tienen equivalente en Markdown plano.
 *
 * Los diagramas son SVG generados por codigo y las pestanas son una
 * construccion de CSS: ninguna de las dos sobrevive fuera del sitio. Dejar el
 * comentario a la vista seria peor que quitarlo, porque parece un error.
 *
 * @param {string} markdown Cuerpo de la pagina.
 * @returns {string} Cuerpo sin marcadores irresolubles.
 */
function dropVisualMarkers(markdown) {
    return markdown
        .replace(/<!--\s*DIAGRAM:[a-z-]+\s*-->\n?/g, '')
        .replace(/<!--\s*\/?TABS?[^>]*-->\n?/g, '');
}

/**
 * Convierte los enlaces internos en absolutos.
 *
 * Dentro del sitio, `[la doc](/docs/)` funciona. En un fichero descargado no
 * lleva a ninguna parte: no hay origen contra el que resolver la barra
 * inicial, asi que el enlace queda apuntando a la raiz del disco de quien lo
 * abra. Se reescriben con el dominio delante para que el documento siga siendo
 * util fuera del navegador.
 *
 * @param {string} markdown Cuerpo de la pagina.
 * @param {string} siteUrl Origen del sitio, sin barra final.
 * @returns {string} Cuerpo con los enlaces absolutos.
 */
function absolutizeLinks(markdown, siteUrl) {
    // Solo `](/...)`: una barra inicial dentro de un destino de enlace. Los
    // enlaces con protocolo y los anclas de la propia pagina no casan, que es
    // justo lo que se quiere.
    return markdown.replace(/\]\(\/([^)]*)\)/g, `](${siteUrl}/$1)`);
}

/**
 * Construye el Markdown descargable de una pagina.
 *
 * @param {Object} options
 * @param {string} options.body Cuerpo de la pagina, ya sin front matter.
 * @param {string} options.title Titulo de la pagina, para la nota al pie.
 * @param {string} options.url URL canonica de la pagina publicada.
 * @param {string} options.lang Idioma de la pagina.
 * @param {string} options.snippetsDir Directorio de los fragmentos.
 * @param {string} options.siteUrl Origen del sitio, sin barra final.
 * @returns {string} Contenido del fichero `.md`.
 */
export function pageSource({ body, title, url, lang, snippetsDir, siteUrl }) {
    const notes = NOTES[lang] || NOTES.en;
    const content = absolutizeLinks(
        dropVisualMarkers(expandSnippets(body, snippetsDir, notes)),
        siteUrl
    ).trim();

    // La URL de origen va al final y no al principio para que el fichero
    // empiece por su propio encabezado: asi se lee igual que cualquier otro
    // documento, y quien solo quiera el texto no tiene que saltarse una
    // cabecera de procedencia.
    return [
        content,
        '',
        '---',
        '',
        `${notes.footer}: <${url}>`,
        '',
        `${notes.license}: <https://github.com/vesta-lang/vesta>`,
        '',
    ].join('\n');
}

/**
 * Deriva la ruta del `.md` a partir de la URL de la pagina.
 *
 * Se emite como hermano del directorio y no dentro de el (`/learn/foo.md` en
 * lugar de `/learn/foo/index.md`) porque el navegador toma el nombre del
 * fichero descargado de la URL: `index.md` acabaria en la carpeta de descargas
 * de todo el mundo sin decir de que pagina venia.
 *
 * @param {string} url Ruta publica de la pagina, terminada en barra.
 * @returns {string} Ruta publica del fichero Markdown.
 */
export function sourceUrlFor(url) {
    return `${url.replace(/\/$/, '')}.md`;
}
