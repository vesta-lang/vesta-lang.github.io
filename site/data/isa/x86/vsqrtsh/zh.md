---
summary: 计算 标量 FP16 值的平方根
---

## 说明

本指令在 源操作数 上执行 标量 FP16 平方根计算,并存储 FP16 的结果为 目标操作数 。 目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

## 行动

```text
VSQRTSH dest{k1}, src1, src2
IF k1[0] or *no writemask*:

    DEST.fp16[0] := SQRT(src2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VSQRTSH __m128h _mm_mask_sqrt_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, const int rounding);
VSQRTSH __m128h _mm_maskz_sqrt_round_sh (__mmask8 k, __m128h a, __m128h b, const int rounding);
VSQRTSH __m128h _mm_sqrt_round_sh (__m128h a, __m128h b, const int rounding);
VSQRTSH __m128h _mm_mask_sqrt_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VSQRTSH __m128h _mm_maskz_sqrt_sh (__mmask8 k, __m128h a, __m128h b);
VSQRTSH __m128h _mm_sqrt_sh (__m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Precision, Denormal

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
