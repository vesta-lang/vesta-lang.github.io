---
title: "Anatomía de un programa - Aprende Vesta"
description: "Las piezas de un fichero Vesta: comentarios, constantes, funciones, el punto de entrada y la interpolación de cadenas."
section: "learn"
---

# Anatomía de un programa

Hasta ahora has compilado tres líneas. Este capítulo pone nombre a las piezas que
aparecen en cualquier fichero `.vx`, para que el resto del recorrido no tenga que
pararse a explicarlas.

<!-- SNIPPET:anatomy -->

Ejecutándolo con dos argumentos:

```bash
vesta --vx anatomia.vx -o anatomia
vesta --run anatomia.velb uno dos
```

```text
recorta(60)  = 60
recorta(500) = 100
argumentos recibidos: 2
```

## Comentarios

`//` llega hasta el final de la línea y `/* ... */` abarca lo que encierre,
incluidas varias líneas. Sin sorpresas si vienes de C, C++, Java o Rust.

## Funciones

Una función es un trozo de código con nombre, al que se le pasan valores y que
devuelve un resultado. `recorta` recibe un número y devuelve ese mismo número, o
`MAXIMO` si se pasa.

La forma de declararla es la de C, C++ o Java: **primero el tipo que devuelve,
luego el nombre, y luego los parámetros, cada uno con su tipo delante**.

```text
i64 recorta(i64 x)
 |     |      |
 |     |      +-- recibe un i64, que dentro se llama x
 |     +--------- se llama recorta
 +--------------- devuelve un i64
```

Las variables siguen el mismo orden: `i64 valor = 60;` declara una variable
llamada `valor`, de tipo `i64`, con el valor inicial 60.

`i64` es un número entero de 64 bits con signo. Los tipos numéricos de Vesta
dicen su tamaño en el nombre, y el siguiente capítulo los recorre todos.

## Constantes

`const i64 MAXIMO = 100;` declara un valor que no se puede reasignar; intentarlo
es un error de compilación, no un fallo en ejecución.

Una constante declarada fuera de toda función es visible desde cualquier punto
del fichero.

> **Ojo con las constantes de coma flotante.** Hoy, una `const` de tipo `f32` o
> `f64` declarada a nivel superior compila, pero su nombre no se resuelve al
> usarla. Las de entero, cadena y booleano funcionan, y dentro de una función no
> hay problema. Es una limitación conocida del compilador.

## El punto de entrada

`i32 main()` es donde empieza el programa. Devuelve el código de salida del
proceso: `0` significa que todo fue bien.

Un fichero **sin** `main` sigue siendo válido: no es ejecutable por sí mismo,
pero sí importable como módulo desde otro fichero.

## Argumentos de la línea de órdenes

Aquí hay una trampa que conviene conocer. La firma `main(string[] args)` se
acepta, pero **ese parámetro no se rellena**: indexarlo devuelve cadena vacía.

Los argumentos se leen con dos builtins:

```text
args_count()    cuantos argumentos hay
args_get(i)     el argumento numero i
```

`args_get(0)` es el **primer argumento del usuario**, no el nombre del
ejecutable. Ninguno de los dos compila todavía a binario nativo.

## Interpolación

`"recorta(${valor})"` mete el resultado de una expresión dentro de una cadena.
Entre las llaves vale cualquier expresión, incluida una llamada a una función.

Lo que el compilador pueda resolver por su cuenta desaparece del programa final:
en `recorta(500)`, la llamada se calcula al compilar y el binario lleva
directamente el `100`.

## Lo que falta

`import` para traer módulos y el preprocesador `#define` no aparecen aquí porque
merecen su propio sitio: los módulos llegan en la parte de organizar código.
