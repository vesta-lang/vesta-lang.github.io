---
summary: Compare Integer
---

## Description

Compares the value in ST(0) with an integer source operand and sets the condition code flags C0, C2, and C3 in the FPU status word according to the results (see table below). The integer value is converted to double extendedprecision floating-point format before the comparison is made.

**FICOM/FICOMP Results**

| Condition | C3 | C2 | C0 |
| --- | --- | --- | --- |
| > SRC | 0 | 0 | 0 |
| < SRC | 0 | 0 | 1 |
| = SRC | 1 | 0 | 0 |
| Unordered | 1 | 1 | 1 |

## Operation

```text
CASE (relation of operands) OF

    ST(0) > SRC:  C3, C2, C0 := 000;

    ST(0) < SRC:  C3, C2, C0 := 001;

    ST(0) = SRC:  C3, C2, C0 := 100;

    Unordered:    C3, C2, C0 := 111;

ESAC;

IF Instruction = FICOMP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See table on previous page.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are NaN values or have unsupported formats.
```

```text
#D                  One or both operands are denormal values.
```
