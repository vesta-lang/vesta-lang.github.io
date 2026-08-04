---
title: "Hola mundo - Aprende Vesta"
description: "Tu primer programa en Vesta: compilarlo, ejecutarlo y entender cada línea."
section: "learn"
---

# Hola mundo

Antes de nada necesitas el compilador. Si aún no lo tienes, pasa por
[instalar Vesta](/es/download/) y vuelve aquí; son unos minutos.

## El programa

Guarda esto como `hola.vx`:

<!-- SNIPPET:hello -->

## Compilarlo y ejecutarlo

Vesta compila a un bytecode con extensión `.velb`, que ejecuta su máquina
virtual:

```bash
vesta --vx hola.vx -o hola
vesta --run hola.velb
```

Deberías ver:

```text
Hello from Vesta 2!
```

Si en su lugar aparece un error sobre módulos que no se encuentran, el
compilador no está localizando la biblioteca estándar. La causa y la solución
están en [dónde vive la biblioteca estándar](/es/download/).

## Qué dice cada línea

`i32 main()` declara el punto de entrada. El tipo va **delante** del nombre,
como en C o en Java, y devuelve el código de salida del proceso: `0` significa
que todo fue bien.

`println` escribe una línea en la salida estándar. No hace falta importar nada
para usarlo.

Lo interesante está dentro de la cadena. `${1 + 1}` es **interpolación**: lo que
haya entre las llaves se evalúa y su resultado se inserta en el texto. Y como
`1 + 1` es una expresión que el compilador puede resolver por su cuenta, **no
queda ninguna suma en el programa final**: el binario lleva directamente la
cadena `Hello from Vesta 2!`.

Es un ejemplo diminuto de algo que verás por todas partes en Vesta: lo que se
puede saber al compilar, no se paga al ejecutar.

## Y ahora

El programa que acabas de compilar puede ejecutarse de tres maneras distintas
sin que cambies una sola línea. Eso es lo siguiente.
