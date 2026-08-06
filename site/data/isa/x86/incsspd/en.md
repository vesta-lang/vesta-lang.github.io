---
summary: Increment Shadow Stack Pointer
---

## Description

This instruction can be used to increment the current shadow stack pointer by the operand size of the instruction times the unsigned 8-bit value specified by bits 7:0 in the source operand. The instruction performs a pop and discard of the first and last element on the shadow stack in the range specified by the unsigned 8-bit value in bits 7:0 of the source operand.

## Operation

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

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
INCSSPD void _incsspd(int);
INCSSPQ void _incsspq(int);
```
