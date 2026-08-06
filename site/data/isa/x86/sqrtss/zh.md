---
summary: 计算 标量 单精度值的平方根
---

## 说明

计算第二源操作数中低的单精度浮点值的方根,并存储单精度浮点结果为目标操作数. 第二源操作数可以是XMM寄存器,也可以是32位的内存位置. 第一个来源和目标操作数是一个XMM登记册.

128位遗产 SSE 版本 : 第一源操作数和目标操作数是相同的. 相应的YMM目的地注册保持不变的位数(MAXVL-1:32).

VEX.128和EVEX编码版本: 目标操作数的比特127:32从第一源操作数的相应比特复制. 目的地ZMM的位数(MAXVL-1:128)登记被清零.

EVEX 编码版本 : 目标操作数的低双字元素根据写掩码更新.

软件应确保VSQRTSS的编码与VEX.L=0. 用 VEX.L = 1 编码 VSQRTSS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
VSQRTSS (EVEX Encoded Version)

IF (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SQRT(SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VSQRTSS (VEX.128 Encoded Version)
DEST[31:0] := SQRT(SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

SQRTSS (128-bit Legacy SSE Version)
DEST[31:0] := SQRT(SRC2[31:0])
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSQRTSS __m128 _mm_sqrt_round_ss(__m128 a, __m128 b, int r);
VSQRTSS __m128 _mm_mask_sqrt_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int r);
VSQRTSS __m128 _mm_maskz_sqrt_round_ss( __mmask8 k, __m128 a, __m128 b, int r);
SQRTSS __m128 _mm_sqrt_ss(__m128 a);
```

## SIMD 浮点 例外

Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-20"Type 3类例外条件". EVEX-encoded discription,参见表2-49"Type E3类例外条件".
