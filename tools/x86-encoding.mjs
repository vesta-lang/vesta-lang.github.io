/**
 * @file tools/x86-encoding.mjs
 * @brief Genera las tablas de direccionamiento de x86 en lugar de copiarlas.
 *
 * El manual de Intel publica las formas de direccionamiento del byte ModR/M y
 * del byte SIB como tablas de rejilla. Extraerlas de su PDF sale corrompido --
 * las columnas se descuadran y aparecen valores imposibles -- y transcribirlas
 * a mano son varios cientos de celdas donde una errata pasa inadvertida.
 *
 * No hace falta ninguna de las dos cosas: **esas tablas son aritmetica**. El
 * byte ModR/M son tres campos de 2, 3 y 3 bits, y la forma efectiva que
 * codifica cada combinacion sigue reglas cortas con cuatro excepciones. Aqui
 * se generan desde esas reglas, de modo que la tabla es completa y correcta
 * por construccion.
 *
 * Lo que se toma del manual es la PROSA -- las reglas y sus excepciones -- que
 * es lo que si extrae limpio y lo unico que hay que entender. Y cada forma
 * generada se contrasta con el ensamblador del proyecto: si la tabla y la
 * cadena discrepan, una de las dos esta mal y hay que mirarlo.
 *
 * @see tools/verify_encoding.py
 */

/**
 * Archivos de registro que puede nombrar el campo `reg` o `r/m`.
 *
 * Los tres bits del campo NO significan lo mismo en todas las instrucciones:
 * significan un registro del archivo que la instruccion use. `13 /r` nombra
 * enteros; `0F 28 /r` nombra vectores; `0F 22 /r` nombra registros de control.
 * Sin saber de que archivo se habla, un `/r` no se puede leer.
 *
 * De ahi que la tabla del manual tenga una fila por archivo, y de ahi que esto
 * sea una tabla de archivos y no una lista de registros.
 *
 * `bits` es cuantos bits puede llegar a tener el numero de registro:
 *
 * - 3 sin prefijo, que da 8 registros.
 * - 4 con `REX.R` o `REX.B`, que da 16.
 * - 5 con `EVEX.R'`, que da 32 y solo para vectores.
 *
 * @type {Object<string,Object>}
 */
export const REGISTER_FILES = {
    gpr8: {
        label: { en: '8-bit general purpose', es: 'Enteros de 8 bits' },
        bits: 4,
        // La lista cambia segun HAYA o no un prefijo REX, aunque el prefijo no
        // diga nada del tamano. Es la trampa clasica de x86-64: sin REX los
        // indices 4 a 7 son las mitades altas AH..BH; con cualquier REX, aun
        // con todos sus bits a cero, pasan a ser SPL..DIL.
        names: [
            'al', 'cl', 'dl', 'bl', 'spl', 'bpl', 'sil', 'dil',
            'r8b', 'r9b', 'r10b', 'r11b', 'r12b', 'r13b', 'r14b', 'r15b',
        ],
        withoutRex: ['al', 'cl', 'dl', 'bl', 'ah', 'ch', 'dh', 'bh'],
    },
    gpr16: {
        label: { en: '16-bit general purpose', es: 'Enteros de 16 bits' },
        bits: 4,
        names: [
            'ax', 'cx', 'dx', 'bx', 'sp', 'bp', 'si', 'di',
            'r8w', 'r9w', 'r10w', 'r11w', 'r12w', 'r13w', 'r14w', 'r15w',
        ],
    },
    gpr32: {
        label: { en: '32-bit general purpose', es: 'Enteros de 32 bits' },
        bits: 4,
        names: [
            'eax', 'ecx', 'edx', 'ebx', 'esp', 'ebp', 'esi', 'edi',
            'r8d', 'r9d', 'r10d', 'r11d', 'r12d', 'r13d', 'r14d', 'r15d',
        ],
    },
    gpr64: {
        label: { en: '64-bit general purpose', es: 'Enteros de 64 bits' },
        bits: 4,
        names: [
            'rax', 'rcx', 'rdx', 'rbx', 'rsp', 'rbp', 'rsi', 'rdi',
            'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
        ],
    },
    mmx: {
        label: { en: 'MMX', es: 'MMX' },
        // Tres bits y nada mas: MMX no se extendio nunca, asi que `REX.R` se
        // ignora y `MM8` no existe.
        bits: 3,
        names: ['mm0', 'mm1', 'mm2', 'mm3', 'mm4', 'mm5', 'mm6', 'mm7'],
    },
    x87: {
        label: { en: 'x87 stack', es: 'Pila x87' },
        bits: 3,
        names: ['st(0)', 'st(1)', 'st(2)', 'st(3)', 'st(4)', 'st(5)', 'st(6)', 'st(7)'],
    },
    vector: {
        label: { en: 'Vector (XMM/YMM/ZMM)', es: 'Vectoriales (XMM/YMM/ZMM)' },
        // Cinco bits solo con EVEX. Con VEX o con SSE se quedan en 16 y en 8.
        bits: 5,
        prefix: { xmm: 128, ymm: 256, zmm: 512 },
        note: {
            en: '8 without REX, 16 with REX or VEX, 32 with EVEX.',
            es: '8 sin REX, 16 con REX o VEX, 32 con EVEX.',
        },
    },
    mask: {
        label: { en: 'Opmask', es: 'Mascara' },
        // Ocho, y no mas: el manual lo fija en la seccion de EVEX.
        bits: 3,
        names: ['k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7'],
        note: {
            en: 'k0 cannot be used as a write mask: it means "no masking".',
            es: 'k0 no vale como mascara de escritura: significa "sin mascara".',
        },
    },
    control: {
        label: { en: 'Control', es: 'Control' },
        bits: 4,
        names: Array.from({ length: 16 }, (_, i) => `cr${i}`),
        note: {
            en: 'REX.R reaches CR8-CR15. CR8 is the task priority register; ' +
                'CR9-CR15 are not implemented and raise #UD.',
            es: 'REX.R alcanza CR8-CR15. CR8 es el registro de prioridad de ' +
                'tarea; CR9-CR15 no estan implementados y lanzan #UD.',
        },
    },
    debug: {
        label: { en: 'Debug', es: 'Depuracion' },
        bits: 4,
        names: Array.from({ length: 16 }, (_, i) => `dr${i}`),
        note: {
            en: 'REX.R reaches DR8-DR15, which are not implemented and raise #UD.',
            es: 'REX.R alcanza DR8-DR15, que no estan implementados y lanzan #UD.',
        },
    },
    segment: {
        label: { en: 'Segment', es: 'Segmento' },
        bits: 3,
        // Seis validos de ocho posibles: los indices 6 y 7 no existen.
        names: ['es', 'cs', 'ss', 'ds', 'fs', 'gs', null, null],
    },
    bound: {
        label: { en: 'Bounds (MPX)', es: 'Limites (MPX)' },
        bits: 2,
        names: ['bnd0', 'bnd1', 'bnd2', 'bnd3'],
    },
    tile: {
        label: { en: 'Tile (AMX)', es: 'Baldosas (AMX)' },
        bits: 3,
        names: Array.from({ length: 8 }, (_, i) => `tmm${i}`),
    },
};

/**
 * Devuelve los nombres de un archivo de registro para un ancho vectorial.
 *
 * Los vectoriales no se enumeran en la tabla porque su nombre depende de la
 * longitud que la instruccion pida: el mismo numero de registro es `xmm5`,
 * `ymm5` o `zmm5` segun el `L` del prefijo.
 *
 * @param {string} file Identificador del archivo.
 * @param {string} [width] `xmm`, `ymm` o `zmm` para los vectoriales.
 * @returns {Array<string|null>} Nombres, indexados por numero de registro.
 */
export function registerNames(file, width = 'xmm') {
    const spec = REGISTER_FILES[file];
    if (!spec) throw new Error(`Archivo de registro desconocido: "${file}"`);
    if (spec.names) return spec.names;

    const count = 1 << spec.bits;
    return Array.from({ length: count }, (_, i) => `${width}${i}`);
}

/**
 * Bits que aportan los prefijos al numero de registro de cada rol.
 *
 * Sale de la tabla 2-33 del manual. Es lo que convierte tres bits en cinco, y
 * explica por que un mismo campo de tres bits alcanza 32 registros: los otros
 * dos viven en el prefijo, no en el ModR/M.
 *
 * @type {Array<Object>}
 */
export const REGISTER_ROLES = [
    { role: 'reg', high: "EVEX.R'", mid: 'REX.R', low: 'modrm.reg', files: 'gpr, vector' },
    { role: 'vvvv', high: "EVEX.V'", mid: null, low: 'EVEX.vvvv', files: 'gpr, vector' },
    { role: 'rm', high: 'EVEX.X', mid: 'EVEX.B', low: 'modrm.rm', files: 'gpr, vector' },
    { role: 'base', high: null, mid: 'EVEX.B', low: 'modrm.rm', files: 'gpr' },
    { role: 'index', high: null, mid: 'EVEX.X', low: 'sib.index', files: 'gpr' },
    { role: 'vidx', high: "EVEX.V'", mid: 'EVEX.X', low: 'sib.index', files: 'vector (VSIB)' },
];

/** Registros de 64 bits, en el orden en que los codifican los tres bits. */
export const REGS64 = REGISTER_FILES.gpr64.names;

/** Registros de 32 bits, en el mismo orden. */
export const REGS32 = REGISTER_FILES.gpr32.names;

/**
 * Formas de direccionamiento de 16 bits, por campo `rm`.
 *
 * Las de 16 bits no se derivan de una regla: son una lista fija que el manual
 * enumera, herencia del 8086. Se escriben tal cual porque no hay nada que
 * calcular.
 */
const RM16 = [
    'BX+SI', 'BX+DI', 'BP+SI', 'BP+DI', 'SI', 'DI', 'BP', 'BX',
];

/**
 * Compone un byte ModR/M.
 *
 * @param {number} mod Dos bits de modo.
 * @param {number} reg Tres bits del campo reg, o del digito del opcode.
 * @param {number} rm Tres bits del campo r/m.
 * @returns {number} El byte.
 */
export function modrm(mod, reg, rm) {
    return ((mod & 3) << 6) | ((reg & 7) << 3) | (rm & 7);
}

/**
 * Compone un byte SIB.
 *
 * @param {number} scale Dos bits de escala: 0, 1, 2 o 3 para x1, x2, x4 y x8.
 * @param {number} index Tres bits del registro indice.
 * @param {number} base Tres bits del registro base.
 * @returns {number} El byte.
 */
export function sib(scale, index, base) {
    return ((scale & 3) << 6) | ((index & 7) << 3) | (base & 7);
}

/**
 * Devuelve la forma efectiva que codifica una combinacion de `mod` y `rm`.
 *
 * Las cuatro excepciones son lo unico que hay que saberse, y son las que hacen
 * que la tabla no se pueda deducir mirandola:
 *
 * - `rm = 100` en 32 y 64 bits no es un registro: anuncia un byte SIB. Por eso
 *   `[rsp]` no se puede codificar directamente, y el ensamblador emite un SIB
 *   con indice "ninguno".
 * - `mod = 00` con `rm = 101` no es `[rbp]`: es un desplazamiento de 32 bits
 *   suelto en 32 bits, y **relativo a RIP** en 64. De ahi que `[rbp]` tenga
 *   que codificarse con `mod = 01` y desplazamiento cero.
 * - `mod = 11` no direcciona memoria: el campo `rm` es un registro.
 * - En 16 bits el hueco lo ocupa `mod = 00` con `rm = 110`, que es un
 *   desplazamiento de 16 bits.
 *
 * @param {number} mod Modo.
 * @param {number} rm Campo r/m.
 * @param {number} bits Ancho de direccion: 16, 32 o 64.
 * @returns {{text: string, note: string|null}} Forma efectiva y su salvedad.
 */
export function effectiveAddress(mod, rm, bits) {
    if (mod === 3) {
        const regs = bits === 32 ? REGS32 : REGS64;
        return { text: bits === 16 ? `r16[${rm}]` : regs[rm], note: 'registro' };
    }

    if (bits === 16) {
        if (mod === 0 && rm === 6) return { text: 'disp16', note: 'sin registro base' };
        const base = RM16[rm];
        if (mod === 0) return { text: `[${base}]`, note: null };
        return { text: `[${base}+disp${mod === 1 ? 8 : 16}]`, note: null };
    }

    const regs = bits === 32 ? REGS32 : REGS64;

    if (rm === 4) {
        const suffix = mod === 0 ? '' : `+disp${mod === 1 ? 8 : 32}`;
        return { text: `[SIB${suffix}]`, note: 'sigue un byte SIB' };
    }

    if (mod === 0 && rm === 5) {
        return bits === 64
            ? { text: '[rip+disp32]', note: 'relativo a RIP en 64 bits' }
            : { text: '[disp32]', note: 'sin registro base' };
    }

    const base = regs[rm];
    if (mod === 0) return { text: `[${base}]`, note: null };
    return { text: `[${base}+disp${mod === 1 ? 8 : 32}]`, note: null };
}

/**
 * Genera la tabla de formas de direccionamiento del byte ModR/M.
 *
 * @param {number} bits Ancho de direccion: 16, 32 o 64.
 * @returns {Array<Object>} Una fila por combinacion de `mod` y `rm`.
 */
export function modrmTable(bits) {
    const rows = [];
    for (let mod = 0; mod < 4; mod += 1) {
        for (let rm = 0; rm < 8; rm += 1) {
            const { text, note } = effectiveAddress(mod, rm, bits);
            rows.push({
                mod,
                rm,
                address: text,
                note,
                // El byte varia con el campo reg, que no forma parte de la
                // forma de direccionamiento: se da el rango que abarca la fila.
                first: modrm(mod, 0, rm),
                last: modrm(mod, 7, rm),
            });
        }
    }
    return rows;
}

/**
 * Genera la tabla del byte SIB.
 *
 * El SIB tiene su propia excepcion, y es la que sorprende: `index = 100` no es
 * RSP, es "sin indice". Por eso `[rsp]` se codifica con un SIB cuyo indice
 * dice que no hay indice, y por eso RSP no puede usarse nunca como registro
 * indice.
 *
 * @returns {Array<Object>} Una fila por combinacion de escala, indice y base.
 */
export function sibTable() {
    const rows = [];
    for (let scale = 0; scale < 4; scale += 1) {
        for (let index = 0; index < 8; index += 1) {
            for (let base = 0; base < 8; base += 1) {
                const factor = 1 << scale;
                const idx = index === 4 ? null : REGS64[index];
                // Con base = 101 la base depende del `mod` del ModR/M: con
                // mod = 00 no hay base y sigue un disp32.
                const baseText = base === 5 ? 'disp32 o rbp segun mod' : REGS64[base];

                rows.push({
                    scale: factor,
                    index: idx,
                    base: baseText,
                    byte: sib(scale, index, base),
                    address: idx
                        ? `[${baseText}+${idx}*${factor}]`
                        : `[${baseText}]`,
                    note: index === 4 ? 'sin indice: rsp no puede indexar' : null,
                });
            }
        }
    }
    return rows;
}
