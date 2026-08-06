---
summary: Round Packed FP16 Values to Include a Given Number of Fraction Bits
---

## Description

This instruction rounds the FP16 values in the source operand by the rounding mode specified in the immediate operand (see Table 5-30) and places the result in the destination operand. The destination operand is conditionally updated according to the writemask.

The rounding process rounds the input to an integral value, plus number bits of fraction that are specified by imm8[7:4] (to be included in the result), and returns the result as an FP16 value.

Note that no overflow is induced while executing this instruction (although the source is scaled by the imm8[7:4] value).

The immediate operand also specifies control fields for the rounding operation. Three bit fields are defined and shown in Table 5-30, "Imm8 Controls for VRNDSCALEPH/VRNDSCALESH." Bit 3 of the immediate byte controls the processor behavior for a precision exception, bit 2 selects the source of rounding mode control, and bits 1:0 specify a non-sticky rounding-mode value.

The Precision Floating-Point Exception is signaled according to the immediate operand. If any source operand is an SNaN then it will be converted to a QNaN.

The sign of the result of this instruction is preserved, including the sign of zero. Special cases are described in Table 5-31.

The formula of the operation on each data element for VRNDSCALEPH is ROUND(x) = 2-M *Round_to_INT(x * 2M, round_ctrl),

round_ctrl = imm[3:0];

M=imm[7:4]; The operation of x * 2M is computed as if the exponent range is unlimited (i.e., no overflow ever occurs).

If this instruction encoding's SPE bit (bit 3) in the immediate operand is 1, VRNDSCALEPH can set MXCSR.UE without MXCSR.PE.

EVEX.vvvv is reserved and must be 1111b, otherwise instructions will #UD.

Imm8 Bits            Table 5-30. Imm8 Controls for VRNDSCALEPH/VRNDSCALESH imm8[7:4] imm8[3]                   Description

imm8[2]                   Number of fixed points to preserve.

imm8[1:0]                 Suppress Precision Exception (SPE) 0b00: Implies use of MXCSR exception mask. 0b01: Implies suppress.

Round Select (RS) 0b00: Implies use of imm8[1:0]. 0b01: Implies use of MXCSR.

Round Control Override: 0b00: Round nearest even. 0b01: Round down. 0b10: Round up. 0b11: Truncate.

Input Value                  Table 5-31. VRNDSCALEPH/VRNDSCALESH Special Cases Src1 = +/-                                                                     Returned Value Src1 = +/-NaN                                                                  Src1 Src1 = +/-0                                                                    Src1 converted to QNaN Src1

## Operation

```text
def round_fp16_to_integer(src, imm8):
    if imm8[2] = 1:
          rounding_direction := MXCSR.RC
    else:
          rounding_direction := imm8[1:0]
    m := imm8[7:4] // scaling factor

tsrc1 := 2^m * src

if rounding_direction = 0b00:
      tmp := round_to_nearest_even_integer(trc1)

else if rounding_direction = 0b01:
      tmp := round_to_equal_or_smaller_integer(trc1)

else if rounding_direction = 0b10:
      tmp := round_to_equal_or_larger_integer(trc1)

else if rounding_direction = 0b11:
      tmp := round_to_smallest_magnitude_integer(trc1)

dst := 2^(-m) * tmp

if imm8[3]==0: // check SPE
      if src != dst:
            MXCSR.PE := 1

return dst


VRNDSCALEPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := round_fp16_to_integer(tsrc, imm8)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compiler intrinsics

```c
VRNDSCALEPH __m128h _mm_mask_roundscale_ph (__m128h src, __mmask8 k, __m128h a, int imm8);
VRNDSCALEPH __m128h _mm_maskz_roundscale_ph (__mmask8 k, __m128h a, int imm8);
VRNDSCALEPH __m128h _mm_roundscale_ph (__m128h a, int imm8);
VRNDSCALEPH __m256h _mm256_mask_roundscale_ph (__m256h src, __mmask16 k, __m256h a, int imm8);
VRNDSCALEPH __m256h _mm256_maskz_roundscale_ph (__mmask16 k, __m256h a, int imm8);
VRNDSCALEPH __m256h _mm256_roundscale_ph (__m256h a, int imm8);
VRNDSCALEPH __m512h _mm512_mask_roundscale_ph (__m512h src, __mmask32 k, __m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_maskz_roundscale_ph (__mmask32 k, __m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_roundscale_ph (__m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_mask_roundscale_round_ph (__m512h src, __mmask32 k, __m512h a, int imm8, const int sae);
VRNDSCALEPH __m512h _mm512_maskz_roundscale_round_ph (__mmask32 k, __m512h a, int imm8, const int sae);
VRNDSCALEPH __m512h _mm512_roundscale_round_ph (__m512h a, int imm8, const int sae);
```

## SIMD Floating-Point Exceptions

Invalid, Underflow, Precision.

If SPE is enabled, precision exception is not reported (regardless of MXCSR exception mask).

## Other Exceptions

EVEX-encoded instruction, see Table 2-48, "Type E2 Class Exception Conditions."
