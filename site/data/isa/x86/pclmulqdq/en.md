---
summary: Carry-Less Multiplication Quadword
---

## Description

Performs packed carry-less multiplication of quadword pairs. XMM versions perform a single multiply of a pair of

quadwords. YMM versions perform two packed multiplies of pairs of quadwords. ZMM versions perform four packed multiplies of pairs of quadwords. Bits 4 and 0 are used to select which 64-bit half of each operand to use according to Table 4-14, other bits of the immediate byte are ignored.

The EVEX encoded form of this instruction does not support memory fault suppression.

**PCLMULQDQ Quadword Selection of Immediate Byte**

| Imm[4] | Imm[0] | PCLMULQDQ Operation |
| --- | --- | --- |
| 0 | CL_MUL( SRC21[ | 63:0], SRC1[63:0] ) |

**Pseudo-Op and PCLMULQDQ Implementation  Imm8 Encoding**

| Pseudo-Op | Imm8 Encoding |
| --- | --- |
| PCLMULLQLQDQ xmm1, xmm2 | 0000_0000B |
| PCLMULHQLQDQ xmm1, xmm2 | 0000_0001B |
| PCLMULLQHQDQ xmm1, xmm2 | 0001_0000B |
| PCLMULHQHQDQ xmm1, xmm2 | 0001_0001B |

## Operation

```text
define PCLMUL128(X,Y):             // helper function

   FOR i := 0 to 63:

   TMP [ i ] := X[ 0 ] and Y[ i ]

   FOR j := 1 to i:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   FOR i := 64 to 126:

   TMP [ i ] := 0

   FOR j := i - 63 to 63:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   DEST[127] := 0;

   RETURN DEST                     // 128b vector


PCLMULQDQ (SSE Version)
IF imm8[0] = 0:

    TEMP1 := SRC1.qword[0]
ELSE:

    TEMP1 := SRC1.qword[1]
IF imm8[4] = 0:

    TEMP2 := SRC2.qword[0]
ELSE:

    TEMP2 := SRC2.qword[1]
DEST[127:0] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:128] (Unmodified)

VPCLMULQDQ (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR i= 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0

VPCLMULQDQ (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
(V)PCLMULQDQ __m128i _mm_clmulepi64_si128 (__m128i, __m128i, const int) VPCLMULQDQ __m256i _mm256_clmulepi64_epi128(__m256i, __m256i, const int);
VPCLMULQDQ __m512i _mm512_clmulepi64_epi128(__m512i, __m512i, const int);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-21, "Type 4 Class Exception Conditions," additionally:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded: See Table 2-52, "Type E4NF Class Exception Conditions."
