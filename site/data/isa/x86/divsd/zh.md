---
summary: 除以 标量 双精度浮点 值
---

## 说明

将 第一源操作数 中的低双精度浮点 值除以 第二源操作数 中的低双精度浮点 值,并存储 双精度浮点 生成 目标操作数 值. 第二源操作数可以是XMM的寄存器,也可以是64位的内存位置. 第一个来源和目的地是XMM登记册。

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的ZMM目的地注册保持不变的位数(MAXVL-1:64).

VEX.128 编码版本 : 第一源操作数是由VEX.vvvv编码的xmm寄存器. 目标操作数的位数127:64的四字是从第一源操作数的相应四字复制而来. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX.128 编码版本 : 第一源操作数是由EVEX.vvvv编码的xmm寄存器. 目标操作数在位数127:64的四字元素从第一源操作数复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 版本 : 目的地的低四字元素根据写掩码更新.

软件应确保VDIVSD的编码与VEX.L=0. 用 VEX.L = 1 编码 VDIVSD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VDIVSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] / SRC2[63:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VDIVSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] / SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

DIVSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] / SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VDIVSD __m128d _mm_mask_div_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VDIVSD __m128d _mm_maskz_div_sd( __mmask8 k, __m128d a, __m128d b);
VDIVSD __m128d _mm_div_round_sd( __m128d a, __m128d b, int);
VDIVSD __m128d _mm_mask_div_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VDIVSD __m128d _mm_maskz_div_round_sd( __mmask8 k, __m128d a, __m128d b, int);
DIVSD __m128d _mm_div_sd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Divide-by-Zero, Precision, Denormal.

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
