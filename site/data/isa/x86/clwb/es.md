---
summary: Cache Line Write Back
---

## Descripción

Escribe de nuevo a la memoria la línea de caché (si modificada) que contiene la dirección lineal especificada con el operando de memoria de cualquier nivel de la jerarquía de caché en el dominio de coherencia de caché. La línea puede mantenerse en la jerarquía de caché en estado no modificado. Retener la línea en la jerarquía de caché es una optimización de rendimiento (tratado como una pista por hardware) para reducir la posibilidad de falta de caché en un acceso posterior. Hardware puede optar por retener la línea en cualquiera de los niveles en la jerarquía de caché, y en algunos casos, puede invalidar la línea de la jerarquía de caché. El operando de origen es un byte ubicación de memoria.

La disponibilidad de instrucción CLWB es indicada por CPUID.07H.00H:EBX.CLWB[24]. El tamaño de línea de caché alineado afectado también se indica por el valor en CPUID.01H:EBX[15:8].

El atributo de memoria de la página que contiene la línea afectada no tiene efecto en el comportamiento de esta instrucción. Cabe señalar que los procesadores son libres de buscar y guardar datos de forma especulativa de las regiones de memoria del sistema que se asignan un tipo de memoria que permite lecturas especulativas (como, los tipos de memoria WB, WC y WT). Las instrucciones de PREFETCHh se pueden utilizar para proporcionar al procesador consejos para este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, la instrucción CLWB no se ordena con respecto a las instrucciones PREFETCHh o cualquiera de los mecanismos especulativos de captura (es decir, los datos pueden ser cargados especulativamente en una línea de caché justo antes, durante o después de la ejecución de una instrucción CLWB que hace referencia a la línea de caché).

Las ejecuciones de la instrucción CLWB se ordenan con respecto a las instrucciones de la valla y a las instrucciones de escritura-modificación bloqueadas; también se ordenan con respecto a las escrituras anteriores a la línea de caché que se escribe de nuevo. No se les ordena con respecto a otras ejecuciones de CLWB, a las ejecuciones de CLFLUSH y CLFLUSHOPT, o a los más jóvenes escribe a la línea de caché que se escribe de vuelta. El software puede utilizar la instrucción SFENCE para ordenar una ejecución de CLWB relativa a una de esas operaciones.

Para los usos que sólo requieren la escritura de datos modificados de las líneas de caché a la memoria (no requieren que la línea sea invalidada), y espera acceder posteriormente a los datos, se recomienda que el software utilice CLWB (con cerramiento apropiado) en lugar de CLFLUSH o CLFLUSHOPT para mejorar el rendimiento.

La instrucción CLWB se puede utilizar en todos los niveles de privilegios y está sujeta a todas las comprobaciones de permiso y fallas asociadas con una carga de byte. Como una carga, la instrucción CLWB establece la bandera accedida pero no la bandera sucia en las tablas de página.

En algunas implementaciones, la instrucción CLWB siempre puede causar un aborto transaccional con extensiones de sincronización transaccional (TSX). No se espera que la instrucción CLWB sea utilizada comúnmente en las regiones transaccionales típicas. Sin embargo, los programadores no deben confiar en la instrucción CLWB para forzar un aborto transaccional, ya que si causan un aborto transaccional depende de la aplicación.

## Operación

```text
Cache_Line_Write_Back(m8);

1. The Mod field of the ModR/M byte cannot have value 11B.
```

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent CLWB void  mm clwb(void const *p);
