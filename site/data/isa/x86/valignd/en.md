---
summary: Align Doubleword/Quadword Vectors
---

## Description

Concatenates and shifts right doubleword/quadword elements of the first source operand (the second operand) and the second source operand (the third operand) into a 1024/512/256-bit intermediate vector. The low 512/256/128-bit of the intermediate vector is written to the destination operand (the first operand) using the writemask k1. The destination and first source operands are ZMM/YMM/XMM registers. The second source operand can be a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 32/64-bit memory location.

This instruction is writemasked, so only those elements with the corresponding bit set in vector mask register k1 are computed and stored into zmm1. Elements in zmm1 with the corresponding bit clear in k1 retain their previous values (merging-masking) or are set to 0 (zeroing-masking).

## Operation

```text
VALIGND (EVEX Encoded Versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (SRC2 *is memory*) (AND EVEX.b = 1)

     THEN

          FOR j := 0 TO KL-1

                  i := j * 32

                  src[i+31:i] := SRC2[31:0]

          ENDFOR;

     ELSE src := SRC2

FI

; Concatenate sources

tmp[VL-1:0] := src[VL-1:0]

tmp[2VL-1:VL] := SRC1[VL-1:0]

; Shift right doubleword elements

IF VL = 128

     THEN SHIFT = imm8[1:0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[2:0]

                  ELSE SHIFT = imm8[3:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (32*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := tmp[i+31:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                        ; zeroing-masking

                               DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VALIGNQ (EVEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256),(8, 512)
IF (SRC2 *is memory*) (AND EVEX.b = 1)

    THEN
          FOR j := 0 TO KL-1
                i := j * 64
                src[i+63:i] := SRC2[63:0]
          ENDFOR;

    ELSE src := SRC2
FI
; Concatenate sources
tmp[VL-1:0] := src[VL-1:0]
tmp[2VL-1:VL] := SRC1[VL-1:0]
; Shift right quadword elements


IF VL = 128

     THEN SHIFT = imm8[0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[1:0]

                  ELSE SHIFT = imm8[2:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (64*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := tmp[i+63:i]

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VALIGND __m512i _mm512_alignr_epi32( __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_mask_alignr_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_maskz_alignr_epi32( __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m256i _mm256_mask_alignr_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m256i _mm256_maskz_alignr_epi32( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m128i _mm_mask_alignr_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGND __m128i _mm_maskz_alignr_epi32( __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m512i _mm512_alignr_epi64( __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_mask_alignr_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_maskz_alignr_epi64( __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m256i _mm256_mask_alignr_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m256i _mm256_maskz_alignr_epi64( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m128i _mm_mask_alignr_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m128i _mm_maskz_alignr_epi64( __mmask8 k, __m128i a, __m128i b, int cnt);
```
