---
summary: 标量 双倍倍式
---

## 说明

使用三个 源操作数 在低的 打包双精度浮点值 上执行 SIMD 乘积-减数计算,并写入乘积-减数结果为 目标操作数 。 目标操作数亦为第一源操作数. 第二个操作数必须是XMM的登记册. 第三个源操作数可以是XMM寄存器或64位内存位置.

VFMSUB132SD : (英语). 将第一源操作数的低包装双精度浮点值乘以第三源操作数的低包装双精度浮点值. 从无限精度中间结果中,减去第二源操作数中低的打包双精度浮点值,进行四舍五入,并将由此产生的包装的双精度浮点值存储到目标操作数(第一源操作数).

VFMSUB213SD : (英语). 将第二源操作数的低包装双精度浮点值乘以第一源操作数的低包装双精度浮点值. 从无限精度中间结果中,在第三个 源操作数 中减去低包装的 双精度浮点 值,进行四舍五入,并将由此产生的包装的 双精度浮点 值存储到 目标操作数 (第一源操作数).

VFMSUB231SD : (英语). 将第二源的低包装双精度浮点值乘以第三源操作中的低包装双精度浮点值. 从无限精度中间结果中减去双精度浮点在第一源操作数中的低包装值,进行四舍五入,并将由此产生的包装双精度浮点值存储到目标操作数(第一源操作数).

VEX.128和EVEX编码版本: 目标操作数(也是第一源操作数)在reg field中编码. 第二源操作数编码为VEX.vvvv/EVEX.vvvv. 第三个源操作数编码为rm field. 目的地的位数127:64不变. 目的地的Bits MAXVL-1:128注册被清零.

EVEX 编码版本 : 目的地的低四字元素根据写掩码更新.

编译工具可以可选择支持汇总表操作码/指令栏列出的每个指令元的互补元音. 在涉及NANs的情况中,互补的mnemonic的行为受操作码/指令列中定义的指令mnemonic的定义制约.

## 行动

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).

VFMSUB132SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(DEST[63:0]*SRC3[63:0] - SRC2[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMSUB213SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*DEST[63:0] - SRC3[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0


VFMSUB231SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*SRC3[63:0] - DEST[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMSUB132SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] - SRC2[63:0])
DEST[127:64] := DEST[127:64]
DEST[MAXVL-1:128] := 0

VFMSUB213SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] - SRC3[63:0])
DEST[127:64] := DEST[127:64]
DEST[MAXVL-1:128] := 0

VFMSUB231SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] - DEST[63:0])
DEST[127:64] := DEST[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VFMSUBxxxSD __m128d _mm_fmsub_round_sd(__m128d a, __m128d b, __m128d c, int r);
VFMSUBxxxSD __m128d _mm_mask_fmsub_sd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMSUBxxxSD __m128d _mm_maskz_fmsub_sd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMSUBxxxSD __m128d _mm_mask3_fmsub_sd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMSUBxxxSD __m128d _mm_mask_fmsub_round_sd(__m128d a, __mmask8 k, __m128d b, __m128d c, int r);
VFMSUBxxxSD __m128d _mm_maskz_fmsub_round_sd(__mmask8 k, __m128d a, __m128d b, __m128d c, int r);
VFMSUBxxxSD __m128d _mm_mask3_fmsub_round_sd(__m128d a, __m128d b, __m128d c, __mmask8 k, int r);
VFMSUBxxxSD __m128d _mm_fmsub_sd (__m128d a, __m128d b, __m128d c);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal

## 其他例外

VEX-encoded 指令,参见表2-20,"Type 3 Class Exception条件". EVEX-encoded 指令,参见表2-49,"Type E3 Class Exceptity条件".
