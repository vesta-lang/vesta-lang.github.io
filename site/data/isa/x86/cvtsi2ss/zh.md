---
summary: 将已签名的整数转换为 标量 单精度浮点 值
---

## 说明

将"从"源操作数中转换成"目标操作数"(第一个操作数)中已签名的双字或四字整数转换成单精度浮点值. "转换自"源操作数可以是通用寄存器或内存位置. 目标操作数是一个XMM登记册. 结果存储在目标操作数的低双词中,上三双词不变. 当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入.

128位遗产 SSE 版本 : 在64位模式中,使用REX.W前缀促进指令使用64位输入值. "从"源操作数(第二个操作数)是一个通用寄存器或内存位置. 相应的目的地注册保持不变的位数(MAXVL-1:32).

VEX.128和EVEX编码版本: "转换自"源操作数(第三代操作数)可以是通用寄存器或内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX编码版本:转换后的结果为写掩码下的目的地低双字元素.

软件应确保VCVTSI2SS的编码与VEX.L=0. 用 VEX.L = 1 编码 VCVTSI2SS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VCVTSI2SS (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VCVTSI2SS (VEX.128 Encoded Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

CVTSI2SS (128-bit Legacy SSE Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] :=Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTSI2SS __m128 _mm_cvti32_ss(__m128 s, int a);
VCVTSI2SS __m128 _mm_cvt_roundi32_ss(__m128 s, int a, int r);
VCVTSI2SS __m128 _mm_cvti64_ss(__m128 s, __int64 a);
VCVTSI2SS __m128 _mm_cvt_roundi64_ss(__m128 s, __int64 a, int r);
CVTSI2SS __m128 _mm_cvtsi64_ss(__m128 s, __int64 a);
CVTSI2SS __m128 _mm_cvtsi32_ss(__m128 a, int b);
```

## SIMD 浮点 例外

Precision.

## 其他例外

VEX-encoded指令,参见表2-20"第3类例外条件".

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
