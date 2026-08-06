---
summary: Tests Types of Packed Float64 Values
---

## Description

The FPCLASSPD instruction checks the packed double precision floating-point values for special categories, specified by the set bits in the imm8 byte. Each set bit in imm8 specifies a category of floating-point values that the input data element is classified against. The classified results of all specified categories of an input value are ORed together to form the final boolean result for the input element. The result of each element is written to the corresponding bit in a mask register k2 according to the writemask k1. Bits [MAX_KL-1:8/4/2] of the destination are cleared.

The classification categories specified by imm8 are shown in Figure 5-13. The classification test for each category is listed in Table 5-11.

```text
                                7        6              5     4            3          2          1     0
                            SNaN   Neg. Finite    Denormal  Neg. INF    +INF       Neg. 0  +0        QNaN
```

Figure 5-13. Imm8 Byte Specifier of Special Case Floating-Point Values for VFPCLASSPD/SD/PS/SS

**Classifier Operations for VFPCLASSPD/SD/PS/SS**

| Bits | Imm8[0] | Imm8[1] | Imm8[2] | Imm8[3] | Imm8[4] | Imm8[5] | Imm8[6] | Imm8[7] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Category | QNAN | PosZero | NegZero | PosINF | NegINF | Denormal | Negative | SNAN |
| Classifier | Checks for | Checks for | Checks for - | Checks for | Checks for - | Checks for | Checks for | Checks for |
|  | QNaN | +0 | 0 | +INF | INF | Denormal | Negative finite | SNaN |

## Operation

```text
CheckFPClassDP (tsrc[63:0], imm8[7:0]){

    //* Start checking the source operand for special type *//
    NegNum := tsrc[63];
    IF (tsrc[62:52]=07FFh) Then ExpAllOnes := 1; FI;
    IF (tsrc[62:52]=0h) Then ExpAllZeros := 1;
    IF (ExpAllZeros AND MXCSR.DAZ) Then

          MantAllZeros := 1;
    ELSIF (tsrc[51:0]=0h) Then

          MantAllZeros := 1;
    FI;
    ZeroNumber := ExpAllZeros AND MantAllZeros
    SignalingBit := tsrc[51];

    sNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND NOT(SignalingBit); // sNaN
    qNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND SignalingBit; // qNaN
    Pzero_res := NOT(NegNum) AND ExpAllZeros AND MantAllZeros; // +0
    Nzero_res := NegNum AND ExpAllZeros AND MantAllZeros; // -0
    PInf_res := NOT(NegNum) AND ExpAllOnes AND MantAllZeros; // +Inf
    NInf_res := NegNum AND ExpAllOnes AND MantAllZeros; // -Inf
    Denorm_res := ExpAllZeros AND NOT(MantAllZeros); // denorm
    FinNeg_res := NegNum AND NOT(ExpAllOnes) AND NOT(ZeroNumber); // -finite

    bResult = ( imm8[0] AND qNaN_res ) OR (imm8[1] AND Pzero_res ) OR
                ( imm8[2] AND Nzero_res ) OR ( imm8[3] AND PInf_res ) OR
                ( imm8[4] AND NInf_res ) OR ( imm8[5] AND Denorm_res ) OR
                ( imm8[6] AND FinNeg_res ) OR ( imm8[7] AND sNaN_res );

    Return bResult;
} //* end of CheckFPClassDP() *//


VFPCLASSPD (EVEX Encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

       THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN

                    DEST[j] := CheckFPClassDP(SRC1[63:0], imm8[7:0]);

                  ELSE

                    DEST[j] := CheckFPClassDP(SRC1[i+63:i], imm8[7:0]);

             FI;

       ELSE DEST[j] := 0                 ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFPCLASSPD __mmask8 _mm512_fpclass_pd_mask( __m512d a, int c);
VFPCLASSPD __mmask8 _mm512_mask_fpclass_pd_mask( __mmask8 m, __m512d a, int c) VFPCLASSPD __mmask8 _mm256_fpclass_pd_mask( __m256d a, int c) VFPCLASSPD __mmask8 _mm256_mask_fpclass_pd_mask( __mmask8 m, __m256d a, int c) VFPCLASSPD __mmask8 _mm_fpclass_pd_mask( __m128d a, int c) VFPCLASSPD __mmask8 _mm_mask_fpclass_pd_mask( __mmask8 m, __m128d a, int c);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-51, "Type E4 Class Exception Conditions."

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
