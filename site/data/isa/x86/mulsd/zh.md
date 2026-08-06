---
summary: 乘以 标量 双精度浮点 数值
---

## 说明

将第二源操作数中的低双精度浮点值乘以第一源操作数中的低双精度浮点值,存储双精度浮点结果为目标操作数. 第二源操作数可以是XMM的寄存器,也可以是64位的内存位置. 第一源操作数和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的目的地注册保持不变的位数(MAXVL-1:64).

VEX.128和EVEX编码版本: 目标操作数的位数127:64的四字从第一源操作数的相同位数复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低四字元素根据写掩码更新.

软件应确保VMULSD的编码与VEX.L=0. 用 VEX.L = 1 编码 VMULSD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VMULSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] * SRC2[63:0]

     ELSE

          IF *merging-masking*            ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

               THEN DEST[63:0] := 0

           FI

     FI;

ENDFOR

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VMULSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] * SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

MULSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] * SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMULSD __m128d _mm_mask_mul_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VMULSD __m128d _mm_maskz_mul_sd( __mmask8 k, __m128d a, __m128d b);
VMULSD __m128d _mm_mul_round_sd( __m128d a, __m128d b, int);
VMULSD __m128d _mm_mask_mul_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VMULSD __m128d _mm_maskz_mul_round_sd( __mmask8 k, __m128d a, __m128d b, int);
MULSD __m128d _mm_mul_sd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
