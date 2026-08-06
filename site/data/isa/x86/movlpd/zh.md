---
summary: 移动低包装的 双精度浮点 值
---

## 说明

此指令不能用于寄存器注册或内存移动.

128位遗产 SSE 负载 :

从源代码64位内存操作数移动一个双精度浮点值,并将其存储在目的地XMM登记册的低64位. XMM寄存器的上层64位保存. 相应的目的地登记册中的位数(MAXVL-1:128)被保留.

VEX.128 & EVEX 编码载荷 :

从源头装入双精度浮点值为64位的内存操作数(第三操作数),将其与第一源头XMM登记册(第二操作数)的上64位合并,并存储在目的地XMM登记册(第一操作数)的下128位. 对应目的地的比特(MAXVL-1:128)注册被清零.

128-bit store:

存储一个 双精度浮点 值,从 XMM 注册源的低64位(第二位 操作数)到64位 内存位置(第一位 操作数).

说明: VMOVLPD(商店)(VEX.128.66.0F 13 /r)是合法的,与现有的66 0F 13 商店有相同的行为. 对于VMOVLPD(商店),VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果VMOVLPD被用VEX.L或EVEX.L'L=1编码,试图执行用VEX.L或EVEX.L'L=1编码的指令,将会导致#UD例外.

## 行动

```text
MOVLPD (128-bit Legacy SSE Load)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)


VMOVLPD (VEX.128 & EVEX Encoded Load)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVLPD (Store)
DEST[63:0] := SRC[63:0]
```

## Intel C/C++ 内在编译器

```c
MOVLPD __m128d _mm_loadl_pd ( __m128d a, double *p) MOVLPD void _mm_storel_pd (double *p, __m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件",另外还有:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".
