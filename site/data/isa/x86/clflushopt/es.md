---
summary: Flush Cache Line Optimizado
---

## Descripción

Invalida de cada nivel de la jerarquía de caché en el dominio de coherencia de caché la línea de caché que contiene la dirección lineal especificada con el operando de memoria. Si esa línea de caché contiene datos modificados a cualquier nivel de la jerarquía de caché, que los datos se escriben de nuevo a la memoria. El operando de origen es un byte ubicación de memoria.

La disponibilidad de CLFLUSHOPT se indica por la presencia de la bandera CPUID CLFLUSHOPT (CPUID.07H.00H:EBX[23]). El tamaño de línea de caché alineado afectado también se indica por el valor en CPUID.01H:EBX[15:8].

El atributo de memoria de la página que contiene la línea afectada no tiene efecto en el comportamiento de esta instrucción. Cabe señalar que los procesadores son libres de buscar y guardar datos de forma especulativa de las regiones de memoria del sistema asignadas a un tipo de memoria que permite lecturas especulativas (como los tipos de memoria WB, WC y WT). Las instrucciones de PREFETCHh se pueden utilizar para proporcionar al procesador consejos para este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, la instrucción CLFLUSH no se ordena con respecto a las instrucciones PREFETCHh o cualquiera de los mecanismos especulativos de captura (es decir, los datos pueden ser cargados especulativamente en una línea de caché justo antes, durante o después de la ejecución de una instrucción CLFLUSH que hace referencia a la línea de caché).

Las ejecuciones de la instrucción CLFLUSHOPT se ordenan con respecto a las instrucciones de cerca y a las instrucciones de escritura de readmodificación bloqueadas; también se ordenan con respecto a los escritos antiguos a la línea de caché que se invalida. No se les ordena con respecto a otras ejecuciones de CLFLUSHOPT, a las ejecuciones de CLFLUSH y CLWB, o a los menores escribe a la línea de caché siendo invalidado. El software puede utilizar la instrucción SFENCE para ordenar una ejecución de CLFLUSHOPT relativa a una de esas operaciones.

La instrucción CLFLUSHOPT se puede utilizar en todos los niveles de privilegios y está sujeta a todas las comprobaciones de permisos y fallas asociadas con una carga de byte (y además, se permite una instrucción CLFLUSHOPT para cambiar una dirección lineal en un segmento de ejecución solamente). Como una carga, la instrucción CLFLUSHOPT establece el bit A pero no el bit D en las tablas de página.

En algunas implementaciones, la instrucción CLFLUSHOPT siempre puede causar un aborto transaccional con extensiones de sincronización transaccional (TSX). No se espera que la instrucción CLFLUSHOPT sea utilizada comúnmente en las regiones transaccionales típicas. Sin embargo, los programadores no deben confiar en la instrucción CLFLUSHOPT para forzar un aborto transaccional, ya que si causan un aborto transaccional depende de la aplicación.

La operación CLFLUSHOPT es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
Flush_Cache_Line_Optimized(SRC);
```

## Intel C/C++ compilador intrínseco

```c
CLFLUSHOPT void _mm_clflushopt(void const *p);
```
