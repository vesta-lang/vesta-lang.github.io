---
summary: Approximation to the Reciprocal of Scalar Single Precision Floating-Point Value
---

## Description

Computes the reciprocal approximation of the low float32 value in the second source operand (the third operand) and store the result to the destination operand (the first operand). The approximate reciprocal is evaluated with less than 2^-28 of maximum relative error prior to final rounding. The final result is rounded to < 2^-23 relative error before written into the low float32 element of the destination according to writemask k1. Bits 127:32 of the destination is copied from the corresponding bits of the first source operand (the second operand).

A denormal input value is treated as zero and does not signal #DE, irrespective of MXCSR.DAZ. A denormal result is flushed to zero and does not signal #UE, irrespective of MXCSR.FTZ.

If any source element is NaN, the quietized NaN source value is returned for that element. If any source element is +/-, +/-0.0 is returned for that element. Also, if any source element is +/-0.0, +/- is returned for that element.

The first source operand is an XMM register. The second source operand is an XMM register or a 32-bit memory location. The destination operand is a XMM register, conditionally updated using writemask k1.

A numerically exact implementation of VRCP28xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VRCP28SS ((EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

           DEST[31: 0] := RCP_28_SP(1.0/SRC2[31: 0]);

ELSE

      IF *merging-masking*          ; merging-masking

           THEN *DEST[31: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[31: 0] := 0

      FI;

FI;

ENDFOR;

DEST[127:32] := SRC1[127: 32]

DEST[MAXVL-1:128] := 0



                              Table 8-6. VRCP28SS Special Cases

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
VRCP28SS __m128 _mm_rcp28_round_ss ( __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_mask_rcp28_round_ss(__m128 s, __mmask8 m, __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_maskz_rcp28_round_ss(__mmask8 m, __m128 a, __m128 b, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Divide-by-zero.

## Other Exceptions

See Table 2-49, "Type E3 Class Exception Conditions."
