---
summary: 以 Truncation 标量 单精度浮点 值转换为
---

## 说明

将源操作数(第二个操作数)中的单精度浮点值通过折射转换成无符号的双字整数(或者如果操作数大小是64位),在目标操作数(第一个操作数)中进行无符号的四字整数. 源操作数可以是XMM寄存器,也可以是内存位置寄存器. 目标操作数是一个通用寄存器. 当源操作数是一个XMM的寄存器时,单精度浮点值就包含在寄存器的低双字中.

当转换不准确时,返回一个切换值(圆向零)。

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFFFFH.

如果转换结果超过已签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFF FFFFFFH.

EVEX.W1版本:推广以64位模式生成64位数据的指示.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTTSS2USI (EVEX Encoded Version)
IF 64-bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_UInteger_Truncate(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_UInteger_Truncate(SRC[31:0]);
FI;
```

## Intel C/C++ 内在编译器

```c
VCVTTSS2USI unsigned int _mm_cvttss_u32( __m128 a);
VCVTTSS2USI unsigned int _mm_cvtt_roundss_u32( __m128 a, int sae);
VCVTTSS2USI unsigned __int64 _mm_cvttss_u64( __m128 a);
VCVTTSS2USI unsigned __int64 _mm_cvtt_roundss_u64( __m128 a, int sae);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
