---
summary: 以 Truncation 标量 单精度浮点 转换为已签名值
---

## 说明

将源操作数(第二个操作数)中的单精度浮点值转换为目标操作数(第一个操作数)中的签名双字整数(或者如果操作数大小是64位). 源操作数可以是XMM寄存器,也可以是32位的内存位置. 目标操作数是一个通用注册. 当源操作数是一个XMM的寄存器时,单精度浮点值就包含在寄存器的低双字中.

当转换不准确时,将返回切换结果(圆向零)。

如果转换结果超过签名的双字整数(在非64位模式或64位模式中与REX.W/VEX.W/EVEX.W=0)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回无限期整数值80000000H.

如果转换结果超过签名的四字整数(在64位模式和REX.W/VEX.W/EVEX.W=1)的范围限制,则提高浮点无效例外,如果掩盖这一例外,则返回不定期整数值80000 00000H.

遗产 SSE 指令 : 在64位模式中,使用REX.W前缀将指令推广到64位操作. 参见本节开头的汇总图,用于编码数据和限制.

VEX.W1和EVEX.W1版本:推广以64位模式生成64位数据的指示.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

软件应确保VCVTTSS2SI的编码与VEX.L=0. 用 VEX.L = 1 编码 VCVTTSS2SI 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
(V)CVTTSS2SI (All Versions)
IF 64-Bit Mode and OperandSize = 64
THEN

    DEST[63:0] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[31:0]);
ELSE

    DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer_Truncate(SRC[31:0]);
FI;
```

## Intel C/C++ 内在编译器

```c
VCVTTSS2SI int _mm_cvttss_i32( __m128 a);
VCVTTSS2SI int _mm_cvtt_roundss_i32( __m128 a, int sae);
VCVTTSS2SI __int64 _mm_cvttss_i64( __m128 a);
VCVTTSS2SI __int64 _mm_cvtt_roundss_i64( __m128 a, int sae);
CVTTSS2SI int _mm_cvttss_si32( __m128 a);
CVTTSS2SI __int64 _mm_cvttss_si64( __m128 a);
```

## SIMD 浮点 例外

Invalid, Precision.

## 其他例外

见表2-20,"第3类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
