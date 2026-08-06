---
summary: Packed Shuffle Bytes
---

## Description

PSHUFB (with no VEX or EVEX prefix) performs an in-place shuffle of bytes in the destination operand (the first operand) according to the shuffle control mask in the source operand (the second operand). The instruction permutes the data in the destination operand, leaving the shuffle mask unaffected. If the most significant bit (bit[7]) of each byte of the shuffle control mask is set, then constant zero is written in the result byte. Each byte in the shuffle control mask forms an index to permute the corresponding byte in the destination operand. The value of each index is the least significant 3 bits (64-bit operation) or 4 bits (128-bit operation) of the shuffle control byte. See Figure 4-15 for an example for 64-bit operation.

The 128-bit forms of PSHUFB leave bits MAXVL1:128 of the destination register unchanged. A 128-bit memory operand must be aligned on a 16-byte boundary or a general-protection exception (#GP) will be generated. In 64-bit mode, the REX prefix can be used to access XMM8-XMM15.

The following items apply to VPSHUFB, encoded with a VEX or EVEX prefix:

* Each of these forms uses shuffle control bytes in its second source operand to select which bytes in the first

source operand to copy to the destination operand.

* These forms operate in one, two, or four 16-byte "lanes." As with the 128-bit form of PSHUFB (above), the low

4 bits of each shuffle control byte determines which of 16 bytes in a source lane is copied to the appropriate byte in the corresponding destination lane.

* The 128-bit and 256-bit versions of these forms zero upper bits in the destination register beyond the

instruction's operand size.

* The EVEX-encoded versions update their destination conditionally with writemask k1.

## Operation

```text
PSHUFB (with 64-bit MMX operands)
TEMP := DEST
FOR destpos := 0 TO 7

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 07H;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

PSHUFB (with 128-bit SSE operands)
TEMP := DEST;
FOR destpos := 0 TO 15

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

VPSHUFB (VEX.128 encoded version)
FOR destpos := 0 TO 15

    shufbyte := SRC2.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := SRC1.byte[srcpos];
    FI;
DEST[MAXVL1:128] := 0;

VPSHUFB (VEX.256 encoded version)
FOR lane := 0 to 1

    FOR lanepos := 0 TO 15
          destpos := 16 * lane + lanepos;
          shufbyte := SRC2.byte[destpos];
          IF shufbyte & 80H = 80H
                THEN DEST.byte[destpos] := 0;
                ELSE
                      srcpos := 16 * lane + (shufbyte & 0FH);
                      DEST.byte[destpos] := SRC1.byte[srcpos];
          FI;

DEST[MAXVL1:256] := 0;


VPSHUFB (EVEX encoded versions)

// VL is 128, 256, or 512, depending on instruction encoding

// no masking if EVEX.aaa = 0; zeroing if EVEX.z = 1

FOR lane := 0 to VL/128  1

FOR lanepos := 0 TO 15

destpos := 16 * lane + lanepos;

IF no masking OR k[destpos] = 1  // using selected bit from k register

     THEN

     shufbyte := SRC2.byte[destpos];

     IF shufbyte & 80H = 80H

           THEN DEST.byte[destpos] := 0;

           ELSE

                        srcpos := 16 * lane + (shufbyte & 0FH);

                        DEST.byte[destpos] := SRC1.byte[srcpos];

     FI;

     ELSE IF zeroing             // if not zeroing, DEST.byte[destpos] is unchanged

     THEN DEST.byte[destpos] := 0;

FI;

DEST[MAXVL1:VL] := 0;

                        07H 07H  FFH                  MM2         01H   00H  00H          00H
                                                      80H

                        04H 01H  07H                  MM1         02H   02H  FFH          01H
                                                      03H

                                                      MM1

                        04H 04H  00H                  00H         FFH   01H  01H          01H

                                                Figure 4-15. PSHUFB with 64-Bit Operands
```

## Intel C/C++ compiler intrinsics

```c
VPSHUFB __m512i _mm512_shuffle_epi8(__m512i a, __m512i b);
VPSHUFB __m512i _mm512_mask_shuffle_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m512i _mm512_maskz_shuffle_epi8( __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m256i _mm256_mask_shuffle_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m256i _mm256_maskz_shuffle_epi8( __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m128i _mm_mask_shuffle_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSHUFB __m128i _mm_maskz_shuffle_epi8( __mmask16 k, __m128i a, __m128i b);
PSHUFB: __m64 _mm_shuffle_pi8 (__m64 a, __m64 b) (V)PSHUFB: __m128i _mm_shuffle_epi8 (__m128i a, __m128i b) VPSHUFB:__m256i _mm256_shuffle_epi8(__m256i a, __m256i b);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-21, "Type 4 Class Exception Conditions." EVEX-encoded instruction, see Exceptions Type E4NF.nb in Table 2-52, "Type E4NF Class Exception Conditions."
