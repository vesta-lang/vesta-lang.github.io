---
summary: Convert Single Precision FP Value to 16-bit FP Value
---

## Description

Convert packed single precision floating values in the source operand to half-precision (16-bit) floating-point values and store to the destination operand. The rounding mode is specified using the immediate field (imm8).

Underflow results (i.e., tiny results) are converted to denormals. MXCSR.FTZ is ignored. If a source element is denormal relative to the input format with DM masked and at least one of PM or UM unmasked; a SIMD exception will be raised with DE, UE and PE set.

VCVTPS2PH xmm1/mem64, xmm2, imm8

```text
             127              96 95           64 63                             32 31                          0
```

VS0

```text
                  VS3                VS2                               VS1                                           xmm2
```

convert

```text
                  convert            convert                           convert
```

```text
             127              96 95           64 63                    48 47         32 31       16 15            0
```

```text
                                                                 VH3            VH2         VH1         VH0          xmm1/mem64
```

Figure 5-7. VCVTPS2PH (128-bit Version)

The immediate byte defines several bit fields that control rounding operation. The effect and encoding of the RC field are listed in Table 5-3.

**Immediate Byte Encoding for 16-bit Floating-Point Conversion Instructions**

| Bits | Field Name/value | Description | Comment |
| --- | --- | --- | --- |
| RC=00B | Round to nea | rest even      If Imm[2] = | 0 |
| RC=01B | Round down |  |  |
| RC=10B | Round up |  |  |
| RC=11B | Truncate |  |  |

## Operation

```text
vCvt_s2h(SRC1[31:0])
{
IF Imm[2] = 0
THEN ; using Imm[1:0] for rounding control, see Table 5-3

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Imm(SRC1[31:0]);
ELSE ; using MXCSR.RC for rounding control

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Mxcsr(SRC1[31:0]);
FI;
}


VCVTPS2PH (EVEX Encoded Versions) When DEST is a Register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] :=

             vCvt_s2h(SRC[k+31:k])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0

VCVTPS2PH (EVEX Encoded Versions) When DEST is Memory
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 16
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] :=
                vCvt_s2h(SRC[k+31:k])

          ELSE
                *DEST[i+15:i] remains unchanged* ; merging-masking

    FI;
ENDFOR

VCVTPS2PH (VEX.256 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[79:64] := vCvt_s2h(SRC1[159:128]);
DEST[95:80] := vCvt_s2h(SRC1[191:160]);
DEST[111:96] := vCvt_s2h(SRC1[223:192]);
DEST[127:112] := vCvt_s2h(SRC1[255:224]);
DEST[MAXVL-1:128] := 0

VCVTPS2PH (VEX.128 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[MAXVL-1:64] := 0
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
VCVTPS2PH __m256i _mm512_cvtps_ph(__m512 a);
VCVTPS2PH __m256i _mm512_mask_cvtps_ph(__m256i s, __mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_maskz_cvtps_ph(__mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_cvt_roundps_ph(__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_mask_cvt_roundps_ph(__m256i s, __mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_maskz_cvt_roundps_ph(__mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m128i _mm256_mask_cvtps_ph(__m128i s, __mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm256_maskz_cvtps_ph(__mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm_mask_cvtps_ph(__m128i s, __mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_maskz_cvtps_ph(__mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_cvtps_ph ( __m128 m1, const int imm);
VCVTPS2PH __m128i _mm256_cvtps_ph(__m256 m1, const int imm);
```

## SIMD Floating-Point Exceptions

Invalid, Underflow, Overflow, Precision, Denormal (if MXCSR.DAZ=0).

## Other Exceptions

VEX-encoded instructions, see Table 2-26, "Type 11 Class Exception Conditions" (do not report #AC);

EVEX-encoded instructions, see Table 2-62, "Type E11 Class Exception Conditions."

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
