---
summary: Compare Packed Double Precision Floating-Point Values
---

## Description

Performs a SIMD compare of the packed double precision floating-point values in the second source operand and the first source operand and returns the result of the comparison to the destination operand. The comparison predicate operand (immediate byte) specifies the type of comparison performed on each pair of packed values in the two source operands.

EVEX encoded versions: The first source operand (second operand) is a ZMM/YMM/XMM register. The second source operand can be a ZMM/YMM/XMM register, a 512/256/128-bit memory location or a 512/256/128-bit vector broadcasted from a 64-bit memory location. The destination operand (first operand) is an opmask register. Comparison results are written to the destination operand under the writemask k2. Each comparison result is a single mask bit of 1 (comparison true) or 0 (comparison false).

VEX.256 encoded version: The first source operand (second operand) is a YMM register. The second source operand (third operand) can be a YMM register or a 256-bit memory location. The destination operand (first operand) is a YMM register. Four comparisons are performed with results written to the destination operand. The result of each comparison is a quadword mask of all 1s (comparison true) or all 0s (comparison false).

128-bit Legacy SSE version: The first source and destination operand (first operand) is an XMM register. The second source operand (second operand) can be an XMM register or 128-bit memory location. Bits (MAXVL-1:128) of the corresponding ZMM destination register remain unchanged. Two comparisons are performed with results

written to bits 127:0 of the destination operand. The result of each comparison is a quadword mask of all 1s (comparison true) or all 0s (comparison false).

VEX.128 encoded version: The first source operand (second operand) is an XMM register. The second source operand (third operand) can be an XMM register or a 128-bit memory location. Bits (MAXVL-1:128) of the destination ZMM register are zeroed. Two comparisons are performed with results written to bits 127:0 of the destination operand.

The comparison predicate operand is an 8-bit immediate:

* For instructions encoded using the VEX or EVEX prefix, bits 4:0 define the type of comparison to be performed

(see Table 3-8). Bits 5 through 7 of the immediate are reserved.

* For instruction encodings that do not use VEX prefix, bits 2:0 define the type of comparison to be made (see

the first 8 rows of Table 3-8). Bits 3 through 7 of the immediate are reserved.

**Comparison Predicate for CMPPD and CMPPS Instructions**

| EQ_OQ (EQ) | 0H | Equal (ordered, non-signaling) | False | False | True | False | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | Less-than (ordered, signaling) | False | True | False | False | Yes |
| LE_OS (LE) | 2H | Less-than-or-equal (ordered, signaling) | False | True | True | False | Yes |
| UNORD_Q (UNORD) | 3H | Unordered (non-signaling) | False | False | False | True | No |
| NEQ_UQ (NEQ) | 4H | Not-equal (unordered, non-signaling) | True | True | False | True | No |
| NLT_US (NLT) | 5H | Not-less-than (unordered, signaling) | True | False | True | True | Yes |
| NLE_US (NLE) | 6H | Not-less-than-or-equal (unordered, signaling) | True | False | False | True | Yes |
| ORD_Q (ORD) | 7H | Ordered (non-signaling) | True | True | True | False | No |
| EQ_UQ | 8H | Equal (unordered, non-signaling) | False | False | True | True | No |
| NGE_US (NGE) | 9H | Not-greater-than-or-equal (unordered, signaling) | False | True | False | True | Yes |
| NGT_US (NGT) | AH | Not-greater-than (unordered, signaling) | False | True | True | True | Yes |
| FALSE_OQ(FALSE) | BH | False (ordered, non-signaling) | False | False | False | False | No |
| NEQ_OQ | CH | Not-equal (ordered, non-signaling) | True | True | False | False | No |
| GE_OS (GE) | DH | Greater-than-or-equal (ordered, signaling) | True | False | True | False | Yes |
| GT_OS (GT) | EH | Greater-than (ordered, signaling) | True | False | False | False | Yes |
| TRUE_UQ(TRUE) | FH | True (unordered, non-signaling) | True | True | True | True | No |
| EQ_OS | 10H | Equal (ordered, signaling) | False | False | True | False | Yes |
| LT_OQ | 11H | Less-than (ordered, nonsignaling) | False | True | False | False | No |
| LE_OQ | 12H | Less-than-or-equal (ordered, nonsignaling) | False | True | True | False | No |
| UNORD_S | 13H | Unordered (signaling) | False | False | False | True | Yes |
| NEQ_US | 14H | Not-equal (unordered, signaling) | True | True | False | True | Yes |
| NLT_UQ | 15H | Not-less-than (unordered, nonsignaling) | True | False | True | True | No |
| NLE_UQ | 16H | Not-less-than-or-equal (unordered, nonsig- naling) | True | False | False | True | No |
| ORD_S | 17H | Ordered (signaling) | True | True | True | False | Yes |
| EQ_US | 18H | Equal (unordered, signaling) | False | False | True | True | Yes |

**Comparison Predicate for CMPPD and CMPPS Instructions (Contd.)**

| EQ_OQ (EQ) | 0H | Equal (ordered, non-signaling) | False | False | True | False | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | Less-than (ordered, signaling) | False | True | False | False | Yes |
| LE_OS (LE) | 2H | Less-than-or-equal (ordered, signaling) | False | True | True | False | Yes |
| UNORD_Q (UNORD) | 3H | Unordered (non-signaling) | False | False | False | True | No |
| NEQ_UQ (NEQ) | 4H | Not-equal (unordered, non-signaling) | True | True | False | True | No |
| NLT_US (NLT) | 5H | Not-less-than (unordered, signaling) | True | False | True | True | Yes |
| NLE_US (NLE) | 6H | Not-less-than-or-equal (unordered, signaling) | True | False | False | True | Yes |
| ORD_Q (ORD) | 7H | Ordered (non-signaling) | True | True | True | False | No |
| EQ_UQ | 8H | Equal (unordered, non-signaling) | False | False | True | True | No |
| NGE_US (NGE) | 9H | Not-greater-than-or-equal (unordered, signaling) | False | True | False | True | Yes |
| NGT_US (NGT) | AH | Not-greater-than (unordered, signaling) | False | True | True | True | Yes |
| FALSE_OQ(FALSE) | BH | False (ordered, non-signaling) | False | False | False | False | No |
| NEQ_OQ | CH | Not-equal (ordered, non-signaling) | True | True | False | False | No |
| GE_OS (GE) | DH | Greater-than-or-equal (ordered, signaling) | True | False | True | False | Yes |
| GT_OS (GT) | EH | Greater-than (ordered, signaling) | True | False | False | False | Yes |
| TRUE_UQ(TRUE) | FH | True (unordered, non-signaling) | True | True | True | True | No |
| EQ_OS | 10H | Equal (ordered, signaling) | False | False | True | False | Yes |
| LT_OQ | 11H | Less-than (ordered, nonsignaling) | False | True | False | False | No |
| LE_OQ | 12H | Less-than-or-equal (ordered, nonsignaling) | False | True | True | False | No |
| UNORD_S | 13H | Unordered (signaling) | False | False | False | True | Yes |
| NEQ_US | 14H | Not-equal (unordered, signaling) | True | True | False | True | Yes |
| NLT_UQ | 15H | Not-less-than (unordered, nonsignaling) | True | False | True | True | No |
| NLE_UQ | 16H | Not-less-than-or-equal (unordered, nonsig- naling) | True | False | False | True | No |
| ORD_S | 17H | Ordered (signaling) | True | True | True | False | Yes |
| EQ_US | 18H | Equal (unordered, signaling) | False | False | True | True | Yes |

## Operation

```text
CASE (COMPARISON PREDICATE) OF
0: OP3 := EQ_OQ; OP5 := EQ_OQ;

    1: OP3 := LT_OS; OP5 := LT_OS;
    2: OP3 := LE_OS; OP5 := LE_OS;
    3: OP3 := UNORD_Q; OP5 := UNORD_Q;
    4: OP3 := NEQ_UQ; OP5 := NEQ_UQ;
    5: OP3 := NLT_US; OP5 := NLT_US;
    6: OP3 := NLE_US; OP5 := NLE_US;
    7: OP3 := ORD_Q; OP5 := ORD_Q;
    8: OP5 := EQ_UQ;
    9: OP5 := NGE_US;
    10: OP5 := NGT_US;
    11: OP5 := FALSE_OQ;
    12: OP5 := NEQ_OQ;
    13: OP5 := GE_OS;
    14: OP5 := GT_OS;
    15: OP5 := TRUE_UQ;
    16: OP5 := EQ_OS;
    17: OP5 := LT_OQ;
    18: OP5 := LE_OQ;
    19: OP5 := UNORD_S;
    20: OP5 := NEQ_US;
    21: OP5 := NLT_UQ;
    22: OP5 := NLE_UQ;
    23: OP5 := ORD_S;
    24: OP5 := EQ_US;
    25: OP5 := NGE_UQ;
    26: OP5 := NGT_UQ;
    27: OP5 := FALSE_OS;
    28: OP5 := NEQ_OS;
    29: OP5 := GE_OQ;
    30: OP5 := GT_OQ;
    31: OP5 := TRUE_US;
    DEFAULT: Reserved;
ESAC;

VCMPPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    CMP := SRC1[i+63:i] OP5 SRC2[63:0]

                  ELSE

                    CMP := SRC1[i+63:i] OP5 SRC2[i+63:i]

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;


ENDFOR
DEST[MAX_KL-1:KL] := 0

VCMPPD (VEX.256 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
CMP2 := SRC1[191:128] OP5 SRC2[191:128];
CMP3 := SRC1[255:192] OP5 SRC2[255:192];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[191:128] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[191:128] := 0000000000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[255:192] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[255:192] := 0000000000000000H; FI;
DEST[MAXVL-1:256] := 0

VCMPPD (VEX.128 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] := 0

CMPPD (128-bit Legacy SSE Version)
CMP0 := SRC1[63:0] OP3 SRC2[63:0];
CMP1 := SRC1[127:64] OP3 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compiler intrinsics

```c
VCMPPD __mmask8 _mm512_cmp_pd_mask( __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_cmp_round_pd_mask( __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm512_mask_cmp_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_mask_cmp_round_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm256_cmp_pd_mask( __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm256_mask_cmp_pd_mask( __mmask8 k1, __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm_cmp_pd_mask( __m128d a, __m128d b, int imm);
VCMPPD __mmask8 _mm_mask_cmp_pd_mask( __mmask8 k1, __m128d a, __m128d b, int imm);
VCMPPD __m256 _mm256_cmp_pd(__m256d a, __m256d b, int imm) (V)CMPPD __m128 _mm_cmp_pd(__m128d a, __m128d b, int imm);
```

## SIMD Floating-Point Exceptions

Invalid if SNaN operand and invalid if QNaN and predicate as listed in Table 3-8, Denormal.

## Other Exceptions

VEX-encoded instructions, see Table 2-19, "Type 2 Class Exception Conditions." EVEX-encoded instructions, see Table 2-48, "Type E2 Class Exception Conditions."
