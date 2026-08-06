---
summary: Partial Tangent
---

## Description

Computes the approximate tangent of the source operand in register ST(0), stores the result in ST(0), and pushes a 1.0 onto the FPU register stack. The source operand must be given in radians and must be less than +/-263. The

following table shows the unmasked results obtained when computing the partial tangent of various classes of

numbers, assuming that underflow does not occur.

**FPTAN Results**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - | * |
| -F | - F to + F |
| -0 | -0 |
| +0 | +0 |
| +F | - F to + F |
| + | * |
| NaN | NaN |

## Operation

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fptan(ST(0)); // approximation of tan
          TOP := TOP - 1;
          ST(0) := 1.0;
    ELSE (* Source operand is out-of-range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred; set to 1 if stack overflow occurred.

                        Set if result was rounded up; cleared otherwise.

C2                      Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                  Undefined.
```

## Floating-Point Exceptions

```text
#IS                     Stack underflow or overflow occurred.
```

```text
#IA                     Source operand is an SNaN value, , or unsupported format.
```

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
