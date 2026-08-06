---
summary: 回合包装的 FP16 值包含一定的分数位数
---

## 说明

本指令通过即时操作(见表5-30)中指定的四舍五入模式绕过源操作中的FP16值,并将结果放置在目的操作中. 目标操作数根据写掩码有条件更新.

四舍五入过程将输入绕到一个整体值,加上imm8指定的分数位[7:4](将包含在结果中),并将结果以FP16值返回.

注意在执行此指令时不会引起溢出(尽管源值以 imm8 [7:4] 值缩放).

立即数操作数还指定了四舍五入操作的控制字段. 3位字段在表5-30"VRNDSCALEPH/VRNDSCALESH的Imm8控制"中定义并显示. 直接字节的Bit 3控制处理器行为进行精密例外,bit 2选择四舍五入模式控制的来源,bit 1:0指定一个非Sticky四舍五入模式值.

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN.

此指示结果的标志保留下来,包括0的标志. 特殊情况见表5-31。

VRNDSCALEPH的每个数据元素上的操作公式为ROUND(x)=2-M *round to INT(x) * 2M,圆 ctrl),.

round_ctrl = imm[3:0];

M=imm[7:4]; (中文(简体) ). X 的操作 * 2M的计算方式仿佛是无限的(即从未出现溢出).

如果此指令编码在立即数操作数中的SPE比特(bit 3)是1,VRNDSCALEPH可以设置MXCSR.UE而不使用MXCSR.PE.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

Imm8 位数表 5-30. VRNDSCALEPH/VRNDSCALESH imm8的Imm8控制 [7:4] imm8 [3] 描述

imm8 [2] 要保存的固定点数 。

imm8 [1:0] 禁止精密例外(SPE) 0b00: 使用 MXCSR 例外掩码。 0b01 : 隐约压制.

回合选择 (RS) 0b00 : 使用 imm8 [1: 0]. 0b01: 隐含使用 MXCSR.

圆控覆盖: 0b00: 0b01: 最接近的圆形。 转弯,0b10: 集合起来,0b11: 截断.

输入值表5-31. VRNDSCALEPH/VRNDSCALESH 特殊案例 Src1=+/- 返回值 Src1=+/- NaN Src1 Src1=+/-0 Src1 转换为QNaN Src1

## 行动

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

## Intel C/C++ 内在编译器

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

## SIMD 浮点 例外

Invalid, Underflow, Precision.

如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2类例外条件".
