---
summary: 将 Low FP16 值转换为 FP32 值
---

## 说明

本指令将第二源操作数中的低FP16元素转换为目标操作数中的低FP32元素.

目标操作数的比特127:32从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

## 行动

```text
VCVTSH2SS dest, src1, src2
IF k1[0] OR *no writemask*:

    DEST.fp32[0] := Convert_fp16_to_fp32(SRC2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp32[0] := 0
// else dest.fp32[0] remains unchanged

DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTSH2SS __m128 _mm_cvt_roundsh_ss (__m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_mask_cvt_roundsh_ss (__m128 src, __mmask8 k, __m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_maskz_cvt_roundsh_ss (__mmask8 k, __m128 a, __m128h b, const int sae);
VCVTSH2SS __m128 _mm_cvtsh_ss (__m128 a, __m128h b);
VCVTSH2SS __m128 _mm_mask_cvtsh_ss (__m128 src, __mmask8 k, __m128 a, __m128h b);
VCVTSH2SS __m128 _mm_maskz_cvtsh_ss (__mmask8 k, __m128 a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
