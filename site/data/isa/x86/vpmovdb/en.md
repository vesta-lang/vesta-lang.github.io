---
summary: Down Convert DWord to Byte
---

## Description

VPMOVDB down converts 32-bit integer elements in the source operand (the second operand) into packed bytes using truncation. VPMOVSDB converts signed 32-bit integers into packed signed bytes using signed saturation. VPMOVUSDB convert unsigned double-word values into unsigned byte values using unsigned saturation.

The source operand is a ZMM/YMM/XMM register. The destination operand is a XMM register or a 128/64/32-bit memory location.

Down-converted byte elements are written to the destination operand (the first operand) from the least-significant byte. Byte elements of the destination operand are updated according to the writemask. Bits (MAXVL-1:128/64/32) of the register destination are zeroed.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

## Operation

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

## Intel C/C++ compiler intrinsics

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

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instruction, see Table 2-55, "Type E6 Class Exception Conditions."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
