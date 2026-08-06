---
summary: 添加包装的 FP16 值
---

## 说明

本指令添加了源操作数中包装的FP16值,并存储了包装的FP16结果为目标操作数. 目的地元素根据写掩码更新.

## 行动

```text
VADDPH (EVEX Encoded Versions) When SRC2 Operand is a Register
VL = 128, 256 or 512
KL := VL/16
IF (VL = 512) AND (EVEX.b = 1):

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.fp16[j] := SRC1.fp16[j] + SRC2.fp16[j]

    ELSEIF *zeroing*:
          DEST.fp16[j] := 0

    // else dest.fp16[j] remains unchanged
DEST[MAXVL-1:VL] := 0


VADDPH (EVEX Encoded Versions) When SRC2 Operand is a Memory Source
VL = 128, 256 or 512
KL := VL/16
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                DEST.fp16[j] := SRC1.fp16[j] + SRC2.fp16[0]
          ELSE:
                DEST.fp16[j] := SRC1.fp16[j] + SRC2.fp16[j]

    ELSE IF *zeroing*:
          DEST.fp16[j] := 0

    // else dest.fp16[j] remains unchanged
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VADDPH __m128h _mm_add_ph (__m128h a, __m128h b);
VADDPH __m128h _mm_mask_add_ph (__m128h src, __mmask8 k, __m128h a, __m128h b);
VADDPH __m128h _mm_maskz_add_ph (__mmask8 k, __m128h a, __m128h b);
VADDPH __m256h _mm256_add_ph (__m256h a, __m256h b);
VADDPH __m256h _mm256_mask_add_ph (__m256h src, __mmask16 k, __m256h a, __m256h b);
VADDPH __m256h _mm256_maskz_add_ph (__mmask16 k, __m256h a, __m256h b);
VADDPH __m512h _mm512_add_ph (__m512h a, __m512h b);
VADDPH __m512h _mm512_add_ph (__m512h a, __m512h b);
VADDPH __m512h _mm512_mask_add_ph (__m512h src, __mmask32 k, __m512h a, __m512h b);
VADDPH __m512h _mm512_maskz_add_ph (__mmask32 k, __m512h a, __m512h b);
VADDPH __m512h _mm512_add_round_ph (__m512h a, __m512h b, int rounding);
VADDPH __m512h _mm512_mask_add_round_ph (__m512h src, __mmask32 k, __m512h a, __m512h b, int rounding);
VADDPH __m512h _mm512_maskz_add_round_ph (__mmask32 k, __m512h a, __m512h b, int rounding);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
