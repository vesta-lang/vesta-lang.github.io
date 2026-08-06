---
summary: Espejo de giro Hint
---

## Descripción

Mejora el rendimiento de los bucles de husillo. Al ejecutar un "spin-wait loop", los procesadores sufrirán una severa pena de rendimiento al salir del bucle porque detecta una posible violación de la orden de memoria. La instrucción PAUSE proporciona un indicio al procesador de que la secuencia de código es un bucle de la espera de giro. El procesador utiliza esta pista para evitar la violación del orden de memoria en la mayoría de las situaciones, lo que mejora enormemente el rendimiento del procesador. Por esta razón, se recomienda que se coloque una instrucción PAUSE en todos los bucles de espera de giro.

Una función adicional de la instrucción PAUSE es reducir la potencia consumida por un procesador mientras ejecuta un bucle de giro. Un procesador puede ejecutar un bucle de spin-wait extremadamente rápidamente, causando que el procesador consuma mucha energía mientras espera el recurso que está girando para estar disponible. Insertar una instrucción de pausa en un bucle de spinwait reduce considerablemente el consumo de energía del procesador.

Esta instrucción fue introducida en los procesadores Pentium 4, pero es compatible con todos los procesadores IA-32. En los procesadores IA-32 anteriores, la instrucción PAUSE funciona como una instrucción NOP. Los procesadores Pentium 4 e Intel Xeon implementan la instrucción PAUSE como un retraso. El retraso es finito y puede ser cero para algunos procesadores. Esta instrucción no cambia el estado arquitectónico del procesador (es decir, realiza esencialmente una operación no-op retardante).

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
Execute_Next_Instruction(DELAY);
```

## Excepciones numéricas

None.
