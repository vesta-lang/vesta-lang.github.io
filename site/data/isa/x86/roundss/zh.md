---
summary: 标量 单精度浮点 数值
---

## 说明

使用立即数操作数(第三代操作数)指定的圆形模式,将源操作数(第二代操作数)中最小的dword中的单精度浮点值回合,并将结果置入目标操作数(第一代操作数). 四舍五入过程将一个 单精度浮点 输入到整数值,并在最低位置以 单精度浮点 值返回结果. 目的地的上三个单精度浮点值被保留.

立即数操作数指定了四舍五入操作的控制字段,三个位字段被定义并显示于图4-24. 直接字节控制处理器行为中的位3用于精确例外,位2选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘附的圆形模式值(表4-21列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:32).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

## 行动

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[31:0] := ConvertSPFPToInteger_M(SRC[31:0]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[31:0] := ConvertSPFPToInteger_Imm(SRC[31:0]);

FI;
DEST[127:32] remains unchanged ;

ROUNDSS (128-bit Legacy SSE Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[MAXVL-1:32] (Unmodified)


VROUNDSS (VEX.128 Encoded Version)
DEST[31:0] := RoundToInteger(SRC2[31:0], ROUND_CONTROL)
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
ROUNDSS __m128 mm_round_ss(__m128 dst, __m128 s1, int iRoundMode);
ROUNDSS __m128 mm_floor_ss(__m128 dst, __m128 s1);
ROUNDSS __m128 mm_ceil_ss(__m128 dst, __m128 s1);
```

## SIMD 浮点 例外

无效( 只有 SRC = SNaN 时才发出信号) 。 精度(仅当imm[3]=`0; if imm[3] = `1时才发出信号,那么MXCSR中的精度面具会被忽略,精度例外不被信号. ) 注意非正态不是由ROUNDSS发出信号.

## 其他例外

参见表2-20"第3类例外条件".
