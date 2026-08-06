---
summary: Reverse Divide
---

## Description

Divides the source operand by the destination operand and stores the result in the destination location. The destination operand (divisor) is always in an FPU register; the source operand (dividend) can be a register or a memory location. Source operands in memory can be in single precision or double precision floating-point format, word or doubleword integer format.

These instructions perform the reverse operations of the FDIV, FDIVP, and FIDIV instructions. They are provided to support more efficient coding.

The no-operand version of the instruction divides the contents of the ST(0) register by the contents of the ST(1) register. The one-operand version divides the contents of a memory location (either a floating-point or an integer value) by the contents of the ST(0) register. The two-operand version, divides the contents of the ST(i) register by the contents of the ST(0) register or vice versa.

The FDIVRP instructions perform the additional operation of popping the FPU register stack after storing the result. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. The no-operand version of the floating-point divide instructions always results in the register stack being popped. In some assemblers, the mnemonic for this instruction is FDIVR rather than FDIVRP.

The FIDIVR instructions convert an integer source operand to double extended-precision floating-point format before performing the division.

If an unmasked divide-by-zero exception (#Z) is generated, no result is stored; if the exception is masked, an  of the appropriate sign is stored in the destination operand.

The following table shows the results obtained when dividing various classes of numbers, assuming that neither overflow nor underflow occurs.

**FDIVR/FDIVRP/FIDIVR Results**

| SRC | -F | +0 | +F | ** | ** | -F | -0 | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -I | +0 | +F | ** | ** | -F | -0 | NaN |
|  | -0 | +0 | +0 | * | * | -0 | -0 | NaN |
|  | +0 | -0 | -0 | * | * | +0 | +0 | NaN |
|  | +I | -0 | -F | ** | ** | +F | +0 | NaN |
|  | +F | -0 | -F | ** | ** | +F | +0 | NaN |
|  | + | * | - | - | + | + | * | NaN |
|  | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |

## Operation

```text
IF DEST = 0

    THEN
          #Z;

    ELSE

        IF Instruction = FIDIVR

                THEN
                      DEST := ConvertToDoubleExtendedPrecisionFP(SRC) / DEST;

                ELSE (* Source operand is floating-point value *)
                      DEST := SRC / DEST;

          FI;
FI;

IF Instruction = FDIVRP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS     Stack underflow occurred.
```

```text
#IA     Operand is an SNaN value or unsupported format.
```

+/- / +/-; +/-0 / +/-0

```text
#D      Source is a denormal value.
```

```text
#Z      SRC / +/-0, where SRC is not equal to +/-0.
```

```text
#U      Result is too small for destination format.
```

```text
#O      Result is too large for destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
