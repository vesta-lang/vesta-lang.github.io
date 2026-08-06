---
summary: 双精度浮点 值的平方根
---

## 说明

执行 SIMD 计算两个的方根,在 源操作数(第二个 操作数)中四或八个 打包双精度浮点值 存储被包装的 双精度浮点 的结果在 目标操作数(第一个 操作数)中.

EVEX 编码版本 : 源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位的内存位置,或者从64位的内存位置广播的512/256/128位矢量. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128编码版本:源操作数 第二源操作数或128位内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VSQRTPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1) AND (SRC *is register*)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask* THEN

                  IF (EVEX.b = 1) AND (SRC *is memory*)

                       THEN DEST[i+63:i] := SQRT(SRC[63:0])

                       ELSE DEST[i+63:i] := SQRT(SRC[i+63:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSQRTPD (VEX.256 Encoded Version)
DEST[63:0] := SQRT(SRC[63:0])
DEST[127:64] := SQRT(SRC[127:64])
DEST[191:128] := SQRT(SRC[191:128])
DEST[255:192] := SQRT(SRC[255:192])
DEST[MAXVL-1:256] := 0
.
VSQRTPD (VEX.128 Encoded Version)
DEST[63:0] := SQRT(SRC[63:0])
DEST[127:64] := SQRT(SRC[127:64])
DEST[MAXVL-1:128] := 0

SQRTPD (128-bit Legacy SSE Version)
DEST[63:0] := SQRT(SRC[63:0])
DEST[127:64] := SQRT(SRC[127:64])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSQRTPD __m512d _mm512_sqrt_round_pd(__m512d a, int r);
VSQRTPD __m512d _mm512_mask_sqrt_round_pd(__m512d s, __mmask8 k, __m512d a, int r);
VSQRTPD __m512d _mm512_maskz_sqrt_round_pd( __mmask8 k, __m512d a, int r);
VSQRTPD __m256d _mm256_sqrt_pd (__m256d a);
VSQRTPD __m256d _mm256_mask_sqrt_pd(__m256d s, __mmask8 k, __m256d a, int r);
VSQRTPD __m256d _mm256_maskz_sqrt_pd( __mmask8 k, __m256d a, int r);
SQRTPD __m128d _mm_sqrt_pd (__m128d a);
VSQRTPD __m128d _mm_mask_sqrt_pd(__m128d s, __mmask8 k, __m128d a, int r);
VSQRTPD __m128d _mm_maskz_sqrt_pd( __mmask8 k, __m128d a, int r);
```

## SIMD 浮点 例外

Invalid, Precision, Denormal.

## 其他例外

Non-EVEX-encoded discription,参见表2-19,"第2类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded discription,参见表2-48,"Type E2类例外条件",另外还有:

```text
#UD               If EVEX.vvvv != 1111B.
```
