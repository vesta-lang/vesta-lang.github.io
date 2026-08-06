---
summary: Memory Fence
---

## Descripción

Realiza una operación de serialización en todas las instrucciones de carga de memoria y almacén a memoria que se emitieron antes de la instrucción MFENCE. Esta operación serializadora garantiza que todas las instrucciones de carga y almacenamiento que preceden a laMFENCEinstrucción en el orden del programa se hace visible globalmente antes de cualquier instrucción de carga o almacén que sigue laMFENCEinstrucción.1MFENCEinstrucciones se ordena con respecto a todas las instrucciones de carga y almacenamiento, otrasMFENCEinstrucciones, cualquierLFENCEySFENCEinstrucciones, y cualquier instrucciones de serialización (comoCPUIDinstrucción). MFENCE no serializa el flujo de instrucción.

Los tipos de memoria ordenados débilmente se pueden utilizar para lograr un mayor rendimiento de procesador a través de técnicas tales como el problema fuera de orden, lecturas especulativas, combinación de escritura y colapso de escritura. El grado en que un consumidor de datos reconoce o sabe que los datos se ordenan débilmente varía entre las aplicaciones y puede ser desconocido para el productor de estos datos. La instrucción MFENCE proporciona una manera eficiente en el rendimiento de asegurar la carga y almacenar pedidos entre rutinas que producen resultados y rutinas de orden débil que consumen esos datos.

Los procesadores son libres de buscar y caché datos especulativamente de regiones de memoria del sistema que utilizan los tipos de memoria WB, WC y WT. Esta captura especulativa puede ocurrir en cualquier momento y no está vinculada a la ejecución de la instrucción. Por lo tanto, no se ordena con respecto a las ejecuciones de la instrucción MFENCE; los datos se pueden introducir en los caches especulativamente justo antes, durante o después de la ejecución de una instrucción MFENCE.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

La especificación del código de operación de la instrucción indica un byte ModR/M de F0. Para esta instrucción, el procesador ignora el campo r/m del byte ModR/M. Así, MFENCE es codificado por cualquier código de operación de la forma 0F AE Fx, donde x está en el rango 0-7.

## Operación

```text
Wait_On_Following_Loads_And_Stores_Until(preceding_loads_and_stores_globally_visible);
```

## Intel C/C++ compilador intrínseco

```c
void _mm_mfence(void) Exceptions (All Modes of Operation) #UD                   If CPUID.01H:EDX.SSE2[26] = 0. If the LOCK prefix is used.;
```
