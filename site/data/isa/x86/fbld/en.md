---
summary: Load Binary Coded Decimal
---

## Description

Converts the BCD source operand into double extended-precision floating-point format and pushes the value onto the FPU stack. The source operand is loaded without rounding errors. The sign of the source operand is preserved, including that of -0.

The packed BCD digits are assumed to be in the range 0 through 9; the instruction does not check for invalid digits (AH through FH). Attempting to load an invalid encoding produces an undefined result.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
TOP := TOP - 1;
ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack overflow occurred.
```
