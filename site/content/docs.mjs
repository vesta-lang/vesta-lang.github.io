/**
 * @file docs.mjs
 * @brief Indice de la seccion Documentation.
 *
 * Es la unica fuente de la navegacion de la referencia: la barra lateral, la
 * portada de cada libro y la comprobacion de que lo declarado y lo escrito
 * coinciden salen todas de aqui. Dos listas separadas se contradicen a la
 * primera pagina que se anade.
 *
 * ## Por que tres niveles
 *
 * Learn es una lista plana porque se lee en orden y tiene un final. La
 * referencia no: crece indefinidamente y se entra por el medio. Una barra
 * lateral con las cincuenta paginas de la referencia deja de servir para
 * navegar en cuanto pasa de una pantalla.
 *
 * Por eso la jerarquia es libro -> pagina -> entrada:
 *
 *     /docs/                              los libros
 *     /docs/language/                     las paginas del libro
 *     /docs/language/statements/          la pagina
 *     /docs/language/statements/#match    la entrada
 *
 * La barra lateral muestra el libro actual desplegado y el resto plegados a
 * una linea. Anadir veinte entradas a una pagina no la alarga en absoluto,
 * porque las entradas son anclas y viven en el indice de la derecha.
 *
 * ## Reparto con Internals y Stdlib
 *
 * La frontera no es tematica, es el tipo de afirmacion:
 *
 * - **Docs** dice que esta garantizado. Es normativo.
 * - **Internals** dice como se consigue. Es descriptivo y puede cambiar sin
 *   romper nada: que el JIT dispare a las 1500 invocaciones es implementacion.
 * - **Stdlib** dice que hay escrito en Vesta encima de eso.
 *
 * De ahi que el juego de instrucciones de la VM y el formato `.velb` vivan
 * aqui y no en Internals: son especificaciones contra las que alguien podria
 * escribir otra implementacion.
 */

/**
 * Libros de la referencia.
 *
 * @typedef {Object} DocsPage
 * @property {string} id Identificador estable, independiente del idioma.
 * @property {Object<string,string>} title Titulo por idioma.
 * @property {Object<string,string>} slug Ultimo segmento de URL por idioma.
 * @property {boolean} [draft] Aun sin escribir; no se enlaza.
 *
 * @typedef {Object} DocsBook
 * @property {string} id Identificador estable.
 * @property {Object<string,string>} title Titulo por idioma.
 * @property {Object<string,string>} slug Segmento de URL por idioma.
 * @property {Object<string,string>} summary Una linea para la portada.
 * @property {Array<DocsPage>} pages
 */
export const DOCS = [
    {
        id: 'language',
        title: { en: 'Language reference', es: 'Referencia del lenguaje' },
        slug: { en: 'language', es: 'lenguaje' },
        summary: {
            en: 'What the language guarantees: lexis, types, expressions, ' +
                'statements, declarations, contracts, comptime.',
            es: 'Lo que el lenguaje garantiza: lexico, tipos, expresiones, ' +
                'sentencias, declaraciones, contratos, comptime.',
        },
        pages: [
            {
                id: 'lexical',
                title: { en: 'Lexical structure', es: 'Estructura lexica' },
                slug: { en: 'lexical', es: 'lexico' },
                // Bloqueada: la tabla de literales flotantes no se puede
                // publicar todavia. La documentacion del proyecto anuncia la
                // forma IEEE 754 hexadecimal (`0x1.8p+1`) y el lexer la
                // rechaza, asi que hace falta decidir cual de las dos se
                // corrige antes de afirmar nada aqui.
                draft: true,
            },
            {
                id: 'types',
                title: { en: 'Types', es: 'Tipos' },
                slug: { en: 'types', es: 'tipos' },
                draft: true,
            },
            {
                id: 'expressions',
                title: { en: 'Expressions and operators', es: 'Expresiones y operadores' },
                slug: { en: 'expressions', es: 'expresiones' },
                draft: true,
            },
            {
                id: 'statements',
                title: { en: 'Statements', es: 'Sentencias' },
                slug: { en: 'statements', es: 'sentencias' },
                draft: true,
            },
            {
                id: 'declarations',
                title: { en: 'Declarations', es: 'Declaraciones' },
                slug: { en: 'declarations', es: 'declaraciones' },
                draft: true,
            },
            {
                id: 'memory',
                title: { en: 'Memory and ownership', es: 'Memoria y propiedad' },
                slug: { en: 'memory', es: 'memoria' },
                draft: true,
            },
            {
                id: 'errors',
                title: { en: 'Errors and absence', es: 'Errores y ausencia' },
                slug: { en: 'errors', es: 'errores' },
                draft: true,
            },
            {
                id: 'concurrency',
                title: { en: 'Concurrency', es: 'Concurrencia' },
                slug: { en: 'concurrency', es: 'concurrencia' },
                draft: true,
            },
            {
                id: 'contracts',
                title: { en: 'Contracts and annotations', es: 'Contratos y anotaciones' },
                slug: { en: 'contracts', es: 'contratos' },
                draft: true,
            },
            {
                id: 'comptime',
                title: { en: 'Compile-time execution', es: 'Ejecucion en compilacion' },
                slug: { en: 'comptime', es: 'comptime' },
                draft: true,
            },
            {
                id: 'preprocessor',
                title: { en: 'Preprocessor', es: 'Preprocesador' },
                slug: { en: 'preprocessor', es: 'preprocesador' },
                draft: true,
            },
            {
                id: 'asm',
                title: { en: 'Inline assembly', es: 'Ensamblador integrado' },
                slug: { en: 'asm', es: 'asm' },
                draft: true,
            },
            {
                id: 'interop',
                title: { en: 'Interoperability', es: 'Interoperabilidad' },
                slug: { en: 'interop', es: 'interoperabilidad' },
                draft: true,
            },
            {
                id: 'overlays',
                title: { en: 'Overlays', es: 'Overlays' },
                slug: { en: 'overlays', es: 'overlays' },
                draft: true,
            },
            {
                id: 'grammar',
                title: { en: 'Grammar', es: 'Gramatica' },
                slug: { en: 'grammar', es: 'gramatica' },
                draft: true,
            },
        ],
    },
    {
        id: 'tools',
        title: { en: 'Toolchain reference', es: 'Referencia de herramientas' },
        slug: { en: 'tools', es: 'herramientas' },
        summary: {
            en: 'The command line, environment variables, diagnostics, the ' +
                'shell, the package manager and the file formats.',
            es: 'La linea de ordenes, las variables de entorno, los ' +
                'diagnosticos, la shell, el gestor de paquetes y los formatos.',
        },
        pages: [
            {
                id: 'cli',
                title: { en: 'The vesta command', es: 'La orden vesta' },
                slug: { en: 'cli', es: 'cli' },
                draft: true,
            },
            {
                id: 'env',
                title: { en: 'Environment variables', es: 'Variables de entorno' },
                slug: { en: 'environment', es: 'entorno' },
                draft: true,
            },
            {
                id: 'diagnostics',
                title: { en: 'Diagnostics', es: 'Diagnosticos' },
                slug: { en: 'diagnostics', es: 'diagnosticos' },
                draft: true,
            },
            {
                id: 'shell',
                title: { en: 'VestaShell', es: 'VestaShell' },
                slug: { en: 'shell', es: 'shell' },
                draft: true,
            },
            {
                id: 'packages',
                title: { en: 'Package manager', es: 'Gestor de paquetes' },
                slug: { en: 'packages', es: 'paquetes' },
                draft: true,
            },
            {
                id: 'formats',
                title: { en: 'File extensions', es: 'Extensiones de fichero' },
                slug: { en: 'file-types', es: 'tipos-de-fichero' },
                draft: true,
            },
        ],
    },
    {
        id: 'vm',
        title: { en: 'Platform reference', es: 'Referencia de la plataforma' },
        slug: { en: 'vm', es: 'vm' },
        summary: {
            en: 'The virtual machine as a specification: instruction set, ' +
                'registers, calling convention, binary formats, syscalls.',
            es: 'La maquina virtual como especificacion: juego de ' +
                'instrucciones, registros, convencion de llamadas, formatos ' +
                'binarios, syscalls.',
        },
        pages: [
            {
                id: 'isa',
                title: { en: 'Instruction set', es: 'Juego de instrucciones' },
                slug: { en: 'instruction-set', es: 'juego-de-instrucciones' },
                draft: true,
            },
            {
                id: 'registers',
                title: { en: 'Registers', es: 'Registros' },
                slug: { en: 'registers', es: 'registros' },
                draft: true,
            },
            {
                id: 'callconv',
                title: { en: 'Calling convention', es: 'Convencion de llamadas' },
                slug: { en: 'calling-convention', es: 'convencion-de-llamadas' },
                draft: true,
            },
            {
                id: 'velb',
                title: { en: 'The .velb format', es: 'El formato .velb' },
                slug: { en: 'velb', es: 'velb' },
                draft: true,
            },
            {
                id: 'vela',
                title: { en: 'The .vela archive', es: 'El archivo .vela' },
                slug: { en: 'vela', es: 'vela' },
                draft: true,
            },
            {
                id: 'syscalls',
                title: { en: 'VM syscalls', es: 'Syscalls de la VM' },
                slug: { en: 'syscalls', es: 'syscalls' },
                draft: true,
            },
        ],
    },
    {
        id: 'encoding',
        title: { en: 'Encoding reference', es: 'Referencia de codificacion' },
        slug: { en: 'encoding', es: 'codificacion' },
        summary: {
            en: 'How instructions are encoded, for the bytecode and for each ' +
                'native target the toolchain emits.',
            es: 'Como se codifican las instrucciones, en el bytecode y en cada ' +
                'objetivo nativo que la cadena genera.',
        },
        pages: [
            {
                id: 'bytecode',
                title: { en: 'Bytecode encoding', es: 'Codificacion del bytecode' },
                slug: { en: 'bytecode', es: 'bytecode' },
                draft: true,
            },
            {
                id: 'x86-64',
                title: { en: 'x86-64 encoding', es: 'Codificacion x86-64' },
                slug: { en: 'x86-64', es: 'x86-64' },
                draft: true,
            },
            {
                id: 'x86-32',
                title: { en: 'x86-32 encoding', es: 'Codificacion x86-32' },
                slug: { en: 'x86-32', es: 'x86-32' },
                draft: true,
            },
            {
                id: 'relocations',
                title: { en: 'Relocations', es: 'Reubicaciones' },
                slug: { en: 'relocations', es: 'reubicaciones' },
                draft: true,
            },
            {
                id: 'targets',
                title: { en: 'Supported targets', es: 'Objetivos soportados' },
                slug: { en: 'targets', es: 'objetivos' },
                draft: true,
            },
        ],
    },
];

/**
 * Construye la ruta canonica de una pagina de la referencia.
 *
 * La ruta canonica lleva siempre el prefijo `/docs/`; el idioma lo anade
 * `urlFor`, igual que en el resto del sitio. Es la unica funcion que sabe
 * componer la ruta, para que la barra lateral, el indice cruzado y la
 * comprobacion del build no puedan discrepar.
 *
 * @param {DocsBook} book Libro al que pertenece.
 * @param {DocsPage} page Pagina.
 * @param {string} lang Idioma.
 * @returns {string} Ruta canonica, con barra final.
 */
export function docsHref(book, page, lang) {
    return `/docs/${book.slug[lang]}/${page.slug[lang]}/`;
}

/**
 * Construye la ruta canonica de la portada de un libro.
 *
 * @param {DocsBook} book Libro.
 * @param {string} lang Idioma.
 * @returns {string} Ruta canonica, con barra final.
 */
export function bookHref(book, lang) {
    return `/docs/${book.slug[lang]}/`;
}

/**
 * Devuelve la lista plana de paginas de la referencia.
 *
 * @returns {Array<{book: DocsBook, page: DocsPage}>}
 */
export function flatPages() {
    const out = [];
    for (const book of DOCS) {
        for (const page of book.pages) out.push({ book, page });
    }
    return out;
}
