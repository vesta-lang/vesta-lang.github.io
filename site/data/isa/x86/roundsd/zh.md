---
summary: 标量 双精度浮点 数值
---

## 说明

使用立即数操作数(第三操作数)指定的圆形模式,在源操作数(第二操作数)的下方qword中圆形双精度浮点值,并将结果放置在目标操作数(第一操作数)中. 四舍五入过程回合一个双精度浮点输入到一个整数值,并将整数结果以双精度浮点值在最低位置返回. 目的地的上方双精度浮点值被保留.

立即数操作数指定了四舍五入操作的控制字段,三个位字段被定义并显示于图4-24. 直接字节控制处理器行为中的位3用于精确例外,位2选择四舍五入模式控制的来源. 位数 1: 0 指定一个非粘附的圆形模式值(表4-21列出圆形模式字段的编码值).

精度浮点例外根据立即数操作数发出信号. 如果任何源操作数是SNaN,那么它将被转换成QNaN. 如果 DAZ 设定为 `1,那么在四舍五入前,异常值将转换为 0。

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:64).

VEX.128 编码版本 : 目的地YMM的位数(MAXVL-1:128)登记被清零.

## 行动

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[63:0] := ConvertDPFPToInteger_M(SRC[63:0]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[63:0] := ConvertDPFPToInteger_Imm(SRC[63:0]);

FI;
DEST[127:63] remains unchanged ;

ROUNDSD (128-bit Legacy SSE Version)
DEST[63:0] := RoundToInteger(SRC[63:0], ROUND_CONTROL)
DEST[MAXVL-1:64] (Unmodified)


VROUNDSD (VEX.128 Encoded Version)
DEST[63:0] := RoundToInteger(SRC2[63:0], ROUND_CONTROL)
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
ROUNDSD __m128d mm_round_sd(__m128d dst, __m128d s1, int iRoundMode);
ROUNDSD __m128d mm_floor_sd(__m128d dst, __m128d s1);
ROUNDSD __m128d mm_ceil_sd(__m128d dst, __m128d s1);
```

## SIMD 浮点 例外

无效( 只有 SRC = SNaN 时才发出信号) 。 精度(仅当imm[3]=`0; if imm[3] = `1时才发出信号,那么MXCSR中的精度面具会被忽略,精度例外不被信号. ) 注意非正态不是由ROUNDSD发出信号.

## 其他例外

参见表2-20"第3类例外条件".
