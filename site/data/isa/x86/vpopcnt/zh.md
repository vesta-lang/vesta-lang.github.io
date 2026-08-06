---
summary: 返回 BYTE/WORD/DWORD/QWORD中的位数集数为 1
---

## 说明

本指令计算其来源(如zmm2或内存)中每个字节,单词,dword或qword元素中设置的位数为1,并将结果放入目的地寄存器(zmm1). 本指令支持内存断层抑制.

## 行动

```text
VPOPCNTB
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          DEST.byte[j] := POPCNT(SRC.byte[j])

    ELSE IF *merging-masking*:
          *DEST.byte[j] remains unchanged*

    ELSE:
          DEST.byte[j] := 0

DEST[MAX_VL-1:VL] := 0

VPOPCNTW
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          DEST.word[j] := POPCNT(SRC.word[j])

    ELSE IF *merging-masking*:
          *DEST.word[j] remains unchanged*

    ELSE:
          DEST.word[j] := 0

DEST[MAX_VL-1:VL] := 0

VPOPCNTD
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          IF SRC is broadcast memop:
                t := SRC.dword[0]
          ELSE:
                t := SRC.dword[j]
          DEST.dword[j] := POPCNT(t)

    ELSE IF *merging-masking*:
          *DEST..dword[j] remains unchanged*

    ELSE:
          DEST..dword[j] := 0

DEST[MAX_VL-1:VL] := 0


VPOPCNTQ
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF MaskBit(j) OR *no writemask*:
          IF SRC is broadcast memop:
                t := SRC.qword[0]
          ELSE:
                t := SRC.qword[j]
          DEST.qword[j] := POPCNT(t)

    ELSE IF *merging-masking*:
          *DEST..qword[j] remains unchanged*

    ELSE:
          DEST..qword[j] := 0

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPOPCNTW __m128i _mm_popcnt_epi16(__m128i);
VPOPCNTW __m128i _mm_mask_popcnt_epi16(__m128i, __mmask8, __m128i);
VPOPCNTW __m128i _mm_maskz_popcnt_epi16(__mmask8, __m128i);
VPOPCNTW __m256i _mm256_popcnt_epi16(__m256i);
VPOPCNTW __m256i _mm256_mask_popcnt_epi16(__m256i, __mmask16, __m256i);
VPOPCNTW __m256i _mm256_maskz_popcnt_epi16(__mmask16, __m256i);
VPOPCNTW __m512i _mm512_popcnt_epi16(__m512i);
VPOPCNTW __m512i _mm512_mask_popcnt_epi16(__m512i, __mmask32, __m512i);
VPOPCNTW __m512i _mm512_maskz_popcnt_epi16(__mmask32, __m512i);
VPOPCNTQ __m128i _mm_popcnt_epi64(__m128i);
VPOPCNTQ __m128i _mm_mask_popcnt_epi64(__m128i, __mmask8, __m128i);
VPOPCNTQ __m128i _mm_maskz_popcnt_epi64(__mmask8, __m128i);
VPOPCNTQ __m256i _mm256_popcnt_epi64(__m256i);
VPOPCNTQ __m256i _mm256_mask_popcnt_epi64(__m256i, __mmask8, __m256i);
VPOPCNTQ __m256i _mm256_maskz_popcnt_epi64(__mmask8, __m256i);
VPOPCNTQ __m512i _mm512_popcnt_epi64(__m512i);
VPOPCNTQ __m512i _mm512_mask_popcnt_epi64(__m512i, __mmask8, __m512i);
VPOPCNTQ __m512i _mm512_maskz_popcnt_epi64(__mmask8, __m512i);
VPOPCNTD __m128i _mm_popcnt_epi32(__m128i);
VPOPCNTD __m128i _mm_mask_popcnt_epi32(__m128i, __mmask8, __m128i);
VPOPCNTD __m128i _mm_maskz_popcnt_epi32(__mmask8, __m128i);
VPOPCNTD __m256i _mm256_popcnt_epi32(__m256i);
VPOPCNTD __m256i _mm256_mask_popcnt_epi32(__m256i, __mmask8, __m256i);
VPOPCNTD __m256i _mm256_maskz_popcnt_epi32(__mmask8, __m256i);
VPOPCNTD __m512i _mm512_popcnt_epi32(__m512i);
VPOPCNTD __m512i _mm512_mask_popcnt_epi32(__m512i, __mmask16, __m512i);
VPOPCNTD __m512i _mm512_maskz_popcnt_epi32(__mmask16, __m512i);
VPOPCNTB __m128i _mm_popcnt_epi8(__m128i);
VPOPCNTB __m128i _mm_mask_popcnt_epi8(__m128i, __mmask16, __m128i);
VPOPCNTB __m128i _mm_maskz_popcnt_epi8(__mmask16, __m128i);
VPOPCNTB __m256i _mm256_popcnt_epi8(__m256i);
VPOPCNTB __m256i _mm256_mask_popcnt_epi8(__m256i, __mmask32, __m256i);
VPOPCNTB __m256i _mm256_maskz_popcnt_epi8(__mmask32, __m256i);
VPOPCNTB __m512i _mm512_popcnt_epi8(__m512i);
VPOPCNTB __m512i _mm512_mask_popcnt_epi8(__m512i, __mmask64, __m512i);
VPOPCNTB __m512i _mm512_maskz_popcnt_epi8(__mmask64, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
