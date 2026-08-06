---
summary: Prefetch Vector Data Into Caches With Intent to Write and T1 Hint
---

## Descripción

Señala la línea de datos de la memoria que contiene el byte especificado con el operando de origen a un lugar en la jerarquía de caché especificado por una intención de escribir la insinuación (para que los datos se introducen en el estado 'Exclusivo' a través de una solicitud de propiedad) y una pista de localización:

* T1 (datos temporales con respecto a la caché de primer nivel)--preparar los datos en la caché de segundo nivel.

El operando de origen es un byte ubicación de memoria. (Las pistas de la localidad se codifican en la instrucción del nivel de la máquina utilizando bits 3 a 5 del byte ModR/M. El uso de cualquier valor ModR/M aparte de los especificados llevará a un comportamiento impredecible.)

Si la línea seleccionada ya está presente en la jerarquía de caché a un nivel más cercano al procesador, no se produce movimiento de datos. Se ignoran las prefetches de memoria incacheable o WC.

La instrucción PREFETCHWT1 es simplemente una pista y no afecta el comportamiento del programa. Si se ejecuta, esta instrucción mueve los datos más cerca del procesador en previsión del uso futuro.

La aplicación de consejos locales prefetch depende de la implementación y puede ser sobrecargada o ignorada por una implementación del procesador. La cantidad de datos prefetched también depende de la implementación del procesador. Sin embargo, será un mínimo de 32 bytes. En la sección 9.5, "Memory Optimization Using Prefetch" del Manual de Optimización de Arquitecturas Intel(R) 64 y IA-32 se describen detalles adicionales de los consejos de localización dependientes de la implementación.

Cabe señalar que los procesadores son libres de buscar y guardar datos especulativos de las regiones de memoria del sistema que se asignan un tipo de memoria que permite lecturas especulativas (es decir, los tipos de memoria WB, WC y WT). Una instrucción PREFETCHWT1 se considera un indicio a este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, una instrucción PREFETCHWT1 no se ordena con respecto a las instrucciones de la cerca (MFENCE, SFENCE y LFENCE) o referencias de memoria bloqueadas. Una instrucción PREFETCHWT1 también no está ordenada con respecto a las instrucciones CLFLUSH y CLFLUSHOPT, otras instrucciones PREFETCHWT1, o cualquier otra instrucción general. Se ordena con respecto a instrucciones de serialización como CPUID, WRMSR, OUT y MOV CR.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

Prefetch (m8, Level = 1, EXCLUSIVE=1);
```

## Banderas afectadas

Todas las banderas están afectadas.

C/C++ Compiler Intrinsic Equivalent void  mm prefetch( char const *, int hint=  MM HINT ET1);
