---
summary: Approximation to the Reciprocal of Packed Single Precision Floating-Point Values
---

## Description

Computes the reciprocal approximation of the float32 values in the source operand (the second operand) and store the results to the destination operand (the first operand) using the writemask k1. The approximate reciprocal is evaluated with less than 2^-28 of maximum relative error prior to final rounding. The final results are rounded to < 2^-23 relative error before written to the destination.

Denormal input values are treated as zeros and do not signal #DE, irrespective of MXCSR.DAZ. Denormal results are flushed to zeros and do not signal #UE, irrespective of MXCSR.FTZ.

If any source element is NaN, the quietized NaN source value is returned for that element. If any source element is +/-, +/-0.0 is returned for that element. Also, if any source element is +/-0.0, +/- is returned for that element.

The source operand is a ZMM register, a 512-bit memory location, or a 512-bit vector broadcasted from a 32-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

A numerically exact implementation of VRCP28xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VRCP28PS (EVEX Encoded Versions)
(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := RCP_28_SP(1.0/SRC[31:0]);

                  ELSE DEST[i+31:i] := RCP_28_SP(1.0/SRC[i+31:i]);

             FI;

ELSE

     IF *merging-masking*               ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                       ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



                             Table 8-5. VRCP28PS Special Cases

Input Value     Result Value  Comments

NAN             QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-126
-2-126 < X  -0  INF           Positive input denormal or zero; #Z
X > 2126
X < -2126       -INF          Negative input denormal or zero; #Z

X = +           +0.0f

X = -           -0.0f
X = 2-n
X = -2-n        +0.0f

                -0.0f

                2n            Exact result (unless input/output is a denormal)

                -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ compiler intrinsics

```c
VRCP28PS _mm512_rcp28_round_ps ( __m512 a, int sae);
VRCP28PS __m512 _mm512_mask_rcp28_round_ps(__m512 s, __mmask16 m, __m512 a, int sae);
VRCP28PS __m512 _mm512_maskz_rcp28_round_ps( __mmask16 m, __m512 a, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Divide-by-zero.

## Other Exceptions

See Table 2-48, "Type E2 Class Exception Conditions."
