---
summary: Cosine
---

## Description

Computes the approximate cosine of the source operand in register ST(0) and stores the result in ST(0). The source operand must be given in radians and must be within the range -263 to +263. The following table shows the

results obtained when taking the cosine of various classes of numbers.

**FCOS Results**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - | * |
| -F | -1 to +1 |
| -0 | +1 |
| +0 | +1 |
| +F | - 1 to + 1 |
| + | * |
| NaN | NaN |

## Operation

```text
IF |ST(0)| < 263
THEN

    C2 := 0;
    ST(0) := FCOS(ST(0)); // approximation of cosine
ELSE (* Source operand is out-of-range *)
    C2 := 1;
FI;


FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

                    Undefined if C2 is 1.

C2                  Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3              Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value, , or unsupported format.
```

```text
#D                  Source is a denormal value.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
