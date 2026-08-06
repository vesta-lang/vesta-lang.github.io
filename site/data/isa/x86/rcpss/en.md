---
summary: Compute Reciprocal of Scalar Single Precision Floating-Point Values
---

## Description

Computes of an approximate reciprocal of the low single precision floating-point value in the source operand (second operand) and stores the single precision floating-point result in the destination operand. The source operand can be an XMM register or a 32-bit memory location. The destination operand is an XMM register. The three high-order doublewords of the destination operand remain unchanged. See Figure 10-6 in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for an illustration of a scalar single precision floatingpoint operation.

The relative error for this approximation is:

```text
    |Relative Error|  1.5  2-12
```

The RCPSS instruction is not affected by the rounding control bits in the MXCSR register. When a source value is a 0.0, an  of the sign of the source value is returned. A denormal source value is treated as a 0.0 (of the same sign). Tiny results (see Section 4.9.1.5, "Numeric Underflow Exception (#U)" in Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1) are always flushed to 0.0, with the sign of the operand. (Input values greater than or equal to |1.11111111110100000000000B2125| are guaranteed to not produce tiny results; input values less than or equal to |1.00000000000110000000001B*2126| are guaranteed to produce tiny results, which are in turn flushed to 0.0; and input values in between this range may or may not produce tiny results, depending on the implementation.) When a source value is an SNaN or QNaN, the SNaN is converted to a QNaN or the source QNaN is returned.

In 64-bit mode, using a REX prefix in the form of REX.R permits this instruction to access additional registers (XMM8-XMM15).

128-bit Legacy SSE version: The first source operand and the destination operand are the same. Bits (MAXVL- 1:32) of the corresponding YMM destination register remain unchanged.

VEX.128 encoded version: Bits (MAXVL-1:128) of the destination YMM register are zeroed.

## Operation

```text
RCPSS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[MAXVL-1:32] (Unmodified)


VRCPSS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
RCPSS __m128 _mm_rcp_ss(__m128 a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-22, "Type 5 Class Exception Conditions."
