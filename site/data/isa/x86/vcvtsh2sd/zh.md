---
summary: 将 Low FP16 值转换为 FP64 值
---

## 说明

本指令将第二源操作数中的低FP16元素转换为FP64元素在目标操作数的低元素中.

目标操作数的比特127:64从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP64元素根据写掩码更新.

## 行动

```text
VCVTSH2SD dest, src1, src2
IF k1[0] OR *no writemask*:

    DEST.fp64[0] := Convert_fp16_to_fp64(SRC2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp64[0] := 0
// else dest.fp64[0] remains unchanged

DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTSH2SD __m128d _mm_cvt_roundsh_sd (__m128d a, __m128h b, const int sae);
VCVTSH2SD __m128d _mm_mask_cvt_roundsh_sd (__m128d src, __mmask8 k, __m128d a, __m128h b, const int sae);
VCVTSH2SD __m128d _mm_maskz_cvt_roundsh_sd (__mmask8 k, __m128d a, __m128h b, const int sae);
VCVTSH2SD __m128d _mm_cvtsh_sd (__m128d a, __m128h b);
VCVTSH2SD __m128d _mm_mask_cvtsh_sd (__m128d src, __mmask8 k, __m128d a, __m128h b);
VCVTSH2SD __m128d _mm_maskz_cvtsh_sd (__mmask8 k, __m128d a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
