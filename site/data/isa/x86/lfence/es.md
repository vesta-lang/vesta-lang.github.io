---
summary: Carga Fence
---

## Descripción

Realiza una operación de serialización en todas las instrucciones de carga de memoria que se emitieron antes de la instrucción LFENCE. Específicamente, LFENCE no se ejecuta hasta que todas las instrucciones anteriores hayan completado localmente, y ninguna instrucción posterior comienza la ejecución hasta que LFENCE termine. En particular, una instrucción que se carga de memoria y que precede a un LFENCE recibe datos de memoria antes de la terminación del LFENCE. (Un LFENCE que sigue una instrucción que almacena a la memoria podría completar antes de que los datos almacenados se hayan convertido en visibles a nivel mundial.) Las instrucciones posteriores a un LFENCE pueden ser arrebatadas de memoria antes del LFENCE, pero no se ejecutarán (incluso especulativamente) hasta que el LFENCE termine.

Los tipos de memoria ordenados débilmente se pueden utilizar para lograr un mayor rendimiento de procesador a través de técnicas tales como el problema fuera de orden y lecturas especulativas. El grado en que un consumidor de datos reconoce o sabe que los datos se ordenan débilmente varía entre las aplicaciones y puede ser desconocido para el productor de estos datos. La instrucción LFENCE proporciona una manera eficiente en el rendimiento de asegurar el orden de carga entre rutinas que producen resultados y rutinas desordenados que consumen esos datos.

Los procesadores son libres de buscar y caché datos especulativamente de regiones de memoria del sistema que utilizan los tipos de memoria WB, WC y WT. Esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción. Por lo tanto, no se ordena con respecto a las ejecuciones de la instrucción LFENCE; los datos se pueden introducir en los caches especulativamente justo antes, durante o después de la ejecución de una instrucción LFENCE.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

La especificación de la instrucción código de operación arriba indica un byte ModR/M de E8. Para esta instrucción, el procesador ignora el campo r/m del byte ModR/M. Así, LFENCE es codificado por cualquier código de operación de la forma 0F AE Ex, donde x está en el rango 8-F.

## Operación

```text
Wait_On_Following_Instructions_Until(preceding_instructions_complete);
```

## Intel C/C++ compilador intrínseco

```c
void _mm_lfence(void) Exceptions (All Modes of Operation) #UD                 If CPUID.01H:EDX.SSE2[26] = 0. If the LOCK prefix is used.;
```
