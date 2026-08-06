---
summary: 回合 标量 浮点32 数值包含一定的分数位数
---

## 说明

按立即数操作数(见图5-29)中指定的四舍五入模式,将第二源操作数(第三个操作数)低双字元件中的单精度浮点值四舍五入,并将结果按照写掩码(第一个操作数)排列为目标操作数(第一个操作数)的相应元件. 目的地的比特127:32的双字元素从第一源操作数(第二个操作数)复制.

目的地和第一个源操作数是XMM登记册,第2个源操作数可以是XMM登记册或内存位置. 目的地登记簿的位数MAXVL-1:128被清除.

四舍五入过程将输入绕到一个整体值,加上imm8指定的分数位[7:4](将包含在结果中),并以单精度浮点值返回结果.

应当指出的是,在执行此指示时不会引起溢出(虽然来源以imm8[7:4]值缩放)。

立即数操作数还指定了四舍五入操作的控制字段,3位字段被定义并显示在下面的"即时控制描述"图中. 直接字节的比特 3 控制处理器行为以进行精密例外,比特 2 选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘性圆形模式值(下面的即时控制表列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

此指示结果的标志保留下来,包括0的标志.

VRNDSCALESS的操作公式为:ROUND(x)=2-M*round to INT(x*2M,圆 ctrl),圆 ctrl=im[3:0]; M=imm[7:4]; (中文(简体) ).

X*2M的运行被计算成像表示范围无限(即从未出现溢出). VRNDSCALESS是VEX-encoded VROUNDSS指令的一种较为一般的形式. 在VROUNDSS中,每个元素的操作公式是

ROUND(x) = Round_to_INT(x, round_ctrl), round_ctrl = imm[3:0];

EVEX 编码版本 : 源操作数是一个XMM的寄存器或32位的内存位置. 目标操作数是一个XMM登记册.

特殊输入值的处理情况见表5-29。

## 行动

```text
RoundToIntegerSP(SRC[31:0], imm8[7:0]) {

     if (imm8[2] = 1)

           rounding_direction := MXCSR:RC     ; get round control from MXCSR

     else

           rounding_direction := imm8[1:0]    ; get round control from imm8[1:0]

     FI

     M := imm8[7:4]         ; get the scaling factor

     case (rounding_direction)
     00: TMP[31:0] := round_to_nearest_even_integer(2M*SRC[31:0])
     01: TMP[31:0] := round_to_equal_or_smaller_integer(2M*SRC[31:0])
     10: TMP[31:0] := round_to_equal_or_larger_integer(2M*SRC[31:0])
     11: TMP[31:0] := round_to_nearest_smallest_magnitude_integer(2M*SRC[31:0])
     ESAC;

     Dest[31:0] := 2-M* TMP[31:0]           ; scale down back to 2-M

     if (imm8[3] = 0) Then       ; check SPE

           if (SRC[31:0] != Dest[31:0]) Then ; check precision lost

                set_precision()    ; set #PE

           FI;

     FI;

     return(Dest[31:0])

}

VRNDSCALESS (EVEX encoded version)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundToIntegerSP(SRC2[31:0], Zero_upper_imm[7:0])

     ELSE

           IF *merging-masking*               ; merging-masking

                THEN *DEST[31:0] remains unchanged*

                ELSE                          ; zeroing-masking

                THEN DEST[31:0] := 0

           FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VRNDSCALESS __m128 _mm_roundscale_ss ( __m128 a, __m128 b, int imm);
VRNDSCALESS __m128 _mm_roundscale_round_ss ( __m128 a, __m128 b, int imm, int sae);
VRNDSCALESS __m128 _mm_mask_roundscale_ss (__m128 s, __mmask8 k, __m128 a, __m128 b, int imm);
VRNDSCALESS __m128 _mm_mask_roundscale_round_ss (__m128 s, __mmask8 k, __m128 a, __m128 b, int imm, int sae);
VRNDSCALESS __m128 _mm_maskz_roundscale_ss ( __mmask8 k, __m128 a, __m128 b, int imm);
VRNDSCALESS __m128 _mm_maskz_roundscale_round_ss ( __mmask8 k, __m128 a, __m128 b, int imm, int sae);
```

## SIMD 浮点 例外

无效, 精度 。 如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

见表2-49"E3类例外条件"。
