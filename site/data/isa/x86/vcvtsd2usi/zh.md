---
summary: 将 标量 双精度浮点 值转换为无符号整数
---

## 说明

将源操作数(第二个操作数)中的双精度浮点值转换为目标操作数(第一个操作数)中的无符号双字整数. 源操作数可以是XMM的寄存器,也可以是64位的内存位置. 目标操作数是一个通用寄存器. 当源操作数是一个XMM的寄存器时,双精度浮点的值就包含在寄存器的低四字中.

当转换不准确时,返回的值按照MXCSR寄存器或嵌入式圆形控制位的圆形控制位进行四舍五入.

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFFFFH.

如果转换结果超过已签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFF FFFFFFH.

## 行动

```text
VCVTSD2USI (EVEX Encoded Version)
IF (SRC *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode and OperandSize = 64

    THEN DEST[63:0] := Convert_Double_Precision_Floating_Point_To_UInteger(SRC[63:0]);
    ELSE DEST[31:0] := Convert_Double_Precision_Floating_Point_To_UInteger(SRC[63:0]);
FI
```

## Intel C/C++ 内在编译器

```c
VCVTSD2USI unsigned int _mm_cvtsd_u32(__m128d);
VCVTSD2USI unsigned int _mm_cvt_roundsd_u32(__m128d, int r);
VCVTSD2USI unsigned __int64 _mm_cvtsd_u64(__m128d);
VCVTSD2USI unsigned __int64 _mm_cvt_roundsd_u64(__m128d, int r);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
