/**
 * @file flame.mjs
 * @brief Logotipo de Vesta con la llama ardiendo de verdad.
 *
 * COMO SE LLEGO AQUI, porque explica la solucion. Primero se dibujo fuego
 * DETRAS del PNG: invisible, porque el logotipo es opaco y tapaba lo que se
 * movia. Despues se deformo el propio PNG usandolo como textura: se movia poco
 * y mal, porque empujar los pixeles de un dibujo fijo no es fuego -- el fuego
 * cambia de FORMA. Luego se genero una llama procedural completa: se movia
 * bien, pero era una llama cualquiera, no la de Vesta.
 *
 * Esta version junta las dos mitades que funcionaban. La SILUETA sale del
 * logotipo, usando su canal alfa como mascara; el MOVIMIENTO es procedural y
 * arde dentro de esa silueta. El ruido ademas erosiona el borde de la mascara,
 * de modo que las lenguas se desprenden y vuelven en lugar de quedar recortadas
 * contra un contorno fijo.
 *
 * El pebetero y la linea negra del dibujo -- incluida la "V" -- se componen
 * encima sin animar: son solidos, y verlos ondular delataria el truco.
 *
 * Backends: WebGPU, WebGL2 y, si no hay ninguno, el PNG que ya venia en el
 * HTML. La pagina se lee igual sin nada de esto.
 */

/** Proporcion del lienzo respecto al ancho del logotipo. */
const CANVAS_W = 1.35;
const CANVAS_H = 1.55;

/**
 * Altura, en coordenadas de la textura, donde empieza el pebetero.
 *
 * Medida sobre el propio PNG: por debajo de esa linea los pixeles opacos pasan
 * a ser marrones. Por encima arde; por debajo es metal y no se mueve.
 */
const BOWL_LINE = 0.745;

/** Shaders de WebGL2. */
const GL_VERTEX = `#version 300 es
void main() {
    vec2 p[3] = vec2[3](vec2(-1.0, -3.0), vec2(-1.0, 1.0), vec2(3.0, 1.0));
    gl_Position = vec4(p[gl_VertexID], 0.0, 1.0);
}`;

const GL_FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uLogo;
out vec4 outColor;

// --- Ajustes del caracter del fuego ---
// RISE:  velocidad de ascenso.
// EROSION: cuanto muerde el ruido el borde de la silueta.
// SWAY:  desviacion lateral de las puntas.
const float RISE    = 1.05;
const float EROSION = 0.62;
const float SWAY    = 0.10;
const float BOWL    = ${BOWL_LINE};

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Interpolacion quintica: sin saltos en la derivada, que en un fluido se
// verian como facetas.
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.07 + vec2(37.0, 17.0);
        a *= 0.5;
    }
    return v;
}

// Silueta suavizada del logotipo por encima del pebetero.
//
// Se toman varias muestras alrededor del punto para redondear el borde: con la
// alfa cruda, el ruido recortaria contra un contorno duro y se verian dientes.
float silhouette(vec2 uv) {
    float acc = texture(uLogo, clamp(uv, 0.0, 1.0)).a;
    for (int i = 0; i < 6; i++) {
        float a = float(i) * 1.0471976;
        vec2 d = vec2(cos(a), sin(a)) * 0.022;
        acc += texture(uLogo, clamp(uv + d, 0.0, 1.0)).a;
    }
    acc /= 7.0;
    // Se descarta el pebetero: ahi no arde nada.
    return acc * (1.0 - smoothstep(BOWL - 0.09, BOWL, uv.y));
}

// Rampa de color del fuego, con la paleta del logotipo y un nucleo casi blanco.
vec3 fireColor(float h) {
    vec3 c = mix(vec3(0.30, 0.05, 0.01), vec3(0.78, 0.13, 0.08),
                 smoothstep(0.04, 0.28, h));
    c = mix(c, vec3(0.88, 0.42, 0.05), smoothstep(0.26, 0.50, h));
    c = mix(c, vec3(0.95, 0.74, 0.11), smoothstep(0.48, 0.72, h));
    c = mix(c, vec3(0.99, 0.94, 0.60), smoothstep(0.74, 0.95, h));
    return c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;      // y crece hacia arriba

    // El logotipo se ancla en la base del lienzo; encima queda aire para que
    // las lenguas se escapen.
    vec2 logoUv = vec2((uv.x - 0.5) * ${CANVAS_W} + 0.5, 1.0 - uv.y * ${CANVAS_H});
    float up = 1.0 - logoUv.y;                    // 0 en la base, 1 arriba

    // Campo turbulento ascendente. La deformacion de dominio (un fbm dentro de
    // otro) curva las lenguas en vez de dejarlas subir rectas.
    vec2 q = vec2(logoUv.x * 3.4, logoUv.y * 2.2 + uTime * RISE);
    float warp = fbm(q * 0.7 - vec2(0.0, uTime * 0.3));
    float n = fbm(q + (warp - 0.5) * 1.25);

    // Las puntas se desvian; la base queda anclada.
    float drift = (fbm(vec2(uTime * 0.5, logoUv.y * 1.3)) - 0.5) * SWAY * up * up;
    float shape = silhouette(vec2(logoUv.x - drift, logoUv.y));

    // El ruido erosiona el borde de la silueta: es lo que hace que las lenguas
    // se desprendan y vuelvan, en lugar de arder recortadas contra el contorno.
    float fire = smoothstep(0.30, 0.72, shape + (n - 0.5) * EROSION);

    // Enfriamiento con la altura: nucleo claro abajo, rojo que se apaga arriba.
    float cooling = 1.0 - smoothstep(0.05, 0.95, up) * 0.65;
    float h = clamp(fire * (0.5 + n * 0.9) * cooling * 1.5, 0.0, 1.0);

    vec3 color = fireColor(h) * h;

    // Halo alrededor del fuego.
    float glow = smoothstep(0.0, 0.5, h) * 0.5;
    color += vec3(0.88, 0.40, 0.07) * glow * 0.45;
    float alpha = clamp(h * 1.3 + glow * 0.4, 0.0, 1.0);

    // El dibujo solido encima: pebetero y linea negra (contornos y la "V").
    // Van sin animar porque son metal y trazo, no llama.
    vec4 tex = texture(uLogo, clamp(logoUv, 0.0, 1.0));
    float inside = step(0.0, logoUv.x) * step(logoUv.x, 1.0)
                 * step(0.0, logoUv.y) * step(logoUv.y, 1.0);
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float ink = tex.a * (1.0 - smoothstep(0.10, 0.42, lum));       // trazo negro
    float bowl = tex.a * smoothstep(BOWL - 0.02, BOWL + 0.05, logoUv.y);
    float solid = clamp(max(ink, bowl), 0.0, 1.0) * inside;

    color = mix(color, tex.rgb, solid);
    alpha = max(alpha, solid);

    outColor = vec4(color, alpha);
}`;

/** Shader de WebGPU, con la misma logica en WGSL. */
const WGSL = `
struct Uniforms { resolution: vec2f, time: f32, pad: f32 };
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var samp: sampler;
@group(0) @binding(2) var logoTex: texture_2d<f32>;

const RISE:    f32 = 1.05;
const EROSION: f32 = 0.62;
const SWAY:    f32 = 0.10;
const BOWL:    f32 = ${BOWL_LINE};

@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
    var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
    return vec4f(p[i], 0.0, 1.0);
}

fn hash(p: vec2f) -> f32 {
    return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

fn noise(p: vec2f) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let q = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(hash(i), hash(i + vec2f(1.0, 0.0)), q.x),
               mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), q.x), q.y);
}

fn fbm(p: vec2f) -> f32 {
    var v = 0.0;
    var a = 0.5;
    var q = p;
    for (var i = 0; i < 5; i = i + 1) {
        v = v + a * noise(q);
        q = q * 2.07 + vec2f(37.0, 17.0);
        a = a * 0.5;
    }
    return v;
}

// El muestreo va SIEMPRE fuera de condicionales: WGSL exige control de flujo
// uniforme para las texturas, y un 'if' que dependa del fragmento impide que el
// shader compile siquiera.
fn silhouette(uv: vec2f) -> f32 {
    var acc = textureSample(logoTex, samp, clamp(uv, vec2f(0.0), vec2f(1.0))).a;
    for (var i = 0; i < 6; i = i + 1) {
        let a = f32(i) * 1.0471976;
        let d = vec2f(cos(a), sin(a)) * 0.022;
        acc = acc + textureSample(logoTex, samp,
                                  clamp(uv + d, vec2f(0.0), vec2f(1.0))).a;
    }
    acc = acc / 7.0;
    return acc * (1.0 - smoothstep(BOWL - 0.09, BOWL, uv.y));
}

fn fireColor(h: f32) -> vec3f {
    var c = mix(vec3f(0.30, 0.05, 0.01), vec3f(0.78, 0.13, 0.08),
                smoothstep(0.04, 0.28, h));
    c = mix(c, vec3f(0.88, 0.42, 0.05), smoothstep(0.26, 0.50, h));
    c = mix(c, vec3f(0.95, 0.74, 0.11), smoothstep(0.48, 0.72, h));
    c = mix(c, vec3f(0.99, 0.94, 0.60), smoothstep(0.74, 0.95, h));
    return c;
}

@fragment
fn fs(@builtin(position) frag: vec4f) -> @location(0) vec4f {
    // En WebGPU el origen del fragmento esta arriba; se invierte para que la
    // llama suba.
    let uv = vec2f(frag.x / u.resolution.x, 1.0 - frag.y / u.resolution.y);

    let logoUv = vec2f((uv.x - 0.5) * ${CANVAS_W} + 0.5, 1.0 - uv.y * ${CANVAS_H});
    let up = 1.0 - logoUv.y;

    let q = vec2f(logoUv.x * 3.4, logoUv.y * 2.2 + u.time * RISE);
    let warp = fbm(q * 0.7 - vec2f(0.0, u.time * 0.3));
    let n = fbm(q + (warp - 0.5) * 1.25);

    let drift = (fbm(vec2f(u.time * 0.5, logoUv.y * 1.3)) - 0.5) * SWAY * up * up;
    let shape = silhouette(vec2f(logoUv.x - drift, logoUv.y));

    let fire = smoothstep(0.30, 0.72, shape + (n - 0.5) * EROSION);

    let cooling = 1.0 - smoothstep(0.05, 0.95, up) * 0.65;
    let h = clamp(fire * (0.5 + n * 0.9) * cooling * 1.5, 0.0, 1.0);

    var color = fireColor(h) * h;

    let glow = smoothstep(0.0, 0.5, h) * 0.5;
    color = color + vec3f(0.88, 0.40, 0.07) * glow * 0.45;
    var alpha = clamp(h * 1.3 + glow * 0.4, 0.0, 1.0);

    let tex = textureSample(logoTex, samp, clamp(logoUv, vec2f(0.0), vec2f(1.0)));
    let inside = step(0.0, logoUv.x) * step(logoUv.x, 1.0)
               * step(0.0, logoUv.y) * step(logoUv.y, 1.0);
    let lum = dot(tex.rgb, vec3f(0.299, 0.587, 0.114));
    let ink = tex.a * (1.0 - smoothstep(0.10, 0.42, lum));
    let bowl = tex.a * smoothstep(BOWL - 0.02, BOWL + 0.05, logoUv.y);
    let solid = clamp(max(ink, bowl), 0.0, 1.0) * inside;

    color = mix(color, tex.rgb, solid);
    alpha = max(alpha, solid);

    return vec4f(color, alpha);
}
`;

/**
 * Crea el lienzo y lo coloca en lugar del logotipo.
 *
 * @param {HTMLImageElement} image Logotipo del HTML.
 * @returns {HTMLCanvasElement}
 */
function mountCanvas(image) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flame';

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');

    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.round(image.getBoundingClientRect().width) || 200;
    canvas.width = Math.round(size * CANVAS_W * scale);
    canvas.height = Math.round(size * CANVAS_H * scale);

    image.parentNode.insertBefore(wrapper, image);
    wrapper.appendChild(canvas);
    wrapper.appendChild(image);
    return canvas;
}

/**
 * Bucle de animacion comun.
 *
 * Se detiene con la pestana oculta: mantener la GPU dibujando algo que nadie
 * mira gasta bateria sin motivo.
 *
 * @param {(seconds: number) => void} draw Dibuja un fotograma.
 */
function animate(draw) {
    const start = performance.now();
    let running = true;

    const tick = () => {
        if (!running) return;
        draw((performance.now() - start) / 1000);
        requestAnimationFrame(tick);
    };

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            running = false;
        } else if (!running) {
            running = true;
            requestAnimationFrame(tick);
        }
    });

    requestAnimationFrame(tick);
}

/**
 * Arranca con WebGPU.
 *
 * @param {HTMLCanvasElement} canvas Destino.
 * @param {ImageBitmap} bitmap Logotipo decodificado.
 * @returns {Promise<boolean>} true si quedo en marcha.
 */
async function startWebGpu(canvas, bitmap) {
    if (!navigator.gpu) return false;

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return false;
    const device = await adapter.requestDevice();

    const context = canvas.getContext('webgpu');
    if (!context) return false;

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'premultiplied' });

    const texture = device.createTexture({
        size: [bitmap.width, bitmap.height],
        format: 'rgba8unorm',
        usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture({ source: bitmap }, { texture }, [
        bitmap.width,
        bitmap.height,
    ]);

    const sampler = device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
    });

    // Los errores de WebGPU son ASINCRONOS: un shader invalido no lanza, deja
    // el pipeline inutil y los dibujados se vuelven no-operaciones, con un
    // lienzo transparente como unico sintoma.
    device.pushErrorScope('validation');

    const module = device.createShaderModule({ code: WGSL });
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: {
            module,
            entryPoint: 'fs',
            targets: [
                {
                    format,
                    blend: {
                        color: {
                            srcFactor: 'src-alpha',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add',
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one-minus-src-alpha',
                            operation: 'add',
                        },
                    },
                },
            ],
        },
        primitive: { topology: 'triangle-list' },
    });

    const uniforms = device.createBuffer({
        size: 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: uniforms } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: texture.createView() },
        ],
    });

    if (await device.popErrorScope()) return false;

    animate((seconds) => {
        device.queue.writeBuffer(
            uniforms,
            0,
            new Float32Array([canvas.width, canvas.height, seconds, 0])
        );
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: context.getCurrentTexture().createView(),
                    clearValue: { r: 0, g: 0, b: 0, a: 0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
    });

    return true;
}

/**
 * Arranca con WebGL2.
 *
 * @param {HTMLCanvasElement} canvas Destino.
 * @param {ImageBitmap} bitmap Logotipo decodificado.
 * @returns {boolean} true si quedo en marcha.
 */
function startWebGl(canvas, bitmap) {
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
    if (!gl) return false;

    const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, GL_VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, GL_FRAGMENT);
    if (!vertex || !fragment) return false;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    gl.uniform1i(gl.getUniformLocation(program, 'uLogo'), 0);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA
    );

    animate((seconds) => {
        gl.uniform1f(uTime, seconds);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    });

    return true;
}

/** Punto de entrada. */
async function init() {
    const image = document.querySelector('.hero-logo');
    if (!image) return;

    // Respetar esta preferencia no es opcional: para algunas personas el
    // movimiento en pantalla produce mareo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!image.complete) {
        await new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
        });
    }
    if (!image.naturalWidth) return;

    let bitmap;
    try {
        bitmap = await createImageBitmap(image);
    } catch {
        return;
    }

    const canvas = mountCanvas(image);
    let started = false;

    try {
        started = await startWebGpu(canvas, bitmap);
    } catch {
        started = false;
    }

    if (!started) {
        // Un lienzo del que ya se obtuvo contexto WebGPU no admite despues uno
        // de WebGL2: hay que reemplazarlo por uno nuevo.
        const fresh = canvas.cloneNode();
        canvas.replaceWith(fresh);
        try {
            started = startWebGl(fresh, bitmap);
        } catch {
            started = false;
        }
        if (!started) fresh.remove();
    }

    if (started) {
        // La imagen se oculta pero permanece: aporta el texto alternativo y
        // vuelve a verse si el contexto grafico se pierde.
        image.classList.add('is-animated');
    } else if (canvas.isConnected) {
        canvas.remove();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
