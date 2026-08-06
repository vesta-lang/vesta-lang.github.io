---
summary: No hay operación
---

## Descripción

No realiza ninguna operación FPU. Esta instrucción ocupa espacio en el flujo de instrucción pero no afecta el contexto FPU o máquina, excepto el registro EIP y el FPU puntero de instruccion.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

Banderas FPU Afectados C0, C1, C2, C3 indefinidos.

## Excepciones coma flotante

None.
