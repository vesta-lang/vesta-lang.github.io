---
summary: 将 QWord 转换为字节
---

## 说明

VPMOVQB向下将源操作数(第二个操作数)中的64位整数元素使用调值转换成已打包的字节元素. VPMOVSQB 使用签名饱和度将签名的64位整数转换成已签名的字节. VPMOVUSQB 使用未符号饱和度将未符号的四字节值转换为未符号字节值. 源操作数是一个矢量寄存器. 目标操作数是一个XMM登记册或内存位置.

向下转换的字节元素从最小的字节写入目标操作数(第一个操作数). 目标操作数的字节元素根据写掩码更新. 目的地被清零的位数(MAXVL-1:64).

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateQuadWordToByte (SRC[m+63:m])

           ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/8] := 0;

VPMOVQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateQuadWordToByte (SRC[m+63:m])

           ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVSQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := SaturateSignedQuadWordToByte (SRC[m+63:m])

           ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI


      FI;
ENDFOR
DEST[MAXVL-1:VL/8] := 0;

VPMOVSQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateSignedQuadWordToByte (SRC[m+63:m])

        ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVUSQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedQuadWordToByte (SRC[m+63:m])

        ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/8] := 0;

VPMOVUSQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedQuadWordToByte (SRC[m+63:m])

        ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVQB __m128i _mm512_cvtepi64_epi8( __m512i a);
VPMOVQB __m128i _mm512_mask_cvtepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVQB __m128i _mm512_maskz_cvtepi64_epi8( __mmask8 k, __m512i a);
VPMOVQB void _mm512_mask_cvtepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVSQB __m128i _mm512_cvtsepi64_epi8( __m512i a);
VPMOVSQB __m128i _mm512_mask_cvtsepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVSQB __m128i _mm512_maskz_cvtsepi64_epi8( __mmask8 k, __m512i a);
VPMOVSQB void _mm512_mask_cvtsepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm512_cvtusepi64_epi8( __m512i a);
VPMOVUSQB __m128i _mm512_mask_cvtusepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm512_maskz_cvtusepi64_epi8( __mmask8 k, __m512i a);
VPMOVUSQB void _mm512_mask_cvtusepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm256_cvtusepi64_epi8(__m256i a);
VPMOVUSQB __m128i _mm256_mask_cvtusepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVUSQB __m128i _mm256_maskz_cvtusepi64_epi8( __mmask8 k, __m256i b);
VPMOVUSQB void _mm256_mask_cvtusepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVUSQB __m128i _mm_cvtusepi64_epi8(__m128i a);
VPMOVUSQB __m128i _mm_mask_cvtusepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVUSQB __m128i _mm_maskz_cvtusepi64_epi8( __mmask8 k, __m128i b);
VPMOVUSQB void _mm_mask_cvtusepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVSQB __m128i _mm256_cvtsepi64_epi8(__m256i a);
VPMOVSQB __m128i _mm256_mask_cvtsepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVSQB __m128i _mm256_maskz_cvtsepi64_epi8( __mmask8 k, __m256i b);
VPMOVSQB void _mm256_mask_cvtsepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVSQB __m128i _mm_cvtsepi64_epi8(__m128i a);
VPMOVSQB __m128i _mm_mask_cvtsepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVSQB __m128i _mm_maskz_cvtsepi64_epi8( __mmask8 k, __m128i b);
VPMOVSQB void _mm_mask_cvtsepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVQB __m128i _mm256_cvtepi64_epi8(__m256i a);
VPMOVQB __m128i _mm256_mask_cvtepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVQB __m128i _mm256_maskz_cvtepi64_epi8( __mmask8 k, __m256i b);
VPMOVQB void _mm256_mask_cvtepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVQB __m128i _mm_cvtepi64_epi8(__m128i a);
VPMOVQB __m128i _mm_mask_cvtepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVQB __m128i _mm_maskz_cvtepi64_epi8( __mmask8 k, __m128i b);
VPMOVQB void _mm_mask_cvtepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-55,"Type E6类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
