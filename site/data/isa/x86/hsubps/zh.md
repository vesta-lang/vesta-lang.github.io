---
summary: 包装的 单精度浮点 水平减法
---

## 说明

从 目标操作数 的第一个 dword 中减去 单精度浮点 中 目标操作数 的第二个 dword 值,并将结果存储在 目标操作数 的第一个 dword 中.

从 目标操作数 的第三个 dword 中减去 单精度浮点 的第四个 dword 中 目标操作数 的值,并将结果存储为 目标操作数 的第二个 dword 。

将 源操作数 的第二个 dword 中的 单精度浮点 值从 源操作数 的第一个 dword 中减去,并将结果存储为 目标操作数 的第三个 dword 。

从 源操作数 的第三个 dword 中减去 单精度浮点 的第四个 dword 中 源操作数 的值,并将结果存储为 目标操作数 的第四个 dword 。

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

See Figure 3-18 for HSUBPS; see Figure 3-19 for VHSUBPS.

HSUBPS xmm1, xmm2/m128

[127:96]             [95:64]                                            [63:32]        [31:0]      xmm2/ m128

[127:96]             [95:64]                                            [63:32]        [31:0]      xmm1

xmm2/m128            xmm2/m128                                     xmm1[95:64] -  xmm1[31:0] -    RESULT: [95:64] - xmm2/      [31:0] - xmm2/                                 xmm1[127:96]   xmm1[63:32]     xmm1 m128[127:96]         m128[63:32]

```text
                                                                      [63:32]          [31:0]
    [127:96]            [95:64]
```

OM15996

图3-18. HSUBPS - 装入的 单精度浮点 水平减法

SRC1 X7          X6  X5                                             X4  X3         X2          X1  X0

SRC2 Y7          Y6  Y5                                             Y4  Y3         Y2          Y1  Y0

DEST Y6-Y7 Y4-Y5     X6-X7 X4-X5 Y2-Y3 Y0-Y1 X2-X3 X0-X1

图3-19. VHSUBPS 操作

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改. VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128). VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
HSUBPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)

VHSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[MAXVL-1:128] := 0

VHSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC1[63:32]
DEST[63:32] := SRC1[95:64] - SRC1[127:96]
DEST[95:64] := SRC2[31:0] - SRC2[63:32]
DEST[127:96] := SRC2[95:64] - SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC1[191:160]
DEST[191:160] := SRC1[223:192] - SRC1[255:224]
DEST[223:192] := SRC2[159:128] - SRC2[191:160]
DEST[255:224] := SRC2[223:192] - SRC2[255:224]
```

## Intel C/C++ 内在编译器

```c
HSUBPS __m128 _mm_hsub_ps(__m128 a, __m128 b);
VHSUBPS __m256 _mm256_hsub_ps (__m256 a, __m256 b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## 数字例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

参见表2-19"第2类例外条件".
