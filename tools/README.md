# Herramientas

Los datos que publica el sitio no se escriben a mano: se importan, se verifican
y se commitean como ficheros. El build de GitHub Actions no tiene ni el
compilador de Vesta ni acceso al manual de Intel, asi que **todo lo que hace
falta ya tiene que estar en el repositorio** cuando arranca.

Estas son las herramientas que producen esos ficheros, en el orden en que se
usan.

---

## Referencia de instrucciones x86

Convierte el manual del desarrollador de Intel en un directorio por
instruccion, en el formato [`isadoc`](../site/data/isa/FORMAT.md).

### 1. Volcar el PDF a texto, una vez

El manual es un PDF de 26 MB que no viaja en el repositorio. Se descarga de
Intel, se deja donde se quiera, y de el se sacan **dos volcados**, que no son
redundantes:

```bash
mkdir -p manual
pdftotext -layout <manual.pdf> manual/sdm.txt
pdftotext -table  <manual.pdf> manual/sdm.table.txt
```

| Volcado | Para que sirve | Que estropea |
| --- | --- | --- |
| `-layout` | La prosa: respeta parrafos y encabezados | Desincroniza las tablas: la descripcion se desplaza una fila y `r/m8` sale como `r/m81` |
| `-table` | Las tablas: alinea las columnas | Destroza la prosa y pega los encabezados de seccion a la primera fila |

De ahi la regla de todo el importador: **la prosa sale del volcado normal y las
tablas del de modo tabla**. Mezclarlo al reves publica datos falsos que no
parecen falsos.

`pdftotext` viene con Xpdf o con Poppler. El modo `-table` es de Xpdf 4.

Los volcados se buscan en `manual/`, que esta en las exclusiones locales. Con
`VESTA_SDM_DIR` se pueden tener fuera del arbol del proyecto, que es lo
razonable cuando se comparten entre repositorios.

### 2. Importar

```bash
python tools/import_sdm.py              # las 798 instrucciones
python tools/import_sdm.py --limit 20   # solo las primeras, para probar
python tools/import_sdm.py --dry-run    # cuenta sin escribir nada
```

Produce, por instruccion:

```text
site/data/isa/x86/adc/
    data.json     opcodes, excepciones, banderas y enlaces. Se REGENERA entero
    en.md         el documento. Una reimportacion lo REESCRIBE
    es.md         traduccion. El importador NO la toca
```

Al terminar informa de lo que no entendio. Un parser sobre una fuente que no
controlamos falla en silencio si no se le pide cuentas, asi que el recuento no
es decorativo: si sube, algo cambio en el manual.

```text
referencia: paginas 686 a 2982, 798 instrucciones
instrucciones: 798
formas de codificacion: 3968
notacion sin reconocer: 2 (0.05%)
```

El importador consulta ademas `arch-data` para emparejar cada instruccion con
los mnemonicos con que aquella base la guarda. Si no hay red, avisa y sigue: la
importacion del manual no depende de eso.

### 3. Verificar

```bash
python tools/verify_encoding.py    # tablas de direccionamiento vs ensamblador
```

Las formas de direccionamiento de ModR/M y SIB **se generan** desde las reglas
del manual en lugar de copiarse ([`x86-encoding.mjs`](x86-encoding.mjs)): la
tabla del PDF sale corrompida y transcribirla son cientos de celdas donde una
errata pasa inadvertida.

Una tabla generada es coherente por construccion, pero eso no la hace correcta:
si las reglas se entendieron mal, es coherentemente falsa. Este script cierra
la comprobacion ensamblando cada forma con la cadena del proyecto y comparando
los bytes.

### El paquete por dentro

`tools/sdm/` esta partido por responsabilidad, y cada modulo se puede probar
solo:

| Modulo | De que se ocupa |
| --- | --- |
| `pages.py` | Cargar los volcados y localizar el rango de la referencia |
| `titles.py` | Encontrar cada instruccion y expandir sus mnemonicos |
| `sections.py` | Quitar cabeceras y pies de pagina, trocear por secciones |
| `tables.py` | Leer tablas alineadas por columnas |
| `embedded.py` | Recuperar del otro volcado las tablas incrustadas en la prosa |
| `opcode.py` | Analizar la notacion `REX.W + 81 /2 id` |
| `encodings.py` | Leer la tabla de codificaciones de cada instruccion |
| `operands.py` | Leer la tabla que dice en que campo va cada operando |
| `isadoc.py` | Componer los dos ficheros de salida |
| `translate.py` | Memoria de traduccion y paquetes de idioma |

`titles.py` expone `suspicious()`, que lista los mnemonicos que no parecen
validos. Existe porque la expansion de familias puede producir fragmentos sin
que nada reviente, y sacarlos a la luz es la unica forma de no publicarlos.

Las dos tablas de una instruccion se leen por separado y se comprueban juntas:
`operands.reconcile()` repara una clave de `Op/En` que la columna corto, pero
**solo si la tabla de modos reconoce la version reparada**. Asi la reparacion
no puede inventar: en el peor caso no hace nada y el verificador sigue
senalando el hueco.

---

### 4. Traducir

La traduccion no se escribe sobre el Markdown. Se guarda en una memoria de
frases y cada `<idioma>.md` se **genera** aplicandola sobre `en.md`, de modo
que reimportar el manual no destruye nada.

```bash
python tools/translate.py --lang es extract     # que falta, de lo mas repetido
python tools/translate.py --lang es translate   # traducir con el motor
python tools/translate.py --lang es apply       # generar los <idioma>.md
python tools/translate.py --lang es coverage    # cuanto esta cubierto
```

`translate` acepta ademas `--device cuda|cpu` para forzar el dispositivo y
`--refresh` para vaciar la memoria y rehacerla, que es lo que hay que hacer
despues de ampliar el glosario: la memoria guarda el resultado, no la receta,
asi que un termino nuevo no cambia por si solo lo ya traducido.

Hoy hay dos idiomas, `es` y `zh`. Anadir uno es escribir su
`glossary.<idioma>.json` y ejecutar los cuatro pasos con `--lang`.

#### Maquina y mano, en ficheros distintos

| Fichero | Que es | Quien lo escribe |
| --- | --- | --- |
| `x86.tm.<idioma>.json` | memoria | el motor; `--refresh` la vacia entera |
| `x86.fix.<idioma>.json` | correcciones | una persona; no la toca nada |

Las correcciones mandan sobre la memoria. La separacion no es organizativa: sin
ella no se puede corregir a mano, porque el primer `--refresh` que hiciera falta
para el glosario se llevaria el trabajo por delante. Ademas hace visible lo
revisado -- se lee de un vistazo y se compara en un diff -- en lugar de dejarlo
disuelto entre once mil frases de maquina.

La regla para elegir entre las dos es la frecuencia. Una expresion que se
repite va al glosario, donde una linea arregla todas sus apariciones; una que
sale una vez va a las correcciones, porque una regex aplicada a todo el corpus
para arreglar una frase no compensa.

#### Buscar lo que no se tradujo, con una sonda

```bash
python tools/translate.py --lang es residue --via zh
```

Medir lo que falta comparando con el ingles solo encuentra lo que vuelve
**identico**. Una unidad traducida a medias -- `el Native Model ID Enumeration
Leaf` -- no lo es, asi que la metrica la da por buena y en la pagina se lee
media frase en cada idioma.

La sonda usa un idioma de **otro alfabeto**: ahi lo que el motor no tradujo se
ve por la escritura, no por comparacion. Cualquier tramo en letras latinas
dentro de una frase china es texto intacto. Si ese idioma ya esta traducido, la
sonda no cuesta nada: lee su memoria.

Lo que encuentra es un candidato, no un veredicto. Se descarta lo que se aparto
a proposito -- `XMM` y `VEX` son latinos y deben seguir siendolo -- y se
confirma contra la traduccion real, de modo que lo que queda es texto ingles
que hoy esta en la pagina. Aun asi lista nombres propios (`Intel`, `NaN`) que
estan bien: es una lista ordenada por peso para mirarla, no una lista de
errores.

Encontro dos cosas que ninguna otra medida veia: la seccion de intrinsics se
publicaba como prosa y se enviaba al traductor, siendo declaraciones de C -- se
emite como bloque `c`, y el corpus bajo de 24284 unidades a 22630 -- y la
familia de `... exception`, que el motor traducia de cualquier manera.

Compensa porque el corpus se repite: 24284 apariciones de 12237 unidades
distintas. `#UD If the LOCK prefix is used.` se traduce una vez y cubre todas
sus apariciones, y una correccion a mano vale para todas ellas.

#### Que cuenta como unidad

Lo decide `units()`, y es la **unica** descripcion de que se traduce y que no:
`extract` y `apply` salen las dos de ahi, asi que no pueden discrepar. Un
invariante lo respalda -- descomponer un documento y volver a concatenarlo
devuelve el original byte a byte -- y se comprueba sobre los 798.

| En el documento | Que se traduce |
| --- | --- |
| Prosa | cada frase, cortando tambien por vineta |
| `#### 21.1.4 CPUID Domains` | el titulo; la numeracion no, es la misma en todo idioma |
| Fila de tabla | las celdas que son texto; `01H`, `ECX[27]` y `OSXSAVE` no |
| Valla de codigo | nada |
| `summary:` del front matter | su valor, conservando la etiqueta |

Las dos filas del medio no estaban al principio y se notaba justo donde mas
tablas hay: `CPUID` publicaba novecientas lineas en ingles con la prosa de
alrededor ya traducida. Una celda se acepta con **una** palabra normal, no con
dos como una linea suelta, porque si no los encabezados de columna (`Leaf`,
`Register`) se quedaban fuera.

El motor por omision es Argos Translate (`pip install argostranslate`), que
funciona sin conexion, sin clave y sin limite. No es obligatorio: `extract`,
`apply` y `coverage` no lo necesitan.

#### Lote y GPU

No se llama a la funcion `translate()` de Argos: traduce de una en una y
decide por su cuenta que no hay GPU. `sdm/engine.py` usa el mismo modelo con
un `Translator` de CTranslate2 propio, en lotes. Medido sobre este corpus en
una RTX 4060:

| | s/frase | corpus entero |
| --- | --- | --- |
| Argos, una a una, CPU | 0,044 | 7,3 min |
| CTranslate2, en lote, GPU | 0,0011 | 0,2 min |

La GPU necesita el runtime de CUDA, que CTranslate2 no trae:

```bash
pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
```

Los deja dentro de `site-packages`, donde la busqueda de DLL no mira, asi que
el motor registra esos directorios antes de cargarse. Sin ellos sigue por CPU
y lo dice; la GPU acelera, no es un requisito.

#### Que se traduce entero y no a medias

Una frase en ingles en mitad de un parrafo traducido se lee como un error, no
como una traduccion parcial. Por eso una frase solo se guarda si vuelve
**completa**: si el motor se comio un marcador o se desvio del texto, se
descarta y se reintenta de otra manera.

| Peldano | Que cambia | Recupero |
| --- | --- | --- |
| Primera pasada | todo apartado | 12087 |
| Sin glosario | menos marcadores que perder | 30 |
| Hipotesis alternativas | la 2a hipotesis puede no comerse el marcador | 14 |
| Por tramos | solo la prosa de entre marcadores | 106 |

El ultimo no puede fallar por esta causa: al motor no se le ensenan los
marcadores, se intercalan despues. Pierde el contexto de la frase y se nota,
y por eso es el ultimo. El resultado es 24284 de 24284.

Se descarta ademas lo que vuelve **desviado del texto**, no solo lo que vuelve
incompleto: el motor emite de su cosecha el simbolo de menor o igual donde el
original pone `<=`, y ante un `<>` llego a escribir una palabra en cirilico.
Lo primero se convierte con la misma tabla que usa el importador; lo segundo
significa que la traduccion se fue por su cuenta, y entonces vuelve a la
escalera.

#### El paquete de idioma

Medido con Argos sobre las cuarenta frases mas frecuentes: el motor acierta la
prosa y falla el vocabulario, que es justo lo que se repite. `operand` salia
como "el operado", "opera" y "los operadores". Y lo peor no era el error, sino
que tres frases inglesas casi iguales salieran con tres redacciones distintas.

Eso se corrige con terminologia fijada, y la terminologia **es del idioma, no
del programa**: vive en `site/data/isa/glossary.<idioma>.json` y el codigo
solo sabe aplicarla.

```json
{
 "articles": {"la": ["la", "una"]},
 "definite": ["el", "la", "los", "las"],
 "glossary": [
  {"en": "memory location", "term": "ubicacion de memoria", "article": "la"},
  {"en": "are zeroed", "term": "se ponen a cero"}
 ]
}
```

- Las entradas se aplican **en el orden del fichero**: de la expresion mas
  larga a la mas corta, o `operand` dejaria `destination operand` a medias.
- `article` existe porque el termino se sustituye **despues** de traducir: el
  motor deja delante el articulo que le pedia el ingles y salia "el tabla
  resumen". El genero solo se sabe aqui.
- Un idioma sin genero que concordar deja `articles` vacio y lo demas funciona
  igual. Un idioma sin paquete tambien se traduce, solo que sin terminologia
  fijada, y la herramienta lo avisa.

Anadir un idioma es, por tanto, escribir su `glossary.<idioma>.json` y
ejecutar los cuatro pasos de arriba con `--lang`.

---

## Fragmentos de codigo Vesta

```bash
python tools/gen_snippets.py            # todos
python tools/gen_snippets.py <nombre>   # solo uno
python tools/gen_snippets.py --check    # comprobar que estan al dia
```

Toma cada `site/snippets/*.vx`, lo compila con `vesta.exe` para comprobar que
es codigo real, y le pide al servidor LSP la clasificacion de cada token. El
resultado se guarda al lado como `.tokens.json` **con el hash SHA-256 del
fuente**: si alguien edita el fragmento y olvida regenerar, el build falla.

Es preferible romper la publicacion a servir un fragmento cuyo resaltado no
corresponde a su codigo.

El paso `--check` forma parte del build, asi que no depende de que nadie se
acuerde de ejecutarlo.

---

## Comprobaciones del repositorio

```bash
node tools/lint.mjs           # reglas del proyecto
node tools/lint.mjs --quiet   # solo el resumen
node build.mjs                # construir en dist/
node build.mjs --serve        # construir y servir en localhost:8080
```

El linter comprueba lo que este proyecto se ha impuesto y ninguna herramienta
generica sabe mirar: ASCII sin la tabla de caracteres prohibidos, cabecera de
documentacion por modulo, funcion exportada sin documentar, lenguaje de valla
desconocido, una anotacion por linea. Corre en el workflow **antes** del build,
porque comprueba el fuente y no el resultado.

---

## Que se commitea y que no

| | Se commitea | Por que |
| --- | --- | --- |
| `site/data/isa/**` | Si | El build no puede leer un PDF ni salir a la red |
| `site/snippets/*.tokens.json` | Si | Actions no tiene el compilador de Vesta |
| `manual/` | No | 35 MB de volcados derivados de un PDF ajeno |
| `dist/` | No | Es salida del build |

La regla es la misma en los tres casos: **lo que el build necesita, viaja en el
repositorio; lo que produce, no.**
