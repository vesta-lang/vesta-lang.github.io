---
summary: Compute Reciprocals of Packed FP16 Values
---

## Description

This instruction performs a SIMD computation of the approximate reciprocals of 8/16/32 packed FP16 values in the source operand (the second operand) and stores the packed FP16 results in the destination operand. The maximum relative error for this approximation is less than 2-11 + 2-14.

For special cases, see Table 5-26.

**VRCPPH/VRCPSH Special Cases**

| 0 | X | 2-16 | INF | Very small denormal |
| --- | --- | --- | --- | --- |
| -2- | 16 | X  -0 | -INF | Very small denormal |
| X > | + |  | +0 |  |
| X < | - |  | -0 |  |
| X = | 2- | n | 2n |  |
| X = | -2 | -n | -2n |  |

## Operation

```text
VRCPPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := APPROXIMATE(1.0 / tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VRCPPH __m128h _mm_mask_rcp_ph (__m128h src, __mmask8 k, __m128h a);
VRCPPH __m128h _mm_maskz_rcp_ph (__mmask8 k, __m128h a);
VRCPPH __m128h _mm_rcp_ph (__m128h a);
VRCPPH __m256h _mm256_mask_rcp_ph (__m256h src, __mmask16 k, __m256h a);
VRCPPH __m256h _mm256_maskz_rcp_ph (__mmask16 k, __m256h a);
VRCPPH __m256h _mm256_rcp_ph (__m256h a);
VRCPPH __m512h _mm512_mask_rcp_ph (__m512h src, __mmask32 k, __m512h a);
VRCPPH __m512h _mm512_maskz_rcp_ph (__mmask32 k, __m512h a);
VRCPPH __m512h _mm512_rcp_ph (__m512h a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instruction, see Table 2-51, "Type E4 Class Exception Conditions."
