---
summary: BF16配对的点产品
---

## 说明

本规范执行两个BF16对的SIMD点产物,并累积成一个装箱的单精密寄存器.

在进行FMA的每次堆积时,使用"径向最近的偶数"四舍五入模式. 输出异常常被冲到零,输入异常常被作为零处理. MXCSR不咨询也不更新.

NaN的传播重点见表5-4。

NaN优先说明表5-4。 NaN 宣传优先事项

```text
       1      src1 low is NaN        Comments
       2      src2 low is NaN        Lower part has priority over upper part, i.e., it overrides the upper part.
       3      src1 high is NaN
       4      src2 high is NaN       Upper part may be overridden if lower has NaN.
       5      srcdest is NaN         Dest is propagated if no NaN is encountered by src2.
```

## 行动

```text
Define make_fp32(x):
    // The x parameter is bfloat16. Pack it in to upper 16b of a dword. The bit pattern is a legal fp32 value. Return that bit pattern.
    dword := 0
    dword[31:16] := x
    RETURN dword


VDPBF16PS srcdest, src1, src2
VL = (128, 256, 512)
KL = VL/32

origdest := srcdest
FOR i := 0 to KL-1:

    IF k1[ i ] or *no writemask*:
          IF src2 is memory and evex.b == 1:
               t := src2.dword[0]
          ELSE:
               t := src2.dword[ i ]

          // FP32 FMA with daz in, ftz out and RNE rounding. MXCSR neither consulted nor updated.

          srcdest.fp32[ i ] += make_fp32(src1.bfloat16[2*i+1]) * make_fp32(t.bfloat[1])
          srcdest.fp32[ i ] += make_fp32(src1.bfloat16[2*i+0]) * make_fp32(t.bfloat[0])

    ELSE IF *zeroing*:
         srcdest.dword[ i ] := 0

    ELSE: // merge masking, dest element unchanged
         srcdest.dword[ i ] := origdest.dword[ i ]

srcdest[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VDPBF16PS __m128 _mm_dpbf16_ps(__m128, __m128bh, __m128bh);
VDPBF16PS __m128 _mm_mask_dpbf16_ps( __m128, __mmask8, __m128bh, __m128bh);
VDPBF16PS __m128 _mm_maskz_dpbf16_ps(__mmask8, __m128, __m128bh, __m128bh);
VDPBF16PS __m256 _mm256_dpbf16_ps(__m256, __m256bh, __m256bh);
VDPBF16PS __m256 _mm256_mask_dpbf16_ps(__m256, __mmask8, __m256bh, __m256bh);
VDPBF16PS __m256 _mm256_maskz_dpbf16_ps(__mmask8, __m256, __m256bh, __m256bh);
VDPBF16PS __m512 _mm512_dpbf16_ps(__m512, __m512bh, __m512bh);
VDPBF16PS __m512 _mm512_mask_dpbf16_ps(__m512, __mmask16, __m512bh, __m512bh);
VDPBF16PS __m512 _mm512_maskz_dpbf16_ps(__mmask16, __m512, __m512bh, __m512bh);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
