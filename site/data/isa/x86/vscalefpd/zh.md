---
summary: 以浮点64值缩放的浮点64值
---

## 说明

在第一个源操作中,通过将双精度浮点值乘以2来达到第二个源操作中双精度浮点值的功率,来对组合的双精度浮点值进行浮点尺度.

此操作的方程式由:

```text
zmm1 := zmm2*2floor(zmm3).
```

地板(zmm3)是指最大整数值zmm3.

如果结果不能以双精度表示,则会发出适当的溢出响应(正缩放操作数),或适当的下流响应(负缩放操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR的其他设置(例外面具位,FTZ位),以及SAE位.

第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位的内存位置或512/256/128位的向量从64位的内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

表5-37和表5-38列出了特殊情况输入值的处理情况。

** VSCALEFPD/SD/PS/SS 特殊情况**

| Src1 | +/-QNAN 组合键 | QNaN( 曲线1) | +INF | +0 | QNaN( 曲线1) | 如果两个源是 SNAN |
| --- | --- | --- | --- | --- | --- | --- |
|  | +/- SNAN 组合键 | QNaN( 曲线1) | QNaN( 曲线1) | QNaN( 曲线1) | QNaN( 曲线1) | YES |
|  | +/-Inf 组合键 | QNaN( 曲线2) | Src1 | QNaN_Indefinite | Src1 | IF Src2 is SNAN or -INF |
|  | +/-0 | QNaN( 曲线2) | QNaN_Indefinite | Src1 | Src1 | IF Src2 is SNAN or +INF |

## 行动

```text
SCALE(SRC1, SRC2)

{

TMP_SRC2 := SRC2

TMP_SRC1 := SRC1

IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0

IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0

/* SRC2 is a 64 bits floating-point value */

DEST[63:0] := TMP_SRC1[63:0] * POW(2, Floor(TMP_SRC2[63:0]))

}

VSCALEFPD (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

           SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

           SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[i+63:i] := SCALE(SRC1[i+63:i], SRC2[63:0]);

                       ELSE DEST[i+63:i] := SCALE(SRC1[i+63:i], SRC2[i+63:i]);

                  FI;

           ELSE

                  IF *merging-masking*        ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                   ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VSCALEFPD __m512d _mm512_scalef_round_pd(__m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_mask_scalef_round_pd(__m512d s, __mmask8 k, __m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_maskz_scalef_round_pd(__mmask8 k, __m512d a, __m512d b, int rounding);
VSCALEFPD __m512d _mm512_scalef_pd(__m512d a, __m512d b);
VSCALEFPD __m512d _mm512_mask_scalef_pd(__m512d s, __mmask8 k, __m512d a, __m512d b);
VSCALEFPD __m512d _mm512_maskz_scalef_pd(__mmask8 k, __m512d a, __m512d b);
VSCALEFPD __m256d _mm256_scalef_pd(__m256d a, __m256d b);
VSCALEFPD __m256d _mm256_mask_scalef_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VSCALEFPD __m256d _mm256_maskz_scalef_pd(__mmask8 k, __m256d a, __m256d b);
VSCALEFPD __m128d _mm_scalef_pd(__m128d a, __m128d b);
VSCALEFPD __m128d _mm_mask_scalef_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VSCALEFPD __m128d _mm_maskz_scalef_pd(__mmask8 k, __m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal (for Src1).

Src2 没有报告异常情况。

## 其他例外

见表2-48"E2类例外条件"。
