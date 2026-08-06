---
summary: Compute y  log2(x +1)
---

## Description

Computes (ST(1)  log2(ST(0) + 1.0)), stores the result in register ST(1), and pops the FPU register stack. The source operand in ST(0) must be in the range:

```text
     (1  2 / 2) )to(1  2 / 2)
```

The source operand in ST(1) can range from - to +. If the ST(0) operand is outside of its acceptable range, the result is undefined and software should not rely on an exception being generated. Under some circumstances exceptions may be generated when ST(0) is out of range, but this behavior is implementation specific and not guaranteed.

The following table shows the results obtained when taking the log epsilon of various classes of numbers, assuming that underflow does not occur.

**FYL2XP1 Results**

| -(1 - ( | 2 / 2 )) to -0 | -0 | +0 | +0 to +(1 - ( | 2 / 2 )) | NaN |
| --- | --- | --- | --- | --- | --- | --- |
|  | + | * | * | - |  | NaN |
|  | +F | +0 | -0 | -F |  | NaN |
|  | +0 | +0 | -0 | -0 |  | NaN |
|  | -0 | -0 | +0 | +0 |  | NaN |
|  | -F | -0 | +0 | +F |  | NaN |
|  | - | * | * | + |  | NaN |
|  | NaN | NaN | NaN | NaN |  | NaN |

## Operation

```text
ST(1) := ST(1)  log2(ST(0) + 1.0);
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
#IA                 Either operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#O                  Result is too large for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
