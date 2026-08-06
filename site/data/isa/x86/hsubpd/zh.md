---
summary: 包装的 双精度浮点 水平减法
---

## 说明

HSUBPD指令横向减去两个操作数的包装双精度浮点数字.

将目标操作数的高四字中的双精度浮点值从目标操作数的低四字中减去,并存储结果为目标操作数的低四字.

将源操作数的高四字中的双精度浮点值从源操作数的低四字中减去,并将结果存储为目标操作数的高四字.

在64位模式中,使用REX.R前缀允许此指令访问额外的注册(XMM8-XMM15).

See Figure 3-16 for HSUBPD; see Figure 3-17 for VHSUBPD.

HSUBPD xmm1, xmm2/m128

```text
                               [127:64]                             [63:0]                     xmm2
```

/m128

```text
                               [127:64]                             [63:0]                     xmm1
```

```text
                               xmm2/m128[63:0] -                    xmm1[63:0] - xmm1[127:64]  Result:
                               xmm2/m128[127:64]                                    [63:0]     xmm1
```

[127:64]

OM15995

图3-16. HSUBPD - 装入的 双精度浮点 水平减法

SRC1  X3           X2                                                   X1       X0

```text
                   Y2                                                   Y1       Y0
```

SRC2  Y3       X2 - X3                                              Y0 - Y1  X0 - X1

DEST  Y2 - Y3

图3-17. VHSUBPD 操作

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改.

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

## 行动

```text
HSUBPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] (Unmodified)

VHSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[MAXVL-1:128] := 0

VHSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC1[127:64]
DEST[127:64] := SRC2[63:0] - SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC1[255:192]
DEST[255:192] := SRC2[191:128] - SRC2[255:192]
```

## Intel C/C++ 内在编译器

```c
HSUBPD __m128d _mm_hsub_pd(__m128d a, __m128d b) VHSUBPD __m256d _mm256_hsub_pd (__m256d a, __m256d b);
Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## 数字例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

参见表2-19"第2类例外条件".
