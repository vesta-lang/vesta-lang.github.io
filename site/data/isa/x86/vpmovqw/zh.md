---
summary: 将 QWord 转换为文字
---

## 说明

VPMOVQW向下使用调值将源操作数(第二个操作数)中的64位整数元素转换成包词. VPMOVSQW使用签名的饱和度将签名的64位整数转换成包式签名单词. VPMOVUSQW 使用未符号饱和度将未符号的四字值转换为未符号的字值.

源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个XMM的寄存器,或128个/64/32位内存位置.

向下转换的单词元素从最小的单词写入目标操作数(第一个操作数). 目标操作数的单词元素根据写掩码更新. 注册目的地被清零的位数(MAXVL-1:128/64/32).

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := TruncateQuadWordToWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := TruncateQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := SaturateSignedQuadWordToWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0


                  FI
      FI;
ENDFOR
DEST[MAXVL-1:VL/4] := 0;

VPMOVSQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateSignedQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+15:i] := SaturateUnsignedQuadWordToWord (SRC[m+63:m])

        ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVUSQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateUnsignedQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVQW __m128i _mm512_cvtepi64_epi16( __m512i a);
VPMOVQW __m128i _mm512_mask_cvtepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVQW __m128i _mm512_maskz_cvtepi64_epi16( __mmask8 k, __m512i a);
VPMOVQW void _mm512_mask_cvtepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVSQW __m128i _mm512_cvtsepi64_epi16( __m512i a);
VPMOVSQW __m128i _mm512_mask_cvtsepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVSQW __m128i _mm512_maskz_cvtsepi64_epi16( __mmask8 k, __m512i a);
VPMOVSQW void _mm512_mask_cvtsepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVUSQW __m128i _mm512_cvtusepi64_epi16( __m512i a);
VPMOVUSQW __m128i _mm512_mask_cvtusepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVUSQW __m128i _mm512_maskz_cvtusepi64_epi16( __mmask8 k, __m512i a);
VPMOVUSQW void _mm512_mask_cvtusepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVUSQD __m128i _mm256_cvtusepi64_epi32(__m256i a);
VPMOVUSQD __m128i _mm256_mask_cvtusepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVUSQD __m128i _mm256_maskz_cvtusepi64_epi32( __mmask8 k, __m256i b);
VPMOVUSQD void _mm256_mask_cvtusepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVUSQD __m128i _mm_cvtusepi64_epi32(__m128i a);
VPMOVUSQD __m128i _mm_mask_cvtusepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVUSQD __m128i _mm_maskz_cvtusepi64_epi32( __mmask8 k, __m128i b);
VPMOVUSQD void _mm_mask_cvtusepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
VPMOVSQD __m128i _mm256_cvtsepi64_epi32(__m256i a);
VPMOVSQD __m128i _mm256_mask_cvtsepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVSQD __m128i _mm256_maskz_cvtsepi64_epi32( __mmask8 k, __m256i b);
VPMOVSQD void _mm256_mask_cvtsepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVSQD __m128i _mm_cvtsepi64_epi32(__m128i a);
VPMOVSQD __m128i _mm_mask_cvtsepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVSQD __m128i _mm_maskz_cvtsepi64_epi32( __mmask8 k, __m128i b);
VPMOVSQD void _mm_mask_cvtsepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
VPMOVQD __m128i _mm256_cvtepi64_epi32(__m256i a);
VPMOVQD __m128i _mm256_mask_cvtepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVQD __m128i _mm256_maskz_cvtepi64_epi32( __mmask8 k, __m256i b);
VPMOVQD void _mm256_mask_cvtepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVQD __m128i _mm_cvtepi64_epi32(__m128i a);
VPMOVQD __m128i _mm_mask_cvtepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVQD __m128i _mm_maskz_cvtepi64_epi32( __mmask8 k, __m128i b);
VPMOVQD void _mm_mask_cvtepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-55,"Type E6类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
