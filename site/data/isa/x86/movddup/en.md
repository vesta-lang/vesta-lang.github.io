---
summary: Replicate Double Precision Floating-Point Values
---

## Description

For 256-bit or higher versions: Duplicates even-indexed double precision floating-point values from the source operand (the second operand) and into adjacent pair and store to the destination operand (the first operand).

For 128-bit versions: Duplicates the low double precision floating-point value from the source operand (the second operand) and store to the destination operand (the first operand).

128-bit Legacy SSE version: Bits (MAXVL-1:128) of the corresponding destination register are unchanged. The source operand is XMM register or a 64-bit memory location.

VEX.128 and EVEX.128 encoded version: Bits (MAXVL-1:128) of the destination register are zeroed. The source operand is XMM register or a 64-bit memory location. The destination is updated conditionally under the writemask for EVEX version.

VEX.256 and EVEX.256 encoded version: Bits (MAXVL-1:256) of the destination register are zeroed. The source operand is YMM register or a 256-bit memory location. The destination is updated conditionally under the writemask for EVEX version.

EVEX.512 encoded version: The destination is updated according to the writemask. The source operand is ZMM register or a 512-bit memory location.

Note: VEX.vvvv and EVEX.vvvv are reserved and must be 1111b otherwise instructions will #UD.

```text
                            SRC          X3                  X2    X1           X0
```

```text
                            DEST         X2                  X2    X0           X0
```

Figure 4-2. VMOVDDUP Operation

## Operation

```text
VMOVDDUP (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

TMP_SRC[63:0] := SRC[63:0]

TMP_SRC[127:64] := SRC[63:0]

IF VL >= 256

     TMP_SRC[191:128] := SRC[191:128]

     TMP_SRC[255:192] := SRC[191:128]

FI;

IF VL >= 512

     TMP_SRC[319:256] := SRC[319:256]

     TMP_SRC[383:320] := SRC[319:256]

     TMP_SRC[477:384] := SRC[477:384]

     TMP_SRC[511:484] := SRC[477:384]

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_SRC[i+63:i]

          ELSE

                  IF *merging-masking*          ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                      ; zeroing-masking

                      DEST[i+63:i] := 0         ; zeroing-masking

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVDDUP (VEX.256 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[191:128] := SRC[191:128]
DEST[255:192] := SRC[191:128]
DEST[MAXVL-1:256] := 0

VMOVDDUP (VEX.128 Encoded Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] := 0


MOVDDUP (128-bit Legacy SSE Version)
DEST[63:0] := SRC[63:0]
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compiler intrinsics

```c
VMOVDDUP __m512d _mm512_movedup_pd( __m512d a);
VMOVDDUP __m512d _mm512_mask_movedup_pd(__m512d s, __mmask8 k, __m512d a);
VMOVDDUP __m512d _mm512_maskz_movedup_pd( __mmask8 k, __m512d a);
VMOVDDUP __m256d _mm256_mask_movedup_pd(__m256d s, __mmask8 k, __m256d a);
VMOVDDUP __m256d _mm256_maskz_movedup_pd( __mmask8 k, __m256d a);
VMOVDDUP __m128d _mm_mask_movedup_pd(__m128d s, __mmask8 k, __m128d a);
VMOVDDUP __m128d _mm_maskz_movedup_pd( __mmask8 k, __m128d a);
MOVDDUP __m256d _mm256_movedup_pd (__m256d a);
MOVDDUP __m128d _mm_movedup_pd (__m128d a);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

Non-EVEX-encoded instruction, see Table 2-22, "Type 5 Class Exception Conditions."

EVEX-encoded instruction, see Table 2-54, "Type E5NF Class Exception Conditions."

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
