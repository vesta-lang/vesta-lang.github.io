---
summary: Examine Floating-Point
---

## Description

Examines the contents of the ST(0) register and sets the condition code flags C0, C2, and C3 in the FPU status word to indicate the class of value or number in the register (see the table below).

.                                                 Table 3-44. FXAM Results

```text
                         Class                                C3            C2                              C0
```

Unsupported                                                0             0                               0

NaN                                                        0             0                               1

Normal finite number                                       0             1                               0

Infinity                                                   0             1                               1

Zero                                                       1             0                               0

Empty                                                      1             0                               1

Denormal number                                            1             1                               0

The C1 flag is set to the sign of the value in ST(0), regardless of whether the register is empty or full. This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
C1 := sign bit of ST; (* 0 for positive, 1 for negative *)

CASE (class of value or number in ST(0)) OF

    Unsupported:C3, C2, C0 := 000;

    NaN:        C3, C2, C0 := 001;

    Normal:     C3, C2, C0 := 010;

    Infinity:   C3, C2, C0 := 011;

    Zero:       C3, C2, C0 := 100;

    Empty:      C3, C2, C0 := 101;

    Denormal: C3, C2, C0 := 110;

ESAC;

FPU Flags Affected

C1                       Sign of value in ST(0).

C0, C2, C3               See Table 3-44.
```

## Floating-Point Exceptions

None.
