---
summary: 逻辑 OR
---

## 说明

在源操作数(第二次操作数)和目标操作数(第一次操作数)上执行位元逻辑OR操作,并将结果存储在目标操作数中. 如果第一个和第二个操作数的任何一个或两个对应的比特为1,结果的每个比特被设定为1;否则,它被设定为0.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 版本 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一个来源和目标操作数可以是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一个来源和目标操作数可以是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一个来源和目标操作数可以是YMM登记册.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置播出. 目的地操作器是一个ZMM/YMM/XMM的寄存器,在32/64位颗粒性时,以写mask k1有条件更新.

## 行动

```text
POR (64-bit Operand)
DEST := DEST OR SRC

POR (128-bit Legacy SSE Version)
DEST := DEST OR SRC
DEST[MAXVL-1:128] (Unmodified)

VPOR (VEX.128 Encoded Version)
DEST := SRC1 OR SRC2
DEST[MAXVL-1:128] := 0

VPOR (VEX.256 Encoded Version)
DEST := SRC1 OR SRC2
DEST[MAXVL-1:256] := 0

VPORD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] BITWISE OR SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] BITWISE OR SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*           ; merging-masking

                  *DEST[i+31:i] remains unchanged*

                  ELSE                      ; zeroing-masking

                         DEST[i+31:i] := 0

             FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPORD __m512i _mm512_or_epi32(__m512i a, __m512i b);
VPORD __m512i _mm512_mask_or_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPORD __m512i _mm512_maskz_or_epi32( __mmask16 k, __m512i a, __m512i b);
VPORD __m256i _mm256_or_epi32(__m256i a, __m256i b);
VPORD __m256i _mm256_mask_or_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b,);
VPORD __m256i _mm256_maskz_or_epi32( __mmask8 k, __m256i a, __m256i b);
VPORD __m128i _mm_or_epi32(__m128i a, __m128i b);
VPORD __m128i _mm_mask_or_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPORD __m128i _mm_maskz_or_epi32( __mmask8 k, __m128i a, __m128i b);
VPORQ __m512i _mm512_or_epi64(__m512i a, __m512i b);
VPORQ __m512i _mm512_mask_or_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPORQ __m512i _mm512_maskz_or_epi64(__mmask8 k, __m512i a, __m512i b);
VPORQ __m256i _mm256_or_epi64(__m256i a, int imm);
VPORQ __m256i _mm256_mask_or_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPORQ __m256i _mm256_maskz_or_epi64( __mmask8 k, __m256i a, __m256i b);
VPORQ __m128i _mm_or_epi64(__m128i a, __m128i b);
VPORQ __m128i _mm_mask_or_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPORQ __m128i _mm_maskz_or_epi64( __mmask8 k, __m128i a, __m128i b);
POR __m64 _mm_or_si64(__m64 m1, __m64 m2) (V)POR __m128i _mm_or_si128(__m128i m1, __m128i m2) VPOR __m256i _mm256_or_si256 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
