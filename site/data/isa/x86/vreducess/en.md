---
summary: Perform a Reduction Transformation on a Scalar Float32 Value
---

## Description

Perform a reduction transformation of the binary encoded single precision floating-point value in the low dword element of the second source operand (the third operand) and store the reduced result in binary floating-point format to the low dword element of the destination operand (the first operand) under the writemask k1. Bits 127:32 of the destination operand are copied from respective dword elements of the first source operand (the second operand).

The reduction transformation subtracts the integer part and the leading M fractional bits from the binary floatingpoint source value, where M is a unsigned integer specified by imm8[7:4], see Figure 5-28. Specifically, the reduction transformation can be expressed as: dest = src  (ROUND(2M*src))*2-M; where "Round()" treats "src", "2M", and their product as binary floating-point numbers with normalized significand and biased exponents. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

This instruction might end up with a precision exception set. However, in case of SPE set (i.e., Suppress Precision Exception, which is imm8[3]=1), no precision exception is reported.

Handling of special case of input values are listed in Table 5-27.

## Operation

```text
ReduceArgumentSP(SRC[31:0], imm8[7:0])
{

    // Check for NaN
    IF (SRC [31:0] = NAN) THEN

          RETURN (Convert SRC[31:0] to QNaN); FI
    M := imm8[7:4]; // Number of fraction bits of the normalized significand to be subtracted
    RC := imm8[1:0];// Round Control for ROUND() operation
    RC source := imm[2];
    SPE := imm[3];// Suppress Precision Exception
    TMP[31:0] := 2-M *{ROUND(2M*SRC[31:0], SPE, RC_source, RC)}; // ROUND() treats SRC and 2M as standard binary FP values
    TMP[31:0] := SRC[31:0]  TMP[31:0]; // subtraction under the same RC,SPE controls
RETURN TMP[31:0]; // binary encoded FP with biased exponent and normalized significand
}

VREDUCESS

IF k1[0] or *no writemask*

     THEN DEST[31:0] := ReduceArgumentSP(SRC2[31:0], imm8[7:0])

     ELSE

     IF *merging-masking*       ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                 ; zeroing-masking

           THEN DEST[31:0] = 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compiler intrinsics

```c
VREDUCESS __m128 _mm_mask_reduce_ss( __m128 a, __m128 b, int imm, int sae) VREDUCESS __m128 _mm_mask_reduce_ss(__m128 s, __mmask16 k, __m128 a, __m128 b, int imm, int sae) VREDUCESS __m128 _mm_maskz_reduce_ss(__mmask16 k, __m128 a, __m128 b, int imm, int sae);
```

## SIMD Floating-Point Exceptions

Invalid, Precision. If SPE is enabled, precision exception is not reported (regardless of MXCSR exception mask).

## Other Exceptions

See Table 2-49, "Type E3 Class Exception Conditions."
