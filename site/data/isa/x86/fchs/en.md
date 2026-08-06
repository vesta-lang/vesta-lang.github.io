---
summary: Change Sign
---

## Description

Complements the sign bit of ST(0). This operation changes a positive value into a negative value of equal magnitude or vice versa. The following table shows the results obtained when changing the sign of various classes of numbers.

**FCHS Results**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| + |  |
| +F |  |
| +0 |  |
| -0 |  |
| -F |  |
| - |  |
| NaN |  |

## Operation

```text
SignBit(ST(0)) := NOT (SignBit(ST(0)));

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```
