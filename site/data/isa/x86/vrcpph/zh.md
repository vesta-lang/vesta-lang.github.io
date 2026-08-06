---
summary: 计算包装的 FP16 值的对称
---

## 说明

本指令对源操作数(第二个操作数)中8/16/32包装的FP16值进行SIMD计算,并将包装的FP16结果存储在目标操作数中. 此近似的最大相对误差小于2-11+2-14.

特殊情况见表5-26。

** VRCPPH/VRCPSH 特殊情况**

| 0 | X | 2-16 | INF | 非常小的异常 |
| --- | --- | --- | --- | --- |
| -2- | 16 | X  -0 | -INF | 非常小的异常 |
| X > | + |  | +0 |  |
| X < | - |  | -0 |  |
| X = | 2- | n | 2n |  |
| X = | -2 | -n | -2n |  |

## 行动

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

## Intel C/C++ 内在编译器

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

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
