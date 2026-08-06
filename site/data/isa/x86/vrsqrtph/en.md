---
summary: Compute Reciprocals of Square Roots of Packed FP16 Values
---

## Description

This instruction performs a SIMD computation of the approximate reciprocals square-root of 8/16/32 packed FP16 floating-point values in the source operand (the second operand) and stores the packed FP16 floating-point results in the destination operand. The maximum relative error for this approximation is less than 2-11 + 2-14. For special cases, see Table 5-36.

The destination elements are updated according to the writemask.

**VRSQRTPH/VRSQRTSH Special Cases**

| Input value | Reset Value | Comments |
| --- | --- | --- |
| Any denormal | Normal | Cannot generate overflow |
| X = 2-2n | 2n |  |
| X<0 | QNaN_Indefinite | Including - |
| X = -0 | - |  |
| X = +0 | + |  |
| X = + | +0 |  |
| VRSQRTPH--Compute Reciprocals | of Square Roots of Packed | FP16 Values |

## Operation

```text
VRSQRTPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := APPROXIMATE(1.0 / SQRT(tsrc) )
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VRSQRTPH __m128h _mm_mask_rsqrt_ph (__m128h src, __mmask8 k, __m128h a);
VRSQRTPH __m128h _mm_maskz_rsqrt_ph (__mmask8 k, __m128h a);
VRSQRTPH __m128h _mm_rsqrt_ph (__m128h a);
VRSQRTPH __m256h _mm256_mask_rsqrt_ph (__m256h src, __mmask16 k, __m256h a);
VRSQRTPH __m256h _mm256_maskz_rsqrt_ph (__mmask16 k, __m256h a);
VRSQRTPH __m256h _mm256_rsqrt_ph (__m256h a);
VRSQRTPH __m512h _mm512_mask_rsqrt_ph (__m512h src, __mmask32 k, __m512h a);
VRSQRTPH __m512h _mm512_maskz_rsqrt_ph (__mmask32 k, __m512h a);
VRSQRTPH __m512h _mm512_rsqrt_ph (__m512h a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instruction, see Table 2-51, "Type E4 Class Exception Conditions."
