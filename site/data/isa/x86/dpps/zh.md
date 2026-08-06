---
summary: 打包单精度浮点值 的点产品
---

## 说明

有条件地将目标操作数(第一操作数)中的打包单精度浮点值乘以源头的包装单精度浮点(第二操作数),取决于从直接字节(第三操作数)的高4位拔出的口罩. 如果imm8[7:4]中的条件掩码位为零,则对应的乘法按照Intel(R)64和IA-32架构软件开发者手册第1卷第12.8.4节描述的方式被0.0的值所取代.

四个产生的单精度值被归纳为中间结果. 中间结果使用直接字节的位[3:0]指定的广播口罩,有条件地向目的地广播.

如果广播口罩位是"1",中间结果会被复制到目标操作数中相应的dword元素. 如果广播口罩位是零,则目的地中相应的元素被设定为零.

DPPS遵循软件开发者手册第1卷表4.7中所述的NaN转发规则. 这些规则并不涵盖NaNs的横向优先级. NaNs向目的地的横向传播以及这些NaNs在目的地的定位取决于执行。 输入源上的NaN或计算产生的NaN将至少向目的地传播一个NaN.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
DP_primitive (SRC1, SRC2)
IF (imm8[4] = 1)

    THEN Temp1[31:0] := DEST[31:0] * SRC[31:0]; // update SIMD exception flags
    ELSE Temp1[31:0] := +0.0; FI;
IF (imm8[5] = 1)
    THEN Temp1[63:32] := DEST[63:32] * SRC[63:32]; // update SIMD exception flags
    ELSE Temp1[63:32] := +0.0; FI;
IF (imm8[6] = 1)
    THEN Temp1[95:64] := DEST[95:64] * SRC[95:64]; // update SIMD exception flags
    ELSE Temp1[95:64] := +0.0; FI;
IF (imm8[7] = 1)
    THEN Temp1[127:96] := DEST[127:96] * SRC[127:96]; // update SIMD exception flags
    ELSE Temp1[127:96] := +0.0; FI;

Temp2[31:0] := Temp1[31:0] + Temp1[63:32]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/
Temp3[31:0] := Temp1[95:64] + Temp1[127:96]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/
Temp4[31:0] := Temp2[31:0] + Temp3[31:0]; // update SIMD exception flags
/* if unmasked exception reported, execute exception handler*/

IF (imm8[0] = 1)
    THEN DEST[31:0] := Temp4[31:0];
    ELSE DEST[31:0] := +0.0; FI;

IF (imm8[1] = 1)
    THEN DEST[63:32] := Temp4[31:0];
    ELSE DEST[63:32] := +0.0; FI;

IF (imm8[2] = 1)
    THEN DEST[95:64] := Temp4[31:0];
    ELSE DEST[95:64] := +0.0; FI;

IF (imm8[3] = 1)
    THEN DEST[127:96] := Temp4[31:0];
    ELSE DEST[127:96] := +0.0; FI;

DPPS (128-bit Legacy SSE Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] (Unmodified)

VDPPS (VEX.128 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[MAXVL-1:128] := 0

VDPPS (VEX.256 Encoded Version)
DEST[127:0] := DP_Primitive(SRC1[127:0], SRC2[127:0]);
DEST[255:128] := DP_Primitive(SRC1[255:128], SRC2[255:128]);
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
(V)DPPS __m128 _mm_dp_ps ( __m128 a, __m128 b, const int mask);
VDPPS __m256 _mm256_dp_ps ( __m256 a, __m256 b, const int mask);
```

## SIMD 浮点 例外

过度流 内流 无效 精度 异常 每项加法和乘法的例外按执行顺序分别确定。 无假冒的例外会让 目标操作数 不变.

## 其他例外

参见表2-19"第2类例外条件".
