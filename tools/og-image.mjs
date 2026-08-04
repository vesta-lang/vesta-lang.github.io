/**
 * @file tools/og-image.mjs
 * @brief Genera la imagen que acompana al sitio cuando se comparte un enlace.
 *
 * Es la primera impresion del proyecto en Slack, Discord, Mastodon o cualquier
 * cliente que despliegue una vista previa, y hasta ahora la plantilla anunciaba
 * una imagen que no existia: cada enlace compartido mostraba un hueco roto.
 *
 * La imagen se genera aqui en lugar de dibujarse a mano por el motivo de
 * siempre en este proyecto: el titular y el logotipo cambian, y una imagen
 * exportada a mano se queda vieja sin que nadie lo note. Al construirse en cada
 * build no puede desincronizarse del sitio.
 *
 * FORMATO. Se emite SVG y no PNG porque el generador no tiene dependencias y
 * rasterizar exigiria arrastrar una. La consecuencia hay que conocerla: varias
 * plataformas grandes no aceptan SVG en `og:image`. Por eso el SVG se declara
 * como imagen secundaria y la principal sigue siendo un PNG -- el propio
 * logotipo -- que todas entienden. Cuando exista un PNG compuesto de 1200x630,
 * se sustituye aqui y no hay que tocar nada mas.
 */

import { readFileSync } from 'node:fs';

/** Medidas canonicas de una tarjeta social. */
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Textos de la tarjeta, por idioma.
 *
 * Se repite el titular de la portada a proposito: la vista previa y la pagina
 * deben decir lo mismo, o quien pulsa siente que ha llegado a otro sitio.
 */
const TEXT = {
    es: {
        headline: 'Sin magia. Sin coste oculto.',
        lead: 'Todo lo que puede escribirse en el propio lenguaje esta escrito en el.',
        kicker: 'Lenguaje de sistemas',
    },
    en: {
        headline: 'No magic. No hidden cost.',
        lead: 'Everything that can be written in the language is written in the language.',
        kicker: 'Systems language',
    },
};

/**
 * Escapa texto para insertarlo en un atributo o nodo de texto XML.
 *
 * @param {string} text Texto crudo.
 * @returns {string} Texto seguro.
 */
const xml = (text) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

/**
 * Parte un texto en lineas que no superen un numero de caracteres.
 *
 * SVG no ajusta texto solo: `<text>` es una linea y punto. Se parte por
 * palabras porque cortar por caracteres dejaria palabras partidas a la mitad.
 *
 * @param {string} text Texto a repartir.
 * @param {number} max Maximo de caracteres por linea.
 * @returns {string[]} Lineas.
 */
function wrap(text, max) {
    const lines = [];
    let current = '';
    for (const word of text.split(' ')) {
        if (current && `${current} ${word}`.length > max) {
            lines.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    if (current) lines.push(current);
    return lines;
}

/**
 * Construye la tarjeta social del sitio.
 *
 * Los colores van escritos literalmente y no como variables CSS: la imagen se
 * abre fuera del sitio, sin su hoja de estilos, y una variable sin resolver
 * dejaria el texto invisible.
 *
 * @param {string} lang Codigo de idioma.
 * @param {string} logoPath Ruta del logotipo en disco, para incrustarlo.
 * @returns {string} Documento SVG.
 */
export function socialCard(lang, logoPath) {
    const t = TEXT[lang] || TEXT.en;

    // El logotipo se incrusta en base64: la imagen tiene que ser autonoma,
    // porque quien la muestra no va a resolver rutas de este sitio.
    const logo = readFileSync(logoPath).toString('base64');

    const headline = wrap(t.headline, 26);
    const lead = wrap(t.lead, 52);

    const headlineY = 250;
    const leadY = headlineY + headline.length * 74 + 24;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}"
     viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${xml(t.headline)}">
  <defs>
    <radialGradient id="ember" cx="78%" cy="42%" r="46%">
      <stop offset="0%" stop-color="#d09010" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#d09010" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#100e0c"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ember)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#c02020"/>

  <image href="data:image/png;base64,${logo}" x="852" y="150" width="300" height="300"/>

  <text x="80" y="126" fill="#a29788" font-family="system-ui, sans-serif"
        font-size="26" letter-spacing="2">VESTA</text>
  <text x="80" y="170" fill="#e8a13c" font-family="system-ui, sans-serif"
        font-size="26">${xml(t.kicker)}</text>

${headline
    .map(
        (line, i) =>
            `  <text x="80" y="${headlineY + i * 74}" fill="#e6e0d6" ` +
            `font-family="system-ui, sans-serif" font-size="64" font-weight="700">` +
            `${xml(line)}</text>`
    )
    .join('\n')}

${lead
    .map(
        (line, i) =>
            `  <text x="80" y="${leadY + i * 38}" fill="#a29788" ` +
            `font-family="system-ui, sans-serif" font-size="28">${xml(line)}</text>`
    )
    .join('\n')}

  <text x="80" y="574" fill="#a29788" font-family="ui-monospace, monospace"
        font-size="24">vesta-lang.github.io</text>
</svg>
`;
}
