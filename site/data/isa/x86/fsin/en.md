---
summary: Sine
---

## Description

Computes an approximation of the sine of the source operand in register ST(0) and stores the result in ST(0). The source operand must be given in radians and must be within the range -263 to +263. The following table shows the

results obtained when taking the sine of various classes of numbers, assuming that underflow does not occur.

**FSIN Results**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | - 1 to + 1 |
| -0 | -0 |
| +0 | +0 |
| +F | - 1 to +1 |
| + | * |
| NaN | NaN |

## Operation

```text
IF -263 < ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fsin(ST(0)); // approximation of the mathematical sin function
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C2                  Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3              Undefined.
```

## Floating-Point Exceptions

```text
#IS         Stack underflow occurred.
```

```text
#IA         Source operand is an SNaN value, , or unsupported format.
```

```text
#D          Source operand is a denormal value.
```

```text
#P          Value cannot be represented exactly in destination format.
```
