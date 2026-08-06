---
summary: Square Root
---

## Description

Computes the square root of the source value in the ST(0) register and stores the result in ST(0).

The following table shows the results obtained when taking the square root of various classes of numbers, assuming that neither overflow nor underflow occurs.

**FSQRT Results**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | * |
| -0 | -0 |
| +0 | +0 |
| +F | +F |
| + | + |
| NaN | NaN |

## Operation

```text
ST(0) := SquareRoot(ST(0));

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value or unsupported format.
```

Source operand is a negative value (except for -0).

```text
#D                  Source operand is a denormal value.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
