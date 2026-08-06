---
summary: Unpack and Interleave Low Packed Single Precision Floating-Point Values
---

## Description

Performs an interleaved unpack of the low single precision floating-point values from the first source operand and the second source operand.

128-bit Legacy SSE version: The second source can be an XMM register or an 128-bit memory location. The destination is not distinct from the first source XMM register and the upper bits (MAXVL-1:128) of the corresponding ZMM register destination are unmodified. When unpacking from a memory operand, an implementation may fetch only the appropriate 64 bits; however, alignment to 16-byte boundary and normal segment checking will still be enforced.

VEX.128 encoded version: The first source operand is a XMM register. The second source operand can be a XMM register or a 128-bit memory location. The destination operand is a XMM register. The upper bits (MAXVL-1:128) of the corresponding ZMM register destination are zeroed.

VEX.256 encoded version: The first source operand is a YMM register. The second source operand can be a YMM register or a 256-bit memory location. The destination operand is a YMM register.

SRC1 X7  X6  X5  X4  X3                                                            X2  X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3                                                            Y2  Y1  Y0

DEST Y5  X5  Y4  X4  Y1                                                            X1  Y0  X0

Figure 4-28. VUNPCKLPS Operation

EVEX.512 encoded version: The first source operand is a ZMM register. The second source operand is a ZMM register, a 512-bit memory location, or a 512-bit vector broadcasted from a 32-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.256 encoded version: The first source operand is a YMM register. The second source operand is a YMM register, a 256-bit memory location, or a 256-bit vector broadcasted from a 32-bit memory location. The destination operand is a YMM register, conditionally updated using writemask k1.

EVEX.128 encoded version: The first source operand is an XMM register. The second source operand is a XMM register, a 128-bit memory location, or a 128-bit vector broadcasted from a 32-bit memory location. The destination operand is a XMM register, conditionally updated using writemask k1.

## Operation

```text
VUNPCKLPS (EVEX Encoded Version When SRC2 is a ZMM Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL >= 128

    TMP_DEST[31:0] := SRC1[31:0]
    TMP_DEST[63:32] := SRC2[31:0]
    TMP_DEST[95:64] := SRC1[63:32]
    TMP_DEST[127:96] := SRC2[63:32]
FI;
IF VL >= 256
    TMP_DEST[159:128] := SRC1[159:128]
    TMP_DEST[191:160] := SRC2[159:128]
    TMP_DEST[223:192] := SRC1[191:160]
    TMP_DEST[255:224] := SRC2[191:160]
FI;
IF VL >= 512
    TMP_DEST[287:256] := SRC1[287:256]
    TMP_DEST[319:288] := SRC2[287:256]
    TMP_DEST[351:320] := SRC1[319:288]
    TMP_DEST[383:352] := SRC2[319:288]
    TMP_DEST[415:384] := SRC1[415:384]
    TMP_DEST[447:416] := SRC2[415:384]
    TMP_DEST[479:448] := SRC1[447:416]
    TMP_DEST[511:480] := SRC2[447:416]
FI;
FOR j := 0 TO KL-1


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

DEST[MAXVL-1:VL] := 0

VUNPCKLPS (EVEX Encoded Version When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 31

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

TMP_DEST[31:0] := SRC1[31:0]

TMP_DEST[63:32] := TMP_SRC2[31:0]

TMP_DEST[95:64] := SRC1[63:32]

TMP_DEST[127:96] := TMP_SRC2[63:32]

FI;

IF VL >= 256

     TMP_DEST[159:128] := SRC1[159:128]

     TMP_DEST[191:160] := TMP_SRC2[159:128]

     TMP_DEST[223:192] := SRC1[191:160]

     TMP_DEST[255:224] := TMP_SRC2[191:160]

FI;

IF VL >= 512

     TMP_DEST[287:256] := SRC1[287:256]

     TMP_DEST[319:288] := TMP_SRC2[287:256]

     TMP_DEST[351:320] := SRC1[319:288]

     TMP_DEST[383:352] := TMP_SRC2[319:288]

     TMP_DEST[415:384] := SRC1[415:384]

     TMP_DEST[447:416] := TMP_SRC2[415:384]

     TMP_DEST[479:448] := SRC1[447:416]

     TMP_DEST[511:480] := TMP_SRC2[447:416]

FI;

FOR j := 0 TO KL-1

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
DEST[MAXVL-1:VL] := 0

UNPCKLPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[159:128] := SRC1[159:128]
DEST[191:160] := SRC2[159:128]
DEST[223:192] := SRC1[191:160]
DEST[255:224] := SRC2[191:160]
DEST[MAXVL-1:256] := 0

VUNPCKLPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] := 0

UNPCKLPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compiler intrinsics

```c
VUNPCKLPS __m512 _mm512_unpacklo_ps(__m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_mask_unpacklo_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_maskz_unpacklo_ps(__mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m256 _mm256_unpacklo_ps (__m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_mask_unpacklo_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_maskz_unpacklo_ps(__mmask8 k, __m256 a, __m256 b);
UNPCKLPS __m128 _mm_unpacklo_ps (__m128 a, __m128 b);
VUNPCKLPS __m128 _mm_mask_unpacklo_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VUNPCKLPS __m128 _mm_maskz_unpacklo_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instructions, see Table 2-21, "Type 4 Class Exception Conditions."

EVEX-encoded instructions, see Table 2-52, "Type E4NF Class Exception Conditions."

CHAPTER 5

5.1 TERNARY BIT VECTOR LOGIC TABLE

VPTERNLOGD/VPTERNLOGQ instructions operate on dword/qword elements and take three bit vectors of the respective input data elements to form a set of 32/64 indices, where each 3-bit value provides an index into an 8-bit lookup table represented by the imm8 byte of the instruction. The 256 possible values of the imm8 byte is constructed as a 16x16 boolean logic table. The 16 rows of the table uses the lower 4 bits of imm8 as row index. The 16 columns are referenced by imm8[7:4]. The 16 columns of the table are present in two halves, with 8 columns shown in Table 5-1 for the column index value between 0:7, followed by Table 5-2 showing the 8 columns corresponding to column index 8:15. This section presents the two-halves of the 256-entry table using a shorthand notation representing simple or compound boolean logic expressions with three input bit source data. The three input bit source data will be denoted with the capital letters: A, B, C; where A represents a bit from the first source operand (also the destination operand), B and C represent a bit from the 2nd and 3rd source operands. Each map entry takes the form of a logic expression consisting of one of more component expressions. Each component expression consists of either a unary or binary boolean operator and associated operands. Each binary boolean operator is expressed in lowercase letters, and operands concatenated after the logic operator. The unary operator `not' is expressed using `!'. Additionally, the conditional expression "A?B:C" expresses a result returning B if A is set, returning C otherwise. A binary boolean operator is followed by two operands, e.g., andAB. For a compound binary expression that contain commutative components and comprising the same logic operator, the 2nd logic operator is omitted and three operands can be concatenated in sequence, e.g., andABC. When the 2nd operand of the first binary boolean expression comes from the result of another boolean expression, the 2nd boolean expression is concatenated after the uppercase operand of the first logic expression, e.g., norBnandAC. When the result is independent of an operand, that operand is omitted in the logic expression, e.g., zeros or norCB. The 3-input expression "majorABC" returns 0 if two or more input bits are 0, returns 1 if two or more input bits are 1. The 3-input expression "minorABC" returns 1 if two or more input bits are 0, returns 0 if two or more input bits are 1. The building-block bit logic functions used in Table 5-1 and Table 5-2 include:

* Constants: TRUE (1), FALSE (0); * Unary function: Not (!); * Binary functions: and, nand, or, nor, xor, xnor; * Conditional function: Select (?:); * Tertiary functions: major, minor.

:              Table 5-1. Lower 8 columns of the 16x16 Map of VPTERNLOG Boolean Logic Operations

Imm                                                   [7:4] [3:0] 00H    0H         1H         2H           3H          4H         5H                  6H          7H 01H 02H    FALSE      andAnorBC norBnandAC andA!B         norCnandBA andA!C              andAxorBC andAnandBC 03H 04H    norABC     norCB      norBxorAC    A?!B:norBC  norCxorBA  A?!C:norBC          A?xorBC:norB A?nandBC:no 05H 06H                                                                                  C           rBC 07H 08H    andCnorBA norBxnorAC andC!B        norBnorAC   C?norBA:and C?norBA:A          C?!B:andBA C?!B:A 09H                                                   BA 0AH 0BH    norBA      norBandAC C?!B:norBA !B             C?norBA:xnor A?!C:!B           A?xorBC:!B A?nandBC:!B 0CH                                                   BA 0DH 0EH    andBnorAC  norCxnorBA B?norAC:and B?norAC:A    andB!C     norCnorBA B?!C:andAC B?!C:A 0FH                                   AC

```text
        norCA      norCandBA  B?norAC:xnor A?!B:!C     B?!C:norAC !C                  A?xorBC:!C A?nandBC:!C
```

AC

```text
        norAxnorBC A?norBC:xorB B?norAC:C  xorBorAC    C?norBA:B xorCorBA             xorCB       B?!C:orAC
```

C

```text
        norAandBC minorABC    C?!B:!A      nandBorAC B?!C:!A      nandCorBA           A?xorBC:nan nandCB
```

dBC

```text
        norAnandBC A?norBC:and andCxorBA   A?!B:andBC  andBxorAC  A?!C:andBC          A?xorBC:and xorAandBC
                            BC                                                        BC
```

```text
        norAxorBC  A?norBC:xnor C?xorBA:norB A?!B:xnorBC B?xorAC:norA A?!C:xnorBC xnorABC         A?nandBC:xn
```

orBC

```text
                   BC         A                        C
```

```text
        andC!A     A?norBC:C andCnandBA A?!B:C         C?!A:andBA xorCA               xorCandBA A?nandBC:C
```

```text
        C?!A:norBA C?!A:!B    C?nandBA:no C?nandBA:!B B?xorAC:!A  B?xorAC:nan C?nandBA:xn nandBxnorAC
                              rBA                                 dAC                 orBA
```

```text
        andB!A     A?norBC:B B?!A:andAC xorBA          andBnandAC A?!C:B              xorBandAC A?nandBC:B
```

```text
        B?!A:norAC B?!A:!C    B?!A:xnorAC C?xorBA:nan B?nandAC:no B?nandAC:!C B?nandAC:xn nandCxnorBA
                                           dBA         rAC                            orAC
```

```text
        norAnorBC xorAorBC    B?!A:C       A?!B:orBC   C?!A:B     A?!C:orBC           B?nandAC:C A?nandBC:or
```

BC

```text
        !A         nandAorBC C?nandBA:!A nandBA        B?nandAC:!A nandCA             nandAxnorBC nandABC
```

Table 5-2 shows the half of 256-entry map corresponding to column index values 8:15.

:               Table 5-2. Upper 8 columns of the 16x16 Map of VPTERNLOG Boolean Logic Operations

Imm                                                 [7:4] [3:0] 00H    08H     09H             0AH        0BH       0CH           0DH        0EH                  0FH 01H 02H    andABC  andAxnorBC andCA           B?andAC:A andBA         C?andBA:A andAorBC              A 03H 04H    A?andBC:nor B?andAC:!C  A?C:norBC  C?A:!B    A?B:norBC B?A:!C         xnorAorBC orAnorBC 05H    BC 06H 07H    andCxnorBA B?andAC:xor B?andAC:C   B?andAC:orA C?xnorBA:an B?A:xorAC  B?A:C                B?A:orAC 08H                        AC             C         dBA 09H 0AH    A?andBC:!B xnorBandAC A?C:!B       nandBnandA xnorBA       B?A:nandAC A?orBC:!B            orA!B 0BH                                       C 0CH 0DH    andBxnorAC C?andBA:xor B?xnorAC:an B?xnorAC:A C?andBA:B    C?andBA:orB C?A:B               C?A:orBA 0EH            BA              dAC                                A 0FH

```text
        A?andBC:!C xnorCandBA xnorCA       C?A:nandBA A?B:!C       nandCnandB A?orBC:!C            orA!C
```

A

```text
        A?andBC:xor xorABC      A?C:xorBC  B?xnorAC:orA A?B:xorBC  C?xnorBA:orB A?orBC:xorBC orAxorBC
        BC                                 C                       A
```

xnorAandBC A?xnorBC:na A?C:nandBC nandBxorAC A?B:nandBC nandCxorBA A?orBCnandB orAnandBC

```text
                ndBC                                                          C
```

```text
        andCB   A?xnorBC:an andCorAB       B?C:A     andBorAC      C?B:A      majorABC             orAandBC
```

dBC

```text
        B?C:norAC xnorCB        xnorCorBA C?orBA:!B  xnorBorAC B?orAC:!C      A?orBC:xnorB orAxnorBC
```

C

```text
        A?andBC:C A?xnorBC:C C             B?C:orAC  A?B:C         B?orAC:xorAC orCandBA           orCA
```

```text
        B?C:!A  B?C:nandAC orCnorBA        orC!B     B?orAC:!A     B?orAC:nand orCxnorBA           nandBnorAC
```

AC

```text
        A?andBC:B A?xnorBC:B A?C:B         C?orBA:xorBA B          C?B:orBA   orBandAC             orBA
```

```text
        C?B!A   C?B:nandBA C?orBA:!A       C?orBA:nand orBnorAC    orB!C      orBxnorAC nandCnorBA
```

BA

```text
        A?andBC:orB A?xnorBC:orB A?C:orBC  orCxorBA  A?B:orBC      orBxorAC   orCB                 orABC
        C       C
```

```text
        nandAnandB nandAxorBC orC!A        orCnandBA orB!A         orBnandAC nandAnorBC TRUE
```

C

Table 5-1 and Table 5-2 translate each of the possible value of the imm8 byte to a Boolean expression. These tables can also be used by software to translate Boolean expressions to numerical constants to form the imm8 value needed to construct the VPTERNLOG syntax. There is a unique set of three byte constants (F0H, CCH, AAH) that can be used for this purpose as input operands in conjunction with the Boolean expressions defined in those tables. The reverse mapping can be expressed as:

Result_imm8 = Table_Lookup_Entry(0F0H, 0CCH, 0AAH)

Table_Lookup_Entry is the Boolean expression defined in Table 5-1 and Table 5-2.

5.2 INSTRUCTIONS (V)

Chapter 5 continues an alphabetical discussion of Intel(R) 64 and IA-32 instructions (V). See also: Chapter 3, "Instruction Set Reference, A-L," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume

2A; Chapter 5, "Instruction Set Reference, V," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2B; and Chapter 5, "Instruction Set Reference, V," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2D.
