---
summary: Free Floating-Point Register
---

## Description

Sets the tag in the FPU tag register associated with register ST(i) to empty (11B). The contents of ST(i) and the FPU stack-top pointer (TOP) are not affected.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
TAG(i) := 11B;

FPU Flags Affected
C0, C1, C2, C3 undefined.
```

## Floating-Point Exceptions

None
