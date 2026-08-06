---
summary: Assert LOCK# Signal Prefix
---

## Descripción

Causa que la señal LOCK# del procesador sea afirmada durante la ejecución de la instrucción que acompaña (hace la instrucción en una instrucción atómica). En un entorno multiprocesador, la señal LOCK# garantiza que el procesador tenga un uso exclusivo de cualquier memoria compartida mientras se afirma la señal.

En la mayoría de los procesadores IA-32 y todos los procesadores Intel 64, el bloqueo puede ocurrir sin la señal LOCK# que se afirma. Vea la sección "IA- 32 Arquitectura Compatibilidad" a continuación para más detalles.

El prefijo LOCK se puede prever solamente a las siguientes instrucciones y sólo a aquellas formas de las instrucciones en las que el operando de destino es un operando de memoria: ADD, ADC, AND, BTC, BTR, BTS, CMPXCHG, CMPXCH8B, CMPXCHG16B, DEC, INC, NEG, NOT, O,SBB, SUB, XOR, XADD, yXCHG. Si el prefijo LOCK se utiliza con una de estas instrucciones y el operando de origen es un operando de memoria, se puede generar una excepción código de operación indefinida (#UD). También se generará una excepción código de operación indefinida si el prefijo LOCK se utiliza con cualquier instrucción no en la lista anterior. La instrucción XCHG siempre afirma la señal LOCK# independientemente de la presencia o ausencia del prefijo LOCK.

El prefijo LOCK se utiliza típicamente con la instrucción BTS para realizar una operación de escritura-modificación de lectura en una ubicación de memoria en entorno de memoria compartido.

La integridad del prefijo LOCK no se ve afectada por la alineación del campo de memoria. El bloqueo de memoria se observa para campos arbitrarios mal alineados.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Comenzando con los procesadores de la familia P6, cuando el prefijo LOCK está prefijado a una instrucción y el área de memoria a la que se accede es caché internamente en el procesador, la señal LOCK# generalmente no se afirma. En su lugar, sólo el caché del procesador está bloqueado. Aquí, el mecanismo de coherencia de caché del procesador garantiza que la operación se lleve a cabo atómicamente con respecto a la memoria. Ver "Efectos de una operación bloqueada sobre jaulas de procesadores internos" en el capítulo 11 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, el para obtener más información sobre el bloqueo de jaulas.

## Operación

```text
AssertLOCK#(DurationOfAccompaningInstruction);
```

## Banderas afectadas

None.
