---
summary: 将 打包单精度浮点值 转换为包装的 FP16 值
---

## 说明

本指令将 源操作数 中包装的单精度浮值转换为 FP16 值,存储为 目标操作数 值.

VCVTPS2PHX指令支持广播.

本指令使用MXCSR.DAZ处理FP32输入. FP16输出可以是正常的或不正常的数字,而不是根据MXCSR设置有条件的冲洗.

## 行动

```text
VCVTPS2PHX DEST, SRC (AVX512_FP16 Load Version With Broadcast Support)
VL = 128, 256, or 512
KL := VL / 32

IF *SRC is a register* and (VL == 512) and (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE:
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp32[0]
          ELSE
                tsrc := SRC.fp32[j]
          DEST.fp16[j] := Convert_fp32_to_fp16(tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL/2] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VCVTPS2PHX __m256h _mm512_cvtx_roundps_ph (__m512 a, int rounding);
VCVTPS2PHX __m256h _mm512_mask_cvtx_roundps_ph (__m256h src, __mmask16 k, __m512 a, int rounding);
VCVTPS2PHX __m256h _mm512_maskz_cvtx_roundps_ph (__mmask16 k, __m512 a, int rounding);
VCVTPS2PHX __m128h _mm_cvtxps_ph (__m128 a);
VCVTPS2PHX __m128h _mm_mask_cvtxps_ph (__m128h src, __mmask8 k, __m128 a);
VCVTPS2PHX __m128h _mm_maskz_cvtxps_ph (__mmask8 k, __m128 a);
VCVTPS2PHX __m128h _mm256_cvtxps_ph (__m256 a);
VCVTPS2PHX __m128h _mm256_mask_cvtxps_ph (__m128h src, __mmask8 k, __m256 a);
VCVTPS2PHX __m128h _mm256_maskz_cvtxps_ph (__mmask8 k, __m256 a);
VCVTPS2PHX __m256h _mm512_cvtxps_ph (__m512 a);
VCVTPS2PHX __m256h _mm512_mask_cvtxps_ph (__m256h src, __mmask16 k, __m512 a);
VCVTPS2PHX __m256h _mm512_maskz_cvtxps_ph (__mmask16 k, __m512 a);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal (if MXCSR.DAZ=0).

## 其他例外

EVEX-encoded 指令,参见表2-46,"Type E2类例外条件".

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
