---
summary: Store Integer
---

## Description

The FIST instruction converts the value in the ST(0) register to a signed integer and stores the result in the destination operand. Values can be stored in word or doubleword integer format. The destination operand specifies the address where the first byte of the destination value is to be stored.

The FISTP instruction performs the same operation as the FIST instruction and then pops the register stack. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. The FISTP instruction also stores values in quadword integer format.

The following table shows the results obtained when storing various classes of numbers in integer format.

**FIST/FISTP Results**

| - | or Value Too Large for DEST Format | * |
| --- | --- | --- |
|  | F  -1 | -I |
|  | -1 < F < -0 | ** |
|  | -0 | 0 |
|  | +0 | 0 |
|  | +0<F<+1 | ** |
|  | F+1 | +I |
| + | or Value Too Large for DEST Format | * |
|  | NaN | * |

## Operation

```text
DEST := Integer(ST(0));

IF Instruction = FISTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                         Set to 0 if stack underflow occurred.

                           Indicates rounding direction of if the inexact exception (#P) is generated: 0 := not roundup; 1
                           := roundup.

                           Set to 0 otherwise.

C0, C2, C3                 Undefined.
```

## Floating-Point Exceptions

```text
#IS                        Stack underflow occurred.
```

```text
#IA                        Converted value is too large for the destination format.
```

Source operand is an SNaN, QNaN, +/-, or unsupported format.

```text
#P                         Value cannot be represented exactly in destination format.
```
