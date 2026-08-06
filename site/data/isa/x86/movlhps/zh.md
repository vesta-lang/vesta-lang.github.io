---
summary: 将 打包单精度浮点值 低到高
---

## 说明

此指令不能用于内存注册移动 。

128位双参数形式:

将两个 打包单精度浮点值 从第二个 XMM 参数(第二个 操作数)的低四字移到第一个 XMM 记录器(第一个参数)的高四字. 目标操作数的低四字未变. 相应的目的地登记册中的位数(MAXVL-1:128)没有修改.

128位三参数形式:

将两个打包单精度浮点值从第三个XMM参数(第三个操作数)的低四字移到目的地的高四字(第一个操作数). 从第二个 XMM 参数(第二个 操作数)复制到目的地的低四字(第一个 操作数). 对应目的地的比特(MAXVL-1:128)注册被清零.

如果VMOVLHPS被用VEX.L或EVEX.L'L=1编码,试图执行用VEX.L或EVEX.L'L=1编码的指令,将会导致#UD例外.

## 行动

```text
MOVLHPS (128-bit Two-Argument Form)
DEST[63:0] (Unmodified)
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)

VMOVLHPS (128-bit Three-Argument Form - VEX & EVEX)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
MOVLHPS __m128 _mm_movelh_ps(__m128 a, __m128 b);
```

## SIMD 浮点 例外

None.

1. ModRM.MOD = 011B required

## 其他例外

Non-EVEX-encoded discription,参见表2-24,"第7类例外条件",另外:

```text
#UD               If VEX.L = 1.
```

EVEX-编码指令,参见表2-57中的例外类型E7NM.128,"Type E7NM类例外条件".
