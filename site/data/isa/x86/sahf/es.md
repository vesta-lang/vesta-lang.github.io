---
summary: Tienda AH Into Flags
---

## Descripción

Carga las banderas SF, ZF, AF, PF y CF del registro EFLAGS con valores de los bits correspondientes en el registro AH (bits 7, 6, 4, 2, y 0, respectivamente). Se ignoran los bits 1, 3 y 5 del registro AH; los bits reservados correspondientes (1, 3 y 5) en el registro EFLAGS permanecen como se muestra en la sección "Operación" a continuación.

Esta instrucción se ejecuta como se describe anteriormente en modo de compatibilidad y modo legado. Es válido en modo de 64 bits sólo si CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1.

## Operación

```text
IF IA-64 Mode
    THEN
          IF CPUID.80000001H:ECX[0] = 1;
                THEN
                      RFLAGS(SF:ZF:0:AF:0:PF:1:CF) := AH;
                ELSE
                      #UD;
          FI
    ELSE
          EFLAGS(SF:ZF:0:AF:0:PF:1:CF) := AH;

FI;
```

## Banderas afectadas

Las banderas SF, ZF, AF, PF y CF se cargan con valores del registro AH. Los bits 1, 3 y 5 del registro EFLAGS no son afectados, con los valores restantes 1, 0 y 0, respectivamente.
