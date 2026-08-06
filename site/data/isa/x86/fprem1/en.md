---
summary: Partial Remainder
---

## Description

Computes the IEEE remainder obtained from dividing the value in the ST(0) register (the dividend) by the value in the ST(1) register (the divisor or modulus), and stores the result in ST(0). The remainder represents the following value:

```text
Remainder := ST(0) - (Q  ST(1))
```

Here, Q is an integer value that is obtained by rounding the floating-point number quotient of [ST(0) / ST(1)] toward the nearest integer value. The magnitude of the remainder is less than or equal to half the magnitude of the modulus, unless a partial remainder was computed (as described below).

This instruction produces an exact result; the precision (inexact) exception does not occur and the rounding control has no effect. The following table shows the results obtained when computing the remainder of various classes of numbers, assuming that underflow does not occur.

**FPREM1 Results**

| ST(0) | -F | ST(0) | +/-F or -0 | * | * | +/- F or - 0 | ST(0) | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0                   * | * | -0 | -0 | NaN |  |
|  | +0 | +0 | +0                   * | * | +0 | +0 | NaN |  |
|  | +F | ST(0) | +/- F or + 0 | * | * | +/- F or + 0 | ST(0) | NaN |
|  | + | * | *                    * | * | * | * | NaN |  |

## Operation

```text
D := exponent(ST(0))  exponent(ST(1));

IF D < 64
    THEN
          Q := Integer(RoundTowardNearestInteger(ST(0) / ST(1)));
          ST(0) := ST(0)  (ST(1)  Q);
          C2 := 0;
          C0, C3, C1 := LeastSignificantBits(Q); (* Q2, Q1, Q0 *)
    ELSE
          C2 := 1;
          N := An implementation-dependent number between 32 and 63;
          QQ := Integer(TruncateTowardZero((ST(0) / ST(1)) / 2(D - N)));
          ST(0) := ST(0)  (ST(1)  QQ  2(D - N));

FI;

FPU Flags Affected

C0                  Set to bit 2 (Q2) of the quotient.

C1                  Set to 0 if stack underflow occurred; otherwise, set to least significant bit of quotient (Q0).

C2                  Set to 0 if reduction complete; set to 1 if incomplete.

C3                  Set to bit 1 (Q1) of the quotient.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value, modulus (divisor) is 0, dividend is , or unsupported
```

format.

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```
