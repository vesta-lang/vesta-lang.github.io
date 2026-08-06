---
summary: 打包双精度浮点值 回合
---

## 说明

使用 立即数操作数(第三操作数)指定的圆形模式,在 源操作数(第二操作数)中绕行2 双精度浮点值,并将结果放置在 目标操作数(第一操作数)中. 四舍五入过程环绕每个输入的浮点值为整数值,并以双精度浮点值返回整数结果.

立即数操作数指定了四舍五入操作的控制字段,三个位字段被定义并显示于图4-24. 直接字节控制处理器行为中的位3用于精确例外,位2选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘附的圆形模式值(表4-21列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:源操作数 第二源操作数或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                     8                                               3210
```

Reserved

P - 精密面罩(SPE); 0: 普通, 1: 不准确的RS - 圆形选择; 1: MXCSR.RC, 0: (中文(简体) ). Imm8.RC RC - 四舍五入模式

图4-24. ROUNDxx指令的直接字节的位控制字段

** 四舍五入控制场的旋转模式和编码**

| 回合至 | 00B | 四舍五入的结果是最接近无限精确的结果. 如果两个值同样接近,则 | 结果 | is |
| --- | --- | --- | --- | --- |
| 最近的( 偶数) |  | 偶数(即零最小位的整数)。 |  |  |
| 掉头 | 01B | 四舍五入的结果最接近但不超过无限精确的结果。 |  |  |
| (转-) |  |  |  |  |
| 集合起来 | 10B | 四舍五入的结果最接近但不少于无限精确的结果。 |  |  |
| (转+) |  |  |  |  |
| 圆向 | 11B | 四舍五入的结果最接近但绝对值并不大于无限精确的结果。 |  |  |
| 零( 曲线) |  |  |  |  |

## 行动

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[63:0] := ConvertDPFPToInteger_M(SRC[63:0]);
          DEST[127:64] := ConvertDPFPToInteger_M(SRC[127:64]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[63:0] := ConvertDPFPToInteger_Imm(SRC[63:0]);
          DEST[127:64] := ConvertDPFPToInteger_Imm(SRC[127:64]);

FI

ROUNDPD (128-bit Legacy SSE Version)
DEST[63:0] := RoundToInteger(SRC[63:0]], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[MAXVL-1:128] (Unmodified)

VROUNDPD (VEX.128 Encoded Version)
DEST[63:0] := RoundToInteger(SRC[63:0]], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[MAXVL-1:128] := 0

VROUNDPD (VEX.256 Encoded Version)
DEST[63:0] := RoundToInteger(SRC[63:0], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[191:128] := RoundToInteger(SRC[191:128]], ROUND_CONTROL)
DEST[255:192] := RoundToInteger(SRC[255:192] ], ROUND_CONTROL)
```

## Intel C/C++ 内在编译器

```c
__m128 _mm_round_pd(__m128d s1, int iRoundMode);
__m128 _mm_floor_pd(__m128d s1);
__m128 _mm_ceil_pd(__m128d s1) __m256 _mm256_round_pd(__m256d s1, int iRoundMode);
__m256 _mm256_floor_pd(__m256d s1);
__m256 _mm256_ceil_pd(__m256d s1);
```

## SIMD 浮点 例外

无效( 只有 SRC = SNaN 时才发出信号) 。 精度(仅当imm[3]=`0; if imm[3] = `1时才发出信号,那么MXCSR中的精度面具会被忽略,精度例外不被信号. ) 注意非正态不是由ROUNDPD发出信号.

## 其他例外

见表2-19,"第2类例外条件",另外:

```text
#UD               If VEX.vvvv  1111B.
```
