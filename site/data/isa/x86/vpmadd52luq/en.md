---
summary: Packed Multiply of Unsigned 52-Bit Integers and Add the Low 52-Bit Products
---

## Description

Multiplies packed unsigned 52-bit integers in each qword element of the first source operand (the second operand) with the packed unsigned 52-bit integers in the corresponding elements of the second source operand (the third operand) to form packed 104-bit intermediate results. The low 52-bit, unsigned integer of each 104-bit product is added to the corresponding qword unsigned integer of the destination operand (the first operand) under the writemask k1.

The first source operand is a ZMM/YMM/XMM register. The second source operand can be a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 64-bit memory location. The destination operand is a ZMM/YMM/XMM register conditionally updated with writemask k1 at 64-bit granularity.

## Operation

```text
VPMADDLUQ srcdest, src1, src2 (VEX version)
VL = (128,256)
KL = VL/64

FOR i in 0 .. KL-1:
    temp128 := zeroextend64(src1.qword[i][51:0]) *zeroextend64(src2.qword[i][51:0])
    srcdest.qword[i] := srcdest.qword[i] +zeroextend64(temp128[51:0])

srcdest[MAXVL:VL] := 0

VPMADD52LUQ (EVEX encoded)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64;
    IF k1[j] OR *no writemask* THEN

          IF src2 is Memory AND EVEX.b=1 THEN
                tsrc2[63:0] := ZeroExtend64(src2[51:0]);

          ELSE
                tsrc2[63:0] := ZeroExtend64(src2[i+51:i];

          FI;
          Temp128[127:0] := ZeroExtend64(src1[i+51:i]) * tsrc2[63:0];
          Temp2[63:0] := DEST[i+63:i] + ZeroExtend64(temp128[51:0]) ;
          DEST[i+63:i] := Temp2[63:0];
    ELSE
          IF *zeroing-masking* THEN

                DEST[i+63:i] := 0;
          ELSE *merge-masking*

                DEST[i+63:i] is unchanged;
          FI;
    FI;
ENDFOR

DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ compiler intrinsics

```c
VPMADD52LUQ __m128i _mm_madd52lo_avx_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52LUQ __m128i _mm_madd52lo_epu64( __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m128i _mm_madd52lo_epu64 (__m128i __X, __m128i __Y, __m128i __Z);
VPMADD52LUQ __m128i _mm_mask_madd52lo_epu64(__m128i s, __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m128i _mm_maskz_madd52lo_epu64( __mmask8 k, __m128i a, __m128i b, __m128i c);
VPMADD52LUQ __m256i _mm256_madd52lo_avx_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52LUQ __m256i _mm256_madd52lo_epu64( __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m256i _mm256_madd52lo_epu64 (__m256i __X, __m256i __Y, __m256i __Z);
VPMADD52LUQ __m256i _mm256_mask_madd52lo_epu64(__m256i s, __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m256i _mm256_maskz_madd52lo_epu64( __mmask8 k, __m256i a, __m256i b, __m256i c);
VPMADD52LUQ __m512i _mm512_madd52lo_epu64( __m512i a, __m512i b, __m512i c);
VPMADD52LUQ __m512i _mm512_mask_madd52lo_epu64(__m512i s, __mmask8 k, __m512i a, __m512i b, __m512i c);
VPMADD52LUQ __m512i _mm512_maskz_madd52lo_epu64( __mmask8 k, __m512i a, __m512i b, __m512i c);
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

VEX-encoded instructions, see Table 2-21, "Type 4 Class Exception Conditions." EVEX-encoded instructions, see Table 2-51, "Type E4 Class Exception Conditions."
