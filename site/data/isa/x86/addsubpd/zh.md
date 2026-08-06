---
summary: 包装的 双精度浮点 添加/减法
---

## 说明

添加 第一源操作数(第二操作数)的奇数双精度浮点值,加上第二源操作数(第三操作数)的相应双精度浮点值;存储结果为目标操作数(第一操作数)的奇数值. 将 第二源操作数 的偶数双精度浮点 值从 第一源操作数 中相应的双精度浮值中减去;将结果存储到 目标操作数 的偶数值中.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改. 见图3-3。

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

ADDSUBPD xmm1, xmm2/m128

[127:64]                                                       [63:0]                        xmm2/m128

xmm1[127:64] + xmm2/m128[127:64]                               xmm1[63:0] - xmm2/m128[63:0]  RESULT:

```text
                   [127:64]                                                     [63:0]       xmm1
```

图3-3。 ADDSUBPD - 装入的 双精度浮点 添加/分录

## 行动

```text
ADDSUBPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] - SRC[63:0]
DEST[127:64] := DEST[127:64] + SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)

VADDSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[MAXVL-1:128] := 0

VADDSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC2[191:128]
DEST[255:192] := SRC1[255:192] + SRC2[255:192]
```

## Intel C/C++ 内在编译器

```c
ADDSUBPD __m128d _mm_addsub_pd(__m128d a, __m128d b) VADDSUBPD __m256d _mm256_addsub_pd (__m256d a, __m256d b) Exceptions When the source operand is a memory operand, it must be aligned on a 16-byte boundary or a general-protection exception (#GP) will be generated.;
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

参见表2-19"第2类例外条件".
