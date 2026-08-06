---
summary: Maximum of Packed Signed Integers
---

## Description

Performs a SIMD compare of the packed signed byte, word, dword or qword integers in the second source operand and the first source operand and returns the maximum value for each pair of integers to the destination operand.

Legacy SSE version PMAXSW: The source operand can be an MMX technology register or a 64-bit memory location. The destination operand can be an MMX technology register.

128-bit Legacy SSE version: The first source and destination operands are XMM registers. The second source operand is an XMM register or a 128-bit memory location. Bits (MAXVL-1:128) of the corresponding YMM destination register remain unchanged.

VEX.128 encoded version: The first source and destination operands are XMM registers. The second source operand is an XMM register or a 128-bit memory location. Bits (MAXVL-1:128) of the corresponding destination register are zeroed.

VEX.256 encoded version: The second source operand can be an YMM register or a 256-bit memory location. The first source and destination operands are YMM registers. Bits (MAXVL-1:256) of the corresponding destination register are zeroed.

EVEX encoded VPMAXSD/Q: The first source operand is a ZMM/YMM/XMM register; The second source operand is a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 32/64-bit memory location. The destination operand is conditionally updated based on writemask k1.

EVEX encoded VPMAXSB/W: The first source operand is a ZMM/YMM/XMM register; The second source operand is a ZMM/YMM/XMM register, a 512/256/128-bit memory location. The destination operand is conditionally updated based on writemask k1.

## Operation

```text
PMAXSW (64-bit Operands)

    IF DEST[15:0] > SRC[15:0]) THEN
          DEST[15:0] := DEST[15:0];

    ELSE
          DEST[15:0] := SRC[15:0]; FI;

    (* Repeat operation for 2nd and 3rd words in source and destination operands *)
    IF DEST[63:48] > SRC[63:48]) THEN

          DEST[63:48] := DEST[63:48];
    ELSE

          DEST[63:48] := SRC[63:48]; FI;

PMAXSB (128-bit Legacy SSE Version)
    IF DEST[7:0] > SRC[7:0] THEN
          DEST[7:0] := DEST[7:0];
    ELSE
          DEST[7:0] := SRC[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF DEST[127:120] >SRC[127:120] THEN
          DEST[127:120] := DEST[127:120];
    ELSE
          DEST[127:120] := SRC[127:120]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSB (VEX.128 Encoded Version)
    IF SRC1[7:0] > SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[7:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF SRC1[127:120] >SRC2[127:120] THEN
          DEST[127:120] := SRC1[127:120];
    ELSE
          DEST[127:120] := SRC2[127:120]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSB (VEX.256 Encoded Version)
    IF SRC1[7:0] > SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[7:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 31st bytes in source and destination operands *)
    IF SRC1[255:248] >SRC2[255:248] THEN
          DEST[255:248] := SRC1[255:248];
    ELSE
          DEST[255:248] := SRC2[255:248]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+7:i] > SRC2[i+7:i]

            THEN DEST[i+7:i] := SRC1[i+7:i];

            ELSE DEST[i+7:i] := SRC2[i+7:i];

     FI;

     ELSE

            IF *merging-masking*              ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE                          ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PMAXSW (128-bit Legacy SSE Version)
    IF DEST[15:0] >SRC[15:0] THEN
          DEST[15:0] := DEST[15:0];
    ELSE
          DEST[15:0] := SRC[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:112] >SRC[127:112] THEN
          DEST[127:112] := DEST[127:112];
    ELSE
          DEST[127:112] := SRC[127:112]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSW (VEX.128 Encoded Version)
    IF SRC1[15:0] > SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF SRC1[127:112] >SRC2[127:112] THEN
          DEST[127:112] := SRC1[127:112];
    ELSE
          DEST[127:112] := SRC2[127:112]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSW (VEX.256 Encoded Version)
    IF SRC1[15:0] > SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 15th words in source and destination operands *)
    IF SRC1[255:240] >SRC2[255:240] THEN
          DEST[255:240] := SRC1[255:240];
    ELSE
          DEST[255:240] := SRC2[255:240]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+15:i] > SRC2[i+15:i]

             THEN DEST[i+15:i] := SRC1[i+15:i];

             ELSE DEST[i+15:i] := SRC2[i+15:i];

     FI;

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                            ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PMAXSD (128-bit Legacy SSE Version)
    IF DEST[31:0] >SRC[31:0] THEN
          DEST[31:0] := DEST[31:0];
    ELSE
          DEST[31:0] := SRC[31:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:96] >SRC[127:96] THEN
          DEST[127:96] := DEST[127:96];
    ELSE
          DEST[127:96] := SRC[127:96]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSD (VEX.128 Encoded Version)
    IF SRC1[31:0] > SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];
    ELSE
          DEST[31:0] := SRC2[31:0]; FI;
    (* Repeat operation for 2nd through 3rd dwords in source and destination operands *)
    IF SRC1[127:96] > SRC2[127:96] THEN
          DEST[127:96] := SRC1[127:96];
    ELSE
          DEST[127:96] := SRC2[127:96]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSD (VEX.256 Encoded Version)
    IF SRC1[31:0] > SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];
    ELSE
          DEST[31:0] := SRC2[31:0]; FI;
    (* Repeat operation for 2nd through 7th dwords in source and destination operands *)
    IF SRC1[255:224] > SRC2[255:224] THEN
          DEST[255:224] := SRC1[255:224];
    ELSE
          DEST[255:224] := SRC2[255:224]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+31:i] > SRC2[31:0]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[31:0];

                  FI;

             ELSE

                  IF SRC1[i+31:i] > SRC2[i+31:i]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[i+31:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE DEST[i+31:i] := 0          ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMAXSQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+63:i] > SRC2[63:0]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[63:0];

                  FI;

             ELSE

                  IF SRC1[i+63:i] > SRC2[i+63:i]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[i+63:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                            ; zeroing-masking

                       THEN DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VPMAXSB __m512i _mm512_max_epi8( __m512i a, __m512i b);
VPMAXSB __m512i _mm512_mask_max_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPMAXSB __m512i _mm512_maskz_max_epi8( __mmask64 k, __m512i a, __m512i b);
VPMAXSW __m512i _mm512_max_epi16( __m512i a, __m512i b);
VPMAXSW __m512i _mm512_mask_max_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMAXSW __m512i _mm512_maskz_max_epi16( __mmask32 k, __m512i a, __m512i b);
VPMAXSB __m256i _mm256_mask_max_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPMAXSB __m256i _mm256_maskz_max_epi8( __mmask32 k, __m256i a, __m256i b);
VPMAXSW __m256i _mm256_mask_max_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMAXSW __m256i _mm256_maskz_max_epi16( __mmask16 k, __m256i a, __m256i b);
VPMAXSB __m128i _mm_mask_max_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPMAXSB __m128i _mm_maskz_max_epi8( __mmask16 k, __m128i a, __m128i b);
VPMAXSW __m128i _mm_mask_max_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSW __m128i _mm_maskz_max_epi16( __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m256i _mm256_mask_max_epi32(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMAXSD __m256i _mm256_maskz_max_epi32( __mmask16 k, __m256i a, __m256i b);
VPMAXSQ __m256i _mm256_mask_max_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMAXSQ __m256i _mm256_maskz_max_epi64( __mmask8 k, __m256i a, __m256i b);
VPMAXSD __m128i _mm_mask_max_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m128i _mm_maskz_max_epi32( __mmask8 k, __m128i a, __m128i b);
VPMAXSQ __m128i _mm_mask_max_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSQ __m128i _mm_maskz_max_epu64( __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m512i _mm512_max_epi32( __m512i a, __m512i b);
VPMAXSD __m512i _mm512_mask_max_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPMAXSD __m512i _mm512_maskz_max_epi32( __mmask16 k, __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_max_epi64( __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_mask_max_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_maskz_max_epi64( __mmask8 k, __m512i a, __m512i b);
(V)PMAXSB __m128i _mm_max_epi8 ( __m128i a, __m128i b);
(V)PMAXSW __m128i _mm_max_epi16 ( __m128i a, __m128i b) (V)PMAXSD __m128i _mm_max_epi32 ( __m128i a, __m128i b);
VPMAXSB __m256i _mm256_max_epi8 ( __m256i a, __m256i b);
VPMAXSW __m256i _mm256_max_epi16 ( __m256i a, __m256i b) VPMAXSD __m256i _mm256_max_epi32 ( __m256i a, __m256i b);
PMAXSW:__m64 _mm_max_pi16(__m64 a, __m64 b);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-21, "Type 4 Class Exception Conditions."

EVEX-encoded VPMAXSD/Q, see Table 2-51, "Type E4 Class Exception Conditions."

EVEX-encoded VPMAXSB/W, see Exceptions Type E4.nb in Table 2-51, "Type E4 Class Exception Conditions."
