---
summary: Incremento Shadow puntero de pila
---

## Descripción

Esta instrucción se puede utilizar para aumentar la sombra actual puntero de pila por el tamaño de operando de los tiempos de instrucción el valor de 8 bits no firmado especificado por los bits 7:0 en el operando de origen. La instrucción realiza un pop y descarte del primer y último elemento en la pila de sombras en el rango especificado por el valor de 8 bits no firmado en los bits 7:0 del operando de origen.

## Operación

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;

FI;

IF (operand size is 64-bit)
    THEN
          Range := R64[7:0];
          shadow_stack_load 8 bytes from SSP;
          IF Range > 0
                THEN shadow_stack_load 8 bytes from SSP + 8 * (Range - 1);
          FI;
          SSP := SSP + Range * 8;
    ELSE
          Range := R32[7:0];
          shadow_stack_load 4 bytes from SSP;
          IF Range > 0
                THEN shadow_stack_load 4 bytes from SSP + 4 * (Range - 1);
          FI;
          SSP := SSP + Range * 4;

FI;
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
INCSSPD void _incsspd(int);
INCSSPQ void _incsspq(int);
```
