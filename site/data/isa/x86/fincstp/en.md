---
summary: Increment Stack-Top Pointer
---

## Description

Adds one to the TOP field of the FPU status word (increments the top-of-stack pointer). If the TOP field contains a 7, it is set to 0. The effect of this instruction is to rotate the stack by one position. The contents of the FPU data registers and tag register are not affected. This operation is not equivalent to popping the stack, because the tag for the previous top-of-stack register is not marked empty.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
IF TOP = 7

    THEN TOP := 0;
    ELSE TOP := TOP + 1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## Floating-Point Exceptions

None.
