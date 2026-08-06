/**
 * @file copy-code.mjs
 * @brief Anade un boton de copiado a cada bloque de codigo de la pagina.
 *
 * Es mejora progresiva estricta: el HTML servido ya contiene el codigo
 * completo y seleccionable, y el boton solo se inyecta si el navegador ofrece
 * la API de portapapeles. Sin JS, o con la API ausente, la pagina no muestra
 * un boton que no funcionaria.
 *
 * El texto que se copia sale de `textContent`, no del HTML: el resaltado
 * envuelve cada token en un `<span>`, y copiar el marcado pegaria etiquetas en
 * el editor del lector. `textContent` devuelve exactamente el codigo original.
 */

/**
 * Rotulos por idioma.
 *
 * El sitio es bilingue y el boton es contenido visible, asi que sigue al
 * atributo `lang` del documento en lugar de fijar el ingles. Cualquier idioma
 * no contemplado cae en ingles, que es el idioma por defecto del sitio.
 */
const LABELS = {
    en: { copy: 'Copy', copied: 'Copied', failed: 'Copy failed' },
    es: { copy: 'Copiar', copied: 'Copiado', failed: 'No se pudo copiar' },
};

/** Milisegundos que el boton se queda diciendo "Copiado" antes de volver. */
const FEEDBACK_MS = 1600;

/**
 * Inserta el boton en un bloque de codigo.
 *
 * @param {HTMLElement} block Contenedor `.code-block` o `.snippet`.
 * @param {{copy: string, copied: string, failed: string}} ui Rotulos.
 * @returns {void}
 */
function addButton(block, ui) {
    const code = block.querySelector('pre > code');
    if (!code) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = ui.copy;

    // El boton no aporta nada a quien lee con lector de pantalla el codigo en
    // si, pero si necesita saber que existe: de ahi el rotulo accesible, que
    // es mas explicito que el texto visible.
    button.setAttribute('aria-label', `${ui.copy}`);

    let timer = 0;

    /**
     * Muestra un estado temporal y vuelve al rotulo inicial.
     *
     * @param {string} text Texto a mostrar.
     * @param {boolean} ok Si la copia salio bien.
     */
    const flash = (text, ok) => {
        button.textContent = text;
        button.dataset.state = ok ? 'ok' : 'error';
        clearTimeout(timer);
        timer = setTimeout(() => {
            button.textContent = ui.copy;
            delete button.dataset.state;
        }, FEEDBACK_MS);
    };

    button.addEventListener('click', () => {
        navigator.clipboard.writeText(code.textContent).then(
            () => flash(ui.copied, true),
            // El permiso de portapapeles puede denegarse, y en ese caso callar
            // seria peor que avisar: el lector creeria tener el codigo copiado.
            () => flash(ui.failed, false)
        );
    });

    block.appendChild(button);
}

/**
 * Punto de entrada: recorre los bloques de codigo y los equipa.
 *
 * @returns {void}
 */
function init() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;

    const lang = (document.documentElement.lang || 'en').slice(0, 2);
    const ui = LABELS[lang] || LABELS.en;

    for (const block of document.querySelectorAll('.code-block, .snippet')) {
        addButton(block, ui);
    }
}

init();
