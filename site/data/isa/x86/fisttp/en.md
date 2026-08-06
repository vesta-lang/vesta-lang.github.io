---
summary: Store Integer With Truncation
---

## Description

FISTTP converts the value in ST into a signed integer using truncation (chop) as rounding mode, transfers the result to the destination, and pop ST. FISTTP accepts word, short integer, and long integer destinations.

The following table shows the results obtained when storing various classes of numbers in integer format.

**FISTTP Results**

| - | or | Value Too Large for DEST Format | * |
| --- | --- | --- | --- |
| F | -1 |  | -I |
| -1<F< | +1 |  | 0 |
| FS+ 1 |  |  | +I |

## Operation

```text
DEST := ST;
pop ST;
```

## Flags affected

C1 is cleared; C0, C2, C3 undefined.

## Numeric Exceptions

Invalid, Stack Invalid (stack underflow), Precision.
