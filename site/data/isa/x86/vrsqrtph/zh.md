---
summary: 计算包装的 FP16 值的平方根对称
---

## 说明

本指令对SIMD在源操作数(第二个操作数)中8/16/32包装的FP16 浮点值的大约对等根进行计算,并将包装的FP16 浮点结果存储在目标操作数中. 此近似的最大相对误差小于2-11+2-14. 特殊情况见表5-36。

目的地元素根据写掩码更新.

** VRSQRTPH/VRSQRTSH 特殊情况**

| 输入值 | 重置值 | 评论 |
| --- | --- | --- |
| 任何异常 | 常规 | 无法生成溢出 |
| X = 2-2n | 2n |  |
| X<0 | QNaN_Indefinite | 包括: |
| X = -0 | - |  |
| X = +0 | + |  |
| X = + | +0 |  |
| VRSQRTPH - 计算对等 | 包装的方根 | FP16 数值 |

## 行动

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

## Intel C/C++ 内在编译器

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

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
