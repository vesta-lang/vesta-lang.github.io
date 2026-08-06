---
summary: Scale
---

## Description

Truncates the value in the source operand (toward 0) to an integral value and adds that value to the exponent of the destination operand. The destination and source operands are floating-point values located in registers ST(0) and ST(1), respectively. This instruction provides rapid multiplication or division by integral powers of 2. The following table shows the results obtained when scaling various classes of numbers, assuming that neither overflow nor underflow occurs.

**FSCALE Results**

| ST(0) | -F | -0 | -F | -F | -F | -F | - | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0 | -0 | -0 | -0 | NaN | NaN |
|  | +0 | +0 | +0 | +0 | +0 | +0 | NaN | NaN |
|  | +F | +0 | +F | +F | +F | +F | + | NaN |
|  | + | NaN | + | + | + | + | + | NaN |
|  | NaN | NaN | NaN             NaN |  | NaN | NaN | NaN | NaN |

## Operation

```text
ST(0) := ST(0)  2RoundTowardZero(ST(1));

FPU Flags Affected

C1                    Set to 0 if stack underflow occurred.

                      Set if result was rounded up; cleared otherwise.

C0, C2, C3            Undefined.
```

## Floating-Point Exceptions

```text
#IS            Stack underflow occurred.
```

```text
#IA            Source operand is an SNaN value or unsupported format.
```

```text
#D             Source operand is a denormal value.
```

```text
#U             Result is too small for destination format.
```

```text
#O             Result is too large for destination format.
```

```text
#P             Value cannot be represented exactly in destination format.
```
