---
summary: 将 标量 单精度浮点 值转换为无符号双字
---

## 说明

将源操作(第二个操作)中的单个精度浮点值转换为目的地操作(第一个操作)中的无符号双字整数(或者如果操作大小为64位). 源操作数可以是XMM寄存器,也可以是内存位置寄存器. 目标操作数是一个通用注册. 当源操作数是一个XMM的寄存器时,单精度浮点值就包含在寄存器的低双字中.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入.

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFFFFH.

如果转换结果超过已签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFF FFFFFFH.

VEX.W1和EVEX.W1版本:推广以64位模式生成64位数据的指示.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VCVTSS2USI (EVEX Encoded Version)
IF (SRC *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0]);
FI;
```

## Intel C/C++ 内在编译器

```c
VCVTSS2USI unsigned _mm_cvtss_u32( __m128 a);
VCVTSS2USI unsigned _mm_cvt_roundss_u32( __m128 a, int r);
VCVTSS2USI unsigned __int64 _mm_cvtss_u64( __m128 a);
VCVTSS2USI unsigned __int64 _mm_cvt_roundss_u64( __m128 a, int r);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
