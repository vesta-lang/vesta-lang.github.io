---
summary: 圆形 标量 FP16 值包含一个特定的小数位数
---

## 说明

本指令以 立即数操作数(见表5-30)中指定的圆形模式环绕第二源操作数中的低FP16值,并将结果置于目标操作数.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

四舍五入过程将输入绕到一个整体值,加上imm8指定的分数位[7:4](将包含在结果中),并将结果以FP16值返回.

注意在执行此指令时不会引起溢出(尽管源值以 imm8 [7:4] 值缩放).

立即数操作数还指定了四舍五入操作的控制字段. 3位字段在表5-30"VRNDSCALEPH/VRNDSCALESH的Imm8控制"中定义并显示. 直接字节的Bit 3控制处理器行为进行精密例外,bit 2选择四舍五入模式控制的来源,bit 1:0指定一个非Sticky四舍五入模式值.

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN.

此指示结果的标志保留下来,包括0的标志. 特殊情况见表5-31。

如果此指令编码在立即数操作数中的SPE比特(bit 3)是1,VRNDSCALESH可以设置MXCSR.UE而不使用MXCSR.PE.

VRNDSCALESH每个数据元素的操作公式是: ROUND(x)=2-M *round to INT(x) * 2M,圆 ctrl),.

round_ctrl = imm[3:0];

M=imm[7:4]; (中文(简体) ). X 的操作 * 2M的计算方式仿佛是无限的(即从未出现溢出).

## 行动

```text
VRNDSCALESH dest{k1}, src1, src2, imm8
IF k1[0] or *no writemask*:

    DEST.fp16[0] := round_fp16_to_integer(src2.fp16[0], imm8) // see VRNDSCALEPH
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] = src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VRNDSCALESH __m128h _mm_mask_roundscale_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_maskz_roundscale_round_sh (__mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_roundscale_round_sh (__m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_mask_roundscale_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8);
VRNDSCALESH __m128h _mm_maskz_roundscale_sh (__mmask8 k, __m128h a, __m128h b, int imm8);
VRNDSCALESH __m128h _mm_roundscale_sh (__m128h a, __m128h b, int imm8);
```

## SIMD 浮点 例外

Invalid, Underflow, Precision.

如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
