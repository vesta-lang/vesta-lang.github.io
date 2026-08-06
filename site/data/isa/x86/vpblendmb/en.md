---
summary: Blend Byte/Word Vectors Using an Opmask Control
---

## Description

Performs an element-by-element blending of byte/word elements between the first source operand byte vector register and the second source operand byte vector from memory or register, using the instruction mask as selector. The result is written into the destination byte vector register.

The destination and first source operands are ZMM/YMM/XMM registers. The second source operand can be a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit memory location.

The mask is not used as a writemask for this instruction. Instead, the mask is used as an element selector: every element of the destination is conditionally selected between first source or second source using the value of the related mask bit (0 for first source, 1 for second source).

## Operation

```text
VPBLENDMB (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC2[i+7:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+7:i] := SRC1[i+7:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+7:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0;

VPBLENDMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC2[i+15:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+15:i] := SRC1[i+15:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+15:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VPBLENDMB __m512i _mm512_mask_blend_epi8(__mmask64 m, __m512i a, __m512i b);
VPBLENDMB __m256i _mm256_mask_blend_epi8(__mmask32 m, __m256i a, __m256i b);
VPBLENDMB __m128i _mm_mask_blend_epi8(__mmask16 m, __m128i a, __m128i b);
VPBLENDMW __m512i _mm512_mask_blend_epi16(__mmask32 m, __m512i a, __m512i b);
VPBLENDMW __m256i _mm256_mask_blend_epi16(__mmask16 m, __m256i a, __m256i b);
VPBLENDMW __m128i _mm_mask_blend_epi16(__mmask8 m, __m128i a, __m128i b);
```

## SIMD Floating-Point Exceptions

None

## Other Exceptions

See Table 2-51, "Type E4 Class Exception Conditions."
