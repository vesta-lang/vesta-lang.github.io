---
title: "Control de flujo - Aprende Vesta"
description: "Condicionales y bucles en Vesta: if, while, do-while, for, foreach sobre arrays, break y continue."
section: "learn"
---

# Control de flujo

Decidir y repetir. Si vienes de C, C++, Java o C#, todo esto te va a resultar
familiar hasta el detalle de la sintaxis.

<!-- SNIPPET:control -->

```text
aprobado
while 0
while 1
while 2
intentos = 5
for 0
for 1
for 2
suma = 100
impar 1
impar 3
impar 5
mayor = 9
desconocido:
  codigo = 3
```

## Condicionales

`if`, `else if` y `else`, con la condición entre paréntesis.

Las llaves son opcionales cuando el cuerpo es una sola sentencia, igual que en C:

```vx
if (n > 0) println("positivo");
```

Aun así conviene ponerlas siempre. Es la costumbre que evita la familia de
errores que aparece cuando alguien añade una segunda línea a un `if` sin llaves y
esa línea acaba ejecutándose pase lo que pase.

Un número también sirve como condición: cero es falso y cualquier otro valor es
verdadero. `if (n)` compila y hace lo que esperas. Escribir `if (n != 0)` dice lo
mismo de forma más explícita, y es lo que se usa en este recorrido.

## `while` y `do-while`

`while` comprueba la condición **antes** de entrar, así que puede no ejecutarse
ninguna vez.

`do { ... } while (cond);` ejecuta el cuerpo y comprueba **después**, así que
corre al menos una vez. Es lo que quieres cuando el propio cuerpo produce el
valor que vas a comprobar: leer una entrada, intentar una conexión, procesar un
bloque.

Fíjate en el punto y coma final del `do-while`: es parte de la sintaxis.

## `for`

El `for` clásico, con las tres partes separadas por punto y coma:

```vx
for (i64 k = 0; k < 3; k++) { ... }
```

Inicialización, condición y paso. La variable declarada ahí solo existe dentro
del bucle.

## Recorrer un array

Cuando lo único que quieres es pasar por todos los elementos, el índice sobra:

```vx
i64[4] datos = {10, 20, 30, 40};
for (i64 v : datos) {
    total = total + v;
}
```

Se lee *"para cada `v` de tipo `i64` en `datos`"*. `v` es una copia del elemento,
no el elemento, así que modificarla no cambia el array.

Los arrays tienen su propio capítulo más adelante; aquí basta con saber
recorrerlos.

## `break` y `continue`

`break` sale del bucle. `continue` abandona la vuelta actual y salta a la
siguiente. Ambos afectan al bucle más interno que los contenga.

```vx
for (i64 m = 0; m < 10; m++) {
    if (m % 2 == 0) { continue; }   // los pares no interesan
    if (m > 6) { break; }           // a partir de 7, terminamos
    println("impar ${m}");
}
```

## `goto`

El lenguaje tiene `goto` y etiquetas, para lo mismo que en C: salir de varios
bucles anidados de golpe, o saltar a un bloque común de limpieza.

> **Hoy no funciona para saltar hacia atrás.** Un salto a una etiqueta anterior
> pierde lo que se hubiera escrito en las variables desde esa etiqueta, así que
> el bucle nunca avanza y el programa se queda dando vueltas. Usa `while` o
> `for` hasta que se corrija.

## El ternario

Cuando lo único que quieres es elegir entre dos valores, `if` es demasiado:

```vx
i64 mayor = a > b ? a : b;
```

Se lee *"si `a > b`, entonces `a`, si no `b`"*.

> **No lo metas dentro de una cadena.** `"${a > b ? a : b}"` no compila: los dos
> puntos del ternario se confunden con el separador del especificador de formato
> de `${expr:fmt}`. Calcula el valor fuera y luego interpólalo.

## `match`

`match` compara un valor contra varias formas posibles. Si vienes de C o de
Java, ocupa el sitio del `switch`, que en Vesta **no existe**.

```vx
match codigo {
    case 1 => println("aceptado");
    case 2 => println("pendiente");
    case _ => {
        println("desconocido:");
        println("  codigo = ${codigo}");
    }
}
```

Cada caso lleva `=>` seguido de una sentencia o de un bloque entre llaves. El
guion bajo `_` recoge todo lo que no haya casado antes, y hace de `default`.

Dos diferencias con el `switch` de C que agradecerás: **no hay caída entre
casos**, así que no hace falta escribir `break` al final de cada uno, y por tanto
no existe el error de olvidarlo.

Aquí `match` está comparando números, pero para eso no haría falta una
construcción propia. Su verdadero uso llega con los `enum`, donde además de
comparar la forma **extrae los datos que lleva dentro**. Eso es un par de
capítulos más adelante.

## Lo que viene

Ya sabes calcular, decidir y repetir. Lo siguiente es agrupar todo eso con un
nombre: funciones.
