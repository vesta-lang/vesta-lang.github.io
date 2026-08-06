---
summary: Excepciones claras
---

## Descripción

Limpia las banderas de excepción la coma flotante (PE, UE, OE, ZE, DE, e IE), la bandera de estado sumario de excepción (ES), la bandera de falla de la pila (SF), y la bandera ocupada (B) en la palabra de estado FPU. La instrucción FCLEX comprueba y descriptores cualquier excepción coma flotante sin máscaras pendientes antes de limpiar las banderas de excepción; la instrucción FNCLEX no.

El ensamblador emite dos instrucciones para la instrucción FCLEX (una instrucción FWAIT seguida de una instrucción FNCLEX), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

## Compatibilidad de arquitectura IA-32

Al operar un procesador Pentium o Intel486 en el modo compatibilidad MS-DOS*, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNCLEX antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNCLEX no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

Esta instrucción afecta sólo las banderas de excepción x87 FPU coma flotante. No afecta las banderas de excepción SIMD coma flotante en el registro MXCSR.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
FPUStatusWord[0:7] := 0;
FPUStatusWord[15] := 0;

FPU Flags Affected

The PE, UE, OE, ZE, DE, IE, ES, SF, and B flags in the FPU status word are cleared. The C0, C1, C2, and C3 flags are
undefined.
```

## Excepciones coma flotante

None.
