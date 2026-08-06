---
summary: Approximation to the Exponential 2^x of Packed Double Precision Floating-Point
---

## Description

Computes the approximate base-2 exponential evaluation of the double precision floating-point values in the source operand (the second operand) and stores the results to the destination operand (the first operand) using the writemask k1. The approximate base-2 exponential is evaluated with less than 2^-23 of relative error.

Denormal input values are treated as zeros and do not signal #DE, irrespective of MXCSR.DAZ. Denormal results are flushed to zeros and do not signal #UE, irrespective of MXCSR.FTZ.

The source operand is a ZMM register, a 512-bit memory location or a 512-bit vector broadcasted from a 64-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

A numerically exact implementation of VEXP2xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VEXP2PD

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := EXP2_23_DP(SRC[63:0])

                  ELSE DEST[i+63:i] := EXP2_23_DP(SRC[i+63:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-1. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ compiler intrinsics

```c
VEXP2PD __m512d _mm512_exp2a23_round_pd (__m512d a, int sae);
VEXP2PD __m512d _mm512_mask_exp2a23_round_pd (__m512d a, __mmask8 m, __m512d b, int sae);
VEXP2PD __m512d _mm512_maskz_exp2a23_round_pd ( __mmask8 m, __m512d b, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Overflow.

## Other Exceptions

See Table 2-48, "Type E2 Class Exception Conditions."
