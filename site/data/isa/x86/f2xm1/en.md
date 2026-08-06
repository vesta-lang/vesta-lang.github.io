---
summary: Compute 2x1
---

## Description

Computes the exponential value of 2 to the power of the source operand minus 1. The source operand is located in register ST(0) and the result is also stored in ST(0). The value of the source operand must lie in the range 1.0 to +1.0. If the source value is outside this range, the result is undefined.

The following table shows the results obtained when computing the exponential value of various classes of numbers, assuming that neither overflow nor underflow occurs.

**Results Obtained from F2XM1**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - 1.0 to -0 | - 0.5 to - 0 |
| -0 | -0 |
| +0 | +0 |
| + 0 to +1.0 | + 0 to 1.0 |
| be exponentiated using the following formula: |  |
| tion is the same in non-64-bit modes and 64-bit mode. |  |

## Operation

```text
ST(0) := (2ST(0) - 1);

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## Floating-Point Exceptions

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Source operand is an SNaN value or unsupported format.
```

```text
#D                      Source is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
