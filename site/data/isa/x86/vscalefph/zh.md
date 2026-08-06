---
summary: 以 FP16 值缩放的 FP16 值
---

## 说明

本指令在 第一源操作数 中执行一个 浮点 的 FP16 值的集合值的 浮点 比例尺,将它乘以 2 到 第二源操作数 中的 FP16 值的功率. 目的地元素根据写掩码更新.

此操作的方程式由:

```text
     zmm1 := zmm2 * 2floor(zmm3).
```

地板(zmm3)是指最大整数值zmm3.

如果结果无法在 FP16 中表示,则会发出适当的溢出响应(对于正缩放 操作数),或者适当的下流响应(对于负缩放 操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR(例外面具位)中的其他设置,以及SAE位.

表5-39和表5-40列出了特殊情况输入值的处理情况。

** VSCALEFPH/VSCALEFSH 特殊情况**

| +/-QNAN 组合键 | QNaN( 曲线1) | +INF | +0 | QNaN( 曲线1) | 如果两个来源都是SNAN |
| --- | --- | --- | --- | --- | --- |
| +/- SNAN 组合键 | QNaN( 曲线1) | QNaN( 曲线1) | QNaN( 曲线1) | QNaN( 曲线1) | YES |
| +/-INF | QNaN( 曲线2) | Src1 | QNaN_Indefinite | Src1 | IF Src2 是 SNaN 或 - INF 。 |
| +/-0 | QNaN( 曲线2) | QNaN_Indefinite | Src1 | Src1 | IF Src2 是 SNaN 或 + INF |

## 行动

```text
def scale_fp16(src1,src2):

    tmp1 := src1
    tmp2 := src2
    return tmp1 * POW(2, FLOOR(tmp2))

VSCALEFPH dest{k1}, src1, src2
VL = 128, 256, or 512
KL := VL / 16

IF (VL = 512) AND (EVEX.b = 1) and no memory operand:
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC2 is memory and (EVEX.b = 1):
                tsrc := src2.fp16[0]
          ELSE:
                tsrc := src2.fp16[i]
          dest.fp16[i] := scale_fp16(src1.fp16[i],tsrc)
    ELSE IF *zeroing*:
          dest.fp16[i] := 0
    //else dest.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VSCALEFPH __m128h _mm_mask_scalef_ph (__m128h src, __mmask8 k, __m128h a, __m128h b);
VSCALEFPH __m128h _mm_maskz_scalef_ph (__mmask8 k, __m128h a, __m128h b);
VSCALEFPH __m128h _mm_scalef_ph (__m128h a, __m128h b);
VSCALEFPH __m256h _mm256_mask_scalef_ph (__m256h src, __mmask16 k, __m256h a, __m256h b);
VSCALEFPH __m256h _mm256_maskz_scalef_ph (__mmask16 k, __m256h a, __m256h b);
VSCALEFPH __m256h _mm256_scalef_ph (__m256h a, __m256h b);
VSCALEFPH __m512h _mm512_mask_scalef_ph (__m512h src, __mmask32 k, __m512h a, __m512h b);
VSCALEFPH __m512h _mm512_maskz_scalef_ph (__mmask32 k, __m512h a, __m512h b);
VSCALEFPH __m512h _mm512_scalef_ph (__m512h a, __m512h b);
VSCALEFPH __m512h _mm512_mask_scalef_round_ph (__m512h src, __mmask32 k, __m512h a, __m512h b, const int rounding);
VSCALEFPH __m512h _mm512_scalef_round_ph (__m512h a, __m512h b, const int rounding);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal (for Src1).

Src2 没有报告异常情况。

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2类例外条件".
