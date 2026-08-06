---
summary: Double Block Packed Sum-Absolute-Differences (SAD) on Unsigned Bytes
---

## Description

Compute packed SAD (sum of absolute differences) word results of unsigned bytes from two 32-bit dword elements. Packed SAD word results are calculated in multiples of qword superblocks, producing 4 SAD word results in each 64-bit superblock of the destination register.

Within each super block of packed word results, the SAD results from two 32-bit dword elements are calculated as follows:

* The lower two word results are calculated each from the SAD operation between a sliding dword element within

a qword superblock from an intermediate vector with a stationary dword element in the corresponding qword superblock of the first source operand. The intermediate vector, see "Tmp1" in Figure 5-8, is constructed from the second source operand the imm8 byte as shuffle control to select dword elements within a 128-bit lane of the second source operand. The two sliding dword elements in a qword superblock of Tmp1 are located at byte offset 0 and 1 within the superblock, respectively. The stationary dword element in the qword superblock from the first source operand is located at byte offset 0.

* The next two word results are calculated each from the SAD operation between a sliding dword element within

a qword superblock from the intermediate vector Tmp1 with a second stationary dword element in the corresponding qword superblock of the first source operand. The two sliding dword elements in a qword superblock of Tmp1 are located at byte offset 2and 3 within the superblock, respectively. The stationary dword element in the qword superblock from the first source operand is located at byte offset 4.

* The intermediate vector is constructed in 128-bits lanes. Within each 128-bit lane, each dword element of the

intermediate vector is selected by a two-bit field within the imm8 byte on the corresponding 128-bits of the second source operand. The imm8 byte serves as dword shuffle control within each 128-bit lanes of the intermediate vector and the second source operand, similarly to PSHUFD.

The first source operand is a ZMM/YMM/XMM register. The second source operand is a ZMM/YMM/XMM register, or a 512/256/128-bit memory location. The destination operand is conditionally updated based on writemask k1 at 16-bit word granularity.

```text
                            127+128*n                   95+128*n                    63+128*n                               31+128*n                 128*n
                                               DW3                    DW2                        DW1                                 DW0
```

128-bit Lane of Src2

```text
                                                    imm8 shuffle control                                                                  00B: DW0
```

01B: DW1

```text
                                                                             7      5            3                 10                     10B: DW2
```

11B: DW3

```text
                                127+128*n               95+128*n                    63+128*n                               31+128*n                 128*n
```

128-bit Lane of Tmp1

Tmp1 qword superblock

55 47 39 31 24                                                                                      39 31 23 15 8

```text
                                      Tmp1 sliding dword                                                                                 Tmp1 sliding dword
```

63 55 47 39 32                                                                                   31 23 15 7 0

```text
                                                    Src1 stationary dword 1                       ____                                    Src1 stationary dword 0
```

_                     _     _                    _                                                abs abs abs abs

abs abs abs abs

```text
                         +                          47 39 31 23 16                                                 +
```

```text
                                                                             Tmp1 sliding dword                              31 23 15 7 0
```

Tmp1 sliding dword

```text
                                                    63 55 47 39 32                                                     31 23 15 7 0                          Src1 stationary dword 0
```

Src1 stationary dword 1 ____ ____ abs abs abs abs abs abs abs abs

```text
                                                    +                                                                                     +
```

```text
                                             63     47                          31                                     15                    0
```

Destination qword superblock

Figure 5-8. 64-bit Super Block of SAD Operation in VDBPSADBW

## Operation

```text
VDBPSADBW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
Selection of quadruplets:
FOR I = 0 to VL step 128

    TMP1[I+31:I] := select (SRC2[I+127: I], imm8[1:0])
    TMP1[I+63: I+32] := select (SRC2[I+127: I], imm8[3:2])
    TMP1[I+95: I+64] := select (SRC2[I+127: I], imm8[5:4])
    TMP1[I+127: I+96] := select (SRC2[I+127: I], imm8[7:6])
END FOR

SAD of quadruplets:

FOR I =0 to VL step 64
    TMP_DEST[I+15:I] := ABS(SRC1[I+7: I] - TMP1[I+7: I]) +
          ABS(SRC1[I+15: I+8]- TMP1[I+15: I+8]) +


     ABS(SRC1[I+23: I+16]- TMP1[I+23: I+16]) +
     ABS(SRC1[I+31: I+24]- TMP1[I+31: I+24])

TMP_DEST[I+31: I+16] := ABS(SRC1[I+7: I] - TMP1[I+15: I+8]) +
      ABS(SRC1[I+15: I+8]- TMP1[I+23: I+16]) +
      ABS(SRC1[I+23: I+16]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+31: I+24]- TMP1[I+39: I+32])

TMP_DEST[I+47: I+32] := ABS(SRC1[I+39: I+32] - TMP1[I+23: I+16]) +
      ABS(SRC1[I+47: I+40]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+55: I+48]- TMP1[I+39: I+32]) +
      ABS(SRC1[I+63: I+56]- TMP1[I+47: I+40])

    TMP_DEST[I+63: I+48] := ABS(SRC1[I+39: I+32] - TMP1[I+31: I+24]) +
          ABS(SRC1[I+47: I+40] - TMP1[I+39: I+32]) +
          ABS(SRC1[I+55: I+48] - TMP1[I+47: I+40]) +
          ABS(SRC1[I+63: I+56] - TMP1[I+55: I+48])

ENDFOR

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

        IF *merging-masking*                ; merging-masking

             THEN *DEST[i+15:i] remains unchanged*

             ELSE                           ; zeroing-masking

                    DEST[i+15:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VDBPSADBW __m512i _mm512_dbsad_epu8(__m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_mask_dbsad_epu8(__m512i s, __mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_maskz_dbsad_epu8(__mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m256i _mm256_dbsad_epu8(__m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_mask_dbsad_epu8(__m256i s, __mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_maskz_dbsad_epu8(__mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m128i _mm_dbsad_epu8(__m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_mask_dbsad_epu8(__m128i s, __mmask8 m, __m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_maskz_dbsad_epu8(__mmask8 m, __m128i a, __m128i b int imm8);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Exceptions Type E4NF.nb in Table 2-52, "Type E4NF Class Exception Conditions."
