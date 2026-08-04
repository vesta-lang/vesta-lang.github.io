/**
 * @file tools/site.mjs
 * @brief Configuracion del sitio: identidad, idiomas, navegacion y rutas.
 *
 * Todo lo que aparece en mas de una pagina se declara aqui una sola vez. El
 * objetivo es que anadir una seccion o un idioma sea editar este fichero, no
 * buscar cadenas repartidas por las plantillas.
 *
 * Las rutas publicadas son un compromiso: una URL que ya se ha indexado no se
 * cambia sin dejar una redireccion, y GitHub Pages no permite redirecciones.
 * Por eso conviene pensarlas aqui antes de publicar, no despues.
 */

/** Dominio canonico. Necesario para `canonical`, `hreflang` y el sitemap. */
export const SITE_URL = 'https://vesta-lang.github.io';

/** Repositorio publico del proyecto. */
export const REPO_URL = 'https://github.com/vesta-lang/vesta';

/**
 * Idiomas del sitio.
 *
 * El ingles ocupa la raiz y hace de `x-default` porque es donde esta la
 * audiencia de un lenguaje de programacion; el espanol vive bajo `/es/`. No hay
 * redireccion de idioma: Pages no la soporta, y forzarla con JavaScript
 * romperia el rastreo de los buscadores.
 */
export const LANGUAGES = {
    en: { code: 'en', label: 'English', prefix: '', default: true },
    es: { code: 'es', label: 'Español', prefix: '/es' },
};

/**
 * Navegacion principal.
 *
 * El orden refleja el recorrido esperado del visitante: primero aprender,
 * luego consultar, y solo despues la maquinaria. `Compiler Internals` va al
 * final a proposito -- es la seccion mas densa y ponerla antes intimidaria a
 * quien solo quiere probar el lenguaje.
 */
export const NAV = [
    { id: 'learn', path: '/learn/', en: 'Learn', es: 'Aprende' },
    { id: 'docs', path: '/docs/', en: 'Documentation', es: 'Documentación' },
    { id: 'stdlib', path: '/stdlib/', en: 'Standard Library', es: 'Biblioteca' },
    // "Compiler Internals" no se traduce literalmente: "interioridades" en
    // castellano connota intimidades, no maquinaria. "Arquitectura" describe lo
    // que hay dentro (SSA, optimizador, JIT, enlazador, GC, cache) y cabe en la
    // navegacion junto al resto.
    { id: 'internals', path: '/internals/', en: 'Compiler Internals', es: 'Arquitectura' },
    { id: 'download', path: '/download/', en: 'Download', es: 'Descargas' },
];

/** Enlace al texto completo de la licencia, en el repositorio del proyecto. */
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

/**
 * Cadenas de interfaz que no forman parte del contenido de las paginas.
 *
 * El texto de licencia del pie destaca la excepcion de runtime antes que la
 * GPL. No es un adorno legal: para quien evalua el lenguaje, el dato que
 * decide es si lo que escriba queda contaminado por la licencia del
 * compilador, y la respuesta es que no. Enterrarlo detras de "GPLv2" haria que
 * mucha gente descartara el proyecto por un motivo que no aplica.
 */
export const UI = {
    en: {
        skip: 'Skip to content',
        langLabel: 'Language',
        repo: 'Source code',
        footer: 'Vesta is developed in the open.',
        toc: 'On this page',
        licenseTitle: 'License',
        licenseBody:
            'The Vesta toolchain is free software under the GPLv2, with a runtime ' +
            'exception: <strong>the programs you write and compile with Vesta are ' +
            'not covered by the GPL</strong> and you may license them however you like.',
        licenseLink: 'Read the full license',
    },
    es: {
        skip: 'Saltar al contenido',
        langLabel: 'Idioma',
        repo: 'Código fuente',
        footer: 'Vesta se desarrolla en abierto.',
        toc: 'En esta página',
        licenseTitle: 'Licencia',
        licenseBody:
            'Las herramientas de Vesta son software libre bajo GPLv2, con una ' +
            'excepción de runtime: <strong>los programas que escribas y compiles ' +
            'con Vesta no quedan sujetos a la GPL</strong> y puedes licenciarlos ' +
            'como quieras.',
        licenseLink: 'Leer la licencia completa',
    },
};

/**
 * Construye la URL publica de una pagina.
 *
 * @param {string} lang Codigo de idioma.
 * @param {string} path Ruta canonica de la pagina, empezando por `/`.
 * @returns {string} Ruta absoluta dentro del sitio, con barra final.
 */
export function urlFor(lang, path) {
    const prefix = LANGUAGES[lang].prefix;
    if (path === '/') return prefix === '' ? '/' : `${prefix}/`;
    return `${prefix}${path}`;
}
