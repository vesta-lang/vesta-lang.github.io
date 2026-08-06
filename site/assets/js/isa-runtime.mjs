/**
 * @file isa-runtime.mjs
 * @brief Trae de arch-data lo que no se copia en este sitio: las
 *        codificaciones de una instruccion y su coste medido.
 *
 * Lleva rotulos de interfaz en castellano y en chino, que son ortografia de su
 * idioma y no decoracion:  lint-script: es, zh
 *
 * ## Por que en el cliente
 *
 * `arch-data` es la unica fuente de ambas cosas. Copiarlas aqui en tiempo de
 * compilacion crearia una segunda version que se queda vieja en cuanto se
 * corrige la original, y nadie se entera hasta que alguien compara las dos
 * paginas. Leyendolas en el navegador, una correccion alli aparece aqui sin
 * volver a publicar este sitio.
 *
 * Las dos webs se sirven desde `vesta-lang.github.io`, asi que en el sitio
 * publicado no hay peticion entre dominios. Se pide por su URL absoluta para
 * que una copia local lea la misma base y la seccion se pueda probar sin
 * montar el otro repositorio al lado.
 *
 * ## Por que al entrar, sin pedirlo
 *
 * El coste es parte de lo que se viene a consultar. Dejarlo detras de un boton
 * -- o peor, detras de un enlace a otro sitio -- obliga a quien lee a dar un
 * paso mas para ver un dato que la pagina ya sabe donde esta.
 *
 * La base pesa doce megabytes y se descarga una sola vez: el navegador la
 * cachea, asi que la segunda instruccion que se consulte no vuelve a pedirla.
 *
 * Sigue siendo mejora progresiva. Sin JavaScript la seccion queda con el
 * enlace a la tabla completa, dentro de un `noscript`: es lo unico que se
 * puede ofrecer sin copiar aqui una base que envejeceria en cuanto se
 * corrigiera la original.
 */

/**
 * Fichero de la base publicada.
 *
 * La URL es **absoluta** a proposito. `arch-data` es otro repositorio: en el
 * sitio publicado cae bajo el mismo dominio y una ruta relativa bastaria, pero
 * en cualquier copia local esa ruta no existe y la seccion no se puede probar.
 * Con la absoluta se lee siempre la base de verdad, que ademas es la unica que
 * esta al dia.
 */
const DB_URL = 'https://vesta-lang.github.io/arch-data/assets/db.js';

/** Rotulos, siguiendo el idioma del documento. */
const LABELS = {
    en: {
        loading: 'Loading...',
        failed: 'Could not reach arch-data.',
        none: 'This mnemonic is not in the database.',
        notMeasured: 'No microarchitecture in the database measures this form.',
        arch: 'Microarch.', tp: 'recip_tp', uops: 'uops', notes: 'Notes',
        divCycles: 'div_cycles', latencies: 'Latencies', ports: 'Ports',
        cycles: 'cycles', upperBound: 'upper bound',
        microcoded: 'microcoded', macroFusible: 'macro-fusible',
        forms: (n) => `${n} forms in the database.`,
        variants: (n) => `${n} measured variants`,
        shown: (n, total) => `${n} of ${total} shown`,
        allArches: 'every microarchitecture',
        categories: 'Colour by category, from arch-data:',
        tagNoFlags: 'no flags', tagNdd: 'non-destructive',
        allAttached:
            'Nothing left over: every measured form hangs from its encoding above.',
        apxEvex:
            'APX: the same instruction re-encoded with the EVEX prefix, which ' +
            'gives it access to the 16 extra general-purpose registers.',
        apxNdd:
            'APX with a non-destructive destination: the result goes to a ' +
            'third register instead of overwriting a source.',
        apxNoFlags:
            'APX no-flags form: it does the same and does NOT write EFLAGS, ' +
            'so it does not break a flag dependency chain.',
        operandSize: (w) => `Operand size: ${w} bits.`,
        attached: (n) => `${n} measured forms, each under its encoding above.`,
        unmatched: (n) =>
            `${n} forms the database measures and the manual does not list as ` +
            'a row of its own:',
        opcode: 'Opcode', form: 'Form', ext: 'Extension', operands: 'Operands',
        iclass: 'Instruction class', extension: 'Extension',
        opcodeField: 'Opcode', encoding: 'Encoding', category: 'Category',
        checksum: 'Checksum', reads: 'Operands read', writes: 'Operands written',
        touches: 'Also touches', effects: 'Effects',
        operandList: 'Operands',
        mem: 'memory', imm: 'immediate',
        wflags: 'writes flags', rflags: 'reads flags',
    },
    es: {
        loading: 'Cargando...',
        failed: 'No se pudo acceder a arch-data.',
        none: 'Este mnemonico no esta en la base.',
        notMeasured: 'Ninguna microarquitectura de la base mide esta forma.',
        arch: 'Microarq.', tp: 'recip_tp', uops: 'uops', notes: 'Notas',
        divCycles: 'div_cycles', latencies: 'Latencias', ports: 'Puertos',
        cycles: 'ciclos', upperBound: 'cota superior',
        microcoded: 'microcodificada', macroFusible: 'macrofusionable',
        forms: (n) => `${n} formas en la base.`,
        variants: (n) => `${n} variantes medidas`,
        shown: (n, total) => `${n} de ${total} visibles`,
        allArches: 'cualquier microarquitectura',
        categories: 'Color por categoria, segun arch-data:',
        tagNoFlags: 'sin banderas', tagNdd: 'destino no destructivo',
        allAttached:
            'No sobra nada: cada forma medida cuelga de su codificacion, arriba.',
        apxEvex:
            'APX: la misma instruccion recodificada con el prefijo EVEX, que ' +
            'le da acceso a los 16 registros de proposito general adicionales.',
        apxNdd:
            'APX con destino no destructivo: el resultado va a un tercer ' +
            'registro en lugar de pisar uno de los operandos de origen.',
        apxNoFlags:
            'Forma APX sin banderas: hace lo mismo y NO escribe EFLAGS, asi ' +
            'que no corta una cadena de dependencias por banderas.',
        operandSize: (w) => `Tamano de operando: ${w} bits.`,
        attached: (n) => `${n} formas medidas, cada una bajo su codificacion.`,
        unmatched: (n) =>
            `${n} formas que la base mide y el manual no publica como fila ` +
            'propia:',
        opcode: 'Opcode', form: 'Forma', ext: 'Extension', operands: 'Operandos',
        iclass: 'Clase de instruccion', extension: 'Extension',
        opcodeField: 'Opcode', encoding: 'Encoding', category: 'Categoria',
        checksum: 'Checksum', reads: 'Operandos que lee',
        writes: 'Operandos que escribe', touches: 'Ademas toca',
        effects: 'Efectos', operandList: 'Operandos',
        mem: 'memoria', imm: 'inmediato',
        wflags: 'escribe banderas', rflags: 'lee banderas',
    },
    zh: {
        loading: '加载中...',
        failed: '无法访问 arch-data。',
        none: '该助记符不在数据库中。',
        notMeasured: '数据库中没有任何微架构测量了此形式。',
        arch: '微架构', tp: 'recip_tp', uops: 'uops', notes: '备注',
        divCycles: 'div_cycles', latencies: '延迟', ports: '端口',
        cycles: '周期', upperBound: '上界',
        microcoded: '微码化', macroFusible: '可宏融合',
        forms: (n) => `数据库中有 ${n} 种形式。`,
        variants: (n) => `${n} 个实测变体`,
        shown: (n, total) => `显示 ${n} / ${total}`,
        allArches: '所有微架构',
        categories: '按类别着色，数据来自 arch-data：',
        tagNoFlags: '无标志', tagNdd: '非破坏性目标',
        allAttached: '没有剩余：每种实测形式都挂在上方对应的编码行下。',
        apxEvex: 'APX：同一条指令改用 EVEX 前缀编码，可访问额外的 16 个通用寄存器。',
        apxNdd: 'APX 非破坏性目标：结果写入第三个寄存器，而不覆盖源操作数。',
        apxNoFlags: 'APX 无标志形式：功能相同但不写 EFLAGS，因此不会打断标志依赖链。',
        operandSize: (w) => `操作数宽度：${w} 位。`,
        attached: (n) => `${n} 种实测形式，分别挂在上方各自的编码行下。`,
        unmatched: (n) => `${n} 种数据库有实测、但手册未单独列出的形式：`,
        opcode: '操作码', form: '形式', ext: '扩展', operands: '操作数',
        iclass: '指令类', extension: '扩展',
        opcodeField: '操作码', encoding: '编码', category: '类别',
        checksum: '校验和', reads: '读取的操作数', writes: '写入的操作数',
        touches: '还会影响', effects: '效果', operandList: '操作数',
        mem: '内存', imm: '立即数',
        wflags: '写标志', rflags: '读标志',
    },
};

/**
 * Indices del array de una forma en la base publicada.
 *
 * La base serializa cada forma como array y no como objeto para que quepa: con
 * los nombres de campo repetidos 22.252 veces ocuparia varias veces mas. El
 * precio es esta tabla, que hay que mantener a la par del esquema de
 * `arch-data`.
 */
const F_ID = 0;
const F_UID = 1;
const F_ICLASS = 2;
const F_EXT = 3;
const F_OPCODE = 4;
const F_ENC = 5;
const F_RMASK = 6;
const F_WMASK = 7;
const F_MEMFLAGS = 8;
const F_OVERLAY = 9;
const F_OPERANDS = 10;
const F_SIGNATURE = 11;
const F_SUMMARY = 12;
const F_CATEGORY = 13;
const F_CHECKSUM = 14;

/**
 * Indices del array de una clase de coste.
 *
 * `flags` es un mapa de bits: 1 microcodificada, 2 fusionable con la anterior.
 * `div_cycles` vale `-1.00` cuando no aplica, igual que `recip_tp`.
 */
const C_RECIP_TP = 0;
const C_UOPS = 1;
const C_FLAGS = 2;
const C_DIV = 3;
const C_LAT = 4;
const C_PORTS = 5;

/**
 * Bits de `memflags`, tal como los compone el exportador:
 * `mem | imm<<1 | wflags<<2 | rflags<<3`.
 */
const MEM_BIT = 1;
const IMM_BIT = 2;
const WFLAGS_BIT = 4;
const RFLAGS_BIT = 8;

/** Promesa de carga, compartida por las dos secciones de la pagina. */
let loading = null;

/**
 * Carga la base una sola vez.
 *
 * Se inyecta como `<script>` en lugar de traerla con `fetch` y analizarla a
 * mano: asi la analiza el motor de JavaScript, que es mucho mas rapido, y el
 * navegador la cachea como cualquier otro script.
 *
 * @returns {Promise<Object>} La base publicada.
 */
function loadDatabase() {
    if (loading) return loading;

    loading = new Promise((resolve, reject) => {
        if (window.VESTA_DB) {
            resolve(window.VESTA_DB);
            return;
        }
        const script = document.createElement('script');
        script.src = DB_URL;
        script.addEventListener('load', () => {
            if (window.VESTA_DB) resolve(window.VESTA_DB);
            else reject(new Error('la base cargo sin definir VESTA_DB'));
        });
        script.addEventListener('error', () =>
            reject(new Error(
                'la peticion de ' + DB_URL + ' no devolvio un script.'
            )));
        document.head.appendChild(script);
    });

    return loading;
}

/**
 * Devuelve las formas de un conjunto de mnemonicos.
 *
 * @param {Object} isa Datos del juego de instrucciones.
 * @param {Array<string>} mnemonics Mnemonicos de la pagina.
 * @returns {Array<Array>} Formas en bruto.
 */
function formsOf(isa, mnemonics) {
    const wanted = new Set(mnemonics.map((m) => m.toUpperCase()));
    return isa.forms.filter((f) => wanted.has(f[F_ICLASS]));
}

/**
 * Envuelve una tabla para que se desplace dentro de si misma.
 *
 * @param {string} head Fila de encabezados.
 * @param {string} body Filas.
 * @returns {string} HTML.
 */
function table(head, body) {
    return (
        '<div class="table-scroll"><table><thead><tr>' + head +
        '</tr></thead><tbody>' + body + '</tbody></table></div>'
    );
}

/** Escapa el texto que llega de la base antes de insertarlo como HTML. */
function esc(text) {
    return String(text == null ? '' : text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Dibuja la tabla de codificaciones.
 *
 * @param {HTMLElement} host Contenedor.
 * @param {Array<Array>} forms Formas.
 * @param {Object} t Rotulos.
 */
function renderForms(host, forms, t) {
    if (forms.length === 0) {
        host.innerHTML = '<p>' + t.none + '</p>';
        return;
    }

    const head =
        '<th>' + t.opcode + '</th><th>' + t.form + '</th>' +
        '<th>' + t.ext + '</th><th>' + t.operands + '</th>';

    const body = forms
        .map((f) =>
            '<tr>' +
            '<td><code>' + esc(f[F_OPCODE]) + '</code></td>' +
            '<td><code>' + esc(f[F_SIGNATURE]) + '</code></td>' +
            '<td>' + esc(f[F_EXT]) + '</td>' +
            '<td>' + esc(f[F_OPERANDS]) + '</td>' +
            '</tr>'
        )
        .join('');

    host.innerHTML = '<p>' + t.forms(forms.length) + '</p>' + table(head, body);
}

/**
 * Tipo de dependencia de una latencia, por la letra del exportador.
 *
 * Las letras son las de `_KIND_LETTER` en `tools/import/dump_html.py` del
 * repositorio del compilador, y `(ub)` marca que el valor es una cota superior
 * y no una medida exacta.
 */
const LAT_KIND = {
    en: { R: 'result', A: 'address', F: 'flags', M: 'memory' },
    es: { R: 'resultado', A: 'direccion', F: 'banderas', M: 'memoria' },
    zh: { R: '结果', A: '地址', F: '标志', M: '内存' },
};

/**
 * Color estable por grupo de puertos.
 *
 * Es la misma funcion que usa el visor de `arch-data`, para que un puerto se
 * vea igual en los dos sitios. El color no es adorno: sirve para reconocer de
 * un vistazo cual domina, y dos tonos distintos para el mismo `p0156` romperian
 * esa lectura.
 *
 * @param {string} name Nombre del grupo de puertos.
 * @returns {number} Tono en grados.
 */
function portHue(name) {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h % 360;
}

/**
 * Dibuja los puertos de una clase, uno por linea y con su color.
 *
 * @param {string} value Campo de puertos, `1.00xp23 2.00xp06`.
 * @returns {string} HTML.
 */
function portsHuman(value) {
    if (!value) return '<span class="dim">-</span>';
    return value
        .split(' ')
        .map((token) => {
            const m = token.match(/^([0-9.]+)x(.+)$/);
            if (!m) return esc(token);
            const hue = portHue(m[2]);
            return (
                '<b>' + esc(m[1]) + '</b> uop &rarr; ' +
                '<span class="pport" style="background:hsl(' + hue +
                ' 60% 50% / .18);color:hsl(' + hue + ' 65% 55%)">' +
                esc(m[2]) + '</span>'
            );
        })
        .join('<br>');
}

/**
 * Dibuja las latencias de una clase, una por linea.
 *
 * @param {string} value Campo de latencias, `op0->op2 5.00M(ub)`.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 * @returns {string} HTML.
 */
function latenciesHuman(value, t, lang) {
    if (!value) return '<span class="dim">-</span>';
    const kinds = LAT_KIND[lang] || LAT_KIND.en;
    return value
        .split(', ')
        .map((entry) => {
            const m = entry.match(/^op(\d+)->op(\d+) ([0-9.]+)([A-Z])(\(ub\))?$/);
            if (!m) return esc(entry);
            return (
                'op' + esc(m[1]) + ' &rarr; op' + esc(m[2]) + ': <b>' +
                esc(m[3]) + '</b> ' + t.cycles +
                ' <span class="dim">(' + esc(kinds[m[4]] || m[4]) +
                (m[5] ? ', ' + t.upperBound : '') + ')</span>'
            );
        })
        .join('<br>');
}

/** Devuelve el valor, o una raya cuando la fuente marca que no aplica. */
function orDash(value) {
    const text = String(value == null ? '' : value);
    if (!text || text === '-1.00' || text === '-1') {
        return '<span class="dim">-</span>';
    }
    return esc(text);
}

/**
 * Dibuja la identidad estructural de una forma.
 *
 * `arch-data` asigna el identificador de forma por el orden de esta clave y no
 * por el nombre, de modo que un renombrado en la fuente no cambia a que se
 * refieren las mediciones. Publicarla permite saber EXACTAMENTE que forma se
 * esta midiendo cuando una instruccion tiene dieciocho.
 *
 * @param {Array} form Forma en bruto.
 * @param {Object} t Rotulos.
 * @returns {string} HTML.
 */
function identityOf(form, t) {
    const rows = [
        [t.iclass, form[F_ICLASS]],
        [t.extension, form[F_EXT]],
        [t.opcodeField, form[F_OPCODE]],
        [t.encoding, form[F_ENC]],
        [t.category, form[F_CATEGORY]],
        [t.checksum, form[F_CHECKSUM]],
    ].filter((r) => r[1]);

    const flags = form[F_MEMFLAGS] | 0;
    const marks = [
        [t.mem, flags & MEM_BIT],
        [t.imm, flags & IMM_BIT],
        [t.wflags, flags & WFLAGS_BIT],
        [t.rflags, flags & RFLAGS_BIT],
    ].filter((m) => m[1]).map((m) => m[0]);

    let out = '<dl class="isa-identity">';
    for (const row of rows) {
        out += '<dt>' + esc(row[0]) + '</dt><dd><code>' + esc(row[1]) + '</code></dd>';
    }
    out += '<dt>' + esc(t.reads) + '</dt><dd><code>' + esc(form[F_RMASK]) + '</code></dd>';
    out += '<dt>' + esc(t.writes) + '</dt><dd><code>' + esc(form[F_WMASK]) + '</code></dd>';
    if (marks.length) {
        out += '<dt>' + esc(t.touches) + '</dt><dd>' + marks.map(esc).join(', ') + '</dd>';
    }
    if (form[F_OVERLAY]) {
        out += '<dt>' + esc(t.effects) + '</dt><dd>' +
            form[F_OVERLAY].split(',')
                .map((e) => '<code>' + esc(e.trim()) + '</code>')
                .join(' ') +
            '</dd>';
    }
    if (form[F_OPERANDS]) {
        out += '<dt>' + esc(t.operandList) + '</dt><dd><code>' +
            esc(form[F_OPERANDS]) + '</code></dd>';
    }
    return out + '</dl>';
}

/**
 * Dibuja la tabla de coste de una forma, con una fila por microarquitectura.
 *
 * @param {Object} isa Datos del juego.
 * @param {Array} form Forma.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 * @returns {string} HTML, o cadena vacia si nadie la mide.
 */
function costTable(isa, form, t, lang) {
    const id = form[F_ID];
    const rows = [];

    for (const arch of isa.arches) {
        // No basta con comprobar el rango del mapa: una forma puede estar
        // mapeada a una clase que esa microarquitectura no define, y entonces
        // el acceso devuelve indefinido. Pasa de verdad.
        const cid = id < arch.map.length ? arch.map[id] : -1;
        const cls = cid >= 0 ? arch.classes[cid] : undefined;
        if (!cls) continue;

        const flags = cls[C_FLAGS] | 0;
        const notes = [];
        if (flags & 1) notes.push(t.microcoded);
        if (flags & 2) notes.push(t.macroFusible);

        rows.push(
            '<tr><td>' + esc(arch.name) + '</td>' +
            '<td>' + orDash(cls[C_RECIP_TP]) + '</td>' +
            '<td>' + esc(cls[C_UOPS]) + '</td>' +
            '<td>' + (notes.length
                ? notes.map(esc).join(', ')
                : '<span class="dim">-</span>') + '</td>' +
            '<td>' + orDash(cls[C_DIV]) + '</td>' +
            '<td>' + latenciesHuman(cls[C_LAT], t, lang) + '</td>' +
            '<td>' + portsHuman(cls[C_PORTS]) + '</td></tr>'
        );
    }

    if (rows.length === 0) return '';

    const head =
        '<th>' + t.arch + '</th><th>' + t.tp + '</th><th>' + t.uops + '</th>' +
        '<th>' + t.notes + '</th><th>' + t.divCycles + '</th>' +
        '<th>' + t.latencies + '</th><th>' + t.ports + '</th>';

    return table(head, rows.join(''));
}

/**
 * Dibuja el coste de todas las formas de la instruccion.
 *
 * Una forma por bloque plegable. `BT` tiene dieciocho, y la latencia de la que
 * opera sobre memoria no se parece a la de la que opera sobre registros:
 * quedarse con el minimo y el maximo, que es lo que se hacia antes, borra
 * justamente el dato por el que se consulta esta seccion.
 *
 * @param {HTMLElement} host Contenedor.
 * @param {Object} isa Datos del juego.
 * @param {Array<Array>} forms Formas de esta instruccion.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 */
/**
 * Devuelve los operandos de una firma de `arch-data`.
 *
 * @param {string} signature Firma, `ADD (M16, R16)`.
 * @returns {Array<string>} Operandos, en orden.
 */
function signatureTokens(signature) {
    const m = (signature || '').match(/\(([^)]*)\)/);
    if (!m) return [];
    return m[1].split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Indica si un operando concreto encaja en lo que pide el manual.
 *
 * El manual escribe la familia (`r/m16`) y la base la instancia (`M16`,
 * `R16`). La correspondencia es la que se lee en cualquier tabla de opcodes:
 * `r/m` admite registro o memoria, `r` solo registro, `imm` un inmediato -- y
 * la base separa ademas la variante con el literal cero -- y un registro fijo
 * se nombra igual en las dos.
 *
 * @param {string} pattern Lo que pide el manual, en minusculas.
 * @param {string} token Lo que ofrece la base.
 * @returns {boolean}
 */
function operandMatches(pattern, token) {
    const t = (token || '').toUpperCase();
    const m = pattern.match(/^(r\/m|rm|r|m|imm|i)(\d+)$/);

    if (m) {
        const width = m[2];
        switch (m[1]) {
        case 'r/m':
        case 'rm':
            return t === 'M' + width || t.indexOf('R' + width) === 0;
        case 'r':
            return t.indexOf('R' + width) === 0;
        case 'm':
            return t === 'M' + width;
        default:
            return t === 'I' + width || t === '0';
        }
    }

    return t === pattern.toUpperCase();
}

/**
 * Devuelve las formas medidas que corresponden a una fila del manual.
 *
 * @param {Array<Array>} forms Formas de la instruccion.
 * @param {string} opcode Bytes del opcode de la fila.
 * @param {string} pattern Patron de operandos de la fila.
 * @returns {Array<Array>} Formas que encajan.
 */
function formsForRow(forms, opcode, pattern) {
    const wanted = pattern.split(',');
    const bytes = opcode.toUpperCase();

    return forms.filter((form) => {
        if ((form[F_OPCODE] || '').toUpperCase() !== bytes) return false;
        const tokens = signatureTokens(form[F_SIGNATURE]);
        if (tokens.length !== wanted.length) return false;
        return wanted.every((p, i) => operandMatches(p, tokens[i]));
    });
}

/**
 * Dibuja una forma medida: su identidad y su coste.
 *
 * @param {Object} isa Datos del juego.
 * @param {Array} form Forma.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 * @returns {string} HTML.
 */
/**
 * Explica que distingue a esta forma, leyendo su propio campo de encoding.
 *
 * `ADD_NF` y `ADD_EVEX` no se explican solos, y son la mayoria de lo que ve
 * quien despliega una fila de `ADD`. La respuesta esta en los datos y no hay
 * que suponerla: el campo dice `isa_set=APX_F,eosz=3,evex=1,nf=1`, o sea que
 * es APX, que va con prefijo EVEX y que no escribe las banderas.
 *
 * Solo se traduce lo que la fuente afirma. `eosz` se nombra porque su
 * correspondencia esta comprobada contra las firmas de las 22252 formas:
 * 1 son 16 bits, 2 son 32 y 3 son 64.
 *
 * @param {Array} form Forma.
 * @param {Object} t Rotulos.
 * @returns {string} HTML, o cadena vacia si no hay nada que anadir.
 */
function variantNote(form, t) {
    const enc = form[F_ENC] || '';
    const notes = [];

    if (/isa_set=APX_F/.test(enc)) {
        const operands = signatureTokens(form[F_SIGNATURE]).length;
        notes.push(/nf=1/.test(enc) ? t.apxNoFlags
            : operands >= 3 ? t.apxNdd : t.apxEvex);
    }

    const size = enc.match(/eosz=(\d)/);
    const width = size && { 1: '16', 2: '32', 3: '64' }[size[1]];
    if (width) notes.push(t.operandSize(width));

    if (notes.length === 0) return '';
    return '<p class="isa-note">' + notes.map(esc).join(' ') + '</p>';
}

/**
 * Distintivos cortos de una forma, para el rotulo.
 *
 * Van FUERA del bloque plegable a proposito. Lo que distingue a `ADD_NF` de
 * `ADD_EVEX` es justo lo que hay que saber para elegir entre las dos, y
 * obligar a desplegar cada una para averiguarlo convierte una lista de seis
 * variantes en seis despliegues.
 *
 * @param {Array} form Forma.
 * @param {Object} t Rotulos.
 * @returns {string} HTML.
 */
function variantTags(form, t) {
    const enc = form[F_ENC] || '';
    const tags = [];

    if (/isa_set=APX_F/.test(enc)) {
        tags.push(['apx', 'APX']);
        if (/nf=1/.test(enc)) tags.push(['nf', t.tagNoFlags]);
        if (signatureTokens(form[F_SIGNATURE]).length >= 3) {
            tags.push(['ndd', t.tagNdd]);
        }
    }

    const size = enc.match(/eosz=(\d)/);
    const width = size && { 1: '16', 2: '32', 3: '64' }[size[1]];
    if (width) tags.push(['size', width + ' bits']);

    return tags
        .map(([kind, label]) =>
            '<span class="isa-tag isa-tag-' + kind + '">' + esc(label) + '</span>')
        .join('');
}

function formBlock(isa, form, t, lang) {
    const cost = costTable(isa, form, t, lang);
    return (
        '<details class="isa-form">' +
        '<summary><code>' + esc(form[F_SIGNATURE] || form[F_UID]) + '</code>' +
        ' <span class="dim">' + esc(form[F_OPCODE]) + '</span>' +
        variantTags(form, t) + '</summary>' +
        variantNote(form, t) +
        identityOf(form, t) +
        (cost || '<p class="isa-note">' + t.notMeasured + '</p>') +
        '</details>'
    );
}

/**
 * Cuelga de cada fila de la tabla de codificaciones sus variantes medidas.
 *
 * ## Por que aqui y no en una seccion aparte
 *
 * Una instruccion como `ADD` tiene diecinueve filas en el manual y ciento
 * treinta formas medidas: `ADD (M8, R8l)`, `ADD_00 (R8l, R8h)`,
 * `ADD_NF_01 (R32, R32, R32)`... Juntas en un solo bloque no hay quien las
 * lea. Colgadas de la fila del manual a la que pertenecen, cada una aparece
 * donde se la busca, y el coste que se ve es el de ESA forma y no un promedio.
 *
 * Lo que no encaja en ninguna fila no se descarta: se lista aparte, porque son
 * formas que la base mide y el manual no publica como fila propia -- las
 * variantes de APX, por ejemplo -- y esconderlas seria perder datos.
 *
 * @param {HTMLElement} host Contenedor de la seccion de coste.
 * @param {Object} isa Datos del juego.
 * @param {Array<Array>} forms Formas de la instruccion.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma.
 */
function renderCost(host, isa, forms, t, lang) {
    if (forms.length === 0) {
        host.innerHTML = '<p>' + t.none + '</p>';
        return;
    }

    const used = new Set();
    const blocks = [];
    const rows = document.querySelectorAll('tr[data-op][data-ops]');
    for (const row of rows) {
        const matched = formsForRow(forms, row.dataset.op, row.dataset.ops);
        if (matched.length === 0) continue;
        matched.forEach((f) => used.add(f[F_ID]));

        // El bloque cuelga de SU fila, que es donde se busca. Puede ir dentro
        // de la tabla porque la de codificaciones reparte sus columnas en
        // proporcion fija y la columna de contenido esta acotada: sin esas dos
        // cosas, una tabla anidada arrastraba su ancho hacia fuera.
        const holder = document.createElement('tr');
        holder.className = 'isa-variants';
        holder.hidden = true;
        holder.innerHTML =
            '<td colspan="' + row.children.length + '">' +
            matched.map((f) => formBlock(isa, f, t, lang)).join('') +
            '</td>';
        row.after(holder);
        blocks.push(holder);

        row.classList.add('is-expandable');
        row.setAttribute('aria-expanded', 'false');
        row.tabIndex = 0;
        row.title = t.variants(matched.length);

        // El numero va en la fila, visible sin desplegar. Sin el no hay forma
        // de saber cuales tienen variantes ni cuantas, y la respuesta a "donde
        // estan las ciento quince" acababa siendo abrirlas una por una.
        const badge = document.createElement('span');
        badge.className = 'isa-count';
        badge.textContent = String(matched.length);
        badge.title = t.variants(matched.length);
        row.lastElementChild.appendChild(badge);

        const toggle = () => {
            const open = holder.hidden;
            // Solo uno abierto a la vez: el bloque sale siempre en el mismo
            // sitio, debajo de la tabla, y dos abiertos a la vez no dejarian
            // saber cual es de que fila.
            for (const other of blocks) other.hidden = true;
            for (const other of rows) other.setAttribute('aria-expanded', 'false');
            holder.hidden = !open;
            row.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        row.addEventListener('click', toggle);
        row.addEventListener('keydown', (event) => {
            // Con teclado la fila responde igual que un boton. Sin esto, la
            // unica forma de ver el coste seria el raton.
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle();
            }
        });
    }

    // Lo que queda en la seccion va plegado y cerrado. Casi siempre no hay
    // nada que mirar aqui -- el coste ya cuelga de su fila -- y un bloque
    // abierto con lo que sobra ensucia la pagina para decir que no sobra nada.
    const leftover = forms.filter((f) => !used.has(f[F_ID]));
    const summary = leftover.length === 0
        ? t.attached(forms.length)
        : t.attached(forms.length - leftover.length) + ' ' +
            t.unmatched(leftover.length);

    host.innerHTML =
        '<details class="isa-leftover">' +
        '<summary>' + summary + '</summary>' +
        (leftover.length === 0
            ? '<p class="isa-note">' + t.allAttached + '</p>'
            : leftover.map((f) => formBlock(isa, f, t, lang)).join('')) +
        '</details>';
}

/**
 * Equipa una seccion con su boton de carga.
 *
 * @param {HTMLElement} host Contenedor con `data-isa`.
 * @param {Object} t Rotulos.
 * @param {string} lang Idioma del documento.
 */
function equip(host, t, lang) {
    const mnemonics = host.dataset.isa.split(',').map((s) => s.trim()).filter(Boolean);
    const kind = host.dataset.isaKind;

    host.innerHTML = '<p class="isa-loading">' + t.loading + '</p>';

    loadDatabase().then(
        (db) => {
            const isa = db.isas.x86;
            const forms = formsOf(isa, mnemonics);
            if (kind === 'cost') renderCost(host, isa, forms, t, lang);
            else renderForms(host, forms, t);
        },
        (error) => {
            // Se dice QUE fallo y DONDE. Un "no se pudo acceder" a secas no
            // deja saber si el problema es la red, la ruta o la base, y en
            // local -- donde `/arch-data/` lo sirve otro repositorio -- parece
            // un fallo del sitio cuando es que la base no esta.
            const reason = (error && error.message) || String(error);
            host.innerHTML =
                '<p>' + t.failed + ' <code>' + esc(DB_URL) + '</code></p>' +
                '<p class="isa-note">' + esc(reason) + '</p>';
            console.error('arch-data:', DB_URL, error);
        }
    );
}

/**
 * Devuelve los mnemonicos que una microarquitectura mide.
 *
 * Una instruccion cuenta si esa microarquitectura tiene clase de coste para
 * **alguna** de sus formas. No vale mirar solo si la forma existe en la base:
 * la base cubre todas las formas de x86, pero cada microarquitectura solo mide
 * las que puede ejecutar, y una forma sin clase mapeada es justamente una que
 * ahi no existe.
 *
 * @param {Object} isa Datos del juego.
 * @param {Object} arch Microarquitectura.
 * @returns {Set<string>} Mnemonicos con medicion.
 */
function measuredBy(isa, arch) {
    const out = new Set();
    for (const form of isa.forms) {
        const id = form[F_ID];
        if (id < arch.map.length && arch.map[id] >= 0) out.add(form[F_ICLASS]);
    }
    return out;
}

/**
 * Equipa el indice con el filtro por microarquitectura.
 *
 * El indice se publica entero en el HTML y el filtro solo esconde entradas:
 * asi la pagina sirve sin JavaScript, el buscador la indexa completa, y quien
 * llega con un enlace directo a una letra la encuentra.
 *
 * @param {HTMLElement} host Contenedor del filtro.
 * @param {Object} isa Datos del juego.
 * @param {Object} t Rotulos.
 */
function equipFilter(host, isa, t) {
    const items = [...document.querySelectorAll('li[data-mnemonics]')];
    // El mapa se filtra tambien: es la misma pregunta -- que hay en esta
    // microarquitectura -- mirada por byte en lugar de por nombre, y un filtro
    // que solo valiera para una de las dos vistas obligaria a cambiar de vista
    // para creerselo.
    const entries = [...document.querySelectorAll('.op-entry[data-mnemonic]')];
    if (items.length === 0 && entries.length === 0) return;

    const select = host.querySelector('select');
    const count = host.querySelector('.isa-filter-count');
    const cache = new Map();

    select.innerHTML =
        '<option value="">' + t.allArches + '</option>' +
        isa.arches
            .map((a, i) => '<option value="' + i + '">' + esc(a.name) + '</option>')
            .join('');

    const apply = () => {
        const index = select.value;
        let shown = 0;

        if (index === '') {
            for (const li of items) li.hidden = false;
            for (const entry of entries) entry.hidden = false;
            shown = items.length;
        } else {
            if (!cache.has(index)) cache.set(index, measuredBy(isa, isa.arches[index]));
            const measured = cache.get(index);
            for (const li of items) {
                const names = li.dataset.mnemonics.split(',').filter(Boolean);
                li.hidden = !names.some((n) => measured.has(n.toUpperCase()));
                if (!li.hidden) shown += 1;
            }
            for (const entry of entries) {
                entry.hidden = !measured.has(entry.dataset.mnemonic.toUpperCase());
            }
        }

        // Una casilla cuyas entradas se han ido queda marcada como vacia, para
        // que el mapa siga distinguiendo "aqui no hay nada" de "aqui no hay
        // nada EN ESTA microarquitectura".
        for (const cellEl of document.querySelectorAll('.op-map td')) {
            const children = [...cellEl.querySelectorAll('.op-entry')];
            if (children.length === 0) continue;
            cellEl.classList.toggle('is-filtered',
                children.every((c) => c.hidden));
        }

        // Una letra sin ninguna entrada visible se esconde con su encabezado:
        // dejarla puesta haria creer que ahi no hay nada medido cuando lo que
        // pasa es que la seccion entera se vacio.
        for (const list of document.querySelectorAll('ul.isa-index')) {
            const empty = ![...list.children].some((li) => !li.hidden);
            list.hidden = empty;
            if (list.previousElementSibling) {
                list.previousElementSibling.hidden = empty;
            }
        }

        count.textContent = t.shown(shown, items.length);
    };

    select.addEventListener('change', apply);
    host.hidden = false;
    apply();
}

/**
 * Colorea el mapa de opcodes por la categoria de cada instruccion.
 *
 * Sin color el mapa son doscientas cincuenta y seis casillas de texto igual y
 * no se distingue una zona de otra; con el se ve de un vistazo donde vive la
 * aritmetica, donde los saltos y donde SSE.
 *
 * La categoria no se inventa aqui: la da `arch-data` en cada forma, que es la
 * misma fuente que usa el compilador. Y el tono se calcula con la misma
 * funcion que los puertos, para que una categoria tenga siempre el mismo color
 * sin mantener una paleta a mano que se quedaria corta al aparecer una nueva.
 *
 * @param {Object} isa Datos del juego.
 * @param {Object} t Rotulos.
 */
function colorOpcodeMap(isa, t) {
    const links = document.querySelectorAll('.op-map a[data-mnemonic]');
    if (links.length === 0) return;

    const category = new Map();
    for (const form of isa.forms) {
        if (form[F_CATEGORY] && !category.has(form[F_ICLASS])) {
            category.set(form[F_ICLASS], form[F_CATEGORY]);
        }
    }

    const used = new Set();
    for (const link of links) {
        const name = link.dataset.mnemonic.toUpperCase();
        const kind = category.get(name);
        if (!kind) continue;
        used.add(kind);
        link.style.color = 'hsl(' + portHue(kind) + ' 70% 68%)';
        link.title = kind;
    }

    const legend = document.querySelector('.op-legend');
    if (!legend || used.size === 0) return;

    legend.innerHTML =
        '<p>' + t.categories + '</p>' +
        [...used].sort().map((kind) =>
            '<span class="op-legend-item" style="color:hsl(' + portHue(kind) +
            ' 70% 68%)">' + esc(kind) + '</span>').join('');
    legend.hidden = false;
}

/**
 * Punto de entrada: equipa las secciones que dependen de arch-data.
 *
 * @returns {void}
 */
function init() {
    const lang = (document.documentElement.lang || 'en').slice(0, 2);
    const t = LABELS[lang] || LABELS.en;

    // El indice: un filtro por microarquitectura. Cuales hay y que mide cada
    // una solo lo sabe la base, asi que el desplegable se rellena al cargarla.
    const filter = document.querySelector('.isa-filter[data-isa-kind="filter"]');
    if (filter) {
        loadDatabase().then(
            (db) => {
                equipFilter(filter, db.isas.x86, t);
                colorOpcodeMap(db.isas.x86, t);
            },
            (error) => console.error('arch-data:', DB_URL, error)
        );
    }

    const hosts = document.querySelectorAll('[data-isa]');
    for (const host of hosts) equip(host, t, lang);
}

init();
