---
summary: Read Shadow Stack Pointer
---

## Description

Copies the current shadow stack pointer (SSP) register to the register destination. This opcode is a NOP when CET shadow stacks are not enabled and on processors that do not support CET.

## Operation

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

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent

RDSSPD__int32 _rdsspd_i32(void); RDSSPQ__int64 _rdsspq_i64(void);
