---
summary: Carga banderas de estado Into AH Registro
---

## Descripción

Esta instrucción se ejecuta como se describe anteriormente en modo de compatibilidad y modo legado. Es válido en modo de 64 bits sólo si CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1.

## Operación

```text
IF 64-Bit ModeTHENIF CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1;THEN AH := RFLAGS(SF:ZF:0:AF:0:PF:1:CF);ELSE #UD; FI;ELSEAH
:= EFLAGS(SF:ZF:0:AF:0:PF:1:CF);FI;
```

## Banderas afectadas

Ninguno. El estado de las banderas en el registro EFLAGS no se ve afectado.
