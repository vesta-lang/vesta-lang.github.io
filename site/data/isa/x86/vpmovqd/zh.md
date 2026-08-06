---
summary: 将 QWord 转换为 DWord
---

## 说明

VPMOVQW向下将源操作数(第二个操作数)中的64位整数元素使用调值转换成打包的双字. VPMOVSQW 使用签名饱和度将签名的64位整数转换成已装箱的签名双字. VPMOVUSQW 使用未符号饱和化将未符号的四字值转换为未符号的双字值.

源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个YMM/XMM/XMM的登记册或256/128/64位内存位置.

向下转换的双字元素从最小的双字写成目标操作数(第一个操作数). 目标操作数的双字元素根据写掩码更新. 注册目的地的位数(MAXVL-1:256/128/64)为零.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := TruncateQuadWordToDWord (SRC[m+63:m])

           ELSE *zeroing-masking*           ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := TruncateQuadWordToDWord (SRC[m+63:m])

           ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVSQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := SaturateSignedQuadWordToDWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*                 ; merging-masking

                    THEN *DEST[i+31:i] remains unchanged*

                    ELSE *zeroing-masking*        ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR


DEST[MAXVL-1:VL/2] := 0;

VPMOVSQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateSignedQuadWordToDWord (SRC[m+63:m])

        ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVUSQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateUnsignedQuadWordToDWord (SRC[m+63:m])

        ELSE

             IF *merging-masking*              ; merging-masking

                    THEN *DEST[i+31:i] remains unchanged*

                    ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateUnsignedQuadWordToDWord (SRC[m+63:m])

        ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVQD __m256i _mm512_cvtepi64_epi32( __m512i a);
VPMOVQD __m256i _mm512_mask_cvtepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVQD __m256i _mm512_maskz_cvtepi64_epi32( __mmask8 k, __m512i a);
VPMOVQD void _mm512_mask_cvtepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
VPMOVSQD __m256i _mm512_cvtsepi64_epi32( __m512i a);
VPMOVSQD __m256i _mm512_mask_cvtsepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVSQD __m256i _mm512_maskz_cvtsepi64_epi32( __mmask8 k, __m512i a);
VPMOVSQD void _mm512_mask_cvtsepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
VPMOVUSQD __m256i _mm512_cvtusepi64_epi32( __m512i a);
VPMOVUSQD __m256i _mm512_mask_cvtusepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVUSQD __m256i _mm512_maskz_cvtusepi64_epi32( __mmask8 k, __m512i a);
VPMOVUSQD void _mm512_mask_cvtusepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
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
