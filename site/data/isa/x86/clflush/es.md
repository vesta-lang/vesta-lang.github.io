---
summary: Flush Cache Line
---

## Descripción

Invalida de cada nivel de la jerarquía de caché en el dominio de coherencia de caché la línea de caché que contiene la dirección lineal especificada con el operando de memoria. Si esa línea de caché contiene datos modificados a cualquier nivel de la jerarquía de caché, que los datos se escriben de nuevo a la memoria. El operando de origen es un byte ubicación de memoria.

La disponibilidad de CLFLUSH se indica por la presencia de la bandera CPUID CLFLUSH (CPUID.01H:EDX[19]). El tamaño de línea de caché alineado afectado también se indica por el valor en CPUID.01H:EBX[15:8].

El atributo de memoria de la página que contiene la línea afectada no tiene efecto en el comportamiento de esta instrucción. Cabe señalar que los procesadores son libres de buscar y guardar datos de forma especulativa de las regiones de memoria del sistema asignadas a un tipo de memoria que permite lecturas especulativas (como los tipos de memoria WB, WC y WT). Las instrucciones de PREFETCHh se pueden utilizar para proporcionar al procesador consejos para este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, la instrucción CLFLUSH no se ordena con respecto a las instrucciones PREFETCHh o cualquiera de los mecanismos especulativos de captura (es decir, los datos pueden ser cargados especulativamente en una línea de caché justo antes, durante o después de la ejecución de una instrucción CLFLUSH que hace referencia a la línea de caché).

Las ejecuciones de la instrucción CLFLUSH se ordenan entre sí y con respecto a los escritos, las instrucciones de lectura-modificar-escritura cerradas, y las instrucciones de la cerca.1 No se ordenan con respecto a las ejecuciones de CLFLUSHOPT y CLWB. El software puede utilizar la instrucción SFENCE para ordenar una ejecución de CLFLUSH relativa a una de esas operaciones.

La instrucción CLFLUSH se puede utilizar en todos los niveles de privilegios y está sujeta a todas las comprobaciones de permisos y fallas asociadas con una carga de byte (y además, se permite una instrucción CLFLUSH para cambiar una dirección lineal en un segmento de ejecución). Como una carga, la instrucción CLFLUSH establece el bit A pero no el bit D en las tablas de página.

En algunas implementaciones, la instrucción CLFLUSH siempre puede causar un aborto transaccional con extensiones de sincronización transaccional (TSX). No se espera que la instrucción CLFLUSH sea utilizada comúnmente en las regiones transaccionales típicas. Sin embargo, los programadores no deben confiar en la instrucción CLFLUSH para forzar un aborto transaccional, ya que si causan un aborto transaccional depende de la aplicación.

La instrucción CLFLUSH fue introducida con las extensiones SSE2; sin embargo, debido a que tiene su propia bandera característica CPUID, puede ser implementada en procesadores IA-32 que no incluyen las extensiones SSE2. Además, la detección de la presencia de las extensiones SSE2 con la instrucción CPUID no garantiza que la instrucción CLFLUSH se implemente en el procesador.

La operación CLFLUSH es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
Flush_Cache_Line(SRC);
```

## Intel C/C++ compilador intrínseco

```c
CLFLUSH void _mm_clflush(void const *p);
```
