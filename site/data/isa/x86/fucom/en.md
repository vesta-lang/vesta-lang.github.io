---
summary: Unordered Compare Floating-Point Values
---

## Description

Performs an unordered comparison of the contents of register ST(0) and ST(i) and sets condition code flags C0, C2, and C3 in the FPU status word according to the results (see the table below). If no operand is specified, the contents of registers ST(0) and ST(1) are compared. The sign of zero is ignored, so that 0.0 is equal to +0.0.

**FUCOM/FUCOMP/FUCOMPP Results**

| Comparison Results* | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| Unordered | 1 | 1 | 1 |

## Operation

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = QNaN, but not SNaN or unsupported format

    THEN
          C3, C2, C0 := 111;

    ELSE (* ST(0) or SRC is SNaN or unsupported format *)
           #IA;

        IF FPUControlWord.IM = 1

                THEN
                      C3, C2, C0 := 111;

          FI;
FI;

IF Instruction = FUCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FUCOMPP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

C0, C2, C3          See Table 3-43.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are SNaN values or have unsupported formats. Detection of a QNaN
```

value in and of itself does not raise an invalid-operand exception.

```text
#D                  One or both operands are denormal values.
```
