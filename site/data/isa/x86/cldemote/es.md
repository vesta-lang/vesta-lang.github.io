---
summary: Cache Line Demote
---

## Descripción

Hints a hardware que la línea de caché que contiene la dirección lineal especificada conel operando de memoriadebe ser movido ("demoted") desde el cache(s) más cercano al núcleo del procesador a un nivel más distante del núcleo del procesador. Esto puede acelerar el acceso posterior a la línea por otros núcleos en el mismo dominio de coherencia, especialmente si la línea fue escrita por el núcleo que demota la línea. Moving the line in such a manner is a performance optimization, i.e., it is a hint which does not modify architectural state. Hardware puede elegir qué nivel en la jerarquía de caché para retener la línea (por ejemplo, L3 en los diseños de servidor típicos). El operando de origen es un byte ubicación de memoria.

La disponibilidad de la instrucción CLDEMOTE se indica por la presencia de la bandera CPUID característica CLDEMOTE (bit 25 del registro ECX en subhoja 07H, ver "CPUID--CPU Identificación"). En los procesadores que no apoyan la instrucción CLDEMOTE (incluido el hardware legado) la instrucción se tratará como un NOP.

Se ordena una instrucción CLDEMOTE con respecto a las tiendas a la misma línea de caché, pero sin orden con respecto a otras instrucciones, incluyendo cercas de memoria, CLDEMOTE, CLWB o CLFLUSHOPT instrucciones a una línea de caché diferente. Dado que CLDEMOTE se jubilará con respecto a las tiendas a la misma línea de caché, el software debe asegurarse de que después de emitir CLDEMOTE la línea no se vuelva a acceder inmediatamente por el mismo núcleo para evitar las sanciones de movimiento de datos de caché.

El tipo de memoria eficaz de la página que contiene la línea afectada determina el efecto; es probable que los tipos cacheables generen una operación de movimiento de datos, mientras que los tipos incalculables pueden hacer que la instrucción sea ignorada.

La captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción. La instrucción CLDEMOTE no se ordena con respecto a las instrucciones de PREFETCHh o cualquiera de los mecanismos especulativos de captura. Es decir, los datos se pueden cargar especulativamente en una línea de caché justo antes, durante o después de la ejecución de una instrucción CLDEMOTE que hace referencia a la línea de caché.

A diferencia de las instrucciones CLFLUSH, CLFLUSHOPT y CLWB, CLDEMOTE no está garantizado para escribir datos modificados a la memoria.

La instrucción CLDEMOTE puede ser ignorada por hardware en ciertos casos y no es una garantía.

La instrucción CLDEMOTE se puede utilizar en todos los niveles de privilegios. En ciertas implementaciones del procesador la instrucción CLDEMOTE puede establecer el bit A pero no el bit D en las tablas de página.

Si la línea no se encuentra en el caché, la instrucción será tratada como un NOP.

En algunas implementaciones, la instrucción CLDEMOTE siempre puede causar un aborto transaccional con extensiones de sincronización transaccional (TSX). Sin embargo, los programadores no deben confiar en la instrucción CLDEMOTE para forzar un aborto transaccional.

1. El campo Mod del byte ModR/M no puede tener valor 11B.

## Operación

```text
Cache_Line_Demote(m8);
```

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent CLDEMOTE void  cldemote(cont void*);
