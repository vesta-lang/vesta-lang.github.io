---
summary: 乘以 标量 单精度浮点 值
---

## 说明

将第二源操作数的低单精度浮点值乘以第一源操作数的低单精度浮点值,存储单精度浮点结果为目标操作数. 第二源操作数可以是XMM寄存器,也可以是32位的内存位置. 第一源操作数和目标操作数是XMM登记册.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:32).

VEX.128和EVEX编码版本: 第一源操作数是由VEX.vvvv编码的xmm寄存器. 目标操作数的三个高序双字从第一源操作数复制. 目的地的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低双字元素根据写掩码更新.

软件应确保VMULSS的编码与VEX.L=0. 用 VEX.L = 1 编码 VMULSS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VMULSS (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] * SRC2[31:0]

     ELSE

          IF *merging-masking*            ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

               THEN DEST[31:0] := 0

           FI

     FI;

ENDFOR

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VMULSS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

MULSS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] * SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VMULSS __m128 _mm_mask_mul_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VMULSS __m128 _mm_maskz_mul_ss( __mmask8 k, __m128 a, __m128 b);
VMULSS __m128 _mm_mul_round_ss( __m128 a, __m128 b, int);
VMULSS __m128 _mm_mask_mul_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VMULSS __m128 _mm_maskz_mul_round_ss( __mmask8 k, __m128 a, __m128 b, int);
MULSS __m128 _mm_mul_ss(__m128 a, __m128 b);
```

## SIMD 浮点 例外

Underflow, Overflow, Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
