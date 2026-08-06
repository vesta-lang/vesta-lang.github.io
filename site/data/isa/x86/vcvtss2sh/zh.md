---
summary: 将 Low FP32 值转换为 FP16 值
---

## 说明

本指令将 第二源操作数 中的低FP32 值转换为 FP16 中 目标操作数 的低元素值.

当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

## 行动

```text
VCVTSS2SH dest, src1, src2
IF *SRC2 is a register* and (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE:

    SET_RM(MXCSR.RC)

IF k1[0] OR *no writemask*:
    DEST.fp16[0] := Convert_fp32_to_fp16(SRC2.fp32[0])

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

// else dest.fp16[0] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTSS2SH __m128h _mm_cvt_roundss_sh (__m128h a, __m128 b, const int rounding);
VCVTSS2SH __m128h _mm_mask_cvt_roundss_sh (__m128h src, __mmask8 k, __m128h a, __m128 b, const int rounding);
VCVTSS2SH __m128h _mm_maskz_cvt_roundss_sh (__mmask8 k, __m128h a, __m128 b, const int rounding);
VCVTSS2SH __m128h _mm_cvtss_sh (__m128h a, __m128 b);
VCVTSS2SH __m128h _mm_mask_cvtss_sh (__m128h src, __mmask8 k, __m128h a, __m128 b);
VCVTSS2SH __m128h _mm_maskz_cvtss_sh (__mmask8 k, __m128h a, __m128 b);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
