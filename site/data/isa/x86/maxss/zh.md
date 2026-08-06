---
summary: 返回最大 标量 单精度浮点 值
---

## 说明

比较第一源操作数和第二源操作数中的低值单精度浮点,并将最大值返回到目标操作数的低双词.

如果所比较的值都是0.0s(其中任何一个符号),则返回第二源操作数中的值。 如果 第二源操作数 中的一个值是 SNaN,那么 SNaN 返回目的地不变(即不返回 SNaN 的 QNaN 版本).

如果这个指令只有一个值是NaN(SNAN或QNaN),则将第二源操作数,即NaN或有效的浮点值写入结果. 如果不采取这种行为,则需要返回源操作数中的NaN,那么MAXSS的动作可以使用指令的序列来模拟,例如AND,ANDN,和OR的比较.

第二源操作数可以是XMM寄存器,也可以是32位的内存位置. 第一个来源和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 目的地和第一源操作数相同. 相应的目的地注册保持不变的位数(MAXVL:32).

VEX.128和EVEX编码版本: 第一源操作数是由VEX.vvvv编码的xmm寄存器. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的比特(MAXVL:128)注册被清零.

EVEX 编码版本 : 目标操作数的低双字元素根据写掩码更新.

软件应确保VMAXSS的编码与VEX.L=0. 用 VEX.L = 1 编码 VMAXSS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
MAX(SRC1, SRC2)
{

    IF ((SRC1 = 0.0) and (SRC2 = 0.0)) THEN DEST := SRC2;
          ELSE IF (SRC1 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC2 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC1 > SRC2) THEN DEST := SRC1;
          ELSE DEST := SRC2;

    FI;
}

VMAXSS (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := MAX(SRC1[31:0], SRC2[31:0])

     ELSE

     IF *merging-masking*                  ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                            ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VMAXSS (VEX.128 Encoded Version)
DEST[31:0] := MAX(SRC1[31:0], SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

MAXSS (128-bit Legacy SSE Version)
DEST[31:0] := MAX(DEST[31:0], SRC[31:0])
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMAXSS __m128 _mm_max_round_ss( __m128 a, __m128 b, int);
VMAXSS __m128 _mm_mask_max_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VMAXSS __m128 _mm_maskz_max_round_ss( __mmask8 k, __m128 a, __m128 b, int);
MAXSS __m128 _mm_max_ss(__m128 a, __m128 b);
```

## SIMD 浮点 例外

无效( 包含 QNaN 源操作数), 异常 。

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
