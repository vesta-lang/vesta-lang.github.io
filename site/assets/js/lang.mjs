/**
 * @file lang.mjs
 * @brief Deteccion del idioma preferido del visitante.
 *
 * GitHub Pages es un servidor estatico: no negocia `Accept-Language` ni admite
 * redirecciones, asi que la eleccion tiene que hacerse en el cliente. Eso
 * obliga a un cuidado que no haria falta en un servidor normal:
 *
 *  - El HTML servido esta COMPLETO y es valido en su idioma antes de que corra
 *    este script. Si nunca se ejecuta, la pagina se lee igual.
 *  - Los rastreadores no ejecutan esto de forma fiable, y da igual: cada
 *    version se indexa por su cuenta gracias a `canonical` y `hreflang`.
 *  - La redireccion ocurre UNA sola vez y solo para quien llega sin haber
 *    elegido. Redirigir a alguien que ya escogio idioma es un error clasico:
 *    convierte el selector en un boton que no funciona.
 *
 * Se usa `replace` y no `assign` para no dejar basura en el historial: el boton
 * de volver debe salir del sitio, no rebotar contra la redireccion.
 */

const STORAGE_KEY = 'vesta:lang';

/** Idiomas publicados. El ingles vive en la raiz; el resto, bajo su prefijo. */
const LANGUAGES = ['en', 'es'];
const DEFAULT_LANGUAGE = 'en';

/**
 * Deduce el idioma de una ruta del sitio.
 *
 * @param {string} pathname Ruta actual.
 * @returns {string} Codigo de idioma.
 */
function languageOfPath(pathname) {
    const segment = pathname.split('/').filter(Boolean)[0];
    return LANGUAGES.includes(segment) ? segment : DEFAULT_LANGUAGE;
}

/**
 * Traduce una ruta a su equivalente en otro idioma.
 *
 * @param {string} pathname Ruta actual.
 * @param {string} from Idioma de la ruta.
 * @param {string} to Idioma destino.
 * @returns {string} Ruta equivalente.
 */
function pathInLanguage(pathname, from, to) {
    const rest = from === DEFAULT_LANGUAGE ? pathname : pathname.slice(from.length + 1) || '/';
    return to === DEFAULT_LANGUAGE ? rest : `/${to}${rest}`;
}

/**
 * Devuelve el primer idioma del navegador que el sitio publique.
 *
 * Se recorre `navigator.languages` en orden porque es la lista de preferencias
 * REAL del usuario; `navigator.language` sola ignora que alguien pueda tener el
 * navegador en ingles y el espanol como segunda opcion.
 *
 * @returns {string|null} Codigo de idioma, o null si ninguno coincide.
 */
function preferredLanguage() {
    const list = navigator.languages || [navigator.language];
    for (const tag of list) {
        if (!tag) continue;
        const base = tag.toLowerCase().split('-')[0];
        if (LANGUAGES.includes(base)) return base;
    }
    return null;
}

/**
 * Recuerda la eleccion del visitante cuando usa el selector de idioma.
 *
 * A partir de ese momento su decision manda sobre la del navegador. Es lo que
 * hace que el selector se comporte como espera cualquiera: si lo pulso, me
 * quedo donde he pedido.
 */
function rememberExplicitChoice() {
    for (const link of document.querySelectorAll('.lang-switch a')) {
        link.addEventListener('click', () => {
            try {
                localStorage.setItem(STORAGE_KEY, link.getAttribute('hreflang'));
            } catch {
                // Modo privado o almacenamiento bloqueado: no es motivo para
                // impedir la navegacion, solo se pierde la preferencia.
            }
        });
    }
}

/** Aplica la deteccion de idioma si procede. */
function run() {
    rememberExplicitChoice();

    let stored = null;
    try {
        stored = localStorage.getItem(STORAGE_KEY);
    } catch {
        stored = null;
    }

    const current = languageOfPath(location.pathname);
    // Quien ya eligio manda; si eligio este idioma, no hay nada que hacer.
    const target = stored || preferredLanguage();
    if (!target || target === current || !LANGUAGES.includes(target)) return;

    // Solo se redirige a quien llega sin preferencia guardada. Se anota antes
    // de saltar para que la decision quede tomada aunque el visitante navegue
    // despues a otra pagina.
    try {
        localStorage.setItem(STORAGE_KEY, target);
    } catch {
        // Sin almacenamiento se redirige igual, pero solo esta vez.
    }
    location.replace(pathInLanguage(location.pathname, current, target) + location.hash);
}

run();
