---
summary: Load Floating-Point Value
---

## Description

Pushes the source operand onto the FPU register stack. The source operand can be in single precision, double precision, or double extended-precision floating-point format. If the source operand is in single precision or double precision floating-point format, it is automatically converted to the double extended-precision floating-point format before being pushed on the stack.

The FLD instruction can also push the value in a selected FPU register [ST(i)] onto the stack. Here, pushing register ST(0) duplicates the stack top.

NOTE

When the FLD instruction loads a denormal value and the DM bit in the CW is not masked, an exception is flagged but the value is still pushed onto the x87 stack.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
IF SRC is ST(i)
    THEN
          temp := ST(i);

FI;

TOP := TOP - 1;

IF SRC is memory-operand
    THEN
          ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);
    ELSE (* SRC is ST(i) *)
          ST(0) := temp;

FI;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack underflow or overflow occurred.
```

```text
#IA                 Source operand is an SNaN. Does not occur if the source operand is in double extended-preci-
```

sion floating-point format (FLD m80fp or FLD ST(i)).

```text
#D                  Source operand is a denormal value. Does not occur if the source operand is in double
```

extended-precision floating-point format.

## Description

Push one of seven commonly used constants (in double extended-precision floating-point format) onto the FPU register stack. The constants that can be loaded with these instructions include +1.0, +0.0, log210, log2e, , log102, and loge2. For each constant, an internal 66-bit constant is rounded (as specified by the RC field in the FPU control word) to double extended-precision floating-point format. The inexact-result exception (#P) is not generated as a result of the rounding, nor is the C1 flag set in the x87 FPU status word if the value is rounded up.

See the section titled "Approximation of Pi" in Chapter 8 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for a description of the  constant.

This instruction's operation is the same in non-64-bit modes and 64-bit mode.

## IA-32 architecture compatibility

When the RC field is set to round-to-nearest, the FPU produces the same constants that is produced by the Intel 8087 and Intel 287 math coprocessors.

## Operation

```text
TOP := TOP - 1;

ST(0) := CONSTANT;

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Floating-Point Exceptions

```text
#IS                 Stack overflow occurred.
```
