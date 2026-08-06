---
summary: 打包双精度浮点值 的点产品
---

## 说明

有条件地将目标操作数(第一操作数)中的打包双精度浮点值与源头中的打包双精度浮点值(第二操作数)相乘,这取决于从立即数操作数(第三操作数)的位点提取的面具[5:4]. 如果条件遮罩位值为0,则对应的乘法按照Intel(R)64和IA-32架构软件开发者手册第1卷第12.8.4节描述的方式被0.0的值所取代.

由此产生的两个双精度值被归纳为中间结果. 中间结果使用即时字节[1:0]位指定的广播口罩,有条件地向目的地广播.

如果广播口罩位是"1",中间结果会被复制到目标操作数中相应的qword元素. 如果广播口罩位是零,则目的地中相应的元素被设定为零.

DPPD遵循软件开发者手册第1卷表4.7中所述的NaN转发规则. 这些规则并不涵盖NaNs的横向优先级. NaNs向目的地的横向传播以及这些NaNs在目的地的定位取决于执行。 输入源上的NaN或计算产生的NaN将至少向目的地传播一个NaN.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

如果 VDPPD 以 VEX.L = 1 编码,则试图执行以 VEX.L = 1 编码的指令将会导致

```text
#UD exception.
```

## 行动

```text
DP_primitive (SRC1, SRC2)
IF (imm8[4] = 1)

    THEN Temp1[63:0] := DEST[63:0] * SRC[63:0]; // update SIMD exception flags
    ELSE Temp1[63:0] := +0.0; FI;
IF (imm8[5] = 1)
    THEN Temp1[127:64] := DEST[127:64] * SRC[127:64]; // update SIMD exception flags
    ELSE Temp1[127:64] := +0.0; FI;
/* if unmasked exception reported, execute exception handler*/

Temp2[63:0] := Temp1[63:0] + Temp1[127:64]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/

IF (imm8[0] = 1)
    THEN DEST[63:0] := Temp2[63:0];
    ELSE DEST[63:0] := +0.0; FI;

IF (imm8[1] = 1)
    THEN DEST[127:64] := Temp2[63:0];
    ELSE DEST[127:64] := +0.0; FI;

DPPD (128-bit Legacy SSE Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] (Unmodified)

VDPPD (VEX.128 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
DPPD __m128d _mm_dp_pd ( __m128d a, __m128d b, const int mask);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

每项加法和乘法的例外分别确定。 不加掩饰的例外将使目的地不受影响。

## 其他例外

见表2-19,"第2类例外条件",另外:

```text
#UD               If VEX.L= 1.
```
