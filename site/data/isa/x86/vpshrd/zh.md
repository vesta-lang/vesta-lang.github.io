---
summary: 连接和移动包装的数据右逻辑
---

## 说明

汇总的包装数据,提取结果按恒值向右转移. 本指令支持内存断层抑制.

## 行动

```text
VPSHRDW DEST, SRC2, SRC3, imm8
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          DEST.word[j] := concat(SRC3.word[j], SRC2.word[j]) >> (imm8 & 15)

    ELSE IF *zeroing*:
          DEST.word[j] := 0

    *ELSE DEST.word[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VPSHRDD DEST, SRC2, SRC3, imm8
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1:

    IF SRC3 is broadcast memop:
          tsrc3 := SRC3.dword[0]

    ELSE:
          tsrc3 := SRC3.dword[j]

    IF MaskBit(j) OR *no writemask*:
          DEST.dword[j] := concat(tsrc3, SRC2.dword[j]) >> (imm8 & 31)

    ELSE IF *zeroing*:
          DEST.dword[j] := 0

    *ELSE DEST.dword[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VPSHRDQ DEST, SRC2, SRC3, imm8
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC3 is broadcast memop:
          tsrc3 := SRC3.qword[0]

    ELSE:
          tsrc3 := SRC3.qword[j]

    IF MaskBit(j) OR *no writemask*:
          DEST.qword[j] := concat(tsrc3, SRC2.qword[j]) >> (imm8 & 63)

    ELSE IF *zeroing*:
          DEST.qword[j] := 0

    *ELSE DEST.qword[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSHRDQ __m128i _mm_shrdi_epi64(__m128i, __m128i, int);
VPSHRDQ __m128i _mm_mask_shrdi_epi64(__m128i, __mmask8, __m128i, __m128i, int);
VPSHRDQ __m128i _mm_maskz_shrdi_epi64(__mmask8, __m128i, __m128i, int);
VPSHRDQ __m256i _mm256_shrdi_epi64(__m256i, __m256i, int);
VPSHRDQ __m256i _mm256_mask_shrdi_epi64(__m256i, __mmask8, __m256i, __m256i, int);
VPSHRDQ __m256i _mm256_maskz_shrdi_epi64(__mmask8, __m256i, __m256i, int);
VPSHRDQ __m512i _mm512_shrdi_epi64(__m512i, __m512i, int);
VPSHRDQ __m512i _mm512_mask_shrdi_epi64(__m512i, __mmask8, __m512i, __m512i, int);
VPSHRDQ __m512i _mm512_maskz_shrdi_epi64(__mmask8, __m512i, __m512i, int);
VPSHRDD __m128i _mm_shrdi_epi32(__m128i, __m128i, int);
VPSHRDD __m128i _mm_mask_shrdi_epi32(__m128i, __mmask8, __m128i, __m128i, int);
VPSHRDD __m128i _mm_maskz_shrdi_epi32(__mmask8, __m128i, __m128i, int);
VPSHRDD __m256i _mm256_shrdi_epi32(__m256i, __m256i, int);
VPSHRDD __m256i _mm256_mask_shrdi_epi32(__m256i, __mmask8, __m256i, __m256i, int);
VPSHRDD __m256i _mm256_maskz_shrdi_epi32(__mmask8, __m256i, __m256i, int);
VPSHRDD __m512i _mm512_shrdi_epi32(__m512i, __m512i, int);
VPSHRDD __m512i _mm512_mask_shrdi_epi32(__m512i, __mmask16, __m512i, __m512i, int);
VPSHRDD __m512i _mm512_maskz_shrdi_epi32(__mmask16, __m512i, __m512i, int);
VPSHRDW __m128i _mm_shrdi_epi16(__m128i, __m128i, int);
VPSHRDW __m128i _mm_mask_shrdi_epi16(__m128i, __mmask8, __m128i, __m128i, int);
VPSHRDW __m128i _mm_maskz_shrdi_epi16(__mmask8, __m128i, __m128i, int);
VPSHRDW __m256i _mm256_shrdi_epi16(__m256i, __m256i, int);
VPSHRDW __m256i _mm256_mask_shrdi_epi16(__m256i, __mmask16, __m256i, __m256i, int);
VPSHRDW __m256i _mm256_maskz_shrdi_epi16(__mmask16, __m256i, __m256i, int);
VPSHRDW __m512i _mm512_shrdi_epi16(__m512i, __m512i, int);
VPSHRDW __m512i _mm512_mask_shrdi_epi16(__m512i, __mmask32, __m512i, __m512i, int);
VPSHRDW __m512i _mm512_maskz_shrdi_epi16(__mmask32, __m512i, __m512i, int);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
