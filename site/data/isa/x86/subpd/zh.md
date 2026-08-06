---
summary: 减法 打包双精度浮点值
---

## 说明

执行SIMD从第一源操作数中减去两个,四个或八个打包双精度浮点值的第二源操作数,并将包装好的双精度浮点结果存储在目标操作数中.

VEX.128和EVEX.128编码版本: 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256和EVEX.256编码版本: 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX.512 编码版本 : 第二源操作数是一个ZMM寄存器,512位内存位置或512位矢量从64位内存位置广播. 第一源操作数和目标操作数是ZMM登记册. 目标操作数根据写掩码有条件更新.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册没有区别,对应注册目的地的上位位(MAXVL-1:128)没有修改.

## 行动

```text
VSUBPD (EVEX Encoded Versions When SRC2 Operand is a Vector Register)
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

     THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i]

ELSE

     IF *merging-masking*          ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                  ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSUBPD (EVEX Encoded Versions When SRC2 Operand is a Memory Source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1)

                  THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[63:0];

                  ELSE EST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i];

             FI;

ELSE

     IF *merging-masking*          ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                  ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] - SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC2[191:128]
DEST[255:192] := SRC1[255:192] - SRC2[255:192]
DEST[MAXVL-1:256] := 0


VSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] - SRC2[127:64]
DEST[MAXVL-1:128] := 0

SUBPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] - SRC[63:0]
DEST[127:64] := DEST[127:64] - SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSUBPD __m512d _mm512_sub_pd (__m512d a, __m512d b);
VSUBPD __m512d _mm512_mask_sub_pd (__m512d s, __mmask8 k, __m512d a, __m512d b);
VSUBPD __m512d _mm512_maskz_sub_pd (__mmask8 k, __m512d a, __m512d b);
VSUBPD __m512d _mm512_sub_round_pd (__m512d a, __m512d b, int);
VSUBPD __m512d _mm512_mask_sub_round_pd (__m512d s, __mmask8 k, __m512d a, __m512d b, int);
VSUBPD __m512d _mm512_maskz_sub_round_pd (__mmask8 k, __m512d a, __m512d b, int);
VSUBPD __m256d _mm256_sub_pd (__m256d a, __m256d b);
VSUBPD __m256d _mm256_mask_sub_pd (__m256d s, __mmask8 k, __m256d a, __m256d b);
VSUBPD __m256d _mm256_maskz_sub_pd (__mmask8 k, __m256d a, __m256d b);
SUBPD __m128d _mm_sub_pd (__m128d a, __m128d b);
VSUBPD __m128d _mm_mask_sub_pd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VSUBPD __m128d _mm_maskz_sub_pd (__mmask8 k, __m128d a, __m128d b);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

VEX-encoded指令,参见表2-19"第2类例外条件".

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
