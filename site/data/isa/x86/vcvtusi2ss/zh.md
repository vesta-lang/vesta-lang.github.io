---
summary: 将未签名的整数转换为 标量 单精度浮点 值
---

## 说明

转换一个无符号的双字整数(如果操作数大小为 64 位元)源操作数(第二届)操作数改为a单精度浮点数值目标操作数(第一届)操作数). 源操作数可以是通用寄存器,也可以是内存位置. 目标操作数是一个XMM登记册. 结果存储在 目标操作数 的低双词中. 当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入.

第二源操作数可以是通用寄存器或32/64位的内存位置. 第一个来源和目标操作数是XMM登记册. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX.W1版本:促进指示在64位模式下使用64位输入值.

## 行动

```text
VCVTUSI2SS (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[31:0] := Convert_UInteger_To_Single_Precision_Floating_Point(SRC[63:0]);
ELSE

    DEST[31:0] := Convert_UInteger_To_Single_Precision_Floating_Point(SRC[31:0]);
FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTUSI2SS __m128 _mm_cvtu32_ss( __m128 s, unsigned a);
VCVTUSI2SS __m128 _mm_cvt_roundu32_ss( __m128 s, unsigned a, int r);
VCVTUSI2SS __m128 _mm_cvtu64_ss( __m128 s, unsigned __int64 a);
VCVTUSI2SS __m128 _mm_cvt_roundu64_ss( __m128 s, unsigned __int64 a, int r);
```

## SIMD 浮点 例外

Precision.

## 其他例外

参见表2-50"Type E3NF类例外条件".
