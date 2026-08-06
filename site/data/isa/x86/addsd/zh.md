---
summary: 添加 标量 双精度浮点 值
---

## 说明

添加 第二源操作数 和 第一源操作数 的低 双精度浮点 值,并存储 双精度浮点 的结果为 目标操作数 。

第二源操作数可以是XMM的寄存器,也可以是64位的内存位置. 第一个来源和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 第一个来源和目标操作数是相同的. 相应的目的地注册保持不变的位数(MAXVL-1:64).

EVEX和VEX.128编码版本: 第一源操作数由EVEX.vvvv/VEX.vvvv编码. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 版本 : 目的地的低四字元素根据写掩码更新.

软件应确保VADDSD的编码与VEX.L=0. 用 VEX.L = 1 编码 VADDSD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VADDSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] + SRC2[63:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VADDSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] + SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

ADDSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] + SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VADDSD __m128d _mm_mask_add_sd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VADDSD __m128d _mm_maskz_add_sd (__mmask8 k, __m128d a, __m128d b);
VADDSD __m128d _mm_add_round_sd (__m128d a, __m128d b, int);
VADDSD __m128d _mm_mask_add_round_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VADDSD __m128d _mm_maskz_add_round_sd (__mmask8 k, __m128d a, __m128d b, int);
ADDSD __m128d _mm_add_sd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-编码指令,参见表2-20"Type 3类例外条件". EVEX-编码指令,参见表2-49"Type E3类例外条件".
