---
summary: 打包双精度浮点值的逻辑 XOR
---

## 说明

从第一个源运行符和第二个源运行符中执行一个位元逻辑的XOR,四个或八个包装的双精度浮点值,并将结果存储在目的地运行符中.

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数可以是ZMM寄存器或矢量内存位置. 目标操作数是一个ZMM的寄存器,有条件更新为写掩码 k1.

VEX.256和EVEX.256编码版本: 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM的登记册(在EVEX的情况下,有条件的更新为写掩码 k1). 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128和EVEX.128编码版本: 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM的登记册(在EVEX的情况下,有条件的更新为写掩码 k1). 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
VXORPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[63:0];

                  ELSE DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[i+63:i];

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*              ; zeroing-masking

                    DEST[i+63:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VXORPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE XOR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE XOR SRC2[127:64]
DEST[191:128] := SRC1[191:128] BITWISE XOR SRC2[191:128]
DEST[255:192] := SRC1[255:192] BITWISE XOR SRC2[255:192]
DEST[MAXVL-1:256] := 0

VXORPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] BITWISE XOR SRC2[63:0]
DEST[127:64] := SRC1[127:64] BITWISE XOR SRC2[127:64]
DEST[MAXVL-1:128] := 0

XORPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] BITWISE XOR SRC[63:0]
DEST[127:64] := DEST[127:64] BITWISE XOR SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VXORPD __m512d _mm512_xor_pd (__m512d a, __m512d b);
VXORPD __m512d _mm512_mask_xor_pd (__m512d a, __mmask8 m, __m512d b);
VXORPD __m512d _mm512_maskz_xor_pd (__mmask8 m, __m512d a);
VXORPD __m256d _mm256_xor_pd (__m256d a, __m256d b);
VXORPD __m256d _mm256_mask_xor_pd (__m256d a, __mmask8 m, __m256d b);
VXORPD __m256d _mm256_maskz_xor_pd (__mmask8 m, __m256d a);
XORPD __m128d _mm_xor_pd (__m128d a, __m128d b);
VXORPD __m128d _mm_mask_xor_pd (__m128d a, __mmask8 m, __m128d b);
VXORPD __m128d _mm_maskz_xor_pd (__mmask8 m, __m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-49"第E4类例外条件".
