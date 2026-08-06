---
summary: Partial Arctangent
---

## Description

Computes the arctangent of the source operand in register ST(1) divided by the source operand in register ST(0), stores the result in ST(1), and pops the FPU register stack. The result in register ST(0) has the same sign as the source operand ST(1) and a magnitude less than +.

The FPATAN instruction returns the angle between the X axis and the line from the origin to the point (X,Y), where Y (the ordinate) is ST(1) and X (the abscissa) is ST(0). The angle depends on the sign of X and Y independently, not just on the sign of the ratio Y/X. This is because a point (-X,Y) is in the second quadrant, resulting in an angle between /2 and , while a point (X,-Y) is in the fourth quadrant, resulting in an angle between 0 and -/2. A point (-X,-Y) is in the third quadrant, giving an angle between -/2 and -.

The following table shows the results obtained when computing the arctangent of various classes of numbers, assuming that underflow does not occur.

**FPATAN Results**

| ST(1) | -F | -p | - to -/2 | -/2 | -/2 | -/2 to -0 | -0 | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -p | -p | -p* | - 0* | -0 | -0 | NaN |
|  | +0 | +p | +p | + * | + 0* | +0 | +0 | NaN |
|  | +F | +p | + to +/2 | + /2 | +/2 | +/2 to +0 | +0 | NaN |
|  | + | +3/4* | +/2 | +/2 | +/2 | + /2 | + /4* | NaN |
|  | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

## IA-32 architecture compatibility

The source operands for this instruction are restricted for the 80287 math coprocessor to the following range: 0  |ST(1)| < |ST(0)| < +

## Operation

```text
ST(1) := arctan(ST(1) / ST(0));
PopRegisterStack;

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

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
