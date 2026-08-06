---
summary: 以 Truncation 标量 双精度浮点 值转换为
---

## 说明

将源操作数(第二个操作数)中的双精度浮点值通过折射转换成无符号的双字整数(或者如果操作数大小是64位),在目标操作数(第一个操作数)中进行无符号的四字整数. 源操作数可以是XMM的寄存器,也可以是64位的内存位置. 目标操作数是一个通用寄存器. 当源操作数是一个XMM寄存器时,双精度浮点值包含在寄存器的低四字中.

当转换不准确时,返回一个切换值(圆向零)。

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFFFFH.

如果转换结果超过已签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回整数值FFFFFF FFFFFFH.

EVEX.W1版本:推广以64位模式生成64位数据的指示.

## 行动

```text
VCVTTSD2USI (EVEX Encoded Version)
IF 64-Bit Mode and OperandSize = 64

    THEN DEST[63:0] := Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[63:0]);
    ELSE DEST[31:0] := Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[63:0]);
FI
```

## Intel C/C++ 内在编译器

```c
VCVTTSD2USI unsigned int _mm_cvttsd_u32(__m128d);
VCVTTSD2USI unsigned int _mm_cvtt_roundsd_u32(__m128d, int sae);
VCVTTSD2USI unsigned __int64 _mm_cvttsd_u64(__m128d);
VCVTTSD2USI unsigned __int64 _mm_cvtt_roundsd_u64(__m128d, int sae);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
