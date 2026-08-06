---
summary: Convert Packed Single Data to Packed BF16 Data
---

## Description

This instruction loads packed FP32 elements from a SIMD register or memory, converts the elements to BF16, and writes the result to the destination SIMD register.

The upper bits of the destination register beyond the down-converted BF16 elements are zeroed.

This instruction uses "Round to nearest (even)" rounding mode. Output denormals are always flushed to zero and input denormals are always treated as zero. MXCSR is not consulted nor updated.

As the instruction operand encoding table shows, the EVEX.vvvv field is not used for encoding an operand. EVEX.vvvv is reserved and must be 0b1111 otherwise instructions will #UD.

## Operation

```text
Define convert_fp32_to_bfloat16(x):
    IF x is zero or denormal:
         dest[15] := x[31] // sign preserving zero (denormal go to zero)
         dest[14:0] := 0
    ELSE IF x is infinity:
         dest[15:0] := x[31:16]
    ELSE IF x is NAN:
         dest[15:0] := x[31:16] // truncate and set MSB of the mantissa to force QNAN
         dest[6] := 1
    ELSE // normal number
         LSB := x[16]
         rounding_bias := 0x00007FFF + LSB
         temp[31:0] := x[31:0] + rounding_bias // integer add
         dest[15:0] := temp[31:16]
    RETURN dest


VCVTNEPS2BF16 dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/16

FOR i := 0 to KL/2-1:
    t := src.fp32[i]
    dest.word[i] := convert_fp32_to_bfloat16(t)

DEST[MAXVL-1:VL/2] := 0

VCVTNEPS2BF16 dest, src (EVEX encoded version)
VL = (128, 256, 512)
KL = VL/16

origdest := dest
FOR i := 0 to KL/2-1:

    IF k1[ i ] or *no writemask*:
          IF src is memory and evex.b == 1:
               t := src.fp32[0]
          ELSE:
               t := src.fp32[ i ]

         dest.word[i] := convert_fp32_to_bfloat16(t)

    ELSE IF *zeroing*:
         dest.word[ i ] := 0

    ELSE: // Merge masking, dest element unchanged
         dest.word[ i ] := origdest.word[ i ]

DEST[MAXVL-1:VL/2] := 0
```

## Intel C/C++ compiler intrinsics

```c
VCVTNEPS2BF16 __m128bh _mm_cvtneps_avx_pbh (__m128 __A);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_avx_pbh (__m256 __A);
VCVTNEPS2BF16 __m128bh _mm_cvtneps_pbh (__m128 a);
VCVTNEPS2BF16 __m128bh _mm_cvtneps_pbh (__m128 __A);
VCVTNEPS2BF16 __m128bh _mm_mask_cvtneps_pbh (__m128bh src, __mmask8 k, __m128 a);
VCVTNEPS2BF16 __m128bh _mm_maskz_cvtneps_pbh (__mmask8 k, __m128 a);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_pbh (__m256 a);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_pbh (__m256 __A);
VCVTNEPS2BF16 __m128bh _mm256_mask_cvtneps_pbh (__m128bh src, __mmask8 k, __m256 a);
VCVTNEPS2BF16 __m128bh _mm256_maskz_cvtneps_pbh (__mmask8 k, __m256 a);
VCVTNEPS2BF16 __m256bh _mm512_cvtneps_pbh (__m512 a);
VCVTNEPS2BF16 __m256bh _mm512_mask_cvtneps_pbh (__m256bh src, __mmask16 k, __m512 a);
VCVTNEPS2BF16 __m256bh _mm512_maskz_cvtneps_pbh (__mmask16 k, __m512 a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

VEX-encoded instructions, see Table 2-21, "Type 4 Class Exception Conditions." EVEX-encoded instructions, see Table 2-51, "Type E4 Class Exception Conditions."
