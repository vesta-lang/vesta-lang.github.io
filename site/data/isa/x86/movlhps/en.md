---
summary: Move Packed Single Precision Floating-Point Values Low to High
---

## Description

This instruction cannot be used for memory to register moves.

128-bit two-argument form:

Moves two packed single precision floating-point values from the low quadword of the second XMM argument (second operand) to the high quadword of the first XMM register (first argument). The low quadword of the destination operand is left unchanged. Bits (MAXVL-1:128) of the corresponding destination register are unmodified.

128-bit three-argument forms:

Moves two packed single precision floating-point values from the low quadword of the third XMM argument (third operand) to the high quadword of the destination (first operand). Copies the low quadword from the second XMM argument (second operand) to the low quadword of the destination (first operand). Bits (MAXVL-1:128) of the corresponding destination register are zeroed.

If VMOVLHPS is encoded with VEX.L or EVEX.L'L= 1, an attempt to execute the instruction encoded with VEX.L or EVEX.L'L= 1 will cause an #UD exception.

## Operation

```text
MOVLHPS (128-bit Two-Argument Form)
DEST[63:0] (Unmodified)
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)

VMOVLHPS (128-bit Three-Argument Form - VEX & EVEX)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
MOVLHPS __m128 _mm_movelh_ps(__m128 a, __m128 b);
```

## SIMD Floating-Point Exceptions

None.

1. ModRM.MOD = 011B required

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-24, "Type 7 Class Exception Conditions," additionally:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded instruction, see Exceptions Type E7NM.128 in Table 2-57, "Type E7NM Class Exception Conditions."
