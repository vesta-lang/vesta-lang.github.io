/**
 * @file error-path.mjs
 * @brief Muestra en la pagina de error la direccion que se pidio.
 *
 * El sitio es estatico: el servidor devuelve siempre el mismo `404.html` sin
 * saber que ruta se solicito, asi que la unica manera de decirselo al visitante
 * es leerla en el cliente.
 *
 * Sin JavaScript la frase no aparece en absoluto, y esa es la conducta
 * deseada: el CSS oculta el parrafo mientras esta vacio. Es preferible no decir
 * nada a mostrar un rotulo con un hueco detras.
 *
 * La ruta se inserta como TEXTO, nunca como HTML. Es un valor que controla
 * quien visita la pagina y basta con que alguien reparta un enlace con
 * marcado dentro para convertir la pagina de error en un problema de seguridad.
 */

const target = document.querySelector('.error-path');

if (target) {
    const label = target.dataset.label || '';
    // Si se llego aqui tras cambiar de idioma, la ruta que fallo de verdad
    // viaja en `from`: la de la barra de direcciones ya es la del propio 404.
    // Se decodifica para que una ruta con acentos se lea como la escribio quien
    // la pidio, y si viniera mal formada se muestra tal cual en lugar de fallar.
    const carried = new URLSearchParams(location.search).get('from');
    let path = carried || location.pathname + location.search;
    try {
        path = decodeURI(path);
    } catch {
        // URI invalida: se muestra tal cual en lugar de fallar.
    }

    target.textContent = label ? `${label}: ` : '';

    const code = document.createElement('code');
    code.textContent = path;
    target.appendChild(code);
}
