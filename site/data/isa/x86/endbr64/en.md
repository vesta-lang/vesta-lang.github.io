---
summary: Terminate an Indirect Branch in 64-bit Mode
---

## Description

Terminate an indirect branch in 64 bit mode. This opcode is a NOP when CET indirect branch tracking is not enabled and on processors that do not support CET.

## Operation

```text
IF EndbranchEnabled(CPL) & IA32_EFER.LMA = 1 & CS.L = 1
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

## Flags affected

None.

Exceptions      If the LOCK prefix is used.

```text
#UD
```
