/**
 * @file site/content/learn.mjs
 * @brief Indice de la seccion Learn: partes, capitulos y su orden.
 *
 * Vive aqui, junto al contenido, y no en `tools/`, porque es una decision
 * EDITORIAL y no una pieza del generador: cambiar el orden de un capitulo o
 * anadir uno nuevo es escribir contenido, no tocar el build.
 *
 * El orden de este fichero ES el orden de lectura. La barra lateral, la
 * navegacion de anterior y siguiente y el indice de la seccion salen todos de
 * aqui, de modo que no pueden contradecirse entre si.
 *
 * Un capitulo aparece en la barra lateral aunque todavia no exista su pagina;
 * se marca como pendiente y no se enlaza. Es deliberado: el lector ve el
 * recorrido completo y sabe que hay mas por venir, en lugar de encontrarse un
 * indice que crece sin explicacion. La alternativa -- ocultarlos -- haria
 * parecer terminada una seccion que no lo esta.
 */

/**
 * Partes de Learn.
 *
 * `slug` es el ultimo segmento de la URL en cada idioma. Se traduce, porque
 * una URL en castellano que dice `/es/learn/getting-started/` delata que la
 * traduccion es un anadido y no una version de primera.
 *
 * @typedef {Object} Chapter
 * @property {string} id Identificador estable, no traducido.
 * @property {Object<string,string>} title Titulo por idioma.
 * @property {Object<string,string>} slug Ultimo segmento de URL por idioma.
 * @property {boolean} [draft] Si aun no existe su pagina.
 */

/** @type {Array<{id: string, title: Object, chapters: Chapter[]}>} */
export const LEARN = [
    {
        id: 'start',
        title: { en: 'Getting started', es: 'Primeros pasos' },
        chapters: [
            {
                id: 'install',
                title: { en: 'Install Vesta', es: 'Instalar Vesta' },
                // Sin pagina propia: la instalacion vive en /download/ y una
                // sola URL canonica por tema es regla del sitio. Duplicarla
                // aqui obligaria a mantener dos versiones del mismo texto.
                path: { en: '/download/', es: '/es/download/' },
            },
            {
                id: 'hello',
                title: { en: 'Hello world', es: 'Hola mundo' },
                slug: { en: 'hello-world', es: 'hola-mundo' },
            },
            {
                id: 'modes',
                title: { en: 'The three modes', es: 'Los tres modos' },
                slug: { en: 'three-modes', es: 'tres-modos' },
            },
            {
                id: 'anatomy',
                title: { en: 'Anatomy of a program', es: 'Anatomia de un programa' },
                slug: { en: 'anatomy', es: 'anatomia' },
            },
        ],
    },
    {
        id: 'language',
        title: { en: 'The language', es: 'El lenguaje' },
        chapters: [
            {
                id: 'variables',
                title: { en: 'Variables and types', es: 'Variables y tipos' },
                slug: { en: 'variables', es: 'variables' },
            },
            {
                id: 'operators',
                title: { en: 'Operators and casts', es: 'Operadores y casts' },
                slug: { en: 'operators', es: 'operadores' },
            },
            {
                id: 'control-flow',
                title: { en: 'Control flow', es: 'Control de flujo' },
                slug: { en: 'control-flow', es: 'control-de-flujo' },
            },
            {
                id: 'functions',
                title: { en: 'Functions', es: 'Funciones' },
                slug: { en: 'functions', es: 'funciones' },
                draft: true,
            },
            {
                id: 'strings',
                title: { en: 'Strings and interpolation', es: 'Cadenas e interpolacion' },
                slug: { en: 'strings', es: 'cadenas' },
                draft: true,
            },
            {
                id: 'pointers',
                title: { en: 'Arrays and pointers', es: 'Arrays y punteros' },
                slug: { en: 'arrays-and-pointers', es: 'arrays-y-punteros' },
                draft: true,
            },
            {
                id: 'structs',
                title: { en: 'Structs', es: 'Structs' },
                slug: { en: 'structs', es: 'structs' },
                draft: true,
            },
            {
                id: 'enums',
                title: { en: 'Enums and pattern matching', es: 'Enums y pattern matching' },
                slug: { en: 'enums', es: 'enums' },
                draft: true,
            },
            {
                id: 'valued-enums',
                title: { en: 'Enums with a backing value', es: 'Enums con valor' },
                slug: { en: 'valued-enums', es: 'enums-con-valor' },
                draft: true,
            },
        ],
    },
    {
        id: 'errors',
        title: { en: 'Absence and error', es: 'Ausencia y error' },
        chapters: [
            {
                id: 'optional-result',
                title: { en: 'Optional and Result', es: 'Optional y Result' },
                slug: { en: 'optional-result', es: 'optional-result' },
                draft: true,
            },
            {
                id: 'unwrap',
                title: { en: 'Unwrapping and propagation', es: 'Desempaquetar y propagar' },
                slug: { en: 'unwrapping', es: 'desempaquetar' },
                draft: true,
            },
            {
                id: 'exceptions',
                title: { en: 'Exceptions and panic', es: 'Excepciones y panic' },
                slug: { en: 'exceptions', es: 'excepciones' },
                draft: true,
            },
        ],
    },
    {
        id: 'memory',
        title: { en: 'Memory', es: 'Memoria' },
        chapters: [
            {
                id: 'ownership',
                title: { en: 'Who frees what', es: 'Quien libera que' },
                slug: { en: 'ownership', es: 'propiedad' },
                draft: true,
            },
            {
                id: 'smart-pointers',
                title: { en: 'unique and shared', es: 'unique y shared' },
                slug: { en: 'smart-pointers', es: 'punteros-inteligentes' },
                draft: true,
            },
            {
                id: 'borrows',
                title: { en: 'Borrows', es: 'Prestamos' },
                slug: { en: 'borrows', es: 'prestamos' },
                draft: true,
            },
            {
                id: 'gc',
                title: { en: 'When you need gc<T>', es: 'Cuando hace falta gc<T>' },
                slug: { en: 'garbage-collection', es: 'recoleccion' },
                draft: true,
            },
        ],
    },
    {
        id: 'abstraction',
        title: { en: 'Abstraction', es: 'Abstraccion' },
        chapters: [
            {
                id: 'classes',
                title: { en: 'Classes and interfaces', es: 'Clases e interfaces' },
                slug: { en: 'classes', es: 'clases' },
                draft: true,
            },
            {
                id: 'members',
                title: { en: 'Properties and destructors', es: 'Propiedades y destructores' },
                slug: { en: 'members', es: 'miembros' },
                draft: true,
            },
            {
                id: 'operators-overload',
                title: { en: 'Operator overloading', es: 'Sobrecarga de operadores' },
                slug: { en: 'operator-overloading', es: 'sobrecarga-de-operadores' },
                draft: true,
            },
            {
                id: 'generics',
                title: { en: 'Generics and concepts', es: 'Genericos y concepts' },
                slug: { en: 'generics', es: 'genericos' },
                draft: true,
            },
            {
                id: 'closures',
                title: { en: 'Closures: fn and cfn', es: 'Closures: fn y cfn' },
                slug: { en: 'closures', es: 'closures' },
                draft: true,
            },
        ],
    },
    {
        id: 'collections',
        title: { en: 'Collections', es: 'Colecciones' },
        chapters: [
            {
                id: 'lists',
                title: { en: 'Arrays and ArrayList', es: 'Arrays y ArrayList' },
                slug: { en: 'lists', es: 'listas' },
                draft: true,
            },
            {
                id: 'maps',
                title: { en: 'Maps and sets', es: 'Mapas y conjuntos' },
                slug: { en: 'maps-and-sets', es: 'mapas-y-conjuntos' },
                draft: true,
            },
            {
                id: 'queues',
                title: { en: 'Queues and stacks', es: 'Colas y pilas' },
                slug: { en: 'queues-and-stacks', es: 'colas-y-pilas' },
                draft: true,
            },
            {
                id: 'collections-memory',
                title: { en: 'Collections and memory', es: 'Colecciones y memoria' },
                slug: { en: 'collections-and-memory', es: 'colecciones-y-memoria' },
                draft: true,
            },
        ],
    },
    {
        id: 'comptime',
        title: { en: 'Compile-time', es: 'Comptime' },
        chapters: [
            {
                id: 'const-comptime',
                title: { en: 'const and comptime', es: 'const y comptime' },
                slug: { en: 'const-and-comptime', es: 'const-y-comptime' },
                draft: true,
            },
            {
                id: 'comptime-fn',
                title: { en: 'Compile-time functions', es: 'Funciones comptime' },
                slug: { en: 'comptime-functions', es: 'funciones-comptime' },
                draft: true,
            },
            {
                id: 'macros',
                title: { en: 'Macros', es: 'Macros' },
                slug: { en: 'macros', es: 'macros' },
                draft: true,
            },
            {
                id: 'expr-capture',
                title: { en: 'Capturing code with expr', es: 'Capturar codigo con expr' },
                slug: { en: 'expr-capture', es: 'captura-expr' },
                draft: true,
            },
            {
                id: 'source-quote',
                title: { en: 'source() as quasi-quote', es: 'source() como quasi-quote' },
                slug: { en: 'source-quote', es: 'source-quote' },
                draft: true,
            },
            {
                id: 'comptime-strings',
                title: { en: 'Strings at compile time', es: 'Cadenas en compile-time' },
                slug: { en: 'comptime-strings', es: 'cadenas-comptime' },
                draft: true,
            },
            {
                id: 'introspect-layout',
                title: {
                    en: 'Introspection: size and identity',
                    es: 'Introspeccion: tamano e identidad',
                },
                slug: { en: 'introspection-layout', es: 'introspeccion-layout' },
                draft: true,
            },
            {
                id: 'introspect-members',
                title: {
                    en: 'Introspection: fields and methods',
                    es: 'Introspeccion: campos y metodos',
                },
                slug: { en: 'introspection-members', es: 'introspeccion-miembros' },
                draft: true,
            },
            {
                id: 'type-predicates',
                title: { en: 'Type predicates', es: 'Predicados de tipo' },
                slug: { en: 'type-predicates', es: 'predicados-de-tipo' },
                draft: true,
            },
            {
                id: 'types-as-values',
                title: { en: 'Types as values', es: 'Tipos como valores' },
                slug: { en: 'types-as-values', es: 'tipos-como-valores' },
                draft: true,
            },
            {
                id: 'comptime-control',
                title: { en: 'comptime if and comptime for', es: 'comptime if y comptime for' },
                slug: { en: 'comptime-control-flow', es: 'control-de-flujo-comptime' },
                draft: true,
            },
            {
                id: 'comptime-data',
                title: {
                    en: 'Compile-time data structures',
                    es: 'Estructuras de datos en compile-time',
                },
                slug: { en: 'data-structures', es: 'estructuras-de-datos' },
                draft: true,
            },
            {
                id: 'static-assert',
                title: { en: 'static_assert', es: 'static_assert' },
                slug: { en: 'static-assert', es: 'static-assert' },
                draft: true,
            },
            {
                id: 'comptime-ffi',
                title: {
                    en: 'Calling the system at build time',
                    es: 'Llamar al sistema al compilar',
                },
                slug: { en: 'compile-time-ffi', es: 'ffi-en-compilacion' },
                draft: true,
            },
            {
                id: 'comptime-asm',
                title: { en: 'Assembly at compile time', es: 'Ensamblador en compile-time' },
                slug: { en: 'compile-time-assembly', es: 'ensamblador-en-compilacion' },
                draft: true,
            },
            {
                id: 'codegen',
                title: { en: 'Generating code', es: 'Generar codigo' },
                slug: { en: 'code-generation', es: 'generar-codigo' },
                draft: true,
            },
            {
                id: 'brainfuck',
                title: {
                    en: 'A compiler inside the compiler',
                    es: 'Un compilador dentro del compilador',
                },
                slug: { en: 'compiler-in-a-compiler', es: 'compilador-en-el-compilador' },
                draft: true,
            },
            {
                id: 'ctpe',
                title: {
                    en: 'CTPE: the whole program, precomputed',
                    es: 'CTPE: el programa precalculado',
                },
                slug: { en: 'ctpe', es: 'ctpe' },
                draft: true,
            },
            {
                id: 'comptime-limits',
                title: { en: 'Limits and workarounds', es: 'Limites y como rodearlos' },
                slug: { en: 'limits', es: 'limites' },
                draft: true,
            },
        ],
    },
    {
        id: 'stdlib',
        title: { en: 'The standard library', es: 'La biblioteca estandar' },
        chapters: [
            {
                id: 'std-tour',
                title: { en: 'What is in std', es: 'Que hay en std' },
                slug: { en: 'tour', es: 'recorrido' },
                draft: true,
            },
            {
                id: 'std-text-math',
                title: { en: 'Text and maths', es: 'Texto y matematicas' },
                slug: { en: 'text-and-maths', es: 'texto-y-matematicas' },
                draft: true,
            },
            {
                id: 'std-wideint',
                title: { en: 'Wide integers: u128 to u512', es: 'Enteros anchos: u128 a u512' },
                slug: { en: 'wide-integers', es: 'enteros-anchos' },
                draft: true,
            },
            {
                id: 'std-atomic',
                title: { en: 'Atomics', es: 'Atomicos' },
                slug: { en: 'atomics', es: 'atomicos' },
                draft: true,
            },
            {
                id: 'std-sync',
                title: { en: 'Mutexes, channels and pools', es: 'Mutex, canales y pools' },
                slug: { en: 'sync-primitives', es: 'primitivas-de-sincronizacion' },
                draft: true,
            },
            {
                id: 'std-types',
                title: { en: 'Per-architecture types and C compatibility', es: 'Tipos por arquitectura y compatibilidad con C' },
                slug: { en: 'types', es: 'tipos' },
                draft: true,
            },
            {
                id: 'std-os',
                title: { en: 'Files and the operating system', es: 'Ficheros y sistema operativo' },
                slug: { en: 'files-and-os', es: 'ficheros-y-sistema' },
                draft: true,
            },
            {
                id: 'std-syscall',
                title: { en: 'Syscalls without libc', es: 'Syscalls sin libc' },
                slug: { en: 'syscalls', es: 'syscalls' },
                draft: true,
            },
            {
                id: 'std-binary',
                title: {
                    en: 'Binary formats: PE, ELF, BMP',
                    es: 'Formatos binarios: PE, ELF, BMP',
                },
                slug: { en: 'binary-formats', es: 'formatos-binarios' },
                draft: true,
            },
            {
                id: 'std-cpu',
                title: { en: 'CPU detection and dispatch', es: 'Deteccion de CPU y despacho' },
                slug: { en: 'cpu-detection', es: 'deteccion-de-cpu' },
                draft: true,
            },
        ],
    },
    {
        id: 'runtime',
        title: { en: 'The runtime, in Vesta', es: 'El runtime, en Vesta' },
        chapters: [
            {
                id: 'runtime-why',
                title: {
                    en: 'Why the runtime is written in the language',
                    es: 'Por que el runtime esta en el lenguaje',
                },
                slug: { en: 'why', es: 'por-que' },
                draft: true,
            },
            {
                id: 'runtime-mem',
                title: {
                    en: 'Memory: arenas and the slab allocator',
                    es: 'Memoria: arenas y allocator slab',
                },
                slug: { en: 'memory', es: 'memoria' },
                draft: true,
            },
            {
                id: 'runtime-io',
                title: { en: 'Input and output without libc', es: 'Entrada y salida sin libc' },
                slug: { en: 'input-output', es: 'entrada-y-salida' },
                draft: true,
            },
            {
                id: 'runtime-exc',
                title: { en: 'Exceptions in the runtime', es: 'Excepciones en el runtime' },
                slug: { en: 'runtime-exceptions', es: 'excepciones-runtime' },
                draft: true,
            },
            {
                id: 'runtime-fiber',
                title: { en: 'Stackful fibers', es: 'Fibras stackful' },
                slug: { en: 'fibers', es: 'fibras' },
                draft: true,
            },
            {
                id: 'runtime-thread',
                title: { en: 'Real OS threads', es: 'Hilos reales del sistema' },
                slug: { en: 'threads', es: 'hilos' },
                draft: true,
            },
            {
                id: 'runtime-sync',
                title: { en: 'Reentrant monitors', es: 'Monitores reentrantes' },
                slug: { en: 'monitors', es: 'monitores' },
                draft: true,
            },
            {
                id: 'runtime-fault',
                title: { en: 'When the processor stops', es: 'Cuando el procesador para' },
                slug: { en: 'faults', es: 'fallos' },
                draft: true,
            },
        ],
    },
    {
        id: 'concurrency',
        title: { en: 'Concurrency', es: 'Concurrencia' },
        chapters: [
            {
                id: 'spawn',
                title: { en: 'spawn and processes', es: 'spawn y procesos' },
                slug: { en: 'spawn', es: 'spawn' },
                draft: true,
            },
            {
                id: 'futures',
                title: { en: 'Futures and await', es: 'Futuros y await' },
                slug: { en: 'futures', es: 'futuros' },
                draft: true,
            },
            {
                id: 'monitors',
                title: { en: 'synchronized and atomics', es: 'synchronized y atomicos' },
                slug: { en: 'synchronized', es: 'synchronized' },
                draft: true,
            },
            {
                id: 'backend-state',
                title: { en: 'What works on each backend', es: 'Que funciona en cada backend' },
                slug: { en: 'backend-support', es: 'soporte-por-backend' },
                draft: true,
            },
        ],
    },
    {
        id: 'building',
        title: { en: 'Organising and building', es: 'Organizar y construir' },
        chapters: [
            {
                id: 'modules',
                title: { en: 'Modules and imports', es: 'Modulos e imports' },
                slug: { en: 'modules', es: 'modulos' },
                draft: true,
            },
            {
                id: 'namespaces',
                title: { en: 'Namespaces, extension and impl', es: 'Namespaces, extension e impl' },
                slug: { en: 'namespaces', es: 'namespaces' },
                draft: true,
            },
            {
                id: 'conditional',
                title: { en: 'Conditional compilation', es: 'Compilacion condicional' },
                slug: { en: 'conditional-compilation', es: 'compilacion-condicional' },
                draft: true,
            },
            {
                id: 'native',
                title: {
                    en: 'From bytecode to a native binary',
                    es: 'Del bytecode al binario nativo',
                },
                slug: { en: 'native-binaries', es: 'binarios-nativos' },
                draft: true,
            },
        ],
    },
    {
        id: 'distinct',
        title: { en: 'What makes it different', es: 'Lo que lo hace distinto' },
        chapters: [
            {
                id: 'contracts',
                title: { en: 'Verified contracts', es: 'Contratos verificados' },
                slug: { en: 'contracts', es: 'contratos' },
                draft: true,
            },
            {
                id: 'ffi',
                title: { en: 'Talking to C', es: 'Hablar con C' },
                slug: { en: 'ffi', es: 'ffi' },
                draft: true,
            },
            {
                id: 'overlays',
                title: { en: 'Typed views over memory', es: 'Vistas tipadas sobre memoria' },
                slug: { en: 'overlays', es: 'overlays' },
                draft: true,
            },
            {
                id: 'vectorization',
                title: { en: 'Automatic vectorization', es: 'Vectorizacion automatica' },
                slug: { en: 'vectorization', es: 'vectorizacion' },
                draft: true,
            },
        ],
    },
];

/**
 * Resuelve la direccion de un capitulo.
 *
 * UNICO sitio donde se calcula. La barra lateral, la navegacion de anterior y
 * siguiente y el propio build la necesitan, y calcularla en cada uno llevo a
 * que un capitulo sin `slug` -- el de instalacion, que apunta a `/download/` --
 * rompiera el build en el unico de los tres que no lo contemplaba.
 *
 * @param {Object} chapter Capitulo.
 * @param {string} lang Idioma.
 * @returns {{href: string, own: boolean}} Direccion final y si vive fuera de
 *          Learn (en cuyo caso ya trae el prefijo de idioma).
 */
export function chapterHref(chapter, lang) {
    if (chapter.path) return { href: chapter.path[lang], own: true };
    return { href: `/learn/${chapter.slug[lang]}/`, own: false };
}

/**
 * Devuelve la lista plana de capitulos, en orden de lectura.
 *
 * La navegacion de anterior y siguiente cruza las fronteras entre partes a
 * proposito: quien termina la ultima pagina de una parte espera continuar, no
 * encontrarse un callejon sin salida.
 *
 * @returns {Array<{part: Object, chapter: Object, index: number}>}
 */
export function flatChapters() {
    const out = [];
    for (const part of LEARN) {
        for (const chapter of part.chapters) {
            out.push({ part, chapter, index: out.length });
        }
    }
    return out;
}

/**
 * Cuenta capitulos totales y escritos.
 *
 * @returns {{total: number, done: number}}
 */
export function learnProgress() {
    const all = flatChapters();
    return {
        total: all.length,
        done: all.filter((c) => !c.chapter.draft).length,
    };
}
