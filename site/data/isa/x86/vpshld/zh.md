---
summary: 连接和移动数据包左侧逻辑
---

## 说明

复合数据包,提取结果以恒值向左移动. 本指令支持内存断层抑制.

## 行动

```text
VPSHLDW DEST, SRC2, SRC3, imm8
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          tmp := concat(SRC2.word[j], SRC3.word[j]) << (imm8 & 15)
          DEST.word[j] := tmp.word[1]

    ELSE IF *zeroing*:
          DEST.word[j] := 0

    *ELSE DEST.word[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VPSHLDD DEST, SRC2, SRC3, imm8
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1:

    IF SRC3 is broadcast memop:
          tsrc3 := SRC3.dword[0]

    ELSE:
          tsrc3 := SRC3.dword[j]

    IF MaskBit(j) OR *no writemask*:
          tmp := concat(SRC2.dword[j], tsrc3) << (imm8 & 31)
          DEST.dword[j] := tmp.dword[1]

    ELSE IF *zeroing*:
          DEST.dword[j] := 0

    *ELSE DEST.dword[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VPSHLDQ DEST, SRC2, SRC3, imm8
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC3 is broadcast memop:
          tsrc3 := SRC3.qword[0]

    ELSE:
          tsrc3 := SRC3.qword[j]

    IF MaskBit(j) OR *no writemask*:
          tmp := concat(SRC2.qword[j], tsrc3) << (imm8 & 63)
          DEST.qword[j] := tmp.qword[1]

    ELSE IF *zeroing*:
          DEST.qword[j] := 0

    *ELSE DEST.qword[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPSHLDD __m128i _mm_shldi_epi32(__m128i, __m128i, int);
VPSHLDD __m128i _mm_mask_shldi_epi32(__m128i, __mmask8, __m128i, __m128i, int);
VPSHLDD __m128i _mm_maskz_shldi_epi32(__mmask8, __m128i, __m128i, int);
VPSHLDD __m256i _mm256_shldi_epi32(__m256i, __m256i, int);
VPSHLDD __m256i _mm256_mask_shldi_epi32(__m256i, __mmask8, __m256i, __m256i, int);
VPSHLDD __m256i _mm256_maskz_shldi_epi32(__mmask8, __m256i, __m256i, int);
VPSHLDD __m512i _mm512_shldi_epi32(__m512i, __m512i, int);
VPSHLDD __m512i _mm512_mask_shldi_epi32(__m512i, __mmask16, __m512i, __m512i, int);
VPSHLDD __m512i _mm512_maskz_shldi_epi32(__mmask16, __m512i, __m512i, int);
VPSHLDQ __m128i _mm_shldi_epi64(__m128i, __m128i, int);
VPSHLDQ __m128i _mm_mask_shldi_epi64(__m128i, __mmask8, __m128i, __m128i, int);
VPSHLDQ __m128i _mm_maskz_shldi_epi64(__mmask8, __m128i, __m128i, int);
VPSHLDQ __m256i _mm256_shldi_epi64(__m256i, __m256i, int);
VPSHLDQ __m256i _mm256_mask_shldi_epi64(__m256i, __mmask8, __m256i, __m256i, int);
VPSHLDQ __m256i _mm256_maskz_shldi_epi64(__mmask8, __m256i, __m256i, int);
VPSHLDQ __m512i _mm512_shldi_epi64(__m512i, __m512i, int);
VPSHLDQ __m512i _mm512_mask_shldi_epi64(__m512i, __mmask8, __m512i, __m512i, int);
VPSHLDQ __m512i _mm512_maskz_shldi_epi64(__mmask8, __m512i, __m512i, int);
VPSHLDW __m128i _mm_shldi_epi16(__m128i, __m128i, int);
VPSHLDW __m128i _mm_mask_shldi_epi16(__m128i, __mmask8, __m128i, __m128i, int);
VPSHLDW __m128i _mm_maskz_shldi_epi16(__mmask8, __m128i, __m128i, int);
VPSHLDW __m256i _mm256_shldi_epi16(__m256i, __m256i, int);
VPSHLDW __m256i _mm256_mask_shldi_epi16(__m256i, __mmask16, __m256i, __m256i, int);
VPSHLDW __m256i _mm256_maskz_shldi_epi16(__mmask16, __m256i, __m256i, int);
VPSHLDW __m512i _mm512_shldi_epi16(__m512i, __m512i, int);
VPSHLDW __m512i _mm512_mask_shldi_epi16(__m512i, __mmask32, __m512i, __m512i, int);
VPSHLDW __m512i _mm512_maskz_shldi_epi16(__mmask32, __m512i, __m512i, int);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
