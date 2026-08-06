---
summary: 将已包装的 FP16 值转换为已签名的单词整数
---

## 说明

本指令将源操作数中包装的FP16值转换为目标操作数中签名的单词整数.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入. 如果转换后的结果不能以目的格式表示,则提高 浮点 无效例外,如果掩盖了这个例外,则返回无限期整数值 8000H.

目的地元素根据写掩码更新.

## 行动

```text
VCVTPH2W DEST, SRC
VL = 128, 256 or 512
KL := VL / 16

IF *SRC is a register* and (VL = 512) and (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE:
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp16[0]
          ELSE
                tsrc := SRC.fp16[j]
          DEST.word[j] := Convert_fp16_to_integer16(tsrc)
    ELSE IF *zeroing*:
          DEST.word[j] := 0
    // else dest.word[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTPH2W __m512i _mm512_cvt_roundph_epi16 (__m512h a, int rounding);
VCVTPH2W __m512i _mm512_mask_cvt_roundph_epi16 (__m512i src, __mmask32 k, __m512h a, int rounding);
VCVTPH2W __m512i _mm512_maskz_cvt_roundph_epi16 (__mmask32 k, __m512h a, int rounding);
VCVTPH2W __m128i _mm_cvtph_epi16 (__m128h a);
VCVTPH2W __m128i _mm_mask_cvtph_epi16 (__m128i src, __mmask8 k, __m128h a);
VCVTPH2W __m128i _mm_maskz_cvtph_epi16 (__mmask8 k, __m128h a);
VCVTPH2W __m256i _mm256_cvtph_epi16 (__m256h a);
VCVTPH2W __m256i _mm256_mask_cvtph_epi16 (__m256i src, __mmask16 k, __m256h a);
VCVTPH2W __m256i _mm256_maskz_cvtph_epi16 (__mmask16 k, __m256h a);
VCVTPH2W __m512i _mm512_cvtph_epi16 (__m512h a);
VCVTPH2W __m512i _mm512_mask_cvtph_epi16 (__m512i src, __mmask32 k, __m512h a);
VCVTPH2W __m512i _mm512_maskz_cvtph_epi16 (__mmask32 k, __m512h a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
