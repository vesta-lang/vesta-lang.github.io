---
summary: Compare Floating-Point Values and Set EFLAGS
---

## Description

Performs an unordered comparison of the contents of registers ST(0) and ST(i) and sets the status flags ZF, PF, and CF in the EFLAGS register according to the results (see the table below). The sign of zero is ignored for comparisons, so that 0.0 is equal to +0.0.

**FCOMI/FCOMIP/ FUCOMI/FUCOMIP Results**

| Comparison Results* | ZF | PF | CF |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| Unordered** | 1 | 1 | 1 |

## IA-32 architecture compatibility

The FCOMI/FCOMIP/FUCOMI/FUCOMIP instructions were introduced to the IA-32 Architecture in the P6 family processors and are not available in earlier IA-32 processors.

FCOMI/FCOMIP/ FUCOMI/FUCOMIP--Compare Floating-Point Values and Set EFLAGS

## Operation

```text
CASE (relation of operands) OF

    ST(0) > ST(i):  ZF, PF, CF := 000;

    ST(0) < ST(i):  ZF, PF, CF := 001;

    ST(0) = ST(i):  ZF, PF, CF := 100;

ESAC;

IF Instruction is FCOMI or FCOMIP
    THEN

        IF ST(0) or ST(i) = NaN or unsupported format

                THEN
                      #IA

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FUCOMI or FUCOMIP
    THEN

        IF ST(0) or ST(i) = QNaN, but not SNaN or unsupported format

                THEN
                      ZF, PF, CF := 111;

                ELSE (* ST(0) or ST(i) is SNaN or unsupported format *)
                       #IA;

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FCOMIP or FUCOMIP
    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Not affected.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 (FCOMI or FCOMIP instruction) One or both operands are NaN values or have unsupported
```

formats.

(FUCOMI or FUCOMIP instruction) One or both operands are SNaN values (but not QNaNs) or have undefined formats. Detection of a QNaN value does not raise an invalid-operand exception.

FCOMI/FCOMIP/ FUCOMI/FUCOMIP--Compare Floating-Point Values and Set EFLAGS
