---
summary: Sine and Cosine
---

## Description

Computes both the approximate sine and the cosine of the source operand in register ST(0), stores the sine in ST(0), and pushes the cosine onto the top of the FPU register stack. (This instruction is faster than executing the FSIN and FCOS instructions in succession.)

The source operand must be given in radians and must be within the range -263 to +263. The following table shows the results obtained when taking the sine and cosine of various classes of numbers, assuming that underflow does not occur.

**FSINCOS Results**

| ST(0) | ST(1) Cosine | ST(0) Sine |
| --- | --- | --- |
| - | * | * |
| -F | - 1 to + 1 | - 1 to + 1 |
| -0 | +1 | -0 |
| +0 | +1 | +0 |
| +F | - 1 to + 1 | - 1 to + 1 |
| + | * | * |
| NaN | NaN | NaN |

## Operation

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          TEMP := fcos(ST(0)); // approximation of cosine
          ST(0) := fsin(ST(0)); // approximation of sine
          TOP := TOP - 1;
          ST(0) := TEMP;
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred; set to 1 of stack overflow occurs.

                          Set if result was rounded up; cleared otherwise.

C2                        Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                    Undefined.
```

## Floating-Point Exceptions

```text
#IS                       Stack underflow or overflow occurred.
```

```text
#IA                       Source operand is an SNaN value, , or unsupported format.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
