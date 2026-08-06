---
summary: 减去 标量 单精度浮点 数值
---

## 说明

从 第二源操作数 和 第一源操作数 中减去低的 单精度浮点 值,并存储 双精度浮点 导致 目标操作数 的低双词.

第二源操作数可以是XMM寄存器,也可以是32位的内存位置. 第一个来源和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 目的地和第一源操作数相同. 相应的目的地注册保持不变的位数(MAXVL-1:32).

VEX.128和EVEX编码版本: XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低双字元素根据写掩码更新.

软件应确保VSUBSS的编码与VEX.L=0. 用 VEX.L = 1 编码 VSUBSD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VSUBSS (EVEX Encoded Version)

IF (SRC2 *is register*) AND (EVEX.b = 1)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] - SRC2[31:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VSUBSS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

SUBSS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] - SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSUBSS __m128 _mm_mask_sub_ss (__m128 s, __mmask8 k, __m128 a, __m128 b);
VSUBSS __m128 _mm_maskz_sub_ss (__mmask8 k, __m128 a, __m128 b);
VSUBSS __m128 _mm_sub_round_ss (__m128 a, __m128 b, int);
VSUBSS __m128 _mm_mask_sub_round_ss (__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VSUBSS __m128 _mm_maskz_sub_round_ss (__mmask8 k, __m128 a, __m128 b, int);
SUBSS __m128 _mm_sub_ss (__m128 a, __m128 b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
