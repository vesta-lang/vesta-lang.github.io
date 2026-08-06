---
summary: Move Packed Single Precision Floating-Point Values High to Low
---

## Description

This instruction cannot be used for memory to register moves.

128-bit two-argument form:

Moves two packed single precision floating-point values from the high quadword of the second XMM argument (second operand) to the low quadword of the first XMM register (first argument). The quadword at bits 127:64 of the destination operand is left unchanged. Bits (MAXVL-1:128) of the corresponding destination register remain unchanged.

128-bit and EVEX three-argument form:

Moves two packed single precision floating-point values from the high quadword of the third XMM argument (third operand) to the low quadword of the destination (first operand). Copies the high quadword from the second XMM argument (second operand) to the high quadword of the destination (first operand). Bits (MAXVL-1:128) of the corresponding destination register are zeroed.

If VMOVHLPS is encoded with VEX.L or EVEX.L'L= 1, an attempt to execute the instruction encoded with VEX.L or EVEX.L'L= 1 will cause an #UD exception.

## Operation

```text
MOVHLPS (128-bit Two-Argument Form)
DEST[63:0] := SRC[127:64]
DEST[MAXVL-1:64] (Unmodified)

VMOVHLPS (128-bit Three-Argument Form - VEX & EVEX)
DEST[63:0] := SRC2[127:64]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
MOVHLPS __m128 _mm_movehl_ps(__m128 a, __m128 b);
```

## SIMD Floating-Point Exceptions

None.

1. ModRM.MOD = 011B required.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-24, "Type 7 Class Exception Conditions," additionally:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded instruction, see Exceptions Type E7NM.128 in Table 2-57, "Type E7NM Class Exception Conditions."
