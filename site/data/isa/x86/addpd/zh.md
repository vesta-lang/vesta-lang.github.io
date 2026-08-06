---
summary: 添加 打包双精度浮点值 时
---

## 说明

将第一源操作数的2,4或8个打包双精度浮点值添加到第二源操作数,并存储已包装的双精度浮点结果目标操作数.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从64位内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128编码版本:第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改.

## 行动

```text
VADDPD (EVEX Encoded Versions) When SRC2 Operand is a Vector Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := SRC1[i+63:i] + SRC2[i+63:i]

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VADDPD (EVEX Encoded Versions) When SRC2 Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+63:i] := SRC1[i+63:i] + SRC2[63:0]

                       ELSE

                       DEST[i+63:i] := SRC1[i+63:i] + SRC2[i+63:i]

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

VADDPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] + SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[191:128] := SRC1[191:128] + SRC2[191:128]
DEST[255:192] := SRC1[255:192] + SRC2[255:192]
DEST[MAXVL-1:256] := 0
.


VADDPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] + SRC2[63:0]
DEST[127:64] := SRC1[127:64] + SRC2[127:64]
DEST[MAXVL-1:128] := 0

ADDPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] + SRC[63:0]
DEST[127:64] := DEST[127:64] + SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VADDPD __m512d _mm512_add_pd (__m512d a, __m512d b);
VADDPD __m512d _mm512_mask_add_pd (__m512d s, __mmask8 k, __m512d a, __m512d b);
VADDPD __m512d _mm512_maskz_add_pd (__mmask8 k, __m512d a, __m512d b);
VADDPD __m256d _mm256_mask_add_pd (__m256d s, __mmask8 k, __m256d a, __m256d b);
VADDPD __m256d _mm256_maskz_add_pd (__mmask8 k, __m256d a, __m256d b);
VADDPD __m128d _mm_mask_add_pd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VADDPD __m128d _mm_maskz_add_pd (__mmask8 k, __m128d a, __m128d b);
VADDPD __m512d _mm512_add_round_pd (__m512d a, __m512d b, int);
VADDPD __m512d _mm512_mask_add_round_pd (__m512d s, __mmask8 k, __m512d a, __m512d b, int);
VADDPD __m512d _mm512_maskz_add_round_pd (__mmask8 k, __m512d a, __m512d b, int);
ADDPD __m256d _mm256_add_pd (__m256d a, __m256d b);
ADDPD __m128d _mm_add_pd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded 指令,参见表2-19,"第2类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2类例外条件".
