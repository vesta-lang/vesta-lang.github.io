---
summary: Add
---

## Description

Adds the destination and source operands and stores the sum in the destination location. The destination operand is always an FPU register; the source operand can be a register or a memory location. Source operands in memory can be in single precision or double precision floating-point format or in word or doubleword integer format.

The no-operand version of the instruction adds the contents of the ST(0) register to the ST(1) register. The oneoperand version adds the contents of a memory location (either a floating-point or an integer value) to the contents of the ST(0) register. The two-operand version, adds the contents of the ST(0) register to the ST(i) register or vice versa. The value in ST(0) can be doubled by coding:

FADD ST(0), ST(0);

The FADDP instructions perform the additional operation of popping the FPU register stack after storing the result. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. (The no-operand version of the floating-point add instructions always results in the register stack being popped. In some assemblers, the mnemonic for this instruction is FADD rather than FADDP.)

The FIADD instructions convert an integer source operand to double extended-precision floating-point format before performing the addition.

The table on the following page shows the results obtained when adding various classes of numbers, assuming that neither overflow nor underflow occurs.

When the sum of two operands with opposite signs is 0, the result is +0, except for the round toward - mode, in which case the result is -0. When the source operand is an integer 0, it is treated as a +0.

When both operand are infinities of the same sign, the result is  of the expected sign. If both operands are infinities of opposite signs, an invalid-operation exception is generated. See Table 3-20.

**FADD/FADDP/FIADD Results**

| - F or - I | - | -F | SRC | SRC | +/- F or | +/- | 0 | + | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| -0 | - | DEST | -0 | +/-0 | DEST |  | + | Na | N |

## Operation

```text
IF Instruction = FIADD

    THEN
          DEST := DEST + ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)
          DEST := DEST + SRC;

FI;

IF Instruction = FADDP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## Floating-Point Exceptions

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Operand is an SNaN value or unsupported format.
```

Operands are infinities of unlike sign.

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#O                      Result is too large for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
