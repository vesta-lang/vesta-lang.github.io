---
summary: Store BCD Integer and Pop
---

## Description

Converts the value in the ST(0) register to an 18-digit packed BCD integer, stores the result in the destination operand, and pops the register stack. If the source value is a non-integral value, it is rounded to an integer value, according to rounding mode specified by the RC field of the FPU control word. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1.

The destination operand specifies the address where the first byte destination value is to be stored. The BCD value (including its sign bit) requires 10 bytes of space in memory.

The following table shows the results obtained when storing various classes of numbers in packed BCD format.

**FBSTP Results**

| - | or Value Too Large for DEST Format | * |
| --- | --- | --- |
|  | F-1 | -D |
|  | -1 < F < -0 | ** |
|  | -0 | -0 |
|  | +0 | +0 |
|  | + 0 < F < +1 | ** |
|  | F  +1 | +D |
| + | or Value Too Large for DEST Format | * |
|  | NaN | * |

## Operation

```text
DEST := BCD(ST(0));
PopRegisterStack;

FPU Flags Affected

C1                   Set to 0 if stack underflow occurred.

                     Set if result was rounded up; cleared otherwise.

C0, C2, C3           Undefined.
```

## Floating-Point Exceptions

```text
#IS     Stack underflow occurred.
```

```text
#IA     Converted value that exceeds 18 BCD digits in length.
```

Source operand is an SNaN, QNaN, +/-, or in an unsupported format.

```text
#P      Value cannot be represented exactly in destination format.
```
