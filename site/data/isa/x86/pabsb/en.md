---
summary: Packed Absolute Value
---

## Description

PABSB/W/D computes the absolute value of each data element of the source operand (the second operand) and stores the UNSIGNED results in the destination operand (the first operand). PABSB operates on signed bytes, PABSW operates on signed 16-bit words, and PABSD operates on signed 32-bit integers.

EVEX encoded VPABSD/Q: The source operand is a ZMM/YMM/XMM register, a 512/256/128-bit memory location, or a 512/256/128-bit vector broadcasted from a 32/64-bit memory location. The destination operand is a ZMM/YMM/XMM register updated according to the writemask.

EVEX encoded VPABSB/W: The source operand is a ZMM/YMM/XMM register, or a 512/256/128-bit memory location. The destination operand is a ZMM/YMM/XMM register updated according to the writemask.

VEX.256 encoded versions: The source operand is a YMM register or a 256-bit memory location. The destination operand is a YMM register. The upper bits (MAXVL-1:256) of the corresponding register destination are zeroed.

VEX.128 encoded versions: The source operand is an XMM register or 128-bit memory location. The destination operand is an XMM register. The upper bits (MAXVL-1:128) of the corresponding register destination are zeroed.

128-bit Legacy SSE version: The source operand can be an XMM register or an 128-bit memory location. The destination is an XMM register. The upper bits (VL_MAX-1:128) of the corresponding register destination are unmodified.

VEX.vvvv and EVEX.vvvv are reserved and must be 1111b otherwise instructions will #UD.

## Operation

```text
PABSB With 64-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 7th bytes
    Unsigned DEST[63:56] := ABS(SRC[63:56])

PABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 256-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 31st bytes
    Unsigned DEST[255:248] := ABS(SRC[255:248])

VPABSB (EVEX Encoded Versions)
    (KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN

            Unsigned DEST[i+7:i] := ABS(SRC[i+7:i])

     ELSE

            IF *merging-masking*                ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*                 ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 256-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 15th 16-bit words
    Unsigned DEST[255:240] := ABS(SRC[255:240])


VPABSW (EVEX Encoded Versions)
    (KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             Unsigned DEST[i+15:i] := ABS(SRC[i+15:i])

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+15:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 256-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 7th 32-bit double words
    Unsigned DEST[255:224] := ABS(SRC[255:224])

VPABSD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+31:i] := ABS(SRC[31:0])

                  ELSE

                    Unsigned DEST[i+31:i] := ABS(SRC[i+31:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;


DEST[MAXVL-1:VL] := 0

VPABSQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+63:i] := ABS(SRC[63:0])

                  ELSE

                    Unsigned DEST[i+63:i] := ABS(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VPABSB__m512i _mm512_abs_epi8 ( __m512i a) VPABSW__m512i _mm512_abs_epi16 ( __m512i a) VPABSB__m512i _mm512_mask_abs_epi8 ( __m512i s, __mmask64 m, __m512i a) VPABSW__m512i _mm512_mask_abs_epi16 ( __m512i s, __mmask32 m, __m512i a) VPABSB__m512i _mm512_maskz_abs_epi8 (__mmask64 m, __m512i a) VPABSW__m512i _mm512_maskz_abs_epi16 (__mmask32 m, __m512i a) VPABSB__m256i _mm256_mask_abs_epi8 (__m256i s, __mmask32 m, __m256i a) VPABSW__m256i _mm256_mask_abs_epi16 (__m256i s, __mmask16 m, __m256i a) VPABSB__m256i _mm256_maskz_abs_epi8 (__mmask32 m, __m256i a) VPABSW__m256i _mm256_maskz_abs_epi16 (__mmask16 m, __m256i a) VPABSB__m128i _mm_mask_abs_epi8 (__m128i s, __mmask16 m, __m128i a) VPABSW__m128i _mm_mask_abs_epi16 (__m128i s, __mmask8 m, __m128i a) VPABSB__m128i _mm_maskz_abs_epi8 (__mmask16 m, __m128i a) VPABSW__m128i _mm_maskz_abs_epi16 (__mmask8 m, __m128i a) VPABSD __m256i _mm256_mask_abs_epi32(__m256i s, __mmask8 k, __m256i a);
VPABSD __m256i _mm256_maskz_abs_epi32( __mmask8 k, __m256i a);
VPABSD __m128i _mm_mask_abs_epi32(__m128i s, __mmask8 k, __m128i a);
VPABSD __m128i _mm_maskz_abs_epi32( __mmask8 k, __m128i a);
VPABSD __m512i _mm512_abs_epi32( __m512i a);
VPABSD __m512i _mm512_mask_abs_epi32(__m512i s, __mmask16 k, __m512i a);
VPABSD __m512i _mm512_maskz_abs_epi32( __mmask16 k, __m512i a);
VPABSQ __m512i _mm512_abs_epi64( __m512i a);
VPABSQ __m512i _mm512_mask_abs_epi64(__m512i s, __mmask8 k, __m512i a);
VPABSQ __m512i _mm512_maskz_abs_epi64( __mmask8 k, __m512i a);
VPABSQ __m256i _mm256_mask_abs_epi64(__m256i s, __mmask8 k, __m256i a);
VPABSQ __m256i _mm256_maskz_abs_epi64( __mmask8 k, __m256i a);
VPABSQ __m128i _mm_mask_abs_epi64(__m128i s, __mmask8 k, __m128i a);
VPABSQ __m128i _mm_maskz_abs_epi64( __mmask8 k, __m128i a);
PABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m256i _mm256_abs_epi8 (__m256i a) PABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m256i _mm256_abs_epi16 (__m256i a) PABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m256i _mm256_abs_epi32 (__m256i a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-21, "Type 4 Class Exception Conditions."

EVEX-encoded VPABSD/Q, see Table 2-51, "Type E4 Class Exception Conditions."

EVEX-encoded VPABSB/W, see Exceptions Type E4.nb in Table 2-51, "Type E4 Class Exception Conditions."
