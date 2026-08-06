---
summary: Store Fence
---

## Descripción

Pedidos de ejecución del procesador en relación con todas las tiendas de memoria antes de la instrucción SFENCE. El procesador asegura que cada tienda antes de SFENCE es visible a nivel mundial antes de cualquier tienda después de que SFENCE se haga visible a nivel mundial. La instrucción SFENCE se ordena con respecto a las tiendas de memoria, otras instrucciones SFENCE, instrucciones MFENCE y cualquier instrucción serializante (como la instrucción CPUID). No se ordena con respecto a las cargas de memoria o la instrucción LFENCE.

Los tipos de memoria ordenados débilmente se pueden utilizar para lograr un mayor rendimiento de procesador a través de técnicas tales como el problema fuera de orden, la combinación de escritura y la colada de escritura. El grado en que un consumidor de datos reconoce o sabe que los datos se ordenan débilmente varía entre las aplicaciones y puede ser desconocido para el productor de estos datos. La instrucción SFENCE proporciona una manera eficiente de garantizar el orden de la tienda entre rutinas que producen resultados y rutinas de orden débil que consumen estos datos.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

La especificación del código de operación de la instrucción indica un byte ModR/M de F8. Para esta instrucción, el procesador ignora el campo r/m del byte ModR/M. Así, SFENCE es codificado por cualquier código de operación de la forma 0F AE Fx, donde x está en el rango 8-F.

## Operación

```text
Wait_On_Following_Stores_Until(preceding_stores_globally_visible);
```

## Intel C/C++ compilador intrínseco

```c
void _mm_sfence(void);
```
