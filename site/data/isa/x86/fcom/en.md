---
summary: Compare Floating-Point Values
---

## Description

Compares the contents of register ST(0) and source value and sets condition code flags C0, C2, and C3 in the FPU status word according to the results (see the table below). The source operand can be a data register or a memory location. If no source operand is given, the value in ST(0) is compared with the value in ST(1). The sign of zero is ignored, so that 0.0 is equal to +0.0.

**FCOM/FCOMP/FCOMPP Results**

| Condition | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST(0) > SRC | 0 | 0 | 0 |
| ST(0) < SRC | 0 | 0 | 1 |
| ST(0) = SRC | 1 | 0 | 0 |
| Unordered* | 1 | 1 | 1 |

## Operation

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = NaN or unsupported format

    THEN

          #IA

        IF FPUControlWord.IM = 1

                THEN

                      C3, C2, C0 := 111;

          FI;

FI;

IF Instruction = FCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FCOMPP

    THEN
          PopRegisterStack;
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See table on previous page.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are NaN values or have unsupported formats.
```

Register is marked empty.

```text
#D                  One or both operands are denormal values.
```
