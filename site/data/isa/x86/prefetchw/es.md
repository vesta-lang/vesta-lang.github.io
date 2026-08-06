---
summary: Datos de Prefetch Into Caches en la Anticipación de un Escriba
---

## Descripción

Señala la línea de caché de datos de memoria que contiene el byte especificado con el operando de origen a un lugar en el caché de primer o segundo nivel e invalida otras instancias caché de la línea.

El operando de origen es un byte ubicación de memoria. Si la línea seleccionada ya está presente en el caché de nivel más bajo y ya está en un estado de propiedad exclusiva, no se produce movimiento de datos. Se ignoran las prefetches de la memoria no-escritura.

La instrucción PREFETCHW es simplemente una pista y no afecta el comportamiento del programa. Si se ejecuta, esta instrucción mueve los datos más cerca del procesador y invalida otras copias en caché en previsión de la línea que se escribe en el futuro.

La característica de las indicaciones de la localidad prefetch es dependiente de la implementación, y puede ser sobrecargado o ignorado por una implementación del procesador. La cantidad de datos prefetched también depende de la implementación del procesador. Sin embargo, será un mínimo de 32 bytes. En la sección 7.4 de Intel(R) 64 y el manual de referencia de optimización de arquitecturas IA-32 se describen detalles adicionales de los consejos de localización dependientes de la implementación.

Cabe señalar que los procesadores son libres de datos especulativos y de caché con propiedad exclusiva de las regiones de memoria del sistema que permiten tales accesos (es decir, el tipo de memoria WB). Una instrucción PREFETCHW se considera un indicio a este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, una instrucción PREFETCHW no se ordena con respecto a las instrucciones de la cerca (MFENCE, SFENCE y LFENCE) o referencias de memoria bloqueadas. Una instrucción PREFETCHW también no está ordenada con respecto a las instrucciones CLFLUSH y CLFLUSHOPT, otras instrucciones PREFETCHW, o cualquier otra instrucción general

Se ordena con respecto a instrucciones de serialización como CPUID, WRMSR, OUT y MOV CR.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
FETCH_WITH_EXCLUSIVE_OWNERSHIP (m8);
```

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent void  m prefetchw( void * );
