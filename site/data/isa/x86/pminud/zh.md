---
summary: 最小包装 无符号整数
---

## 说明

执行 SIMD 比较 第二源操作数 和 第一源操作数 的无符号 dword/qword 整数,并将每对整数的最小值返回 目标操作数 。

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册保持不变.

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256 编码版本 : 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册; 第二源操作数是一个ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置广播. 目标操作数基于写掩码 k1有条件更新.

## 行动

```text
PMINUD (128-bit Legacy SSE Version)
PMINUD instruction for 128-bit operands:

    IF DEST[31:0] < SRC[31:0] THEN
          DEST[31:0] := DEST[31:0];

    ELSE
          DEST[31:0] := SRC[31:0]; FI;

    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:96] < SRC[127:96] THEN

          DEST[127:96] := DEST[127:96];
    ELSE

          DEST[127:96] := SRC[127:96]; FI;
DEST[MAXVL-1:128] (Unmodified)

VPMINUD (VEX.128 Encoded Version)
VPMINUD instruction for 128-bit operands:

    IF SRC1[31:0] < SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];

    ELSE
          DEST[31:0] := SRC2[31:0]; FI;

    (* Repeat operation for 2nd through 3rd dwords in source and destination operands *)
    IF SRC1[127:96] < SRC2[127:96] THEN

          DEST[127:96] := SRC1[127:96];
    ELSE

          DEST[127:96] := SRC2[127:96]; FI;
DEST[MAXVL-1:128] := 0

VPMINUD (VEX.256 Encoded Version)
VPMINUD instruction for 128-bit operands:

    IF SRC1[31:0] < SRC2[31:0] THEN
          DEST[31:0] := SRC1[31:0];

    ELSE
          DEST[31:0] := SRC2[31:0]; FI;

    (* Repeat operation for 2nd through 7th dwords in source and destination operands *)
    IF SRC1[255:224] < SRC2[255:224] THEN

          DEST[255:224] := SRC1[255:224];
    ELSE

          DEST[255:224] := SRC2[255:224]; FI;
DEST[MAXVL-1:256] := 0


VPMINUD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+31:i] < SRC2[31:0]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[31:0];

                  FI;

             ELSE

                  IF SRC1[i+31:i] < SRC2[i+31:i]

                       THEN DEST[i+31:i] := SRC1[i+31:i];

                       ELSE DEST[i+31:i] := SRC2[i+31:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                   ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                              ; zeroing-masking

                       DEST[i+31:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPMINUQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

             THEN

                  IF SRC1[i+63:i] < SRC2[63:0]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[63:0];

                  FI;

             ELSE

                  IF SRC1[i+63:i] < SRC2[i+63:i]

                       THEN DEST[i+63:i] := SRC1[i+63:i];

                       ELSE DEST[i+63:i] := SRC2[i+63:i];

             FI;

     FI;

     ELSE

             IF *merging-masking*                   ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                              ; zeroing-masking

                       DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMINUD __m512i _mm512_min_epu32( __m512i a, __m512i b);
VPMINUD __m512i _mm512_mask_min_epu32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPMINUD __m512i _mm512_maskz_min_epu32( __mmask16 k, __m512i a, __m512i b);
VPMINUQ __m512i _mm512_min_epu64( __m512i a, __m512i b);
VPMINUQ __m512i _mm512_mask_min_epu64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMINUQ __m512i _mm512_maskz_min_epu64( __mmask8 k, __m512i a, __m512i b);
VPMINUD __m256i _mm256_mask_min_epu32(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMINUD __m256i _mm256_maskz_min_epu32( __mmask16 k, __m256i a, __m256i b);
VPMINUQ __m256i _mm256_mask_min_epu64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMINUQ __m256i _mm256_maskz_min_epu64( __mmask8 k, __m256i a, __m256i b);
VPMINUD __m128i _mm_mask_min_epu32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMINUD __m128i _mm_maskz_min_epu32( __mmask8 k, __m128i a, __m128i b);
VPMINUQ __m128i _mm_mask_min_epu64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMINUQ __m128i _mm_maskz_min_epu64( __mmask8 k, __m128i a, __m128i b);
(V)PMINUD __m128i _mm_min_epu32 ( __m128i a, __m128i b);
VPMINUD __m256i _mm256_min_epu32 ( __m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
