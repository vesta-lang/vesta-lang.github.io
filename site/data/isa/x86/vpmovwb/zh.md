---
summary: 将单词向下转换为字节
---

## 说明

VPMOVWB 向下使用调值将 16 位整数转换成 placked 字节. VPMOVSWB 使用签名饱和度将签名的16位整数转换成已签名的字节. VPMOVUSWB 使用无符号饱和度将无符号字节值转换为无符号字节值.

源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个YMM/XMM/XMM的登记册或256/128/64位内存位置.

向下转换的字节元素从最小的字节写入目标操作数(第一个操作数). 目标操作数的字节元素根据写掩码更新. 注册目的地被清零的位数(MAXVL-1:156/128/64).

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateWordToByte (SRC[m+15:m])

           ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := TruncateWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := SaturateSignedWordToByte (SRC[m+15:m])

           ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;


VPMOVSWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := SaturateSignedWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedWordToByte (SRC[m+15:m])

        ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := SaturateUnsignedWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVUSWB __m256i _mm512_cvtusepi16_epi8(__m512i a);
VPMOVUSWB __m256i _mm512_mask_cvtusepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVUSWB __m256i _mm512_maskz_cvtusepi16_epi8( __mmask32 k, __m512i b);
VPMOVUSWB void _mm512_mask_cvtusepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVSWB __m256i _mm512_cvtsepi16_epi8(__m512i a);
VPMOVSWB __m256i _mm512_mask_cvtsepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVSWB __m256i _mm512_maskz_cvtsepi16_epi8( __mmask32 k, __m512i b);
VPMOVSWB void _mm512_mask_cvtsepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVWB __m256i _mm512_cvtepi16_epi8(__m512i a);
VPMOVWB __m256i _mm512_mask_cvtepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVWB __m256i _mm512_maskz_cvtepi16_epi8( __mmask32 k, __m512i b);
VPMOVWB void _mm512_mask_cvtepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVUSWB __m128i _mm256_cvtusepi16_epi8(__m256i a);
VPMOVUSWB __m128i _mm256_mask_cvtusepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVUSWB __m128i _mm256_maskz_cvtusepi16_epi8( __mmask16 k, __m256i b);
VPMOVUSWB void _mm256_mask_cvtusepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVUSWB __m128i _mm_cvtusepi16_epi8(__m128i a);
VPMOVUSWB __m128i _mm_mask_cvtusepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVUSWB __m128i _mm_maskz_cvtusepi16_epi8( __mmask8 k, __m128i b);
VPMOVUSWB void _mm_mask_cvtusepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVSWB __m128i _mm256_cvtsepi16_epi8(__m256i a);
VPMOVSWB __m128i _mm256_mask_cvtsepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVSWB __m128i _mm256_maskz_cvtsepi16_epi8( __mmask16 k, __m256i b);
VPMOVSWB void _mm256_mask_cvtsepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVSWB __m128i _mm_cvtsepi16_epi8(__m128i a);
VPMOVSWB __m128i _mm_mask_cvtsepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVSWB __m128i _mm_maskz_cvtsepi16_epi8( __mmask8 k, __m128i b);
VPMOVSWB void _mm_mask_cvtsepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVWB __m128i _mm256_cvtepi16_epi8(__m256i a);
VPMOVWB __m128i _mm256_mask_cvtepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVWB __m128i _mm256_maskz_cvtepi16_epi8( __mmask16 k, __m256i b);
VPMOVWB void _mm256_mask_cvtepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVWB __m128i _mm_cvtepi16_epi8(__m128i a);
VPMOVWB __m128i _mm_mask_cvtepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVWB __m128i _mm_maskz_cvtepi16_epi8( __mmask8 k, __m128i b);
VPMOVWB void _mm_mask_cvtepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-55,"Type E6类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
