---
title: "Los tres modos - Aprende Vesta"
description: "El mismo fuente Vesta se ejecuta en la máquina virtual, se compila en caliente con el JIT o se convierte en un binario nativo."
section: "learn"
---

# Los tres modos

Un fuente `.vx` no se ata a una forma de ejecutarse. El mismo fichero, sin
cambiar una línea, puede correr en una máquina virtual, compilarse mientras se
ejecuta, o convertirse en un ejecutable nativo que no necesita nada instalado.

Este es el programa que vamos a usar:

<!-- SNIPPET:modes -->

## En la máquina virtual

El compilador produce bytecode y la máquina virtual lo ejecuta:

```bash
vesta --vx modes.vx -o modes
vesta --run modes.velb
```

Arranca al instante y el `.velb` es portable: el mismo fichero corre en Windows
y en Linux sin recompilar.

## Con el JIT

Aquí viene lo primero que sorprende: **el JIT ya estaba funcionando**. La orden
de arriba no ejecuta un intérprete puro. Por defecto, la máquina virtual compila
a código máquina cualquier función que se invoque más de 1500 veces, y sigue
interpretando el resto.

Para verlo:

```bash
vesta --run modes.velb --jit-stats
```

Si quieres que compile en cuanto una función se llama por primera vez, en lugar
de esperar a que se caliente:

```bash
vesta --run modes.velb -m jit
```

Eso baja el umbral a 1. Es útil para comprobar que algo se compila; en un
programa real no interesa, porque se gasta tiempo compilando código que apenas
se ejecuta. El umbral también se fija a mano con `--jit-threshold N`.

Y al revés, para ejecutar **sin JIT**, con el intérprete a secas:

```bash
vesta --run modes.velb -m vm
```

La diferencia se nota. Un `fib(27)` recursivo, en el equipo donde se escribió
esta página, tarda unos 100 ms con `-m vm` y unos 66 ms por defecto.

No hay dos semánticas distintas: el JIT y el intérprete producen el mismo
resultado, y si el JIT se encuentra una operación que aún no sabe compilar, esa
parte vuelve al intérprete sin que el programa lo note.

## Compilado a nativo

El tercer modo no usa la máquina virtual en absoluto:

```bash
vesta --vx modes.vx -m aot -o modes
./modes
```

Eso produce un ejecutable del sistema (PE en Windows, ELF en Linux) que **no
necesita Vesta instalado**. Puedes copiarlo a otra máquina y funciona.

Y no lleva runtime dentro salvo que lo pidas: la memoria se libera de forma
determinista al salir de ámbito, sin recolector. Solo aparece uno si usas
`gc<T>`, y entonces se enlaza dentro del propio binario.

## Cuál usar

| Modo | Orden | Cuándo |
| --- | --- | --- |
| Intérprete puro | `-m vm` | Diagnóstico, o comparar contra el JIT |
| Intérprete y JIT | *(por defecto)* | Desarrollo y uso normal |
| JIT agresivo | `-m jit` | Comprobar que algo se compila |
| Nativo | `-m aot` | Distribuir, arrancar rápido, sistemas sin runtime |

Lo importante no es la tabla, sino que la elección **no condiciona cómo
escribes**. En la mayoría de lenguajes, decidir entre una máquina virtual y un
binario nativo es decidir el lenguaje. Aquí es una opción de la línea de
órdenes.

## Por qué comparten resultado

Los tres caminos salen del mismo IR. El JIT y el compilador nativo usan además
el mismo optimizador y el mismo asignador de registros, así que no hay dos
implementaciones que puedan divergir con el tiempo.

En [Arquitectura](/es/internals/) está el detalle de ese recorrido.
