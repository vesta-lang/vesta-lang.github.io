# isadoc: formato de documentacion de instrucciones

Describe **una instruccion** de un juego de instrucciones, en uno o varios
idiomas, de forma independiente de la fuente que la documento y del sitio que
la publica.

Es multi-ISA por construccion: nada del formato asume x86. Los modos de
operacion, los nombres de bandera y los vectores de excepcion son datos, no
campos fijos, de modo que un importador de ARM o de RISC-V produce lo mismo sin
cambiar el formato ni el resto de la cadena.

## Un directorio por instruccion

```text
site/data/isa/x86/adc/
    data.json     datos consultables. Lo genera el importador
    en.md         documento en el idioma de la fuente
    es.md         traduccion, cuando exista
```

El reparto no es de comodidad: separa **dos naturalezas distintas**.

| | Datos (`data.json`) | Documento (`<idioma>.md`) |
| --- | --- | --- |
| Contiene | opcodes, vectores de excepcion, banderas nombradas, enlaces | resumen, descripcion, pseudocodigo, notas |
| Quien lo escribe | el importador | personas, en cada idioma |
| Para que sirve | consultar: *que instrucciones lanzan `#GP(0)`* | leer |
| Al reimportar | se regenera entero | solo el idioma de la fuente |

Que la traduccion viva en su propio fichero es lo que hace **imposible** que
una reimportacion la pise. No hay convencion que recordar ni fusion que pueda
salir mal: el importador escribe `data.json` y `en.md`, y no toca nada mas.

## Por que Markdown para el documento

Porque es lo que hay que escribir a mano. Una traduccion, una nota del
proyecto, un diagrama o un fragmento de codigo se escriben en Markdown sin
pelearse con escapes, y el diff de una correccion es la linea que cambio.

Admite ademas todo lo que la cadena del sitio ya sabe hacer: HTML en linea,
bloques de codigo con resaltado, y los marcadores de diagrama y de fragmento.

```text
---
summary: Add With Carry
---

## Description

Suma `SRC` y el acarreo a `DEST`.

<!-- DIAGRAM:adc-carry -->

## Notas de Vesta

El lifter de `asm { }` la reconoce y deduce sus clobbers.
```

El cuerpo empieza en `##`: el `h1` lo pone la pagina con el mnemonico, y dos
titulos de primer nivel es justo lo que el linter rechaza.

## data.json

```json
{
  "format": "isadoc",
  "version": 1,
  "isa": "x86",
  "id": "adc",
  "mnemonics": ["ADC"],
  "links": { "arch_data": ["ADC"] },
  "sources": [{ "id": "intel-sdm", "url": "https://www.felixcloutier.com/x86/adc" }],
  "flags": ["OF", "SF", "ZF", "AF", "CF", "PF"],
  "exceptions": [
    { "mode": "protected", "vector": "#GP(0)", "when": "..." }
  ],
  "encodings": [
    { "opcode": "14 ib", "syntax": "ADC AL, imm8", "operands": "I",
      "modes": { "long": "valid", "legacy": "valid" },
      "note": "Add with carry imm8 to AL." }
  ],
  "operand_encodings": [
    { "id": "RM", "operands": ["ModRM:reg (r, w)", "ModRM:r/m (r)"] }
  ]
}
```

| Campo | Que es |
| --- | --- |
| `format`, `version` | Un lector puede rechazar lo que no entiende en vez de interpretarlo mal |
| `isa`, `id` | Juego de instrucciones e identificador estable dentro de el. El `id` forma la URL |
| `links.arch_data` | Mnemonicos con que `arch-data` guarda esta instruccion. El navegador filtra por esta lista |
| `flags` | Banderas que el texto NOMBRA, no lo que les pasa |
| `exceptions` | Una por vector y modo, con la condicion |
| `encodings` | Solo cuando `arch-data` no cubre la instruccion |

`mode` usa nombres neutros -- `real`, `protected`, `virtual8086`, `compat`,
`long` -- en lugar de los titulos del manual: son los que un lector de otro
juego de instrucciones puede mapear a los suyos.

`flags` se llama asi por precision. Prometer "modificada" o "indefinida"
exigiria analizar la frase, y una promesa de ese tipo mal extraida es peor que
no darla.

## Por que las excepciones no van en el documento

Son cinco listas por instruccion y juntas ocupan mas que todo lo demas. Se
consultan mas que se leen, y en `data.json` se pueden cruzar: *que
instrucciones lanzan `#GP(0)` en modo largo* es una pregunta que un fichero de
prosa no responde.

## Procedencia

`sources` dice de donde salio la entrada. Sin eso, una entrada compuesta a
partir de dos fuentes no se puede auditar ni corregir en el sitio correcto.
