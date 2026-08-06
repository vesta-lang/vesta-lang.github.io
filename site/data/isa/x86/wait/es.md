---
summary: Espera.
---

## Descripción

Causa el procesador para comprobar y descriptor pendientes, desenmascaradas, excepciones coma flotante antes de proceder. (FWAIT es una mnemónica alternativa para WAIT.)

Esta instrucción es útil para sincronizar excepciones en secciones críticas de código. Codificación de una instrucción WAIT después de la instrucción una coma flotante asegura que cualquier excepción coma flotante desenmascarada que la instrucción pueda elevar se manejan antes de que el procesador pueda modificar los resultados de la instrucción. Vea la sección titulada "Sincronización de Excepción de coma flotante" en el capítulo 8 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para más información sobre el uso de la instrucción WAIT/FWAIT.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
CheckForPendingUnmaskedFloatingPointExceptions;

FPU Flags Affected
The C0, C1, C2, and C3 flags are undefined.
```

## Excepciones coma flotante

None.
