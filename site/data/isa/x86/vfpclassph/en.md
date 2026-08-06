---
summary: Test Types of Packed FP16 Values
---

## Description

This instruction checks the packed FP16 values in the source operand for special categories, specified by the set bits in the imm8 byte. Each set bit in imm8 specifies a category of floating-point values that the input data element is classified against; see Table 5-12 for the categories. The classified results of all specified categories of an input value are ORed together to form the final boolean result for the input element. The result is written to the corresponding bits in the destination mask register according to the writemask.

**Classifier Operations for VFPCLASSPH/VFPCLASSSH**

| Bits | Category | Classifier |
| --- | --- | --- |
| [0] | QNAN | Checks for QNAN |
| [1] | PosZero | Checks +0 |
| [2] | NegZero | Checks for -0 |
| [3] | PosINF | Checks for + |
| [4] | NegINF | Checks for - |
| [5] | Denormal | Checks for Denormal |

## Operation

```text
def check_fp_class_fp16(tsrc, imm8):

    negative := tsrc[15]
    exponent_all_ones := (tsrc[14:10] == 0x1F)
    exponent_all_zeros := (tsrc[14:10] == 0)
    mantissa_all_zeros := (tsrc[9:0] == 0)
    zero := exponent_all_zeros and mantissa_all_zeros
    signaling_bit := tsrc[9]

    snan := exponent_all_ones and not(mantissa_all_zeros) and not(signaling_bit)
    qnan := exponent_all_ones and not(mantissa_all_zeros) and signaling_bit
    positive_zero := not(negative) and zero
    negative_zero := negative and zero
    positive_infinity := not(negative) and exponent_all_ones and mantissa_all_zeros
    negative_infinity := negative and exponent_all_ones and mantissa_all_zeros
    denormal := exponent_all_zeros and not(mantissa_all_zeros)
    finite_negative := negative and not(exponent_all_ones) and not(zero)

    return (imm8[0] and qnan) OR
          (imm8[1] and positive_zero) OR
          (imm8[2] and negative_zero) OR
          (imm8[3] and positive_infinity) OR
          (imm8[4] and negative_infinity) OR
          (imm8[5] and denormal) OR
          (imm8[6] and finite_negative) OR
          (imm8[7] and snan)

VFPCLASSPH dest{k2}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k2[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := SRC.fp16[0]
          ELSE:
                tsrc := SRC.fp16[i]
          DEST.bit[i] := check_fp_class_fp16(tsrc, imm8)
    ELSE:
          DEST.bit[i] := 0

DEST[MAXKL-1:kl] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFPCLASSPH __mmask8 _mm_fpclass_ph_mask (__m128h a, int imm8);
VFPCLASSPH __mmask8 _mm_mask_fpclass_ph_mask (__mmask8 k1, __m128h a, int imm8);
VFPCLASSPH __mmask16 _mm256_fpclass_ph_mask (__m256h a, int imm8);
VFPCLASSPH __mmask16 _mm256_mask_fpclass_ph_mask (__mmask16 k1, __m256h a, int imm8);
VFPCLASSPH __mmask32 _mm512_fpclass_ph_mask (__m512h a, int imm8);
VFPCLASSPH __mmask32 _mm512_mask_fpclass_ph_mask (__mmask32 k1, __m512h a, int imm8);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instructions, see Table 2-51, "Type E4 Class Exception Conditions."
