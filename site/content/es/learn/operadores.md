---
title: "Operadores y casts - Aprende Vesta"
description: "Aritmética, comparaciones, lógica, operaciones de bits, asignación compuesta y conversión explícita en Vesta."
section: "learn"
---

# Operadores y casts

Los operadores de Vesta son los que esperas si has programado en cualquier
lenguaje de la familia de C. Este capítulo los recorre y se detiene en los tres
sitios donde el comportamiento sorprende: la división entera, el desbordamiento y
la conversión entre tipos.

<!-- SNIPPET:operators -->

```text
17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3      (division entera)
17 % 5 = 2      (resto)
17.0 / 5.0 = 3.4
a == b -> false
a >= b -> true
si && no -> false
si || no -> true
!si      -> false
x & y  = 8
x | y  = 14
x ^ y  = 6
x << 2 = 48
x >> 2 = 3
c tras += 5, *= 2 y %= 7 -> 2
(i64) 3.9 = 3
```

## Aritmética

`+`, `-`, `*`, `/` y `%`, con la precedencia habitual: primero multiplicar y
dividir, después sumar y restar, y los paréntesis por encima de todo.

**La división entre enteros es entera.** `17 / 5` da `3`, no `3.4`. No se
redondea: se descarta la parte decimal. Si quieres el resultado con decimales,
alguno de los dos operandos tiene que ser de coma flotante:

```text
17 / 5       -> 3
17.0 / 5.0   -> 3.4
```

`%` da el resto de esa división entera: `17 % 5` es `2`.

## Comparaciones

`==`, `!=`, `<`, `<=`, `>` y `>=` devuelven un `bool`. Nada llamativo.

## Lógica

`&&`, `||` y `!` trabajan sobre `bool`.

Los dos primeros **cortocircuitan**: si el lado izquierdo ya determina el
resultado, el derecho no llega a evaluarse.

```vx
false && loQueSea()    // loQueSea() no se ejecuta
true  || loQueSea()    // tampoco
```

Eso no es un detalle de rendimiento, es una herramienta: permite escribir
`if (hayDatos() && primerDato() > 0)` sabiendo que la segunda llamada solo ocurre
cuando la primera dio verdadero.

## Operaciones de bits

Aquí es donde un lenguaje de sistemas se separa de uno de aplicación. Estos
operadores no miran el número, miran **sus bits**.

| Operador | Qué hace | Ejemplo con `12` y `10` |
| --- | --- | --- |
| `&` | Bit a 1 solo si lo está en ambos | `1100 & 1010 = 1000` = 8 |
| `\|` | Bit a 1 si lo está en alguno | `1100 \| 1010 = 1110` = 14 |
| `^` | Bit a 1 si lo está en uno y no en el otro | `1100 ^ 1010 = 0110` = 6 |
| `~` | Invierte todos los bits | |
| `<<` | Desplaza a la izquierda | `1100 << 2 = 110000` = 48 |
| `>>` | Desplaza a la derecha | `1100 >> 2 = 11` = 3 |

Desplazar a la izquierda una posición equivale a multiplicar por dos, y a la
derecha, a dividir por dos. Se usan para empaquetar varios valores pequeños en un
mismo entero, para leer campos de un registro de hardware o para trabajar con
banderas.

Escribir los literales en binario, como `0b1100`, hace estas operaciones mucho
más legibles que en decimal.

## Asignación compuesta

`c += 5` es `c = c + 5`. Existen para todos los operadores aritméticos y de bits:
`-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=` y `>>=`.

## Conversión explícita

`(i64) 3.9` convierte a entero, y **trunca hacia cero**: da `3`, no `4`.

El cast también es lo que se usa para pasar a un tipo más estrecho, como viste en
el capítulo anterior. Recuerda que hoy el compilador acepta el estrechamiento sin
cast, así que escribirlo es lo que deja constancia de que era intencionado.

## El ternario

`condicion ? siVerdad : siFalso` elige entre dos valores sin escribir un `if`:

```vx
i64 mayor = a > b ? a : b;
```

## Dos operadores que aún no puedes usar

Verás dos operadores más en código Vesta, y los dos van **detrás** del valor:

| Operador | Para qué sirve |
| --- | --- |
| `!!` | Saca el valor de algo que podría no tenerlo, y falla si no lo tiene |
| `?` | Si hay error, sale de la función devolviéndolo; si no, sigue |

No se explican aquí porque solo tienen sentido acompañados de `Optional` y
`Result`, los tipos que representan *"puede que no haya valor"* y *"esto salió
bien o salió mal"*. Tienen su propio capítulo, en la parte de ausencia y error.

Se mencionan ahora para que, si te los encuentras antes, sepas que no te has
saltado nada.

## Dos cosas que fallan en silencio

**El desbordamiento da la vuelta.** Un `i8` llega a 127 y el siguiente valor es
-128:

```vx
i8 max = 127;
max = max + 1;    // -128
```

No hay aviso ni al compilar ni al ejecutar. Es el comportamiento normal en un
lenguaje de sistemas, y a veces es justo lo que quieres, pero conviene tenerlo
presente: si un contador puede crecer más de lo que cabe en su tipo, el tipo está
mal elegido.

**Dividir por cero detiene el programa sin decir nada.** Hoy no hay mensaje ni
código de error: el proceso simplemente se para donde estaba y devuelve 0, como
si hubiera terminado bien. Comprueba el divisor antes de usarlo.

## Lo que viene

Con valores y operadores ya puedes calcular. Lo siguiente es decidir y repetir:
condicionales, bucles y `match`.
