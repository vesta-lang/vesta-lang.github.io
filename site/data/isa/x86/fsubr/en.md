---
summary: Reverse Subtract
---

## Description

Subtracts the destination operand from the source operand and stores the difference in the destination location. The destination operand is always an FPU register; the source operand can be a register or a memory location. Source operands in memory can be in single precision or double precision floating-point format or in word or doubleword integer format.

These instructions perform the reverse operations of the FSUB, FSUBP, and FISUB instructions. They are provided to support more efficient coding.

The no-operand version of the instruction subtracts the contents of the ST(1) register from the ST(0) register and stores the result in ST(1). The one-operand version subtracts the contents of the ST(0) register from the contents of a memory location (either a floating-point or an integer value) and stores the result in ST(0). The two-operand version, subtracts the contents of the ST(i) register from the ST(0) register or vice versa.

The FSUBRP instructions perform the additional operation of popping the FPU register stack following the subtraction. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. The no-operand version of the floating-point reverse subtract instructions always results in the register stack being popped. In some assemblers, the mnemonic for this instruction is FSUBR rather than FSUBRP.

The FISUBR instructions convert an integer source operand to double extended-precision floating-point format before performing the subtraction.

The following table shows the results obtained when subtracting various classes of numbers from one another, assuming that neither overflow nor underflow occurs. Here, the DEST value is subtracted from the SRC value (SRC - DEST = result).

When the difference between two operands of like sign is 0, the result is +0, except for the round toward - mode, in which case the result is -0. This instruction also guarantees that +0 - (-0) = +0, and that -0 - (+0) = -0. When the source operand is an integer 0, it is treated as a +0.

When one operand is , the result is  of the expected sign. If both operands are  of the same sign, an invalidoperation exception is generated.

**FSUBR/FSUBRP/FISUBR Results**

| - | * | + | + | + | + | + | NaN |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -F         - | +/-F or +/-0 | - | DEST | -DE | ST  +F | + | NaN |
| -0         - | SRC |  | +/-0 | +0 | SRC | + | NaN |
| +0         - | SRC |  | -0 | +/-0 | SRC | + | NaN |
| +F         - |  | -F  -DEST |  | -DEST | +/-F or +/ | -0  + | NaN |
| +          - |  | - | - | - | - | * | NaN |
| NaN        NaN | NaN |  | NaN | NaN | NaN | NaN | NaN |

## Operation

```text
IF Instruction = FISUBR
    THEN

        DEST := ConvertToDoubleExtendedPrecisionFP(SRC) - DEST;

    ELSE (* Source operand is floating-point value *)

        DEST := SRC - DEST; FI;

IF Instruction = FSUBRP
    THEN
          PopRegisterStack; FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Operand is an SNaN value or unsupported format.
```

Operands are infinities of like sign.

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#O                  Result is too large for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
