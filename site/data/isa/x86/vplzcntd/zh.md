---
summary: 计算包装词、包装词值的引导零位数
---

## 说明

计算源操作数(第二个操作数)每个词或qword元素中最显著的零位数,并根据写掩码在目的地寄存器中存储结果(第一个操作数). 如果元素为零,则该元素的结果是元素的操作数大小.

EVEX.512 编码版本 : 源操作数是一个ZMM寄存器,512位内存位置,或512位矢量从32/64位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.256 编码版本 : 源操作数是一个YMM的寄存器,256位的内存位置,或由32/64位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 源操作数是一个XMM寄存器,一个128位的内存位置,或者从32/64位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPLZCNTD
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    IF MaskBit(j) OR *no writemask*

          THEN
                temp := 32
                DEST[i+31:i] := 0
                WHILE (temp > 0) AND (SRC[i+temp-1] = 0)
                DO
                      temp := temp  1
                      DEST[i+31:i] := DEST[i+31:i] + 1
                OD

          ELSE
            IF *merging-masking*
                THEN *DEST[i+31:i] remains unchanged*
                ELSE DEST[i+31:i] := 0
            FI

    FI
ENDFOR
DEST[MAXVL-1:VL] := 0

VPLZCNTQ
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j*64
    IF MaskBit(j) OR *no writemask*

          THEN
                temp := 64
                DEST[i+63:i] := 0
                WHILE (temp > 0) AND (SRC[i+temp-1] = 0)
                DO
                      temp := temp  1
                      DEST[i+63:i] := DEST[i+63:i] + 1
                OD

          ELSE
            IF *merging-masking*
                THEN *DEST[i+63:i] remains unchanged*
                ELSE DEST[i+63:i] := 0
            FI

    FI
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPLZCNTD __m512i _mm512_lzcnt_epi32(__m512i a);
VPLZCNTD __m512i _mm512_mask_lzcnt_epi32(__m512i s, __mmask16 m, __m512i a);
VPLZCNTD __m512i _mm512_maskz_lzcnt_epi32( __mmask16 m, __m512i a);
VPLZCNTQ __m512i _mm512_lzcnt_epi64(__m512i a);
VPLZCNTQ __m512i _mm512_mask_lzcnt_epi64(__m512i s, __mmask8 m, __m512i a);
VPLZCNTQ __m512i _mm512_maskz_lzcnt_epi64(__mmask8 m, __m512i a);
VPLZCNTD __m256i _mm256_lzcnt_epi32(__m256i a);
VPLZCNTD __m256i _mm256_mask_lzcnt_epi32(__m256i s, __mmask8 m, __m256i a);
VPLZCNTD __m256i _mm256_maskz_lzcnt_epi32( __mmask8 m, __m256i a);
VPLZCNTQ __m256i _mm256_lzcnt_epi64(__m256i a);
VPLZCNTQ __m256i _mm256_mask_lzcnt_epi64(__m256i s, __mmask8 m, __m256i a);
VPLZCNTQ __m256i _mm256_maskz_lzcnt_epi64(__mmask8 m, __m256i a);
VPLZCNTD __m128i _mm_lzcnt_epi32(__m128i a);
VPLZCNTD __m128i _mm_mask_lzcnt_epi32(__m128i s, __mmask8 m, __m128i a);
VPLZCNTD __m128i _mm_maskz_lzcnt_epi32( __mmask8 m, __m128i a);
VPLZCNTQ __m128i _mm_lzcnt_epi64(__m128i a);
VPLZCNTQ __m128i _mm_mask_lzcnt_epi64(__m128i s, __mmask8 m, __m128i a);
VPLZCNTQ __m128i _mm_maskz_lzcnt_epi64(__mmask8 m, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
