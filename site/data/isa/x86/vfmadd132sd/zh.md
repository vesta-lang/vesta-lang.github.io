---
summary: 标量双倍倍增法
---

## 说明

在使用三个 源操作数 的 SIMD 值上执行 双精度浮点 乘积计算,并在 目标操作数 中写入乘积结果 。 目标操作数亦为第一源操作数. 第一个和第二个操作数是XMM登记册. 第三个源操作数可以是XMM寄存器或64位内存位置.

VFMADD132SD : (英语). 将第一源操作数的低双精度浮点值乘以第三源操作数的低双精度浮点值,在第二源操作数的低双精度浮点值中加入无限精密中间结果,进行四舍五入,并将由此产生的双精度浮点值存储到目标操作数(第一源操作数).

VFMADD213SD : (英语). 将第二源操作数的低双精度浮点值乘以第一源操作数的低双精度浮点值,将无限精度中间结果加到第三源操作数的低双精度浮点值,进行四舍五入,并将由此产生的双精度浮点值存储到目标操作数(第一源操作数).

VFMADD231SD : (英语). 将第二源的低双精度浮点值乘以第三源操作中的低双精度浮点值,将无限精度中间结果加入第一源操作中的低双精度浮点值,进行四舍五入,并将由此产生的双精度浮点值存储到目的地操作(第一源操作).

VEX.128和EVEX编码版本: 目标操作数(也是第一源操作数)在reg field中编码. 第二源操作数编码为VEX.vvvv/EVEX.vvvv. 第三个源操作数编码为rm field. 目的地的位数127:64不变. 目的地的Bits MAXVL-1:128注册被清零.

EVEX 编码版本 : 目的地的低四字元素根据写掩码更新.

## 行动

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMADD132SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(DEST[63:0]*SRC3[63:0] + SRC2[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMADD213SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*DEST[63:0] + SRC3[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0


VFMADD231SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*SRC3[63:0] + DEST[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMADD132SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := MAXVL-1:128RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0

VFMADD213SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0

VFMADD231SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VFMADDxxxSD __m128d _mm_fmadd_round_sd(__m128d a, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_mask_fmadd_sd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMADDxxxSD __m128d _mm_maskz_fmadd_sd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMADDxxxSD __m128d _mm_mask3_fmadd_sd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMADDxxxSD __m128d _mm_mask_fmadd_round_sd(__m128d a, __mmask8 k, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_maskz_fmadd_round_sd(__mmask8 k, __m128d a, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_mask3_fmadd_round_sd(__m128d a, __m128d b, __m128d c, __mmask8 k, int r);
VFMADDxxxSD __m128d _mm_fmadd_sd (__m128d a, __m128d b, __m128d c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
