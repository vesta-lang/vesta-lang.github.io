---
summary: 向下转换 DWord 到字节
---

## 说明

VPMOVDB向下使用调值将源操作数(第二个操作数)中的32位整数元素转换成被包的字节. VPMOVSDB 使用签名饱和度将签名的32位整数转换成已签名的字节. VPMOVUSDB 使用未符号饱和度将未符号的双字节值转换为未符号字节值.

源操作数是一个ZMM/YMM/XMM登记册. 目标操作数是一个XMM的寄存器,或128个/64/32位内存位置.

向下转换的字节元素从最小的字节写入目标操作数(第一个操作数). 目标操作数的字节元素根据写掩码更新. 注册目的地被清零的位数(MAXVL-1:128/64/32).

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPMOVDB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateDoubleWordToByte (SRC[m+31:m])

           ELSE

            IF *merging-masking*                 ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVDB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateDoubleWordToByte (SRC[m+31:m])

           ELSE *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVSDB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := SaturateSignedDoubleWordToByte (SRC[m+31:m])

           ELSE

            IF *merging-masking*                 ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+7:i] := 0

            FI


      FI;
ENDFOR
DEST[MAXVL-1:VL/4] := 0;

VPMOVSDB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateSignedDoubleWordToByte (SRC[m+31:m])

        ELSE *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVUSDB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedDoubleWordToByte (SRC[m+31:m])

        ELSE

            IF *merging-masking*              ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*    ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVUSDB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 32

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedDoubleWordToByte (SRC[m+31:m])

        ELSE *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR
```

## Intel C/C++ 内在编译器

```c
VPMOVDB __m128i _mm512_cvtepi32_epi8( __m512i a);
VPMOVDB __m128i _mm512_mask_cvtepi32_epi8(__m128i s, __mmask16 k, __m512i a);
VPMOVDB __m128i _mm512_maskz_cvtepi32_epi8( __mmask16 k, __m512i a);
VPMOVDB void _mm512_mask_cvtepi32_storeu_epi8(void * d, __mmask16 k, __m512i a);
VPMOVSDB __m128i _mm512_cvtsepi32_epi8( __m512i a);
VPMOVSDB __m128i _mm512_mask_cvtsepi32_epi8(__m128i s, __mmask16 k, __m512i a);
VPMOVSDB __m128i _mm512_maskz_cvtsepi32_epi8( __mmask16 k, __m512i a);
VPMOVSDB void _mm512_mask_cvtsepi32_storeu_epi8(void * d, __mmask16 k, __m512i a);
VPMOVUSDB __m128i _mm512_cvtusepi32_epi8( __m512i a);
VPMOVUSDB __m128i _mm512_mask_cvtusepi32_epi8(__m128i s, __mmask16 k, __m512i a);
VPMOVUSDB __m128i _mm512_maskz_cvtusepi32_epi8( __mmask16 k, __m512i a);
VPMOVUSDB void _mm512_mask_cvtusepi32_storeu_epi8(void * d, __mmask16 k, __m512i a);
VPMOVUSDB __m128i _mm256_cvtusepi32_epi8(__m256i a);
VPMOVUSDB __m128i _mm256_mask_cvtusepi32_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVUSDB __m128i _mm256_maskz_cvtusepi32_epi8( __mmask8 k, __m256i b);
VPMOVUSDB void _mm256_mask_cvtusepi32_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVUSDB __m128i _mm_cvtusepi32_epi8(__m128i a);
VPMOVUSDB __m128i _mm_mask_cvtusepi32_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVUSDB __m128i _mm_maskz_cvtusepi32_epi8( __mmask8 k, __m128i b);
VPMOVUSDB void _mm_mask_cvtusepi32_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVSDB __m128i _mm256_cvtsepi32_epi8(__m256i a);
VPMOVSDB __m128i _mm256_mask_cvtsepi32_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVSDB __m128i _mm256_maskz_cvtsepi32_epi8( __mmask8 k, __m256i b);
VPMOVSDB void _mm256_mask_cvtsepi32_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVSDB __m128i _mm_cvtsepi32_epi8(__m128i a);
VPMOVSDB __m128i _mm_mask_cvtsepi32_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVSDB __m128i _mm_maskz_cvtsepi32_epi8( __mmask8 k, __m128i b);
VPMOVSDB void _mm_mask_cvtsepi32_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVDB __m128i _mm256_cvtepi32_epi8(__m256i a);
VPMOVDB __m128i _mm256_mask_cvtepi32_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVDB __m128i _mm256_maskz_cvtepi32_epi8( __mmask8 k, __m256i b);
VPMOVDB void _mm256_mask_cvtepi32_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVDB __m128i _mm_cvtepi32_epi8(__m128i a);
VPMOVDB __m128i _mm_mask_cvtepi32_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVDB __m128i _mm_maskz_cvtepi32_epi8( __mmask8 k, __m128i b);
VPMOVDB void _mm_mask_cvtepi32_storeu_epi8(void * , __mmask8 k, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-55,"Type E6类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
