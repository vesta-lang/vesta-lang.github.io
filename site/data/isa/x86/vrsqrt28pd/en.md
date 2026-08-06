---
summary: Approximation to the Reciprocal Square Root of Packed Double Precision
---

## Description

Computes the reciprocal square root of the float64 values in the source operand (the second operand) and store the results to the destination operand (the first operand). The approximate reciprocal is evaluated with less than 2^-28 of maximum relative error.

If any source element is NaN, the quietized NaN source value is returned for that element. Negative (non-zero) source numbers, as well as -, return the canonical NaN and set the Invalid Flag (#I). A value of -0 must return - and set the DivByZero flags (#Z). Negative numbers should return NaN and set the Invalid flag (#I). Note however that the instruction flush input denormals to zero of the same sign, so negative denormals return - and set the DivByZero flag.

The source operand is a ZMM register, a 512-bit memory location or a 512-bit vector broadcasted from a 64-bit memory location. The destination operand is a ZMM register, conditionally updated using writemask k1.

EVEX.vvvv is reserved and must be 1111b otherwise instructions will #UD.

A numerically exact implementation of VRSQRT28xx can be found at https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operation

```text
VRSQRT28PD (EVEX Encoded Versions)

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := (1.0/ SQRT(SRC[63:0]));

                  ELSE DEST[i+63:i] := (1.0/ SQRT(SRC[i+63:i]));

             FI;

ELSE

       IF *merging-masking*               ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

       FI;

FI;

ENDFOR;



                                 Table 8-7. VRSQRT28PD Special Cases

Input Value                  Result Value              Comments
NAN
X = 2-2n                     QNAN(input)               If (SRC = SNaN) then #I
X<0
X = -0 or negative denormal  2n
X = +0 or positive denormal
X = +INF                     QNaN_Indefinite           Including -INF

                             -INF                      #Z

                             +INF                      #Z

                             +0
```

## Intel C/C++ compiler intrinsics

```c
VRSQRT28PD __m512d _mm512_rsqrt28_round_pd(__m512d a, int sae);
VRSQRT28PD __m512d _mm512_mask_rsqrt28_round_pd(__m512d s, __mmask8 m,__m512d a, int sae);
VRSQRT28PD __m512d _mm512_maskz_rsqrt28_round_pd(__mmask8 m,__m512d a, int sae);
```

## SIMD Floating-Point Exceptions

Invalid (if SNaN input), Divide-by-zero.

## Other Exceptions

See Table 2-48, "Type E2 Class Exception Conditions."
