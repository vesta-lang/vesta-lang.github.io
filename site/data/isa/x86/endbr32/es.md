---
summary: Terminar una rama indirecta en modo de 32 bits y compatibilidad
---

## Descripción

Terminar una rama indirecta en 32 bits y modo de compatibilidad. Este código de operación es un NOP cuando CET indirect branch tracking no está habilitado y en procesadores que no admiten CET.

## Operación

```text
IF EndbranchEnabled(CPL) & (IA32_EFER.LMA = 0 | (IA32_EFER.LMA=1 & CS.L = 0)
    IF CPL = 3
          THEN
                IA32_U_CET.TRACKER = IDLE
                IA32_U_CET.SUPPRESS = 0
          ELSE
                IA32_S_CET.TRACKER = IDLE
                IA32_S_CET.SUPPRESS = 0
    FI;

FI;
```

## Banderas afectadas

None.

Excepciones Si se utiliza el prefijo LOCK.

```text
#UD
```
