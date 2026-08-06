---
summary: 逻辑专属或
---

## 说明

在源操作数(第二次操作数)和目标操作数(第一次操作数)上执行一个位元逻辑独家操作(XOR),并将结果存储在目标操作数中. 如果两个操作数的对应位是不同的,结果的每个位是1;如果操作数的对应位是相同的,每个位是0.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 指令 64 位 操作数 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 相应的注册目的地的上位数(MAXVL-1:256)为零.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置播出. 目标操作数是一个ZMM/YMM/XMM的登记册,有条件的更新有写掩码 k1.

## 行动

```text
PXOR (64-bit Operand)
DEST := DEST XOR SRC

PXOR (128-bit Legacy SSE Version)
DEST := DEST XOR SRC
DEST[MAXVL-1:128] (Unmodified)

VPXOR (VEX.128 Encoded Version)
DEST := SRC1 XOR SRC2
DEST[MAXVL-1:128] := 0

VPXOR (VEX.256 Encoded Version)
DEST := SRC1 XOR SRC2
DEST[MAXVL-1:256] := 0

VPXORD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[i+31:i]

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPXORQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[i+63:i]

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPXORD __m512i _mm512_xor_epi32(__m512i a, __m512i b) VPXORD __m512i _mm512_mask_xor_epi32(__m512i s, __mmask16 m, __m512i a, __m512i b) VPXORD __m512i _mm512_maskz_xor_epi32( __mmask16 m, __m512i a, __m512i b) VPXORD __m256i _mm256_xor_epi32(__m256i a, __m256i b) VPXORD __m256i _mm256_mask_xor_epi32(__m256i s, __mmask8 m, __m256i a, __m256i b) VPXORD __m256i _mm256_maskz_xor_epi32( __mmask8 m, __m256i a, __m256i b) VPXORD __m128i _mm_xor_epi32(__m128i a, __m128i b) VPXORD __m128i _mm_mask_xor_epi32(__m128i s, __mmask8 m, __m128i a, __m128i b) VPXORD __m128i _mm_maskz_xor_epi32( __mmask16 m, __m128i a, __m128i b) VPXORQ __m512i _mm512_xor_epi64( __m512i a, __m512i b);
VPXORQ __m512i _mm512_mask_xor_epi64(__m512i s, __mmask8 m, __m512i a, __m512i b);
VPXORQ __m512i _mm512_maskz_xor_epi64(__mmask8 m, __m512i a, __m512i b);
VPXORQ __m256i _mm256_xor_epi64( __m256i a, __m256i b);
VPXORQ __m256i _mm256_mask_xor_epi64(__m256i s, __mmask8 m, __m256i a, __m256i b);
VPXORQ __m256i _mm256_maskz_xor_epi64(__mmask8 m, __m256i a, __m256i b);
VPXORQ __m128i _mm_xor_epi64( __m128i a, __m128i b);
VPXORQ __m128i _mm_mask_xor_epi64(__m128i s, __mmask8 m, __m128i a, __m128i b);
VPXORQ __m128i _mm_maskz_xor_epi64(__mmask8 m, __m128i a, __m128i b);
PXOR:__m64 _mm_xor_si64 (__m64 m1, __m64 m2) (V)PXOR:__m128i _mm_xor_si128 ( __m128i a, __m128i b) VPXOR:__m256i _mm256_xor_si256 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
