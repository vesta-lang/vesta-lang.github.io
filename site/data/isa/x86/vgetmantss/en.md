---
summary: Extract Float32 Vector of Normalized Mantissa From Float32 Scalar
---

## Description

Convert the single precision floating values in the low doubleword element of the second source operand (the third operand) to single precision floating-point value with the mantissa normalization and sign control specified by the imm8 byte, see Figure 5-15. The converted result is written to the low doubleword element of the destination operand (the first operand) using writemask k1. Bits (127:32) of the XMM register destination are copied from corresponding bits in the first source operand. The normalized mantissa is specified by interv (imm8[1:0]) and the sign control (sc) is specified by bits 3:2 of the immediate byte.

The conversion operation is:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

Unbiased exponent k can be either 0 or -1, depending on the interval range defined by interv, the range of the significand and whether the exponent of the source is even or odd. The sign of the final result is determined by sc and the source sign. The encoded value of imm8[1:0] and sign control are shown in Figure 5-15.

The converted single precision floating-point result is encoded according to the sign control, the unbiased exponent k (adding bias) and a mantissa normalized to the range specified by interv.

The GetMant() function follows Table 5-16 when dealing with floating-point special numbers.

If writemasking is used, the low doubleword element of the destination operand is conditionally updated depending on the value of writemask register k1. If writemasking is not used, the low doubleword element of the destination operand is unconditionally updated.

## Operation

```text
// getmant_fp32(src, sign_control, normalization_interval) is defined in the operation section of VGETMANTPS

VGETMANTSS (EVEX encoded version)

SignCtrl[1:0] := IMM8[3:2];

Interv[1:0] := IMM8[1:0];

IF k1[0] OR *no writemask*

     THEN DEST[31:0] :=

           getmant_fp32(src, sign_control, normalization_interval)

     ELSE

     IF *merging-masking*          ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                    ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VGETMANTSS __m128 _mm_getmant_ss( __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_mask_getmant_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_maskz_getmant_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_getmant_round_ss( __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_mask_getmant_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_maskz_getmant_round_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
```

## SIMD Floating-Point Exceptions

Denormal, Invalid

## Other Exceptions

See Table 2-49, "Type E3 Class Exception Conditions."

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

Opcode/                           Op / 64/32          CPUID Feature  Description Instruction                       En Bit Mode Flag Support

VEX.256.66.0F3A.W0 18 /r ib       A          V/V      AVX            Insert 128 bits of packed floating-point values

VINSERTF128 ymm1, ymm2,                                              from xmm3/m128 and the remaining values xmm3/m128, imm8                                                      from ymm2 into ymm1.

EVEX.256.66.0F3A.W0 18 /r ib      C          V/V      (AVX512VL AND  Insert 128 bits of packed single-precision

```text
                                                      AVX512F) OR    floating-point values from xmm3/m128 and the
```

VINSERTF32X4 ymm1 {k1}{z}, ymm2,

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W0 18 /r ib      C          V/V      AVX512F        Insert 128 bits of packed single-precision

```text
                                                      OR AVX10.1     floating-point values from xmm3/m128 and the
```

VINSERTF32X4 zmm1 {k1}{z}, zmm2, remaining values from zmm2 into zmm1 under xmm3/m128, imm8                                                      writemask k1.

EVEX.256.66.0F3A.W1 18 /r ib      B          V/V      (AVX512VL AND  Insert 128 bits of packed double precision

VINSERTF64X2 ymm1 {k1}{z}, ymm2,                      AVX512DQ) OR   floating-point values from xmm3/m128 and the

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W1 18 /r ib      B          V/V      AVX512DQ       Insert 128 bits of packed double precision OR AVX10.1 VINSERTF64X2 zmm1 {k1}{z}, zmm2,                                     floating-point values from xmm3/m128 and the remaining values from zmm2 into zmm1 under xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W0 1A /r ib      D          V/V      AVX512DQ       Insert 256 bits of packed single-precision OR AVX10.1 VINSERTF32X8 zmm1 {k1}{z}, zmm2,                                     floating-point values from ymm3/m256 and the remaining values from zmm2 into zmm1 under ymm3/m256, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W1 1A /r ib      C          V/V      AVX512F        Insert 256 bits of packed double precision OR AVX10.1 VINSERTF64X4 zmm1 {k1}{z}, zmm2,                                     floating-point values from ymm3/m256 and the remaining values from zmm2 into zmm1 under ymm3/m256, imm8                                                      writemask k1.

## Description

VINSERTF128/VINSERTF32x4 and VINSERTF64x2 insert 128-bits of packed floating-point values from the second source operand (the third operand) into the destination operand (the first operand) at an 128-bit granularity offset multiplied by imm8[0] (256-bit) or imm8[1:0]. The remaining portions of the destination operand are copied from the corresponding fields of the first source operand (the second operand). The second source operand can be either an XMM register or a 128-bit memory location. The destination and first source operands are vector registers.

VINSERTF32x4: The destination operand is a ZMM/YMM register and updated at 32-bit granularity according to the writemask. The high 6/7 bits of the immediate are ignored.

VINSERTF64x2: The destination operand is a ZMM/YMM register and updated at 64-bit granularity according to the writemask. The high 6/7 bits of the immediate are ignored.

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF32x8 and VINSERTF64x4 inserts 256-bits of packed floating-point values from the second source operand (the third operand) into the destination operand (the first operand) at a 256-bit granular offset multiplied by imm8[0]. The remaining portions of the destination are copied from the corresponding fields of the first source operand (the second operand). The second source operand can be either an YMM register or a 256-bit memory location. The high 7 bits of the immediate are ignored. The destination operand is a ZMM register and updated at 32/64-bit granularity according to the writemask.

## Operation

```text
VINSERTF32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128 (VEX encoded version)
TEMP[255:0] := SRC1[255:0]
CASE (imm8[0]) OF

    0: TEMP[127:0] := SRC2[127:0]
    1: TEMP[255:128] := SRC2[127:0]
ESAC
DEST := TEMP
```

## Intel C/C++ compiler intrinsics

```c
VINSERTF32x4 __m512 _mm512_insertf32x4( __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_mask_insertf32x4(__m512 s, __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_maskz_insertf32x4( __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_insertf32x4( __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_mask_insertf32x4(__m256 s, __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_maskz_insertf32x4( __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x8 __m512 _mm512_insertf32x8( __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_mask_insertf32x8(__m512 s, __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_maskz_insertf32x8( __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF64x2 __m512d _mm512_insertf64x2( __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_mask_insertf64x2(__m512d s, __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_maskz_insertf64x2( __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_insertf64x2( __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_mask_insertf64x2(__m256d s, __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_maskz_insertf64x2( __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x4 __m512d _mm512_insertf64x4( __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_mask_insertf64x4(__m512d s, __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_maskz_insertf64x4( __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF128 __m256 _mm256_insertf128_ps (__m256 a, __m128 b, int offset);
VINSERTF128 __m256d _mm256_insertf128_pd (__m256d a, __m128d b, int offset);
VINSERTF128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD Floating-Point Exceptions

None

## Other Exceptions

VEX-encoded instruction, see Table 2-23, "Type 6 Class Exception Conditions."

Additionally:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded instruction, see Table 2-56, "Type E6NF Class Exception Conditions."

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

Opcode/                           Op / 64/32     CPUID Feature Description Instruction                       En  Bit Mode Flag Support

VEX.256.66.0F3A.W0 38 /r ib       A   V/V        AVX2           Insert 128 bits of integer data from xmm3/m128 and the remaining values from ymm2 into ymm1. VINSERTI128 ymm1, ymm2, xmm3/m128, imm8

EVEX.256.66.0F3A.W0 38 /r ib      C   V/V        (AVX512VL AND  Insert 128 bits of packed doubleword integer

```text
                                                 AVX512F) OR    values from xmm3/m128 and the remaining
```

VINSERTI32X4 ymm1 {k1}{z}, ymm2,

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W0 38 /r ib      C   V/V        AVX512F        Insert 128 bits of packed doubleword integer

```text
                                                 OR AVX10.1     values from xmm3/m128 and the remaining
```

VINSERTI32X4 zmm1 {k1}{z}, zmm2, values from zmm2 into zmm1 under writemask xmm3/m128, imm8                                                 k1.

EVEX.256.66.0F3A.W1 38 /r ib      B   V/V        (AVX512VL AND  Insert 128 bits of packed quadword integer

VINSERTI64X2 ymm1 {k1}{z}, ymm2,                 AVX512DQ) OR   values from xmm3/m128 and the remaining

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W1 38 /r ib      B   V/V        AVX512DQ OR    Insert 128 bits of packed quadword integer AVX10.1 VINSERTI64X2 zmm1 {k1}{z}, zmm2,                                values from xmm3/m128 and the remaining values from zmm2 into zmm1 under writemask xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W0 3A /r ib      D   V/V        AVX512DQ OR    Insert 256 bits of packed doubleword integer AVX10.1 VINSERTI32X8 zmm1 {k1}{z}, zmm2,                                values from ymm3/m256 and the remaining values from zmm2 into zmm1 under writemask ymm3/m256, imm8                                                 k1.

EVEX.512.66.0F3A.W1 3A /r ib      C   V/V        AVX512F        Insert 256 bits of packed quadword integer OR AVX10.1 VINSERTI64X4 zmm1 {k1}{z}, zmm2,                                values from ymm3/m256 and the remaining values from zmm2 into zmm1 under writemask ymm3/m256, imm8                                                 k1.

## Description

VINSERTI32x4 and VINSERTI64x2 inserts 128-bits of packed integer values from the second source operand (the third operand) into the destination operand (the first operand) at an 128-bit granular offset multiplied by imm8[0] (256-bit) or imm8[1:0]. The remaining portions of the destination are copied from the corresponding fields of the first source operand (the second operand). The second source operand can be either an XMM register or a 128-bit memory location. The high 6/7bits of the immediate are ignored. The destination operand is a ZMM/YMM register and updated at 32 and 64-bit granularity according to the writemask.

VINSERTI32x8 and VINSERTI64x4 inserts 256-bits of packed integer values from the second source operand (the third operand) into the destination operand (the first operand) at a 256-bit granular offset multiplied by imm8[0]. The remaining portions of the destination are copied from the corresponding fields of the first source operand (the second operand). The second source operand can be either an YMM register or a 256-bit memory location. The

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

upper bits of the immediate are ignored. The destination operand is a ZMM register and updated at 32 and 64-bit granularity according to the writemask.

VINSERTI128 inserts 128-bits of packed integer data from the second source operand (the third operand) into the destination operand (the first operand) at a 128-bit granular offset multiplied by imm8[0]. The remaining portions of the destination are copied from the corresponding fields of the first source operand (the second operand). The second source operand can be either an XMM register or a 128-bit memory location. The high 7 bits of the immediate are ignored. VEX.L must be 1, otherwise attempt to execute this instruction with VEX.L=0 will cause #UD.

## Operation

```text
VINSERTI32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

      THEN DEST[i+63:i] := TMP_DEST[i+63:i]

      ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                        ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128

TEMP[255:0] := SRC1[255:0]

CASE (imm8[0]) OF

0: TEMP[127:0] := SRC2[127:0]

1: TEMP[255:128] := SRC2[127:0]

ESAC

DEST := TEMP
```

## Intel C/C++ compiler intrinsics

```c
VINSERTI32x4 _mm512i _inserti32x4( __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _mask_inserti32x4(__m512i s, __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _maskz_inserti32x4( __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_inserti32x4( __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_mask_inserti32x4(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_maskz_inserti32x4( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x8 __m512i _mm512_inserti32x8( __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_mask_inserti32x8(__m512i s, __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_maskz_inserti32x8( __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI64x2 __m512i _mm512_inserti64x2( __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_mask_inserti64x2(__m512i s, __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_maskz_inserti64x2( __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_inserti64x2( __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_mask_inserti64x2(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_maskz_inserti64x2( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x4 _mm512_inserti64x4( __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_mask_inserti64x4(__m512i s, __mmask8 k, __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_maskz_inserti64x4( __mmask m, __m512i a, __m256i b, int imm);
VINSERTI128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD Floating-Point Exceptions

None.

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

## Other Exceptions

VEX-encoded instruction, see Table 2-23, "Type 6 Class Exception Conditions."

Additionally:

```text
#UD               If VEX.L = 0.
```

EVEX-encoded instruction, see Table 2-56, "Type E6NF Class Exception Conditions."

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values
