---
summary: Perform Two Rounds of SHA512 Operation
---

## Description

The VSHA512RNDS2 instruction performs two rounds of SHA512 operation using initial SHA512 state (C,D,G,H) from the first operand, an initial SHA512 state (A,B,E,F) from the second operand, and a pre-computed sum of the next two round message qwords and the corresponding round constants from the third operand (only the two lower qwords of the third operand). The updated SHA512 state (A,B,E,F) is written to the first operand, and the second operand can be used as the updated state (C,D,G,H) in later rounds.

See https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf for more information on the SHA512 standard.

## Operation

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define cap_sigma0(qword):
    return ROR64(qword,28) ^ ROR64(qword, 34) ^ ROR64(qword, 39)

define cap_sigma1(qword):
    return ROR64(qword,14) ^ ROR64(qword, 18) ^ ROR64(qword, 41)

define MAJ(a,b,c):
    return (a & b) ^ (a & c) ^ (b & c)

define CH(e,f,g):
    return (e & f) ^ (g & ~e)


VSHA512RNDS2 SRCDEST, SRC1, SRC2
A[0] := SRC1.qword[3]
B[0] := SRC1.qword[2]
C[0] := SRCDEST.qword[3]
D[0] := SRCDEST.qword[2]
E[0] := SRC1.qword[1]
F[0] := SRC1.qword[0]
G[0] := SRCDEST.qword[1]
H[0] := SRCDEST.qword[0]
WK[0]:= SRC2.qword[0]
WK[1]:= SRC2.qword[1]

FOR i in 0..1:
    A[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] +
          MAJ(A[i], B[i], C[i]) +
          cap_sigma0(A[i])
    B[i+1] := A[i]
    C[i+1] := B[i]
    D[i+1] := C[i]
    E[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] + D[i]
    F[i+1] := E[i]
    G[i+1] := F[i]
    H[i+1] := G[i]

SRCDEST.qword[3] = A[2]
SRCDEST.qword[2] = B[2]
SRCDEST.qword[1] = E[2]
SRCDEST.qword[0] = F[2]
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VSHA512RNDS2 __m256i _mm256_sha512rnds2_epi64 (__m256i __A, __m256i __B, __m128i __C);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-23, "Type 6 Class Exception Conditions."

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

Opcode/                        Op / 64/32     CPUID Feature  Description Instruction                    En bit Mode Flag Support

EVEX.256.66.0F3A.W0 23 /r ib   A  V/V         (AVX512VL AND  Shuffle 128-bit packed single-precision floating-

VSHUFF32X4 ymm1{k1}{z}, ymm2,                 AVX512F) OR    point values selected by imm8 from ymm2 and

```text
                                              AVX10.1        ymm3/m256/m32bcst and place results in ymm1
```

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W0 23 /r ib   A  V/V         AVX512F        Shuffle 128-bit packed single-precision floating- OR AVX10.1 VSHUFF32x4 zmm1{k1}{z}, zmm2,                                point values selected by imm8 from zmm2 and zmm3/m512/m32bcst and place results in zmm1 zmm3/m512/m32bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W1 23 /r ib   A  V/V         (AVX512VL AND  Shuffle 128-bit packed double precision floating-

VSHUFF64X2 ymm1{k1}{z}, ymm2,                 AVX512F) OR    point values selected by imm8 from ymm2 and

```text
                                              AVX10.1        ymm3/m256/m64bcst and place results in ymm1
```

ymm3/m256/m64bcst, imm8 subject to writemask k1.

EVEX.512.66.0F3A.W1 23 /r ib   A  V/V         AVX512F        Shuffle 128-bit packed double precision floating-

```text
                                              OR AVX10.1     point values selected by imm8 from zmm2 and
```

VSHUFF64x2 zmm1{k1}{z}, zmm2,                                zmm3/m512/m64bcst and place results in zmm1

zmm3/m512/m64bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W0 43 /r ib   A  V/V         (AVX512VL AND  Shuffle 128-bit packed double-word values

```text
                                              AVX512F) OR    selected by imm8 from ymm2 and
```

VSHUFI32X4 ymm1{k1}{z}, ymm2,                 AVX10.1        ymm3/m256/m32bcst and place results in ymm1

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W0 43 /r ib   A  V/V         AVX512F        Shuffle 128-bit packed double-word values

```text
                                              OR AVX10.1     selected by imm8 from zmm2 and
```

VSHUFI32x4 zmm1{k1}{z}, zmm2,                                zmm3/m512/m32bcst and place results in zmm1

zmm3/m512/m32bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W1 43 /r ib   A  V/V         (AVX512VL AND  Shuffle 128-bit packed quad-word values selected

```text
                                              AVX512F) OR    by imm8 from ymm2 and ymm3/m256/m64bcst
```

VSHUFI64X2 ymm1{k1}{z}, ymm2,                 AVX10.1        and place results in ymm1 subject to writemask k1.

ymm3/m256/m64bcst, imm8

EVEX.512.66.0F3A.W1 43 /r ib   A  V/V         AVX512F        Shuffle 128-bit packed quad-word values selected OR AVX10.1 VSHUFI64x2 zmm1{k1}{z}, zmm2,                                by imm8 from zmm2 and zmm3/m512/m64bcst and place results in zmm1 subject to writemask k1. zmm3/m512/m64bcst, imm8

## Description

256-bit Version: Moves one of the two 128-bit packed single precision floating-point values from the first source operand (second operand) into the low 128-bit of the destination operand (first operand); moves one of the two packed 128-bit floating-point values from the second source operand (third operand) into the high 128-bit of the destination operand. The selector operand (third operand) determines which values are moved to the destination operand.

512-bit Version: Moves two of the four 128-bit packed single precision floating-point values from the first source operand (second operand) into the low 256-bit of each double qword of the destination operand (first operand); moves two of the four packed 128-bit floating-point values from the second source operand (third operand) into the high 256-bit of the destination operand. The selector operand (third operand) determines which values are moved to the destination operand.

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

The first source operand is a vector register. The second source operand can be a ZMM register, a 512-bit memory location or a 512-bit vector broadcasted from a 32/64-bit memory location. The destination operand is a vector register.

The writemask updates the destination operand with the granularity of 32/64-bit data elements.

## Operation

```text
Select2(SRC, control) {
CASE (control[0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
ESAC;
RETURN TMP
}

Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
    2: TMP := SRC[383:256];
    3: TMP := SRC[511:384];
ESAC;
RETURN TMP
}

VSHUFF32x4 (EVEX versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE *zeroing-masking*    ; zeroing-masking

                       THEN DEST[i+31:i] := 0

                  FI;

     FI;

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

ENDFOR
DEST[MAXVL-1:VL] := 0

VSHUFF64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI32x4 (EVEX 512-bit version)
(KL, VL) = (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]
    FI;
ENDFOR;
IF VL = 256
    TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);
    TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);
FI;
IF VL = 512
    TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);
    TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);
    TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);
    TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity
```

## Intel C/C++ compiler intrinsics

```c
VSHUFI32x4 __m512i _mm512_shuffle_i32x4(__m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_mask_shuffle_i32x4(__m512i s, __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_maskz_shuffle_i32x4( __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m256i _mm256_shuffle_i32x4(__m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_mask_shuffle_i32x4(__m256i s, __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_maskz_shuffle_i32x4( __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFF32x4 __m512 _mm512_shuffle_f32x4(__m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_mask_shuffle_f32x4(__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_maskz_shuffle_f32x4( __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFI64x2 __m512i _mm512_shuffle_i64x2(__m512i a, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_mask_shuffle_i64x2(__m512i s, __mmask8 k, __m512i b, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_maskz_shuffle_i64x2( __mmask8 k, __m512i a, __m512i b, int imm);
VSHUFF64x2 __m512d _mm512_shuffle_f64x2(__m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_mask_shuffle_f64x2(__m512d s, __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_maskz_shuffle_f64x2( __mmask8 k, __m512d a, __m512d b, int imm);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-52, "Type E4NF Class Exception Conditions."

Additionally:

```text
#UD               If EVEX.L'L = 0 for VSHUFF32x4/VSHUFF64x2.
```

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity
