---
summary: 将未签名的整数转换为 标量 双精度浮点 值
---

## 说明

在第二个源代码操作中将一个无符号的双字整数(或者如果操作大小为64位的话,将无符号的四字整数)转换为目的地操作中的双精度浮点值. 结果存储在 目标操作数 的低四字中. 当转换不准确时,返回的值按照MXCSR寄存器中的四舍五入控制位数进行四舍五入.

第二源操作数可以是通用寄存器或32/64位的内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX.W1版本:促进指示在64位模式下使用64位输入值.

EVEX.W0版本:试图用 EVEX 嵌入圆形编码此指令被忽略.

## 行动

```text
VCVTUSI2SD (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_UInteger_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_UInteger_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTUSI2SD __m128d _mm_cvtu32_sd( __m128d s, unsigned a);
VCVTUSI2SD __m128d _mm_cvtu64_sd( __m128d s, unsigned __int64 a);
VCVTUSI2SD __m128d _mm_cvt_roundu64_sd( __m128d s, unsigned __int64 a, int r);
```

## SIMD 浮点 例外

Precision.

## 其他例外

参见表2-50,"Type E3NF类例外条件"如果是W1;否则参见表2-61,"Type E10NF类例外条件".
