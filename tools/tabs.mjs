/**
 * @file tools/tabs.mjs
 * @brief Pestanas sin JavaScript, a partir de marcadores en el Markdown.
 *
 * Un grupo de pestanas se escribe asi en la pagina:
 *
 *     <!-- TABS:instalar -->
 *     <!-- TAB:descargar Descargar -->
 *     ... Markdown normal ...
 *     <!-- TAB:compilar Compilar desde el fuente -->
 *     ... Markdown normal ...
 *     <!-- TABS:end -->
 *
 * Los marcadores son comentarios HTML, de modo que el conversor de Markdown los
 * deja pasar y el contenido de cada pestana se procesa como cualquier otro
 * texto: encabezados, listas y bloques de codigo resaltados incluidos. La
 * conversion a la estructura final ocurre DESPUES, sobre el HTML ya generado.
 *
 * El mecanismo son campos de opcion mas selectores de hermano en CSS, no
 * JavaScript. Tres motivos: el contenido de todas las pestanas viaja en el HTML
 * y por tanto se indexa entero; funciona con los scripts bloqueados; y los
 * campos de opcion ya traen navegacion por teclado, que habria que reimplementar
 * a mano con una version en JavaScript.
 */

import { escapeHtml } from './markdown.mjs';

/**
 * Convierte los marcadores de pestanas en su estructura HTML.
 *
 * @param {string} html Documento ya convertido desde Markdown.
 * @returns {string} Documento con las pestanas montadas.
 */
export function insertTabs(html) {
    const groupStart = /<!--\s*TABS:([a-z0-9-]+)\s*-->/;

    let out = html;
    let guard = 0;

    while (groupStart.test(out) && guard < 32) {
        guard += 1;

        const start = out.match(groupStart);
        const group = start[1];
        const endMarker = '<!-- TABS:end -->';

        const from = start.index;
        const to = out.indexOf(endMarker, from);
        if (to === -1) {
            throw new Error(`El grupo de pestanas "${group}" no se cierra`);
        }

        const body = out.slice(from + start[0].length, to);

        // Cada pestana empieza en su marcador y termina donde empieza la
        // siguiente.
        const marks = [...body.matchAll(/<!--\s*TAB:([a-z0-9-]+)\s+([^>]*?)\s*-->/g)];
        if (marks.length === 0) {
            throw new Error(`El grupo de pestanas "${group}" no tiene pestanas`);
        }

        const tabs = marks.map((mark, index) => {
            const next = index + 1 < marks.length ? marks[index + 1].index : body.length;
            return {
                id: `${group}-${mark[1]}`,
                label: mark[2],
                content: body.slice(mark.index + mark[0].length, next),
            };
        });

        // Los campos de opcion van TODOS antes que los paneles: el selector de
        // hermano de CSS solo mira hacia adelante, asi que un panel solo puede
        // reaccionar a un campo que lo preceda.
        const inputs = tabs
            .map(
                (tab, index) =>
                    `<input class="tab-radio" type="radio" name="${escapeHtml(group)}" ` +
                    `id="${escapeHtml(tab.id)}"${index === 0 ? ' checked' : ''}>`
            )
            .join('\n');

        const labels = tabs
            .map(
                (tab) =>
                    `<label class="tab-label" for="${escapeHtml(tab.id)}">` +
                    `${escapeHtml(tab.label)}</label>`
            )
            .join('\n');

        const panels = tabs
            .map(
                (tab) =>
                    `<section class="tab-panel" data-tab="${escapeHtml(tab.id)}">\n` +
                    `${tab.content}\n</section>`
            )
            .join('\n');

        const rendered =
            `<div class="tabs" data-group="${escapeHtml(group)}">\n${inputs}\n` +
            `<div class="tab-bar">\n${labels}\n</div>\n${panels}\n</div>`;

        out = out.slice(0, from) + rendered + out.slice(to + endMarker.length);
    }

    return out;
}

/**
 * Genera las reglas CSS que enlazan cada campo de opcion con su panel.
 *
 * Se emiten desde aqui porque dependen de los identificadores concretos de cada
 * grupo, que no se conocen al escribir la hoja de estilos. El resto de la
 * apariencia vive en `site.css`, donde corresponde.
 *
 * @param {string} html Documento con las pestanas ya montadas.
 * @returns {string} Bloque `<style>`, o cadena vacia si no hay pestanas.
 */
export function tabStyles(html) {
    const ids = [...html.matchAll(/class="tab-panel" data-tab="([^"]+)"/g)].map((m) => m[1]);
    if (ids.length === 0) return '';

    const rules = ids
        .map(
            (id) =>
                `#${id}:checked ~ [data-tab="${id}"] { display: block }\n` +
                `#${id}:checked ~ .tab-bar [for="${id}"] { color: var(--fg); ` +
                `border-bottom-color: var(--accent) }`
        )
        .join('\n');

    return `<style>\n${rules}\n</style>`;
}
