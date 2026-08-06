---
summary: 圆包浮点32 数值以包含一定的分数位数
---

## 说明

通过即时操作中指定的圆形模式(见图5-29),将源操作中单个精度浮点值绕行,并将结果放置在目的地操作中.

目标操作数(第一个操作数)是一个按照写掩码有条件更新的ZMM登记册. 源操作数(第二个操作数)可以是ZMM的寄存器,512位内存位置的寄存器,也可以是从32位内存位置广播的512位矢量.

四舍五入过程将输入绕到一个整体值,加上imm8指定的分数位[7:4](将包含在结果中),并以单精度浮点值返回结果.

应当指出的是,在执行此指示时不会引起溢出(虽然来源以imm8[7:4]值缩放)。

立即数操作数还指定了四舍五入操作的控制字段,3位字段被定义并显示在下面的"即时控制描述"图中. 直接字节的比特 3 控制处理器行为以进行精密例外,比特 2 选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘性圆形模式值(以下立即控制表列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

此指示结果的标志保留下来,包括0的标志.

VRNDSCALEPS的每个数据元素上的操作公式为ROUND(x)=2-M*Round to INT(x*2M,圆 ctrl),圆 ctrl=imm[3:0]; 2. M=imm[7:4]; (中文(简体) ).

X*2M的运行被计算成像表示范围无限(即从未出现溢出). VRNDSCALEPS是VEX-encoded VROUNDPS指令的一种较为一般的形式. 在VROUNDPS中,每个元素的操作公式是

ROUND(x) = Round_to_INT(x, round_ctrl), round_ctrl = imm[3:0];

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD. 特殊输入值的处理情况见表5-29。

## 行动

```text
RoundToIntegerSP(SRC[31:0], imm8[7:0]) {

   if (imm8[2] = 1)

         rounding_direction := MXCSR:RC       ; get round control from MXCSR

   else

         rounding_direction := imm8[1:0]      ; get round control from imm8[1:0]

   FI

   M := imm8[7:4]         ; get the scaling factor

   case (rounding_direction)
   00: TMP[31:0] := round_to_nearest_even_integer(2M*SRC[31:0])
   01: TMP[31:0] := round_to_equal_or_smaller_integer(2M*SRC[31:0])
   10: TMP[31:0] := round_to_equal_or_larger_integer(2M*SRC[31:0])
   11: TMP[31:0] := round_to_nearest_smallest_magnitude_integer(2M*SRC[31:0])
   ESAC;

   Dest[31:0] := 2-M* TMP[31:0]           ; scale down back to 2-M

   if (imm8[3] = 0) Then         ; check SPE

         if (SRC[31:0] != Dest[31:0]) Then ; check precision lost

                set_precision()    ; set #PE

         FI;

   FI;

   return(Dest[31:0])

}

VRNDSCALEPS (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF *src is a memory operand*

    THEN TMP_SRC := BROADCAST32(SRC, VL, k1)
    ELSE TMP_SRC := SRC
FI;

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

         THEN DEST[i+31:i] := RoundToIntegerSP(TMP_SRC[i+31:i]), imm8[7:0])

   ELSE

         IF *merging-masking*                 ; merging-masking

                THEN *DEST[i+31:i] remains unchanged*

                ELSE                          ; zeroing-masking

                DEST[i+31:i] := 0

         FI;

   FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VRNDSCALEPS __m512 _mm512_roundscale_ps( __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_roundscale_round_ps( __m512 a, int imm, int sae);
VRNDSCALEPS __m512 _mm512_mask_roundscale_ps(__m512 s, __mmask16 k, __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_mask_roundscale_round_ps(__m512 s, __mmask16 k, __m512 a, int imm, int sae);
VRNDSCALEPS __m512 _mm512_maskz_roundscale_ps( __mmask16 k, __m512 a, int imm);
VRNDSCALEPS __m512 _mm512_maskz_roundscale_round_ps( __mmask16 k, __m512 a, int imm, int sae);
VRNDSCALEPS __m256 _mm256_roundscale_ps( __m256 a, int imm);
VRNDSCALEPS __m256 _mm256_mask_roundscale_ps(__m256 s, __mmask8 k, __m256 a, int imm);
VRNDSCALEPS __m256 _mm256_maskz_roundscale_ps( __mmask8 k, __m256 a, int imm);
VRNDSCALEPS __m128 _mm_roundscale_ps( __m256 a, int imm);
VRNDSCALEPS __m128 _mm_mask_roundscale_ps(__m128 s, __mmask8 k, __m128 a, int imm);
VRNDSCALEPS __m128 _mm_maskz_roundscale_ps( __mmask8 k, __m128 a, int imm);
```

## SIMD 浮点 例外

Invalid, Precision.

如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

见表2-48"E2类例外条件"。
