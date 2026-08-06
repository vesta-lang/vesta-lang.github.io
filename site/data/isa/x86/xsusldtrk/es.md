---
summary: Suspend Tracking Load Addresses
---

## Descripción

La instrucción marca el inicio de un Intel TSX (RTM) suspender la región de seguimiento de la dirección de carga. Si la instrucción se utiliza dentro de una región transaccional, las cargas posteriores no se agregan al conjunto de lectura de la transacción. Si la instrucción se utiliza dentro de una región de seguimiento de la dirección de carga de suspensión causará el aborto de transacción.

Si la instrucción se utiliza fuera de una región transaccional se comporta como un NOP. Capítulo 16, "Programación con extensiones de sincronización transaccional Intel(R)", en el Manual del desarrollador de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1 proporciona información adicional sobre Intel(R) TSX Suspend Load Address Tracking.

## Operación

```text
XSUSLDTRK
IF RTM_ACTIVE = 1:

    IF SUSLDTRK_ACTIVE = 0:
          SUSLDTRK_ACTIVE := 1

    ELSE:
          RTM_ABORT

ELSE:
    NOP
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSUSLDTRK void _xsusldtrk(void);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

If CPUID.07H.00H:EDX.TSXLDTRK[16] = 0.

```text
#UD                    If the LOCK prefix is used.
```
