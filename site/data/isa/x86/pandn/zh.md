---
summary: 逻辑 AND NOT
---

## 说明

在 第一源操作数 上执行一个比特逻辑 NOT 操作,然后用 第二源操作数 执行比特逻辑 AND,并将结果存储在 目标操作数 中. 如果第一个操作数中对应位为0,第二个操作数中对应位为1,则结果的每个位被设定为1,否则被设定为0.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 指令 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数可以是MMX技术登记册.

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置播出. 目的地操作器是一个ZMM/YMM/XMM的寄存器,在32/64位颗粒性时,以写mask k1有条件更新.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

## 行动

```text
PANDN (64-bit Operand)
DEST := NOT(DEST) AND SRC

PANDN (128-bit Legacy SSE Version)
DEST := NOT(DEST) AND SRC
DEST[MAXVL-1:128] (Unmodified)

VPANDN (VEX.128 Encoded Version)
DEST := NOT(SRC1) AND SRC2
DEST[MAXVL-1:128] := 0

VPANDN (VEX.256 Encoded Instruction)
DEST[255:0] := ((NOT SRC1[255:0]) AND SRC2[255:0])
DEST[MAXVL-1:256] := 0

VPANDND (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := ((NOT SRC1[i+31:i]) AND SRC2[31:0])

                  ELSE DEST[i+31:i] := ((NOT SRC1[i+31:i]) AND SRC2[i+31:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPANDNQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := ((NOT SRC1[i+63:i]) AND SRC2[63:0])

                  ELSE DEST[i+63:i] := ((NOT SRC1[i+63:i]) AND SRC2[i+63:i])

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
VPANDND __m512i _mm512_andnot_epi32( __m512i a, __m512i b);
VPANDND __m512i _mm512_mask_andnot_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPANDND __m512i _mm512_maskz_andnot_epi32( __mmask16 k, __m512i a, __m512i b);
VPANDND __m256i _mm256_mask_andnot_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPANDND __m256i _mm256_maskz_andnot_epi32( __mmask8 k, __m256i a, __m256i b);
VPANDND __m128i _mm_mask_andnot_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPANDND __m128i _mm_maskz_andnot_epi32( __mmask8 k, __m128i a, __m128i b);
VPANDNQ __m512i _mm512_andnot_epi64( __m512i a, __m512i b);
VPANDNQ __m512i _mm512_mask_andnot_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPANDNQ __m512i _mm512_maskz_andnot_epi64( __mmask8 k, __m512i a, __m512i b);
VPANDNQ __m256i _mm256_mask_andnot_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPANDNQ __m256i _mm256_maskz_andnot_epi64( __mmask8 k, __m256i a, __m256i b);
VPANDNQ __m128i _mm_mask_andnot_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPANDNQ __m128i _mm_maskz_andnot_epi64( __mmask8 k, __m128i a, __m128i b);
PANDN __m64 _mm_andnot_si64 (__m64 m1, __m64 m2) (V)PANDN __m128i _mm_andnot_si128 ( __m128i a, __m128i b) VPANDN __m256i _mm256_andnot_si256 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
