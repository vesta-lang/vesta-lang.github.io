---
summary: 返回最大 标量 双精度浮点 值
---

## 说明

比较 第一源操作数 和 第二源操作数 中低的 双精度浮点 值,并将最大值返回 目标操作数 的低四字. 第二源操作数可以是XMM的寄存器,也可以是64位的内存位置. 第一个来源和目标操作数是XMM登记册. 当第二源操作数是一个内存操作数时,只访问64位.

如果所比较的值都是0.0s(其中任何一个符号),则返回第二源操作数中的值。 如果 第二源操作数 中的一个值是 SNaN,那么 SNaN 返回目的地不变(即不返回 SNaN 的 QNaN 版本).

如果这个指令只有一个值是NaN(SNAN或QNaN),则将第二源操作数,即NaN或有效的浮点值写入结果. 如果不采取这种行为,则需要返回源操作数的NaN,MAXSD的动作可以使用一个指令序列来模拟,例如AND,ANDN,和OR的比较.

128位遗产 SSE 版本 : 目的地和第一源操作数相同. 相应的目的地注册保持不变的位数(MAXVL-1:64).

VEX.128和EVEX编码版本: XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低四字元素根据写掩码更新.

软件应确保VMAXSD的编码与VEX.L=0. 用 VEX.L = 1 编码 VMAXSD 可能会在不同处理器代代遇到不可预测的行为.

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

VMAXSD (EVEX Encoded Version)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := MAX(SRC1[63:0], SRC2[63:0])

     ELSE

     IF *merging-masking*                  ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                            ; zeroing-masking

           DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VMAXSD (VEX.128 Encoded Version)
DEST[63:0] := MAX(SRC1[63:0], SRC2[63:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

MAXSD (128-bit Legacy SSE Version)
DEST[63:0] := MAX(DEST[63:0], SRC[63:0])
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMAXSD __m128d _mm_max_round_sd( __m128d a, __m128d b, int);
VMAXSD __m128d _mm_mask_max_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VMAXSD __m128d _mm_maskz_max_round_sd( __mmask8 k, __m128d a, __m128d b, int);
MAXSD __m128d _mm_max_sd(__m128d a, __m128d b);
```

## SIMD 浮点 例外

无效( 包含 QNaN 源操作数), 异常 。

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
