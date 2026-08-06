---
summary: 向下转换 DWord 到 Word
---

## 说明

VPMOVDW向下使用调值将源操作数(第二个操作数)中的32位整数元素转换成包词. VPMOVSDW使用签名的饱和度将签名的32位整数转换成包式签名单词. VPMOVUSDW 使用未符号饱和化将未符号双字值转换为未符号单字值.

源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个YMM/XMM/XMM的登记册或256/128/64位内存位置.

向下转换的单词元素从最小的单词写入目标操作数(第一个操作数). 目标操作数的单词元素根据写掩码更新. 注册目的地被清零的位数(MAXVL-1:156/128/64).

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := TruncateDoubleWordToWord (SRC[m+31:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := TruncateDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := SaturateSignedDoubleWordToWord (SRC[m+31:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0


                  FI
      FI;
ENDFOR
DEST[MAXVL-1:VL/2] := 0;

VPMOVSDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateSignedDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

        THEN DEST[i+15:i] := SaturateUnsignedDoubleWordToWord (SRC[m+31:m])

        ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateUnsignedDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVDW __m256i _mm512_cvtepi32_epi16( __m512i a);
VPMOVDW __m256i _mm512_mask_cvtepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVDW __m256i _mm512_maskz_cvtepi32_epi16( __mmask16 k, __m512i a);
VPMOVDW void _mm512_mask_cvtepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVSDW __m256i _mm512_cvtsepi32_epi16( __m512i a);
VPMOVSDW __m256i _mm512_mask_cvtsepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVSDW __m256i _mm512_maskz_cvtsepi32_epi16( __mmask16 k, __m512i a);
VPMOVSDW void _mm512_mask_cvtsepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVUSDW __m256i _mm512_mask_cvtusepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVUSDW __m256i _mm512_maskz_cvtusepi32_epi16( __mmask16 k, __m512i a);
VPMOVUSDW void _mm512_mask_cvtusepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVUSDW __m128i _mm256_cvtusepi32_epi16(__m256i a);
VPMOVUSDW __m128i _mm256_mask_cvtusepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVUSDW __m128i _mm256_maskz_cvtusepi32_epi16( __mmask8 k, __m256i b);
VPMOVUSDW void _mm256_mask_cvtusepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVUSDW __m128i _mm_cvtusepi32_epi16(__m128i a);
VPMOVUSDW __m128i _mm_mask_cvtusepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVUSDW __m128i _mm_maskz_cvtusepi32_epi16( __mmask8 k, __m128i b);
VPMOVUSDW void _mm_mask_cvtusepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
VPMOVSDW __m128i _mm256_cvtsepi32_epi16(__m256i a);
VPMOVSDW __m128i _mm256_mask_cvtsepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVSDW __m128i _mm256_maskz_cvtsepi32_epi16( __mmask8 k, __m256i b);
VPMOVSDW void _mm256_mask_cvtsepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVSDW __m128i _mm_cvtsepi32_epi16(__m128i a);
VPMOVSDW __m128i _mm_mask_cvtsepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVSDW __m128i _mm_maskz_cvtsepi32_epi16( __mmask8 k, __m128i b);
VPMOVSDW void _mm_mask_cvtsepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
VPMOVDW __m128i _mm256_cvtepi32_epi16(__m256i a);
VPMOVDW __m128i _mm256_mask_cvtepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVDW __m128i _mm256_maskz_cvtepi32_epi16( __mmask8 k, __m256i b);
VPMOVDW void _mm256_mask_cvtepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVDW __m128i _mm_cvtepi32_epi16(__m128i a);
VPMOVDW __m128i _mm_mask_cvtepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVDW __m128i _mm_maskz_cvtepi32_epi16( __mmask8 k, __m128i b);
VPMOVDW void _mm_mask_cvtepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-55,"Type E6类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
