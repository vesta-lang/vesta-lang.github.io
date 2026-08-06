---
summary: 移动高 打包单精度浮点值
---

## 说明

此指令不能用于寄存器注册或内存移动.

128位遗产 SSE 负载 :

将两个打包单精度浮点值从源代码64位内存操作数移动,并将其存储在目的地XMM登记册的高64位. XMM寄存器的下64位保存. 相应的目的地登记册中的位数(MAXVL-1:128)被保留.

VEX.128 & EVEX 编码载荷 :

从源头装入两个单精度浮点值的64位内存操作数(第三个操作数),并将其存储在目的地XMM登记册(第一个操作数)的上64位. 从第一源操作数(第二个操作数)的低64位被复制到目的地的下64位. 对应目的地的比特(MAXVL-1:128)注册被清零.

128-bit store:

存储两个打包单精度浮点值从XMM注册源的高64位(第二个操作数)到64位内存位置(第一个操作数).

说明: VMOVHPS(商店)(VEX.128.0F 17 /r)是合法的,与现有的0F 17商店有相同的行为. 对于VMOVHPS(商店),VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果VMOVHPS被用VEX.L或EVEX.L'L=1编码,试图执行用VEX.L或EVEX.L'L=1编码的指令,将会导致#UD例外.

## 行动

```text
MOVHPS (128-bit Legacy SSE Load)
DEST[63:0] (Unmodified)
DEST[127:64] := SRC[63:0]
DEST[MAXVL-1:128] (Unmodified)

VMOVHPS (VEX.128 and EVEX Encoded Load)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[MAXVL-1:128] := 0

VMOVHPS (Store)
DEST[63:0] := SRC[127:64]
```

## Intel C/C++ 内在编译器

```c
MOVHPS __m128 _mm_loadh_pi ( __m128 a, __m64 *p) MOVHPS void _mm_storeh_pi (__m64 *p, __m128 a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件",另外还有:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".
