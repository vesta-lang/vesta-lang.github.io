---
title: "Documentación - Vesta"
description: "Referencia de Vesta: el lenguaje, las herramientas, la máquina virtual y la codificación de instrucciones."
section: "docs"
---

# Documentación

Esto es una referencia. No se lee en orden: se busca en ella.

Si lo que quieres es aprender el lenguaje, el sitio para empezar es
[Aprende](/es/learn/), que sí está pensado para leerse seguido y no da nada por
sabido. Aquí cada página se sostiene sola, entra por el buscador y responde una
pregunta concreta.

> **En construcción.** La estructura y las etiquetas están cerradas; las
> páginas se van escribiendo. Las que aún no existen aparecen en el índice sin
> enlace, para que se vea qué falta en lugar de parecer que no hace falta.

## Los cuatro libros

<!-- BOOKINDEX -->

## Qué se dice aquí y qué no

Documentación, Interioridades y Biblioteca estándar hablan de lo mismo desde
sitios distintos. La frontera no es temática, es **el tipo de afirmación**:

| Sección | Qué afirma | Puede cambiar sin avisar |
| --- | --- | --- |
| **Documentación** | Lo que está garantizado. Es normativo | No |
| [**Interioridades**](/es/internals/) | Cómo se consigue. Es descriptivo | Sí |
| [**Biblioteca estándar**](/es/stdlib/) | Qué hay escrito en Vesta encima de eso | Segun su propia versión |

Un ejemplo de la diferencia: que `match` no tenga caída entre casos es una
garantía del lenguaje y vive aquí. Que el JIT compile una función a partir de
cierto número de invocaciones es una decisión de implementación, puede cambiar
en cualquier versión, y vive en Interioridades.

Por eso el juego de instrucciones de la máquina virtual y el formato de sus
binarios están en esta sección y no en Interioridades: son especificaciones
contra las que alguien podría escribir otra implementación.

## Cómo leer las etiquetas

Cada entrada de la referencia lleva las etiquetas que le apliquen. Están para
responder, antes de leer, si eso te sirve.

<!-- TAGLEGEND -->

Dos detalles que conviene saber:

**Un modo ausente significa que ahí no está.** Una entrada etiquetada `VM`
`JIT` está diciendo que en compilación nativa no existe. No hay etiqueta
negativa, y es deliberado: las ausencias no se olvidan, las etiquetas negativas
sí.

**El color agrupa, pero nunca es lo único que informa.** Cada etiqueta dice lo
que es con su propio texto, y su familia aparece al pasar el puntero por
encima. Sólo el estado va relleno, porque es lo que hay que ver antes de copiar
nada.
