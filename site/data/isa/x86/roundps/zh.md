---
summary: 打包单精度浮点值 回合
---

## 说明

使用 立即数操作数(第三操作数)中指定的绕行模式,在 源操作数(第二操作数)中绕行4 单精度浮点值,并将结果放置在 目标操作数(第一操作数)中. 四舍五入过程环绕每个输入的浮点值为整数值,并以单精度浮点值返回整数结果.

立即数操作数指定了四舍五入操作的控制字段,三个位字段被定义并显示于图4-24. 直接字节控制处理器行为中的位3用于精确例外,位2选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘附的圆形模式值(表4-21列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:源操作数 第二源操作数或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

说明: 在VEX-encoded版本中,VEX.vvvv被保留,必须是1111b否则指令会#UD.

## 行动

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[31:0] := ConvertSPFPToInteger_M(SRC[31:0]);
          DEST[63:32] := ConvertSPFPToInteger_M(SRC[63:32]);
          DEST[95:64] := ConvertSPFPToInteger_M(SRC[95:64]);
          DEST[127:96] := ConvertSPFPToInteger_M(SRC[127:96]);
    ELSE // rounding mode is determined by IMM8.RC


          DEST[31:0] := ConvertSPFPToInteger_Imm(SRC[31:0]);
          DEST[63:32] := ConvertSPFPToInteger_Imm(SRC[63:32]);
          DEST[95:64] := ConvertSPFPToInteger_Imm(SRC[95:64]);
          DEST[127:96] := ConvertSPFPToInteger_Imm(SRC[127:96]);
FI;

ROUNDPS(128-bit Legacy SSE Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[MAXVL-1:128] (Unmodified)

VROUNDPS (VEX.128 Encoded Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[MAXVL-1:128] := 0

VROUNDPS (VEX.256 Encoded Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[159:128] := RoundToInteger(SRC[159:128]], ROUND_CONTROL)
DEST[191:160] := RoundToInteger(SRC[191:160]], ROUND_CONTROL)
DEST[223:192] := RoundToInteger(SRC[223:192] ], ROUND_CONTROL)
DEST[255:224] := RoundToInteger(SRC[255:224] ], ROUND_CONTROL)
```

## Intel C/C++ 内在编译器

```c
__m128 _mm_round_ps(__m128 s1, int iRoundMode);
__m128 _mm_floor_ps(__m128 s1);
__m128 _mm_ceil_ps(__m128 s1) __m256 _mm256_round_ps(__m256 s1, int iRoundMode);
__m256 _mm256_floor_ps(__m256 s1);
__m256 _mm256_ceil_ps(__m256 s1);
```

## SIMD 浮点 例外

无效( 只有 SRC = SNaN 时才发出信号) 。 精度(仅当imm[3]=`0; if imm[3] = `1时才发出信号,那么MXCSR中的精度面具会被忽略,精度例外不被信号. ) 注意非正态不是由ROUNDPS发出信号.

## 其他例外

见表2-19,"第2类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
