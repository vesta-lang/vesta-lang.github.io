---
summary: Decrement Stack-Top Pointer
---

## Description

Subtracts one from the TOP field of the FPU status word (decrements the top-of-stack pointer). If the TOP field contains a 0, it is set to 7. The effect of this instruction is to rotate the stack by one position. The contents of the FPU data registers and tag register are not affected.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
IF TOP = 0

    THEN TOP := 7;
    ELSE TOP := TOP  1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## Floating-Point Exceptions

None.
