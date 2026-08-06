---
summary: 计算 标量 双精度浮点 值的平方根
---

## 说明

计算第二源操作数中低的双精度浮点值的方根,并存储双精度浮点结果为目标操作数. 第二源操作数可以是XMM的寄存器,也可以是64位的内存位置. 第一个来源和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 目标操作数的位数127:64的四字不变. 相应的目的地注册保持不变的位数(MAXVL-1:64).

VEX.128和EVEX编码版本: 目标操作数的比特127:64从第一源操作数的相应比特复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低四字元素根据写掩码更新.

软件应确保VSQRTSD的编码与VEX.L=0. 用 VEX.L = 1 编码 VSQRTSD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VSQRTSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SQRT(SRC2[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VSQRTSD (VEX.128 Encoded Version)
DEST[63:0] := SQRT(SRC2[63:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

SQRTSD (128-bit Legacy SSE Version)
DEST[63:0] := SQRT(SRC[63:0])
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSQRTSD __m128d _mm_sqrt_round_sd(__m128d a, __m128d b, int r);
VSQRTSD __m128d _mm_mask_sqrt_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int r);
VSQRTSD __m128d _mm_maskz_sqrt_round_sd(__mmask8 k, __m128d a, __m128d b, int r);
SQRTSD __m128d _mm_sqrt_sd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
