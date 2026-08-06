---
summary: Load Sparse Packed Single Precision Floating-Point Values From Dense Memory
---

## Description

Expand (load) up to 16/8/4, contiguous, single precision floating-point values of the input vector in the source operand (the second operand) to sparse elements of the destination operand (the first operand) selected by the writemask k1.

The destination operand is a ZMM/YMM/XMM register, the source operand can be a ZMM/YMM/XMM register or a 512/256/128-bit memory location.

The input vector starts from the lowest element in the source operand. The writemask k1 selects the destination elements (a partial vector or sparse elements if less than 16 elements) to be replaced by the ascending elements in the input vector. Destination elements not selected by the writemask k1 are either unmodified or zeroed, depending on EVEX.z.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

Note that the compressed displacement assumes a pre-scaling (N) corresponding to the size of one single element instead of the size of the full vector.

## Operation

```text
VEXPANDPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

        THEN

             DEST[i+31:i] := SRC[k+31:k];

             k := k + 32

        ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VEXPANDPS __m512 _mm512_mask_expand_ps( __m512 s, __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_maskz_expand_ps( __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_mask_expandloadu_ps( __m512 s, __mmask16 k, void * a);
VEXPANDPS __m512 _mm512_maskz_expandloadu_ps( __mmask16 k, void * a);
VEXPANDPD __m256 _mm256_mask_expand_ps( __m256 s, __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_maskz_expand_ps( __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_mask_expandloadu_ps( __m256 s, __mmask8 k, void * a);
VEXPANDPD __m256 _mm256_maskz_expandloadu_ps( __mmask8 k, void * a);
VEXPANDPD __m128 _mm_mask_expand_ps( __m128 s, __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_maskz_expand_ps( __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_mask_expandloadu_ps( __m128 s, __mmask8 k, void * a);
VEXPANDPD __m128 _mm_maskz_expandloadu_ps( __mmask8 k, void * a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Exceptions Type E4.nb in Table 2-51, "Type E4 Class Exception Conditions."

Additionally:

```text
#UD                       If EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

Opcode/                           Op / 64/32  CPUID Feature        Description Instruction                       En Bit Mode Flag Support

VEX.256.66.0F3A.W0 19 /r ib       A  V/V      AVX                  Extract 128 bits of packed floating-point values from ymm2 and store results in xmm1/m128. VEXTRACTF128 xmm1/m128, ymm2,

imm8

EVEX.256.66.0F3A.W0 19 /r ib      C  V/V      (AVX512VL AND        Extract 128 bits of packed single precision

```text
                                              AVX512F) OR          floating-point values from ymm2 and store
```

VEXTRACTF32X4 xmm1/m128 {k1}{z},

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 19 /r ib      C  V/V      AVX512F              Extract 128 bits of packed single precision

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32x4 xmm1/m128 {k1}{z},                                   results in xmm1/m128 subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 19 /r ib      B  V/V      (AVX512VL AND        Extract 128 bits of packed double precision

VEXTRACTF64X2 xmm1/m128 {k1}{z},              AVX512DQ) OR         floating-point values from ymm2 and store

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W1 19 /r ib      B  V/V      AVX512DQ             Extract 128 bits of packed double precision OR AVX10.1 VEXTRACTF64X2 xmm1/m128 {k1}{z},                                   floating-point values from zmm2 and store results in xmm1/m128 subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W0 1B /r ib      D  V/V      AVX512DQ             Extract 256 bits of packed single precision

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32X8 ymm1/m256 {k1}{z}, results in ymm1/m256 subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 1B /r ib      C  V/V      AVX512F              Extract 256 bits of packed double precision

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF64x4 ymm1/m256 {k1}{z},                                   results in ymm1/m256 subject to writemask k1.

zmm2, imm8

## Description

VEXTRACTF128/VEXTRACTF32x4 and VEXTRACTF64x2 extract 128-bits of single precision floating-point values from the source operand (the second operand) and store to the low 128-bit of the destination operand (the first operand). The 128-bit data extraction occurs at an 128-bit granular offset specified by imm8[0] (256-bit) or imm8[1:0] as the multiply factor. The destination may be either a vector register or an 128-bit memory location.

VEXTRACTF32x4: The low 128-bit of the destination operand is updated at 32-bit granularity according to the writemask.

VEXTRACTF32x8 and VEXTRACTF64x4 extract 256-bits of double precision floating-point values from the source operand (second operand) and store to the low 256-bit of the destination operand (the first operand). The 256-bit data extraction occurs at an 256-bit granular offset specified by imm8[0] (256-bit) or imm8[0] as the multiply factor The destination may be either a vector register or a 256-bit memory location.

VEXTRACTF64x4: The low 256-bit of the destination operand is updated at 64-bit granularity according to the writemask.

VEX.vvvv and EVEX.vvvv are reserved and must be 1111b otherwise instructions will #UD.

The high 6 bits of the immediate are ignored.

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

If VEXTRACTF128 is encoded with VEX.L= 0, an attempt to execute the instruction encoded with VEX.L= 0 will cause an #UD exception.

## Operation

```text
VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is a Register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 3
    i := j * 32
    IF k1[j] OR *no writemask*

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]  ; merging-masking
          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is a Register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

    i := j * 64                                  ; merging-masking
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

        IF *merging-masking*                      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*                ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE ; merging-masking
                *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF128 (Memory Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTF128 (Register Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VEXTRACTF32x4 __m128 _mm512_extractf32x4_ps(__m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_maskz_extractf32x4_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_extractf32x4_ps(__m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_maskz_extractf32x4_ps( __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_extractf32x8_ps(__m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_mask_extractf32x8_ps(__m256 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_maskz_extractf32x8_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_extractf64x2_pd(__m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_maskz_extractf64x2_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_extractf64x2_pd(__m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_maskz_extractf64x2_pd( __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_extractf64x4_pd( __m512d a, const int nidx);
VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values VEXTRACTF64x4 __m256d _mm512_mask_extractf64x4_pd(__m256d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_maskz_extractf64x4_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF128 __m128 _mm256_extractf128_ps (__m256 a, int offset);
VEXTRACTF128 __m128d _mm256_extractf128_pd (__m256d a, int offset);
VEXTRACTF128 __m128i_mm256_extractf128_si256(__m256i a, int offset);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

VEX-encoded instructions, see Table 2-23, "Type 6 Class Exception Conditions."

EVEX-encoded instructions, see Table 2-56, "Type E6NF Class Exception Conditions."

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

Opcode/                           Op / 64/32     CPUID Feature     Description Instruction                       En Bit Mode Flag Support

VEX.256.66.0F3A.W0 39 /r ib       A  V/V         AVX2              Extract 128 bits of integer data from ymm2 and store results in xmm1/m128. VEXTRACTI128 xmm1/m128, ymm2, imm8

EVEX.256.66.0F3A.W0 39 /r ib      C  V/V         (AVX512VL AND     Extract 128 bits of double-word integer values

```text
                                                 AVX512F) OR       from ymm2 and store results in xmm1/m128
```

VEXTRACTI32X4 xmm1/m128 {k1}{z},

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 39 /r ib      C  V/V         AVX512F           Extract 128 bits of double-word integer values

```text
                                                 OR AVX10.1        from zmm2 and store results in xmm1/m128
```

VEXTRACTI32x4 xmm1/m128 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 39 /r ib      B  V/V         (AVX512VL AND     Extract 128 bits of quad-word integer values

VEXTRACTI64X2 xmm1/m128 {k1}{z},                 AVX512DQ) OR      from ymm2 and store results in xmm1/m128

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W1 39 /r ib      B  V/V         AVX512DQ          Extract 128 bits of quad-word integer values OR AVX10.1 VEXTRACTI64X2 xmm1/m128 {k1}{z},                                   from zmm2 and store results in xmm1/m128 subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W0 3B /r ib      D  V/V         AVX512DQ          Extract 256 bits of double-word integer values

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI32X8 ymm1/m256 {k1}{z}, subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 3B /r ib      C  V/V         AVX512F           Extract 256 bits of quad-word integer values

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI64x4 ymm1/m256 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

## Description

VEXTRACTI128/VEXTRACTI32x4 and VEXTRACTI64x2 extract 128-bits of doubleword integer values from the source operand (the second operand) and store to the low 128-bit of the destination operand (the first operand). The 128-bit data extraction occurs at an 128-bit granular offset specified by imm8[0] (256-bit) or imm8[1:0] as the multiply factor. The destination may be either a vector register or an 128-bit memory location.

VEXTRACTI32x4: The low 128-bit of the destination operand is updated at 32-bit granularity according to the writemask.

VEXTRACTI64x2: The low 128-bit of the destination operand is updated at 64-bit granularity according to the writemask.

VEXTRACTI32x8 and VEXTRACTI64x4 extract 256-bits of quadword integer values from the source operand (the second operand) and store to the low 256-bit of the destination operand (the first operand). The 256-bit data extraction occurs at an 256-bit granular offset specified by imm8[0] (256-bit) or imm8[0] as the multiply factor The destination may be either a vector register or a 256-bit memory location.

VEXTRACTI32x8: The low 256-bit of the destination operand is updated at 32-bit granularity according to the writemask.

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

VEXTRACTI64x4: The low 256-bit of the destination operand is updated at 64-bit granularity according to the writemask.

VEX.vvvv and EVEX.vvvv are reserved and must be 1111b otherwise instructions will #UD.

The high 7 bits (6 bits in EVEX.512) of the immediate are ignored.

If VEXTRACTI128 is encoded with VEX.L= 0, an attempt to execute the instruction encoded with VEX.L= 0 will cause an #UD exception.

## Operation

```text
VEXTRACTI32x4 (EVEX encoded versions) when destination is a register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI32x4 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

FI;

FOR j := 0 TO 3                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI64x2 (EVEX encoded versions) when destination is a register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI64x2 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

          11: TMP_DEST[127:0] := SRC1[511:384]
    ESAC.
FI;

FOR j := 0 TO 1                                  ; merging-masking
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is memory

CASE (imm8[0]) OF

0: TMP_DEST[255:0] := SRC1[255:0]

1: TMP_DEST[255:0] := SRC1[511:256]

ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE *DEST[i+63:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VEXTRACTI128 (memory destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTI128 (register destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values
```

## Intel C/C++ compiler intrinsics

```c
VEXTRACTI32x4 __m128i _mm512_extracti32x4_epi32(__m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_maskz_extracti32x4_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_extracti32x4_epi32(__m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_maskz_extracti32x4_epi32( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_extracti32x8_epi32(__m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_mask_extracti32x8_epi32(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_maskz_extracti32x8_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_extracti64x2_epi64(__m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_maskz_extracti64x2_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_extracti64x2_epi64(__m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_maskz_extracti64x2_epi64( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_extracti64x4_epi64(__m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_mask_extracti64x4_epi64(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_maskz_extracti64x4_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI128 __m128i _mm256_extracti128_si256(__m256i a, int offset);
```

## SIMD Floating-Point Exceptions

None

## Other Exceptions

VEX-encoded instructions, see Table 2-23, "Type 6 Class Exception Conditions."

EVEX-encoded instructions, see Table 2-56, "Type E6NF Class Exception Conditions."

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values
