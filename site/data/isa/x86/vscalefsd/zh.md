---
summary: 标量 浮图64 数值
---

## 说明

在第一个源操作中,通过将双精度浮点值乘以2来达到第二个源操作中双精度浮点值的功率,实现一个浮点尺度.

此操作的方程式由:

```text
xmm1 := xmm2*2floor(xmm3).
```

地板(xmm3)是指最大整数值xmm3.

如果结果不能以双精度表示,则会发出适当的溢出响应(正缩放操作数),或适当的下流响应(负缩放操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR的其他设置(例外面具位,FTZ位),以及SAE位.

EVEX 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM登记册或内存位置. 目的地操作器是一个 XMM 的寄存器,有条件的更新有 writemask k1.

表5-37和表5-38列出了特殊情况输入值的处理情况。

## 行动

```text
SCALE(SRC1, SRC2)
{

    ; Check for denormal operands
TMP_SRC2 := SRC2
TMP_SRC1 := SRC1
IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0
IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0
/* SRC2 is a 64 bits floating-point value */
DEST[63:0] := TMP_SRC1[63:0] * POW(2, Floor(TMP_SRC2[63:0]))
}


VSCALEFSD (EVEX encoded version)

IF (EVEX.b= 1) and SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] OR *no writemask*

     THEN DEST[63:0] := SCALE(SRC1[63:0], SRC2[63:0])

     ELSE

     IF *merging-masking*                ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                          ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VSCALEFSD __m128d _mm_scalef_round_sd(__m128d a, __m128d b, int);
VSCALEFSD __m128d _mm_mask_scalef_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VSCALEFSD __m128d _mm_maskz_scalef_round_sd(__mmask8 k, __m128d a, __m128d b, int);
```

## SIMD 浮点 例外

过度流, 内流, 无效, 精度, 异常( 对于 Src1) 。 Src2 没有报告异常情况。

## 其他例外

见表2-49"E3类例外条件"。
