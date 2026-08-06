---
summary: 在包装的 FP16 值上进行还原转换
---

## 说明

本指令在源操作(第二部操作)中执行编组的二进制编码的FP16值的还原转换,并将降序结果以二进制的FP格式存储到目标操作(第一部操作)的写入mask k1下.

还原转换从二进制FP源值中减去整数部分和主要M分数位,其中M是imm8指定的无符号整数[7:4]. 具体来说,还原转化可以表示为: dest = src - (ROUND(2M)). * 页:1 * 2-M 其中,ROUND()将src,2M,及其产品作为二进制的FP数字,具有正统标志和偏颇的解码器. 通过考虑src=2p来表示减少的结果的大小 * man2, where `man2' is the normalized significand and `p' is the unbiased exponent. 如果 RC=RNE: 0 + 减少 Result -> 2-M-1.

Then if RC  RNE: 0  |ReducedResult| < 2-M.

这一指令最终可能会有一套精确的例外。 然而,对于SPE set(即Sprint Precision,即imm8[3]=1),没有报告精确的例外.

该指示可能产生微小的非零结果。 如果它这样做,它不会报告下流例外,即使下流例外被解码(MXCSR注册的UM旗为0).

特殊情况见表5-28。

** VREDUCEPH/VREDUCESH 特殊情况**

| \|Src1\| < 2-M | RU, Src1 | 0 | Src1 |
| --- | --- | --- | --- |
|  | RD, Src1 | 0 | Src1 |
|  | RD, Src1 < | 0 | 圆( Src1 + 2- M) |
| Src1 = +/-0 or | NOT RD |  | +0.0 |
| Dest = +/-0 (Src1) (中文(简体) ). | RD |  | -0.0 |
| Src1 = +/- | 任意 |  | +0.0 |
| Src1 = +/-NAN | 任意 |  | QNaN (Src1) (中文(简体) ). |

## 行动

```text
def reduce_fp16(src, imm8):
    nan := (src.exp = 0x1F) and (src.fraction != 0)
    if nan:
          return QNAN(src)
    m := imm8[7:4]
    rc := imm8[1:0]
    rc_source := imm8[2]
    spe := imm[3] // suppress precision exception
    tmp := 2^(-m) * ROUND(2^m * src, spe, rc_source, rc)
    tmp := src - tmp // using same RC, SPE controls
    return tmp

VREDUCEPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := reduce_fp16(tsrc, imm8)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VREDUCEPH __m128h _mm_mask_reduce_ph (__m128h src, __mmask8 k, __m128h a, int imm8);
VREDUCEPH __m128h _mm_maskz_reduce_ph (__mmask8 k, __m128h a, int imm8);
VREDUCEPH __m128h _mm_reduce_ph (__m128h a, int imm8);
VREDUCEPH __m256h _mm256_mask_reduce_ph (__m256h src, __mmask16 k, __m256h a, int imm8);
VREDUCEPH __m256h _mm256_maskz_reduce_ph (__mmask16 k, __m256h a, int imm8);
VREDUCEPH __m256h _mm256_reduce_ph (__m256h a, int imm8);
VREDUCEPH __m512h _mm512_mask_reduce_ph (__m512h src, __mmask32 k, __m512h a, int imm8);
VREDUCEPH __m512h _mm512_maskz_reduce_ph (__mmask32 k, __m512h a, int imm8);
VREDUCEPH __m512h _mm512_reduce_ph (__m512h a, int imm8);
VREDUCEPH __m512h _mm512_mask_reduce_round_ph (__m512h src, __mmask32 k, __m512h a, int imm8, const int sae);
VREDUCEPH __m512h _mm512_maskz_reduce_round_ph (__mmask32 k, __m512h a, int imm8, const int sae);
VREDUCEPH __m512h _mm512_reduce_round_ph (__m512h a, int imm8, const int sae);
```

## SIMD 浮点 例外

Invalid, Precision.

如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2类例外条件".
