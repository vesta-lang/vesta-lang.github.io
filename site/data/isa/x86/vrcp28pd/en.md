---
summary: Approximation to the Reciprocal of Packed Double Precision Floating-Point Values
---

## Description

Computes the reciprocal approximation of the float64 values in the source operand (the second operand) and store the results to the destination operand (the first operand). The approximate reciprocal is evaluated with less than 2^-28 of maximum relative error.

Denormal input values are treated as zeros and do not signal #DE, irrespective of MXCSR.DAZ. Denormal results are flushed to zeros and do not signal #UE, irrespective of MXCSR.FTZ.

If any source element is NaN, the quietized NaN source value is returned for that element. If any source element is +/-, +/-0.0 is returned for that element. Also, if any source element is +/-0.0, +/- is returned for that element.

The source operand is a ZMM register, a 512-bit memory location or a 512-bit vector broadcasted from a 64-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

A numerically exact implementation of VRCP28xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VRCP28PD (EVEX Encoded Versions)
(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := RCP_28_DP(1.0/SRC[63:0]);

                  ELSE DEST[i+63:i] := RCP_28_DP(1.0/SRC[i+63:i]);

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;



                              Table 8-3. VRCP28PD Special Cases

Input Value      Result Value  Comments

NAN              QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-1022
-2-1022 < X  -0  INF           Positive input denormal or zero; #Z
X > 21022
X < -21022       -INF          Negative input denormal or zero; #Z

X = +            +0.0f

X = -            -0.0f
X = 2-n
X = -2-n         +0.0f

                 -0.0f

                 2n            Exact result (unless input/output is a denormal)

                 -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ compiler intrinsics

```c
VRCP28PD __m512d _mm512_rcp28_round_pd ( __m512d a, int sae);
VRCP28PD __m512d _mm512_mask_rcp28_round_pd(__m512d a, __mmask8 m, __m512d b, int sae);
VRCP28PD __m512d _mm512_maskz_rcp28_round_pd( __mmask8 m, __m512d b, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Divide-by-zero.

## Other Exceptions

See Table 2-48, "Type E2 Class Exception Conditions."
