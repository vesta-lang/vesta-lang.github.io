---
summary: Packed Double Precision Floating-Point Horizontal Subtract
---

## Description

The HSUBPD instruction subtracts horizontally the packed double precision floating-point numbers of both operands.

Subtracts the double precision floating-point value in the high quadword of the destination operand from the low quadword of the destination operand and stores the result in the low quadword of the destination operand.

Subtracts the double precision floating-point value in the high quadword of the source operand from the low quadword of the source operand and stores the result in the high quadword of the destination operand.

In 64-bit mode, use of the REX.R prefix permits this instruction to access additional registers (XMM8-XMM15).

See Figure 3-16 for HSUBPD; see Figure 3-17 for VHSUBPD.

HSUBPD xmm1, xmm2/m128

```text
                               [127:64]                             [63:0]                     xmm2
```

/m128

```text
                               [127:64]                             [63:0]                     xmm1
```

```text
                               xmm2/m128[63:0] -                    xmm1[63:0] - xmm1[127:64]  Result:
                               xmm2/m128[127:64]                                    [63:0]     xmm1
```

[127:64]

OM15995

Figure 3-16. HSUBPD--Packed Double Precision Floating-Point Horizontal Subtract

SRC1  X3           X2                                                   X1       X0

```text
                   Y2                                                   Y1       Y0
```

SRC2  Y3       X2 - X3                                              Y0 - Y1  X0 - X1

DEST  Y2 - Y3

Figure 3-17. VHSUBPD operation

128-bit Legacy SSE version: The second source can be an XMM register or an 128-bit memory location. The destination is not distinct from the first source XMM register and the upper bits (MAXVL-1:128) of the corresponding YMM register destination are unmodified.

VEX.128 encoded version: the first source operand is an XMM register or 128-bit memory location. The destination operand is an XMM register. The upper bits (MAXVL-1:128) of the corresponding YMM register destination are zeroed.

VEX.256 encoded version: The first source operand is a YMM register. The second source operand can be a YMM register or a 256-bit memory location. The destination operand is a YMM register.

## Operation

```text
HSUBPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] (Unmodified)

VHSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] := 0

VHSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC1[255:192]
DEST[255:192] := SRC2[191:128] - SRC2[255:192]
```

## Intel C/C++ compiler intrinsics

```c
HSUBPD __m128d _mm_hsub_pd(__m128d a, __m128d b) VHSUBPD __m256d _mm256_hsub_pd (__m256d a, __m256d b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## Numeric Exceptions

Overflow, Underflow, Invalid, Precision, Denormal.

## Other Exceptions

See Table 2-19, "Type 2 Class Exception Conditions."
