---
summary: Convert a Mask Register to a Vector
---

## Description

Converts a mask register to a vector register. Each element in the destination register is set to all 1's or all 0's depending on the value of the corresponding bit in the source mask register. The source operand is a mask register. The destination operand is a ZMM/YMM/XMM register. EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

## Operation

```text
VPMOVM2B (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF SRC[j]

          THEN DEST[i+7:i] := -1
          ELSE DEST[i+7:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2W (EVEX encoded versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1

    i := j * 16
    IF SRC[j]

          THEN DEST[i+15:i] := -1
          ELSE DEST[i+15:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2D (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF SRC[j]

          THEN DEST[i+31:i] := -1
          ELSE DEST[i+31:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2Q (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF SRC[j]

          THEN DEST[i+63:i] := -1
          ELSE DEST[i+63:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VPMOVM2B __m512i _mm512_movm_epi8(__mmask64 );
VPMOVM2D __m512i _mm512_movm_epi32(__mmask8 );
VPMOVM2Q __m512i _mm512_movm_epi64(__mmask16 );
VPMOVM2W __m512i _mm512_movm_epi16(__mmask32 );
VPMOVM2B __m256i _mm256_movm_epi8(__mmask32 );
VPMOVM2D __m256i _mm256_movm_epi32(__mmask8 );
VPMOVM2Q __m256i _mm256_movm_epi64(__mmask8 );
VPMOVM2W __m256i _mm256_movm_epi16(__mmask16 );
VPMOVM2B __m128i _mm_movm_epi8(__mmask16 );
VPMOVM2D __m128i _mm_movm_epi32(__mmask8 );
VPMOVM2Q __m128i _mm_movm_epi64(__mmask8 );
VPMOVM2W __m128i _mm_movm_epi16(__mmask8 );
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instruction, see Table 2-57, "Type E7NM Class Exception Conditions."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
