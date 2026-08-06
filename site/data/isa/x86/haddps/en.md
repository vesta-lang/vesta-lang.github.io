---
summary: Packed Single Precision Floating-Point Horizontal Add
---

## Description

Adds the single precision floating-point values in the first and second dwords of the destination operand and stores the result in the first dword of the destination operand.

Adds single precision floating-point values in the third and fourth dword of the destination operand and stores the result in the second dword of the destination operand.

Adds single precision floating-point values in the first and second dword of the source operand and stores the result in the third dword of the destination operand.

Adds single precision floating-point values in the third and fourth dword of the source operand and stores the result in the fourth dword of the destination operand.

In 64-bit mode, use of the REX.R prefix permits this instruction to access additional registers (XMM8-XMM15).

See Figure 3-14 for HADDPS; see Figure 3-15 for VHADDPS.

HADDPS xmm1, xmm2/m128

[127:96]             [95:64]                                       [63:32]        [31:0]      xmm2/ m128

[127:96]             [95:64]                                       [63:32]        [31:0]      xmm1

xmm2/m128           xmm2/m128                                xmm1[95:64] +  xmm1[31:0] +    RESULT: [95:64] + xmm2/      [31:0] + xmm2/                            xmm1[127:96]   xmm1[63:32]     xmm1 m128[127:96]         m128[63:32]

[127:96]             [95:64]                                       [63:32]        [31:0]

OM15994

Figure 3-14. HADDPS--Packed Single Precision Floating-Point Horizontal Add

SRC1 X7          X6  X5                                        X4  X3         X2          X1  X0

SRC2 Y7          Y6  Y5                                        Y4  Y3         Y2          Y1  Y0

DEST Y6+Y7 Y4+Y5 X6+X7 X4+X5 Y2+Y3 Y0+Y1 X2+X3 X0+X1

Figure 3-15. VHADDPS Operation

128-bit Legacy SSE version: The second source can be an XMM register or an 128-bit memory location. The destination is not distinct from the first source XMM register and the upper bits (MAXVL-1:128) of the corresponding YMM register destination are unmodified. VEX.128 encoded version: the first source operand is an XMM register or 128-bit memory location. The destination operand is an XMM register. The upper bits (MAXVL-1:128) of the corresponding YMM register destination are zeroed. VEX.256 encoded version: The first source operand is a YMM register. The second source operand can be a YMM register or a 256-bit memory location. The destination operand is a YMM register.

## Operation

```text
HADDPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[63:32] + SRC1[31:0]
DEST[63:32] := SRC1[127:96] + SRC1[95:64]
DEST[95:64] := SRC2[63:32] + SRC2[31:0]
DEST[127:96] := SRC2[127:96] + SRC2[95:64]
DEST[MAXVL-1:128] (Unmodified)

VHADDPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[63:32] + SRC1[31:0]
DEST[63:32] := SRC1[127:96] + SRC1[95:64]
DEST[95:64] := SRC2[63:32] + SRC2[31:0]
DEST[127:96] := SRC2[127:96] + SRC2[95:64]
DEST[MAXVL-1:128] := 0

VHADDPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[63:32] + SRC1[31:0]
DEST[63:32] := SRC1[127:96] + SRC1[95:64]
DEST[95:64] := SRC2[63:32] + SRC2[31:0]
DEST[127:96] := SRC2[127:96] + SRC2[95:64]
DEST[159:128] := SRC1[191:160] + SRC1[159:128]
DEST[191:160] := SRC1[255:224] + SRC1[223:192]
DEST[223:192] := SRC2[191:160] + SRC2[159:128]
DEST[255:224] := SRC2[255:224] + SRC2[223:192]
```

## Intel C/C++ compiler intrinsics

```c
HADDPS __m128 _mm_hadd_ps (__m128 a, __m128 b);
VHADDPS __m256 _mm256_hadd_ps (__m256 a, __m256 b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## Numeric Exceptions

Overflow, Underflow, Invalid, Precision, Denormal.

## Other Exceptions

See Table 2-19, "Type 2 Class Exception Conditions."
