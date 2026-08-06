---
summary: 打包双精度浮点值 的位逻辑 OR
---

## 说明

从 第一源操作数 和 第二源操作数 执行两个,四个或八个 打包双精度浮点值 的位逻辑OR,并将结果存储在 目标操作数 中.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位的内存位置,也可以是512/256/128位的向量,通过32位的内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
VORPD (EVEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+63:i] := SRC1[i+63:i] BITWISE OR SRC2[63:0]

                  ELSE

                    DEST[i+63:i] := SRC1[i+63:i] BITWISE OR SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*              ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VORPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE OR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE OR SRC2[127:64]
DEST[191:128] := SRC1[191:128] BITWISE OR SRC2[191:128]
DEST[255:192] := SRC1[255:192] BITWISE OR SRC2[255:192]
DEST[MAXVL-1:256] := 0

VORPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE OR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE OR SRC2[127:64]
DEST[MAXVL-1:128] := 0

ORPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] BITWISE OR SRC[63:0]
DEST[127:64] := DEST[127:64] BITWISE OR SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VORPD __m512d _mm512_or_pd ( __m512d a, __m512d b);
VORPD __m512d _mm512_mask_or_pd ( __m512d s, __mmask8 k, __m512d a, __m512d b);
VORPD __m512d _mm512_maskz_or_pd (__mmask8 k, __m512d a, __m512d b);
VORPD __m256d _mm256_mask_or_pd (__m256d s, ___mmask8 k, __m256d a, __m256d b);
VORPD __m256d _mm256_maskz_or_pd (__mmask8 k, __m256d a, __m256d b);
VORPD __m128d _mm_mask_or_pd ( __m128d s, __mmask8 k, __m128d a, __m128d b);
VORPD __m128d _mm_maskz_or_pd (__mmask8 k, __m128d a, __m128d b);
VORPD __m256d _mm256_or_pd (__m256d a, __m256d b);
ORPD __m128d _mm_or_pd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
