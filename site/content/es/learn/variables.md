---
title: "Variables y tipos - Aprende Vesta"
description: "Los tipos primitivos de Vesta, por qué dicen su tamaño, cómo se escriben los literales y qué pasa al convertir entre ellos."
section: "learn"
---

# Variables y tipos

Si vienes de Python, JavaScript o Java, estás acostumbrado a que un número sea
simplemente un número. En Vesta eliges **cuántos bits ocupa**, y esa elección
tiene consecuencias.

<!-- SNIPPET:types -->

```text
i8=100 i32=70000 i64=9000000000
u8=255 u64=18000000000000000000
f32=2.5 f64=3.14159
bool=true char=A string=hola
42 = 42 = 42 = 42 = 42
auto: 0 y 1.5
```

## Por qué el tipo dice su tamaño

`i64` significa *entero con signo de 64 bits*. El número no es decoración: dice
exactamente cuánta memoria ocupa la variable y, por tanto, qué valores caben en
ella.

Eso importa por dos motivos. El primero es la **capacidad**: en un `i8` caben
256 valores distintos y ni uno más, así que si guardas 300 el resultado no será
300. El segundo es el **espacio**: un millón de `i64` ocupa ocho megabytes y un
millón de `i8` ocupa uno. Cuando manejas estructuras grandes, o hablas con
hardware que espera un formato exacto, esa diferencia es la razón de ser del
lenguaje.

Los lenguajes que ocultan el tamaño eligen por ti, normalmente el mayor, y a
cambio te ahorran pensar. Vesta te deja elegir porque a veces la elección es el
problema que estás resolviendo.

## Los tipos primitivos

Enteros con signo:

| Tipo | Bits | Desde | Hasta |
| --- | ---: | ---: | ---: |
| `i8` | 8 | -128 | 127 |
| `i16` | 16 | -32 768 | 32 767 |
| `i32` | 32 | -2 147 483 648 | 2 147 483 647 |
| `i64` | 64 | -9 223 372 036 854 775 808 | 9 223 372 036 854 775 807 |

Enteros sin signo:

| Tipo | Bits | Desde | Hasta |
| --- | ---: | ---: | ---: |
| `u8` | 8 | 0 | 255 |
| `u16` | 16 | 0 | 65 535 |
| `u32` | 32 | 0 | 4 294 967 295 |
| `u64` | 64 | 0 | 18 446 744 073 709 551 615 |

Con signo o sin signo cambia **qué** valores caben, no cuántos. Un `u8` y un `i8`
ocupan un byte y admiten 256 valores distintos cada uno; lo que cambia es dónde
empieza y dónde acaba el rango.

Y el resto:

| Tipo | Bits | Qué es |
| --- | ---: | --- |
| `f32` | 32 | Coma flotante de precisión simple |
| `f64` | 64 | Coma flotante de precisión doble |
| `bool` | 8 | `true` o `false` |
| `char` | 32 | Un punto de código Unicode |
| `string` | - | Texto, gestionado por el runtime |

## Cuatro maneras de escribir el mismo número

```vx
i64 dec = 42;
i64 hex = 0x2A;
i64 bin = 0b101010;
i64 oct = 0o52;
```

Son el mismo valor escrito en base diez, dieciséis, dos y ocho. La base que
elijas depende de lo que estés expresando: una máscara de bits se lee mucho mejor
en binario que en decimal.

## Dejar que el tipo se deduzca

Cuando el valor inicial ya dice de qué tipo se trata, `auto` evita repetirlo:

```vx
auto contador = 0;      // i64
auto ratio = 1.5;       // f64
```

Sirve para variables locales. Es azúcar, no magia: el tipo queda fijado en la
compilación igual que si lo hubieras escrito.

> **Hoy `auto` falla con las cadenas.** `auto s = "hola";` no deduce `string`, y
> al imprimirlo verás un número en lugar del texto. Escribe
> `string s = "hola";` hasta que se corrija.

## `char` es un número

Un `char` guarda un punto de código Unicode, y al interpolarlo verás ese número:

```vx
char letra = 'A';
println("${letra}");         // 65
println("${letra:char}");    // A
```

`${expr:char}` es un **especificador de formato**: dice cómo quieres que se
escriba el valor, no qué valor es. Hay más, como `:hex` para hexadecimal, y
tienen su capítulo en la parte de cadenas.

## Convertir entre tipos

Pasar a un tipo más ancho no pierde nada y no hace falta pedirlo:

```vx
i32 a = 7;
i64 b = a;      // cabe de sobra
```

Al revés sí se pierde información, y aquí conviene ir con cuidado:

```vx
i64 grande = 300;
i8 pequeno = (i8) grande;   // 44
```

300 no cabe en un `i8`, así que se quedan los bits de abajo y el resultado es 44.
El `(i8)` es un **cast**: le dices al compilador que sabes lo que haces.

> **El cast no es obligatorio, y esa es la trampa.** `i8 pequeno = grande;` sin
> cast también compila hoy, y también da 44, sin ningún aviso. Escribe el cast
> siempre que estreches: no cambia el resultado, pero deja constancia de que era
> intencionado.

## Constantes

`const` marca un valor que no se puede reasignar:

```vx
const i64 MAXIMO = 100;
```

Intentar cambiarlo es un error de compilación. Recuerda la limitación del
capítulo anterior: a nivel superior, las constantes de `f32` y `f64` todavía no
resuelven su nombre al usarlas.

## Lo que viene

Ya tienes valores. Lo siguiente es operar con ellos: aritmética, comparaciones,
lógica de bits y las reglas de precedencia.
