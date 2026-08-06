---
summary: Read Shadow puntero de pila
---

## Descripción

Copia el registro de la sombra actual puntero de pila (SSP) al destino de registro. Este código de operación es un NOP cuando las pilas de sombra CET no están habilitadas y en los procesadores que no soportan CET.

## Operación

```text
IF CPL = 3
    IF CR4.CET & IA32_U_CET.SH_STK_EN
          IF (operand size is 64 bit)
                THEN
                      Dest := SSP;
                ELSE
                      Dest := SSP[31:0];
          FI;
    FI;

ELSE
    IF CR4.CET & IA32_S_CET.SH_STK_EN
          IF (operand size is 64 bit)
                THEN
                      Dest := SSP;
                ELSE
                      Dest := SSP[31:0];
          FI;
    FI;

FI;
```

## Banderas afectadas

None.

C/C++ Compilador Equivalente Intrínseco

RDSSPD__int32 _rdsspd_i32(void); RDSSPQ__int64 _rdsspq_i64(void);
