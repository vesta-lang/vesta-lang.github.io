---
summary: 将 标量 FP16 值转换为 FP16 值
---

## 说明

本指令从源操作数(第二个操作数)低词元素的正态化的FP16表示法中提取出偏差的表示法,作为无偏差的签名整数值,或者将输入数据的异常表示法转换为无偏差的负整数值. 无偏差的表示器的整数值被转换成FP16值,并写成目标操作数(第一个操作数)的低词元件,作为FP16数字.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 表5-14列出了输入值的特殊情况。

The formula is:

GETEXP(x) = 地板(log2(Xx|)) 标记地板(x) 代表最大整数不超过实际数字x.

VGETEXPxx和VGETMANTxxx指令的软件使用一般涉及GETEXP操作和GETMANT操作的组合(参见VGETMANTSH). 因此,VGETEXPSH指令对句柄 SIMD 浮点的例外不需要软件.

## 行动

```text
VGETEXPSH dest{k1}, src1, src2
IF k1[0] or *no writemask*:

    DEST.fp16[0] := getexp_fp16(src2.fp16[0]) // see VGETEXPPH
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETEXPSH __m128h _mm_getexp_round_sh (__m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_mask_getexp_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_maskz_getexp_round_sh (__mmask8 k, __m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_getexp_sh (__m128h a, __m128h b);
VGETEXPSH __m128h _mm_mask_getexp_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VGETEXPSH __m128h _mm_maskz_getexp_sh (__mmask8 k, __m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Denormal

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
