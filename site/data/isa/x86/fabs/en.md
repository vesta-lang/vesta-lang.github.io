---
summary: Absolute Value
---

## Description

Clears the sign bit of ST(0) to create the absolute value of the operand. The following table shows the results obtained when creating the absolute value of various classes of numbers.

```text
                                 ST(0) SRC  Table 3-19. Results Obtained from FABS
```

ST(0) DEST -

```text
                                      -F                                                                   +
                                      -0                                                                          +F
                                      +0                                                                          +0
                                      +F                                                                          +0
```

+F +

```text
                                     NaN                                                                   +
```

NOTES:                                                                                                           NaN F Means finite floating-point value.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
ST(0) := |ST(0)|;

FPU Flags Affected

C1                    Set to 0.

C0, C2, C3            Undefined.
```

## Floating-Point Exceptions

```text
#IS                   Stack underflow occurred.
```
