---
summary: 除以 标量 FP16 值
---

## 说明

本指令将FP16的低值从第一源操作数除以第二源操作数的对应值,存储FP16的结果为目标操作数. 目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

## 行动

```text
VDIVSH (EVEX Encoded Versions)
IF EVEX.b = 1 and SRC2 is a register:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] OR *no writemask*:
    DEST.fp16[0] := SRC1.fp16[0] / SRC2.fp16[0]

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

// else dest.fp16[0] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VDIVSH __m128h _mm_div_round_sh (__m128h a, __m128h b, int rounding);
VDIVSH __m128h _mm_mask_div_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int rounding);
VDIVSH __m128h _mm_maskz_div_round_sh (__mmask8 k, __m128h a, __m128h b, int rounding);
VDIVSH __m128h _mm_div_sh (__m128h a, __m128h b);
VDIVSH __m128h _mm_mask_div_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VDIVSH __m128h _mm_maskz_div_sh (__mmask8 k, __m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal, Zero.

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
