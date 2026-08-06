---
summary: Store Floating-Point Value
---

## Description

The FST instruction copies the value in the ST(0) register to the destination operand, which can be a memory location or another register in the FPU register stack. When storing the value in memory, the value is converted to single precision or double precision floating-point format.

The FSTP instruction performs the same operation as the FST instruction and then pops the register stack. To pop the register stack, the processor marks the ST(0) register as empty and increments the stack pointer (TOP) by 1. The FSTP instruction can also store values in memory in double extended-precision floating-point format.

If the destination operand is a memory location, the operand specifies the address where the first byte of the destination value is to be stored. If the destination operand is a register, the operand specifies a register in the register stack relative to the top of the stack.

If the destination size is single precision or double precision, the significand of the value being stored is rounded to the width of the destination (according to the rounding mode specified by the RC field of the FPU control word), and the exponent is converted to the width and bias of the destination format. If the value being stored is too large for the destination format, a numeric overflow exception (#O) is generated and, if the exception is unmasked, no value is stored in the destination operand. If the value being stored is a denormal value, the denormal exception (#D) is not generated. This condition is simply signaled as a numeric underflow exception (#U) condition.

If the value being stored is +/-0, +/-, or a NaN, the least-significant bits of the significand and the exponent are truncated to fit the destination format. This operation preserves the value's identity as a 0, , or NaN.

If the destination operand is a non-empty register, the invalid-operation exception is not generated.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
DEST := ST(0);

IF Instruction = FSTP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Indicates rounding direction of if the floating-point inexact exception (#P) is generated: 0 :=
                    not roundup; 1 := roundup.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS     Stack underflow occurred.
```

```text
#IA     If destination result is an SNaN value or unsupported format, except when the destination
```

format is in double extended-precision floating-point format.

```text
#U      Result is too small for the destination format.
```

```text
#O      Result is too large for the destination format.
```

```text
#P      Value cannot be represented exactly in destination format.
```
