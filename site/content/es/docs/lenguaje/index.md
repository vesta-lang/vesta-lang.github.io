---
title: "Referencia del lenguaje - Vesta"
description: "Lo que el lenguaje Vesta garantiza: léxico, tipos, expresiones, sentencias, declaraciones, contratos, comptime y preprocesador."
section: "docs"
---

# Referencia del lenguaje

Lo que el lenguaje garantiza, construcción por construcción. Cada página agrupa
una familia de construcciones y cada entrada tiene su propio enlace, para poder
apuntar a `#match` y no a la página entera.

Aquí no se enseña a programar en Vesta: para eso está [Aprende](/es/learn/).
Aquí se responde qué formas admite una construcción, qué garantiza y en qué
modos de ejecución existe.

<!-- BOOKINDEX -->

## Qué queda fuera

**Cómo lo hace el compilador** no se cuenta aquí. Que una constante se calcule
al compilar en lugar de en ejecución es una decisión del compilador y vive en
[Interioridades](/es/internals/); lo que esta sección afirma es qué valor tiene
esa constante, que es lo que no cambia entre versiones.

**Los tipos de la biblioteca** tampoco. `u256` se usa como un número y se suma
con `+`, pero no es un tipo del compilador: está escrito en Vesta y se importa.
Vive en [Biblioteca estándar](/es/stdlib/). La frontera importa porque es la
tesis del proyecto: mucho de lo que en otros lenguajes trae el compilador, aquí
lo trae la biblioteca.
