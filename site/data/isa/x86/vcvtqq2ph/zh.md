---
summary: 将已签名的四字形整数转换为已包装的 FP16 值
---

## 说明

本指令将 源操作数 中已打包的签名四字整数转换为 FP16 中打包的 目标操作数 值. 目的地元素根据写掩码更新.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果转换操作结果溢出,MXCSR.OM=0,则用OE=1,PE=1提出SIMD例外.

## 行动

```text
VCVTQQ2PH DEST, SRC
VL = 128, 256 or 512
KL := VL / 64

IF *SRC is a register* and (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE:
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.qword[0]
          ELSE
                tsrc := SRC.qword[j]
          DEST.fp16[j] := Convert_integer64_to_fp16(tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL/4] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTQQ2PH __m128h _mm512_cvt_roundepi64_ph (__m512i a, int rounding);
VCVTQQ2PH __m128h _mm512_mask_cvt_roundepi64_ph (__m128h src, __mmask8 k, __m512i a, int rounding);
VCVTQQ2PH __m128h _mm512_maskz_cvt_roundepi64_ph (__mmask8 k, __m512i a, int rounding);
VCVTQQ2PH __m128h _mm_cvtepi64_ph (__m128i a);
VCVTQQ2PH __m128h _mm_mask_cvtepi64_ph (__m128h src, __mmask8 k, __m128i a);
VCVTQQ2PH __m128h _mm_maskz_cvtepi64_ph (__mmask8 k, __m128i a);
VCVTQQ2PH __m128h _mm256_cvtepi64_ph (__m256i a);
VCVTQQ2PH __m128h _mm256_mask_cvtepi64_ph (__m128h src, __mmask8 k, __m256i a);
VCVTQQ2PH __m128h _mm256_maskz_cvtepi64_ph (__mmask8 k, __m256i a);
VCVTQQ2PH __m128h _mm512_cvtepi64_ph (__m512i a);
VCVTQQ2PH __m128h _mm512_mask_cvtepi64_ph (__m128h src, __mmask8 k, __m512i a);
VCVTQQ2PH __m128h _mm512_maskz_cvtepi64_ph (__mmask8 k, __m512i a);
```

## SIMD 浮点 例外

Overflow, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
