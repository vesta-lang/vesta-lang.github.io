---
summary: Test Types of Scalar FP16 Values
---

## Description

This instruction checks the low FP16 value in the source operand for special categories, specified by the set bits in the imm8 byte. Each set bit in imm8 specifies a category of floating-point values that the input data element is classified against; see Table 5-12 for the categories. The classified results of all specified categories of an input value are ORed together to form the final boolean result for the input element. The result is written to the low bit in the destination mask register according to the writemask. The other bits in the destination mask register are zeroed.

## Operation

```text
// see VFPCLASSPH

VFPCLASSSH dest{k2}, src, imm8
IF k2[0] or *no writemask*:

    DEST.bit[0] := check_fp_class_fp16(src.fp16[0], imm8)
ELSE:

    DEST.bit[0] := 0

DEST[MAXKL-1:1] := 0
```

## Intel C/C++ compiler intrinsics

```c
VFPCLASSSH __mmask8 _mm_fpclass_sh_mask (__m128h a, int imm8);
VFPCLASSSH __mmask8 _mm_mask_fpclass_sh_mask (__mmask8 k1, __m128h a, int imm8);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

EVEX-encoded instructions, see Table 2-60, "Type E10 Class Exception Conditions."
