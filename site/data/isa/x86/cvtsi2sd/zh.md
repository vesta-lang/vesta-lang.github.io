---
summary: 将已签名的整数转换为 标量 双精度浮点 值
---

## 说明

将"从"源操作数转换成"从"目标操作数转换成"从"双精度浮点转换成"双精度浮点。 结果存储在目标操作数的低四字中,高四字保留不变. 当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入.

第二源操作数可以是通用寄存器或32/64位的内存位置. 第一个来源和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 使用REX.W前缀将指令推广到64位操作数. "convert from" 源操作数(第二个操作数)是一个通用寄存器或内存位置. 目的地为XMM注册点Bits(MAXVL-1:64)的对应目的地注册点保持不变.

VEX.128和EVEX编码版本: "转换自"源操作数(第三代操作数)可以是通用寄存器或内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX.W0版本:试图用 EVEX 嵌入圆形编码此指令被忽略.

VEX.W1和EVEX.W1版本:促进指示在64位模式下使用64位输入值.

软件应确保VCVTSI2SD的编码与VEX.L=0. 用 VEX.L = 1 编码 VCVTSI2SD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VCVTSI2SD (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VCVTSI2SD (VEX.128 Encoded Version)
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

CVTSI2SD
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VCVTSI2SD __m128d _mm_cvti32_sd(__m128d s, int a);
VCVTSI2SD __m128d _mm_cvti64_sd(__m128d s, __int64 a);
VCVTSI2SD __m128d _mm_cvt_roundi64_sd(__m128d s, __int64 a, int r);
CVTSI2SD __m128d _mm_cvtsi64_sd(__m128d s, __int64 a);
CVTSI2SD __m128d_mm_cvtsi32_sd(__m128d a, int b);
```

## SIMD 浮点 例外

Precision.

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3类例外条件",如果W1;其他参见表2-22,"Type 5类例外条件".

EVEX-encoded指令,参见表2-50"Type E3NF类例外条件",如果是W1;其他参见表2-61"Type E10NF类例外条件".
