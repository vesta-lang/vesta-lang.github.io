---
summary: Divide
---

## Description

Divides the destination operand by the source operand and stores the result in the destination location. The destination operand (dividend) is always in an FPU register; the source operand (divisor) can be a register or a memory location. Source operands in memory can be in single precision or double precision floating-point format, word or doubleword integer format.

The no-operand version of the instruction divides the contents of the ST(1) register by the contents of the ST(0) register. The one-operand version divides the contents of the ST(0) register by the contents of a memory location (either a floating-point or an integer value). The two-operand version, divides the contents of the ST(0) register by the contents of the ST(i) register or vice versa.

The FDIVP instructions perform the additional operation of popping the FPU register stack after storing the result. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. The no-operand version of the floating-point divide instructions always results in the register stack being popped. In some assemblers, the mnemonic for this instruction is FDIV rather than FDIVP.

The FIDIV instructions convert an integer source operand to double extended-precision floating-point format before performing the division. When the source operand is an integer 0, it is treated as a +0.

If an unmasked divide-by-zero exception (#Z) is generated, no result is stored; if the exception is masked, an  of the appropriate sign is stored in the destination operand.

The following table shows the results obtained when dividing various classes of numbers, assuming that neither overflow nor underflow occurs.

**FDIV/FDIVP/FIDIV Results**

| - | * | +0 | +0 | -0 | -0 | * | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F | + | +F | +0 | -0 | -F | - | NaN |
| -I | + | +F | +0 | -0 | -F | - | NaN |
| -0 | + | ** | * | * | ** | - | NaN |
| +0 | - | ** | * | * | ** | + | NaN |
| +I | - | -F | -0 | +0 | +F | + | NaN |
| +F | - | -F | -0 | +0 | +F | + | NaN |
| + | * | -0 | -0 | +0 | +0 | * | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

## Operation

```text
IF SRC = 0

    THEN
          #Z;

    ELSE
          IF Instruction is FIDIV
                THEN
                      DEST := DEST / ConvertToDoubleExtendedPrecisionFP(SRC);
                ELSE (* Source operand is floating-point value *)
                      DEST := DEST / SRC;
          FI;

FI;

IF Instruction = FDIVP

    THEN
          PopRegisterStack;

FI;

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
#IA                       Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D                        Source is a denormal value.
```

```text
#Z                        DEST / +/-0, where DEST is not equal to +/-0.
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
