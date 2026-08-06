---
title: "Referencia de codificación - Vesta"
description: "Cómo se codifican las instrucciones: el bytecode de VestaVM y cada objetivo nativo que la cadena de herramientas genera."
section: "docs"
---

# Referencia de codificación

Cómo se convierte una instrucción en bytes. Es lo que hace falta para escribir
un desensamblador, para leer un volcado o para entender qué ha emitido el
compilador.

<!-- BOOKINDEX -->

## Dos listas que conviene no confundir

La cadena de herramientas hace dos cosas distintas con las arquitecturas, y la
línea de órdenes las presenta como si fueran una sola:

| Qué hace | Cuántas arquitecturas |
| --- | --- |
| **Ensamblar y desensamblar** un fichero suelto | Varias |
| **Generar código** desde un programa Vesta | Menos |

`--list-arch` imprime la primera lista, que sale de las bibliotecas de
ensamblado y desensamblado. Un lector que la tome por la segunda concluirá que
puede compilar a una arquitectura para la que no hay generador, y el error sólo
aparecerá al intentarlo.

De ahí que esta sección dedique una página a separarlas, con la comprobación
hecha ejecutando el compilador y no leyendo su ayuda.
