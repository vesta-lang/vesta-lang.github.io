---
summary: 最大包装 有符号整数
---

## 说明

执行 SIMD 比较 第二源操作数 和 第一源操作数 中已签名的字节,字节,字节或qword 整数,并将每对整数的最大值返回 目标操作数.

遗产 SSE 版本 PMAXSW : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数可以是MMX技术登记册.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256 编码版本 : 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX编码为VPMAXSD/Q: 第一源操作数是一个ZMM/YMM/XMM登记册; 第二源操作数是一个ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置广播. 目标操作数基于写掩码 k1有条件更新.

EVEX编码为VPMAXSB/W: 第一源操作数是一个ZMM/YMM/XMM登记册; 第二源操作数是一个ZMM/YMM/XMM登记册,一个512/256/128位的内存位置. 目标操作数基于写掩码 k1有条件更新.

## 行动

```text
PMAXSW (64-bit Operands)

    IF DEST[15:0] > SRC[15:0]) THEN
          DEST[15:0] := DEST[15:0];

    ELSE
          DEST[15:0] := SRC[15:0]; FI;

    (* Repeat operation for 2nd and 3rd words in source and destination operands *)
    IF DEST[63:48] > SRC[63:48]) THEN

          DEST[63:48] := DEST[63:48];
    ELSE

          DEST[63:48] := SRC[63:48]; FI;

PMAXSB (128-bit Legacy SSE Version)
    IF DEST[7:0] > SRC[7:0] THEN
          DEST[7:0] := DEST[7:0];
    ELSE
          DEST[7:0] := SRC[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF DEST[127:120] >SRC[127:120] THEN
          DEST[127:120] := DEST[127:120];
    ELSE
          DEST[127:120] := SRC[127:120]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSB (VEX.128 Encoded Version)
    IF SRC1[7:0] > SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[7:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF SRC1[127:120] >SRC2[127:120] THEN
          DEST[127:120] := SRC1[127:120];
    ELSE
          DEST[127:120] := SRC2[127:120]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSB (VEX.256 Encoded Version)
    IF SRC1[7:0] > SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[7:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 31st bytes in source and destination operands *)
    IF SRC1[255:248] >SRC2[255:248] THEN
          DEST[255:248] := SRC1[255:248];
    ELSE
          DEST[255:248] := SRC2[255:248]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+7:i] > SRC2[i+7:i]

            THEN DEST[i+7:i] := SRC1[i+7:i];

            ELSE DEST[i+7:i] := SRC2[i+7:i];

     FI;

     ELSE

            IF *merging-masking*              ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE                          ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PMAXSW (128-bit Legacy SSE Version)
    IF DEST[15:0] >SRC[15:0] THEN
          DEST[15:0] := DEST[15:0];
    ELSE
          DEST[15:0] := SRC[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:112] >SRC[127:112] THEN
          DEST[127:112] := DEST[127:112];
    ELSE
          DEST[127:112] := SRC[127:112]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSW (VEX.128 Encoded Version)
    IF SRC1[15:0] > SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF SRC1[127:112] >SRC2[127:112] THEN
          DEST[127:112] := SRC1[127:112];
    ELSE
          DEST[127:112] := SRC2[127:112]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSW (VEX.256 Encoded Version)
    IF SRC1[15:0] > SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 15th words in source and destination operands *)
    IF SRC1[255:240] >SRC2[255:240] THEN
          DEST[255:240] := SRC1[255:240];
    ELSE
          DEST[255:240] := SRC2[255:240]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+15:i] > SRC2[i+15:i]

             THEN DEST[i+15:i] := SRC1[i+15:i];

             ELSE DEST[i+15:i] := SRC2[i+15:i];

     FI;

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                            ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PMAXSD (128-bit Legacy SSE Version)
    IF DEST[31:0] >SRC[31:0] THEN
          DEST[31:0] := DEST[31:0];
    ELSE
          DEST[31:0] := SRC[31:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:96] >SRC[127:96] THEN
          DEST[127:96] := DEST[127:96];
    ELSE
          DEST[127:96] := SRC[127:96]; FI;

DEST[MAXVL-1:128] (Unmodified)

VPMAXSD (VEX.128 Encoded Version)
    IF SRC1[31:0] > SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];
    ELSE
          DEST[31:0] := SRC2[31:0]; FI;
    (* Repeat operation for 2nd through 3rd dwords in source and destination operands *)
    IF SRC1[127:96] > SRC2[127:96] THEN
          DEST[127:96] := SRC1[127:96];
    ELSE
          DEST[127:96] := SRC2[127:96]; FI;

DEST[MAXVL-1:128] := 0

VPMAXSD (VEX.256 Encoded Version)
    IF SRC1[31:0] > SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];
    ELSE
          DEST[31:0] := SRC2[31:0]; FI;
    (* Repeat operation for 2nd through 7th dwords in source and destination operands *)
    IF SRC1[255:224] > SRC2[255:224] THEN
          DEST[255:224] := SRC1[255:224];
    ELSE
          DEST[255:224] := SRC2[255:224]; FI;

DEST[MAXVL-1:256] := 0


VPMAXSD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+31:i] > SRC2[31:0]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[31:0];

                  FI;

             ELSE

                  IF SRC1[i+31:i] > SRC2[i+31:i]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[i+31:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE DEST[i+31:i] := 0          ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMAXSQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+63:i] > SRC2[63:0]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[63:0];

                  FI;

             ELSE

                  IF SRC1[i+63:i] > SRC2[i+63:i]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[i+63:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                 ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                            ; zeroing-masking

                       THEN DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMAXSB __m512i _mm512_max_epi8( __m512i a, __m512i b);
VPMAXSB __m512i _mm512_mask_max_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPMAXSB __m512i _mm512_maskz_max_epi8( __mmask64 k, __m512i a, __m512i b);
VPMAXSW __m512i _mm512_max_epi16( __m512i a, __m512i b);
VPMAXSW __m512i _mm512_mask_max_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMAXSW __m512i _mm512_maskz_max_epi16( __mmask32 k, __m512i a, __m512i b);
VPMAXSB __m256i _mm256_mask_max_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPMAXSB __m256i _mm256_maskz_max_epi8( __mmask32 k, __m256i a, __m256i b);
VPMAXSW __m256i _mm256_mask_max_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMAXSW __m256i _mm256_maskz_max_epi16( __mmask16 k, __m256i a, __m256i b);
VPMAXSB __m128i _mm_mask_max_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPMAXSB __m128i _mm_maskz_max_epi8( __mmask16 k, __m128i a, __m128i b);
VPMAXSW __m128i _mm_mask_max_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSW __m128i _mm_maskz_max_epi16( __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m256i _mm256_mask_max_epi32(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMAXSD __m256i _mm256_maskz_max_epi32( __mmask16 k, __m256i a, __m256i b);
VPMAXSQ __m256i _mm256_mask_max_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMAXSQ __m256i _mm256_maskz_max_epi64( __mmask8 k, __m256i a, __m256i b);
VPMAXSD __m128i _mm_mask_max_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m128i _mm_maskz_max_epi32( __mmask8 k, __m128i a, __m128i b);
VPMAXSQ __m128i _mm_mask_max_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMAXSQ __m128i _mm_maskz_max_epu64( __mmask8 k, __m128i a, __m128i b);
VPMAXSD __m512i _mm512_max_epi32( __m512i a, __m512i b);
VPMAXSD __m512i _mm512_mask_max_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPMAXSD __m512i _mm512_maskz_max_epi32( __mmask16 k, __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_max_epi64( __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_mask_max_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMAXSQ __m512i _mm512_maskz_max_epi64( __mmask8 k, __m512i a, __m512i b);
(V)PMAXSB __m128i _mm_max_epi8 ( __m128i a, __m128i b);
(V)PMAXSW __m128i _mm_max_epi16 ( __m128i a, __m128i b) (V)PMAXSD __m128i _mm_max_epi32 ( __m128i a, __m128i b);
VPMAXSB __m256i _mm256_max_epi8 ( __m256i a, __m256i b);
VPMAXSW __m256i _mm256_max_epi16 ( __m256i a, __m256i b) VPMAXSD __m256i _mm256_max_epi32 ( __m256i a, __m256i b);
PMAXSW:__m64 _mm_max_pi16(__m64 a, __m64 b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPMAXSD/Q,参见表2-51"Type E4类例外条件".

EVEX-encoded VPMAXSB/W,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
