---
summary: Prefetch Data Into Caches
---

## Descripción

Señala la línea de datos o código (tetos de instrucciones) de la memoria que contiene el byte especificado con el operando de origen a una ubicación en la jerarquía de caché especificada por una pista de localización:

* T0 (datos temporales)--preparar datos en todos los niveles de la jerarquía de caché. * T1 (datos temporales con respecto a las faltas de caché de primer nivel)--prefetch data into nivel 2 cache y superior. * T2 (datos temporales con respecto a las faltas de caché de segundo nivel)--prefetch data into nivel 3 caché y superior, o

una elección específica para la aplicación.

* NTA(datos no temporales con respecto a todos los niveles de caché) - datos de captura previa en la estructura de caché no temporal y

en un lugar cercano al procesador, minimizando la contaminación de caché.

* IT0 (código temporal) - código prefetch en todos los niveles de la jerarquía de caché. * IT1 (código temporal con respecto a las faltas de caché de primer nivel) - código anterior en todos pero el primer nivel del

jerarquía de caché.

El operando de origen es un byte ubicación de memoria. (Las pistas de la localidad se codifican en la instrucción del nivel de la máquina utilizando bits 3 a 5 del byte ModR/M.) Algunas pistas de localidad pueden prefetch sólo para direcciones de memoria relacionadas con RIP; ver detalles adicionales a continuación. La dirección a prefetch es NextRIP + desplazamiento de 32 bits, donde NextRIP es el primer byte de la instrucción que sigue la instrucción prefetch en sí.

Si la línea seleccionada ya está presente en la jerarquía de caché a un nivel más cercano al procesador, no se produce movimiento de datos. Se ignoran las prefetches de memoria incacheable o WC.

La instrucción PREFETCHh es simplemente una pista y no afecta el comportamiento del programa. Si se ejecuta, esta instrucción mueve los datos más cerca del procesador en previsión del uso futuro.

La aplicación de consejos locales prefetch depende de la implementación y puede ser sobrecargada o ignorada por una implementación del procesador. La cantidad de datos o líneas de código prefetched también depende de la implementación del procesador. Sin embargo, será un mínimo de 32 bytes. En la sección 7.4 de Intel(R) 64 y el manual de referencia de optimización de arquitecturas IA-32 se describen detalles adicionales de los consejos de localización dependientes de la implementación.

Cabe señalar que los procesadores son libres de buscar y guardar datos especulativos de las regiones de memoria del sistema que se asignan un tipo de memoria que permite lecturas especulativas (es decir, los tipos de memoria WB, WC y WT). A

La instrucción PREFETCHh se considera un indicio de este comportamiento especulativo. Debido a que esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción, una instrucción PREFETCHh no se ordena con respecto a las instrucciones de la cerca (MFENCE, SFENCE y LFENCE) o referencias de memoria bloqueadas. Una instrucción de PREFETCHh también no está ordenada con respecto a las instrucciones de CLFLUSH y CLFLUSHOPT, otras instrucciones de PREFETCHh, o cualquier otra instrucción general. Se ordena con respecto a instrucciones de serialización como CPUID, WRMSR, OUT y MOV CR.

PREFETCHIT0/1 se puede utilizar en modo de 64 bits con abordaje relacionado con RIP; permanecen NOPs de otra manera. Para un rendimiento óptimo, las direcciones utilizadas con estas instrucciones deben ser el byte inicial de una instrucción real.

PREFETCHIT0/1 instrucciones son enumeradas por CPUID.07H.01H:EDX.PREFETCHI[14].Las codificaciones permanecen NOP en procesadores que no enumeran estas instrucciones.

## Operación

```text
FETCH (m8);
```

## Intel C/C++ compilador intrínseco

```c
void _mm_prefetch(char *p, int i) The argument "*p" gives the address of the byte (and corresponding cache line) to be prefetched. The value "i" gives a constant (_MM_HINT_T0, _MM_HINT_T1, _MM_HINT_T2, _MM_HINT_NTA, _MM_HINT_IT0, or _MM_HINT_IT1) that specifies the type of prefetch operation to be performed.;
```

## Excepciones numéricas

None.
