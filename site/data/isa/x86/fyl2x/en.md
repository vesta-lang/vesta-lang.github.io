---
summary: Compute y  log2x
---

## Description

Computes (ST(1)  log2 (ST(0))), stores the result in register ST(1), and pops the FPU register stack. The source operand in ST(0) must be a non-zero positive number.

The following table shows the results obtained when taking the log of various classes of numbers, assuming that neither overflow nor underflow occurs.

**FYL2X Results**

| ST(1) | -F | * | * | ** | +F | -0 | -F | - | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | * | * | * | +0 | -0 | -0 | * | NaN |
|  | +0 | * | * | * | -0 | +0 | +0 | * | NaN |
|  | +F | * | * | ** | -F | +0 | +F | + | NaN |
|  | + | * | * | - | - | * | + | + | NaN |

## Operation

```text
ST(1) := ST(1)  log2ST(0);
PopRegisterStack;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

                          Set if result was rounded up; cleared otherwise.

C0, C2, C3                Undefined.
```

## Floating-Point Exceptions

```text
#IS                       Stack underflow occurred.
```

```text
#IA                       Either operand is an SNaN or unsupported format.
```

Source operand in register ST(0) is a negative finite value (not -0).

```text
#Z                        Source operand in register ST(0) is +/-0.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```

```text
#O                        Result is too large for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
