/**
 * @file tools/docs.mjs
 * @brief Navegacion de las secciones de documentacion.
 *
 * Construye las tres piezas que rodean a una pagina de documentacion: la barra
 * lateral con el recorrido completo, el indice de la propia pagina y la
 * navegacion de anterior y siguiente.
 *
 * Las tres salen del MISMO indice (`site/content/learn.mjs`), de modo que no
 * pueden contradecirse. Mantenerlas por separado -- una barra lateral escrita a
 * mano, un indice escrito a mano -- garantiza que antes o despues digan cosas
 * distintas, y quien lee no sabe cual creer.
 */

import { escapeHtml, renderInline } from './markdown.mjs';
import { chapterHref } from '../site/content/learn.mjs';
import { urlFor } from './site.mjs';

/** Textos de la navegacion, por idioma. */
const UI = {
    en: {
        sections: 'Sections',
        onThisPage: 'On this page',
        previous: 'Previous',
        next: 'Next',
        draft: 'not written yet',
        progress: (done, total) => `${done} of ${total} chapters written`,
    },
    es: {
        sections: 'Secciones',
        onThisPage: 'En esta pagina',
        previous: 'Anterior',
        next: 'Siguiente',
        draft: 'sin escribir',
        progress: (done, total) => `${done} de ${total} capitulos escritos`,
    },
};

/**
 * Construye la barra lateral con el recorrido completo.
 *
 * Los capitulos pendientes se muestran, sin enlace y marcados. Ocultarlos haria
 * parecer terminada una seccion que no lo esta, y el lector no tendria forma de
 * saber que el recorrido continua.
 *
 * @param {Array} parts Indice de la seccion.
 * @param {string} lang Idioma.
 * @param {string} current Ruta canonica de la pagina actual.
 * @returns {string} HTML de la barra lateral.
 */
export function sidebar(parts, lang, current) {
    const t = UI[lang] || UI.en;

    const groups = parts.map((part) => {
        const items = part.chapters.map((chapter) => {
            const { href: raw, own } = chapterHref(chapter, lang);
            const label = escapeHtml(chapter.title[lang]);

            if (chapter.draft) {
                return (
                    `<li class="is-draft"><span title="${t.draft}">${label}</span></li>`
                );
            }
            const href = own ? raw : urlFor(lang, raw);
            const active = href === current ? ' aria-current="page"' : '';
            return `<li><a href="${href}"${active}>${label}</a></li>`;
        });

        return (
            `<li class="doc-part">` +
            `<h3>${escapeHtml(part.title[lang])}</h3>` +
            `<ul>${items.join('')}</ul>` +
            `</li>`
        );
    });

    return (
        `<nav class="doc-sidebar" aria-label="${t.sections}">` +
        `<ul>${groups.join('')}</ul>` +
        `</nav>`
    );
}

/**
 * Construye la barra lateral de la referencia.
 *
 * A diferencia de Learn, que es una lista plana porque se lee en orden y tiene
 * un final, la referencia crece indefinidamente y se entra por el medio. Una
 * barra lateral con las paginas de los cuatro libros a la vez dejaria de
 * servir para navegar en cuanto pasara de una pantalla, que es casi de
 * inmediato.
 *
 * Por eso solo se despliega el libro actual. El resto ocupan una linea cada
 * uno, enlazando a su portada: siguen visibles, porque esconderlos dejaria al
 * lector sin saber que existen, pero no compiten con la pagina que esta
 * leyendo.
 *
 * @param {Array} books Indice de la referencia.
 * @param {string} lang Idioma.
 * @param {string} current Ruta canonica de la pagina actual.
 * @param {Function} bookHref Constructor de la ruta de la portada de un libro.
 * @param {Function} pageHref Constructor de la ruta de una pagina.
 * @returns {string} HTML de la barra lateral.
 */
export function referenceSidebar(books, lang, current, bookHref, pageHref) {
    const t = UI[lang] || UI.en;

    const groups = books.map((book) => {
        const home = bookHref(book, lang);
        const open = current === home || current.startsWith(home);
        const label = escapeHtml(book.title[lang]);
        const active = current === home ? ' aria-current="page"' : '';

        const head =
            `<h3><a href="${urlFor(lang, home)}"${active}>${label}</a></h3>`;

        if (!open) return `<li class="doc-part is-closed">${head}</li>`;

        const items = book.pages.map((page) => {
            const href = pageHref(book, page, lang);
            const title = escapeHtml(page.title[lang]);

            if (page.draft) {
                return `<li class="is-draft"><span title="${t.draft}">${title}</span></li>`;
            }
            const mark = href === current ? ' aria-current="page"' : '';
            return `<li><a href="${urlFor(lang, href)}"${mark}>${title}</a></li>`;
        });

        return `<li class="doc-part">${head}<ul>${items.join('')}</ul></li>`;
    });

    return (
        `<nav class="doc-sidebar" aria-label="${t.sections}">` +
        `<ul>${groups.join('')}</ul>` +
        `</nav>`
    );
}

/**
 * Construye el listado de paginas de la portada de un libro.
 *
 * Sale del mismo indice que la barra lateral. Escrito a mano en cada portada
 * se quedaria sin la pagina anadida ayer, y una portada incompleta es peor que
 * ninguna: quien la consulta cree haber visto el libro entero.
 *
 * Las paginas pendientes aparecen sin enlace y marcadas, por el mismo motivo
 * que en Learn: ocultarlas haria parecer terminado un libro que no lo esta.
 *
 * @param {Object} book Libro.
 * @param {string} lang Idioma.
 * @param {Function} pageHref Constructor de la ruta de una pagina.
 * @returns {string} HTML del listado.
 */
export function bookIndex(book, lang, pageHref) {
    const t = UI[lang] || UI.en;

    const items = book.pages.map((page) => {
        const title = escapeHtml(page.title[lang]);
        if (page.draft) {
            return `<li class="is-draft"><span title="${t.draft}">${title}</span></li>`;
        }
        return `<li><a href="${urlFor(lang, pageHref(book, page, lang))}">${title}</a></li>`;
    });

    return `<ul class="book-index">${items.join('')}</ul>`;
}

/**
 * Construye el indice de la propia pagina.
 *
 * Solo se listan los encabezados de segundo nivel. Incluir los de tercero
 * convierte el indice en un duplicado del texto y deja de servir para orientar,
 * que es lo unico que tiene que hacer.
 *
 * @param {Array<{level: number, text: string, id: string}>} headings Encabezados.
 * @param {string} lang Idioma.
 * @returns {string} HTML del indice, o cadena vacia si no hay suficientes.
 */
export function tableOfContents(headings, lang) {
    const t = UI[lang] || UI.en;
    const items = headings.filter((h) => h.level === 2);

    // Con uno o dos encabezados el indice no orienta: solo repite lo que ya se
    // ve al bajar la vista.
    if (items.length < 3) return '';

    // El texto del encabezado se procesa como Markdown, igual que en el cuerpo:
    // un titulo que contiene `codigo` debe verse como codigo tambien aqui, no
    // con las comillas invertidas a la vista.
    const links = items
        .map((h) => `<li><a href="#${h.id}">${renderInline(h.text)}</a></li>`)
        .join('');

    return (
        `<nav class="doc-toc" aria-label="${t.onThisPage}">` +
        `<h2>${t.onThisPage}</h2><ul>${links}</ul></nav>`
    );
}

/**
 * Construye la navegacion de anterior y siguiente.
 *
 * Se salta los capitulos sin escribir en lugar de enlazarlos: un enlace a una
 * pagina que no existe rompe el recorrido justo cuando el lector confia en el.
 *
 * @param {Array} flat Lista plana de capitulos, en orden de lectura.
 * @param {number} index Posicion del capitulo actual.
 * @param {string} lang Idioma.
 * @returns {string} HTML del pie de navegacion.
 */
export function pager(flat, index, lang) {
    const t = UI[lang] || UI.en;

    /**
     * Busca el capitulo escrito mas cercano en una direccion.
     *
     * @param {number} from Posicion de partida.
     * @param {number} step -1 hacia atras, +1 hacia adelante.
     * @returns {Object|null}
     */
    const nearest = (from, step) => {
        for (let i = from + step; i >= 0 && i < flat.length; i += step) {
            if (!flat[i].chapter.draft) return flat[i];
        }
        return null;
    };

    const previous = nearest(index, -1);
    const next = nearest(index, 1);
    if (!previous && !next) return '';

    /**
     * Renderiza un extremo de la navegacion.
     *
     * @param {Object|null} entry Capitulo destino.
     * @param {string} label Rotulo.
     * @param {string} side Clase de posicion.
     * @returns {string}
     */
    const link = (entry, label, side) => {
        if (!entry) return '<span></span>';
        const { href: raw, own } = chapterHref(entry.chapter, lang);
        const href = own ? raw : urlFor(lang, raw);
        return (
            `<a class="doc-pager-link ${side}" href="${href}">` +
            `<span class="doc-pager-label">${label}</span>` +
            `<span class="doc-pager-title">${escapeHtml(entry.chapter.title[lang])}</span>` +
            `</a>`
        );
    };

    return (
        `<nav class="doc-pager" aria-label="${t.previous} / ${t.next}">` +
        `${link(previous, t.previous, 'is-prev')}` +
        `${link(next, t.next, 'is-next')}` +
        `</nav>`
    );
}

/**
 * Devuelve el texto de progreso de la seccion.
 *
 * Se muestra mientras la seccion esta incompleta. Decir cuanto falta es mas
 * honesto que dejar que el lector lo descubra encontrandose capitulos vacios, y
 * ademas justifica los que aparecen sin enlace.
 *
 * @param {{total: number, done: number}} progress Recuento.
 * @param {string} lang Idioma.
 * @returns {string} HTML, o cadena vacia si ya esta completa.
 */
export function progressNote(progress, lang) {
    const t = UI[lang] || UI.en;
    if (progress.done >= progress.total) return '';
    return `<p class="doc-progress">${t.progress(progress.done, progress.total)}</p>`;
}
