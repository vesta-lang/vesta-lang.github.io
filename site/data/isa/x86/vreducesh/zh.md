---
summary: 在 标量 FP16 值上执行还原转换
---

## 说明

本指令对源代码为FP16的低二进制值进行还原转换,并将降级后的二进制FP格式存储到写入mask k1下的目的地操作(第一部)低元素中. 详见VREDUCEPH的描述.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

这一指令最终可能会有一套精确的例外。 然而,对于SPE set(即Sprint Precision,即imm8[3]=1),没有报告精确的例外.

该指示可能产生微小的非零结果。 如果它这样做,它不会报告下流例外,即使下流例外被解码(MXCSR注册的UM旗为0).

特殊情况见表5-28。

## 行动

```text
// see VREDUCEPH

VREDUCESH dest{k1}, src, imm8
IF k1[0] or *no writemask*:

    dest.fp16[0] := reduce_fp16(src2.fp16[0], imm8)
ELSE IF *zeroing*:

    dest.fp16[0] := 0
//else dest.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VREDUCESH __m128h _mm_mask_reduce_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_maskz_reduce_round_sh (__mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_reduce_round_sh (__m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_mask_reduce_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8);
VREDUCESH __m128h _mm_maskz_reduce_sh (__mmask8 k, __m128h a, __m128h b, int imm8);
VREDUCESH __m128h _mm_reduce_sh (__m128h a, __m128h b, int imm8);
```

## SIMD 浮点 例外

无效, 精度 。 如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
