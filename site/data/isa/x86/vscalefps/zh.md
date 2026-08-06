---
summary: 以浮点32值缩放的浮点32值
---

## 说明

执行 打包单精度浮点值 在 第一源操作数 中的 浮点 比例尺,将其乘以 2 到 第二源操作数 中的浮点32 值的功率.

此操作的方程式由:

```text
zmm1 := zmm2*2floor(zmm3).
```

地板(zmm3)是指最大整数值zmm3.

如果结果不能以单一精度表示,则会发出适当的溢出响应(正缩放操作数),或适当的下流响应(负缩放操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR的其他设置(例外面具位,FTZ位),以及SAE位.

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM寄存器,512位内存位置或512位矢量从32位内存位置广播. 目标操作数是一个ZMM的寄存器,有条件更新为写掩码 k1.

EVEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM寄存器,一个256位的内存位置,或者从32位的内存位置广播的256位矢量. 目标操作数是一个YMM的寄存器,有条件的更新使用写掩码 k1.

EVEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM寄存器,一个128位的内存位置,或者从32位的内存位置广播128位的矢量. 目标操作数是一个XMM的寄存器,有条件的更新使用写掩码 k1.

特殊情况输入值的处理情况见表5-37和表5-41。

特殊情况表5-41. 附加的 VSCALEFPS/SS 特殊案例错误 QQ结果 < 2-149 返回值 QQ结果 2128 +/-0 或 +/- Min-Dirmal (Src1 标志) 过度流量 +/-INF (Src1 标志) 或 +/-Max- 正常 (Src1 标志)

## 行动

```text
SCALE(SRC1, SRC2)

{                 ; Check for denormal operands

TMP_SRC2 := SRC2

TMP_SRC1 := SRC1

IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0

IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0

/* SRC2 is a 32 bits floating-point value */

DEST[31:0] := TMP_SRC1[31:0] * POW(2, Floor(TMP_SRC2[31:0]))

}

VSCALEFPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[i+31:i] := SCALE(SRC1[i+31:i], SRC2[31:0]);

                       ELSE DEST[i+31:i] := SCALE(SRC1[i+31:i], SRC2[i+31:i]);

                  FI;

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE                      ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR
DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VSCALEFPS __m512 _mm512_scalef_round_ps(__m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_mask_scalef_round_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_maskz_scalef_round_ps(__mmask16 k, __m512 a, __m512 b, int rounding);
VSCALEFPS __m512 _mm512_scalef_ps(__m512 a, __m512 b);
VSCALEFPS __m512 _mm512_mask_scalef_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VSCALEFPS __m512 _mm512_maskz_scalef_ps(__mmask16 k, __m512 a, __m512 b);
VSCALEFPS __m256 _mm256_scalef_ps(__m256 a, __m256 b);
VSCALEFPS __m256 _mm256_mask_scalef_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VSCALEFPS __m256 _mm256_maskz_scalef_ps(__mmask8 k, __m256 a, __m256 b);
VSCALEFPS __m128 _mm_scalef_ps(__m128 a, __m128 b);
VSCALEFPS __m128 _mm_mask_scalef_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VSCALEFPS __m128 _mm_maskz_scalef_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD 浮点 例外

过度流, 内流, 无效, 精度, 异常( 对于 Src1) 。 Src2 没有报告异常情况。

## 其他例外

见表2-48"E2类例外条件"。
