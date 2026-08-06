---
summary: 左侧数据包逻辑
---

## 说明

将 目标操作数(第一个操作数)中单个数据元素中的位数(字,双字,或四字)按计数 操作数(第二个操作数)中指定的位数向左移动. 随着数据元素中的位位左移,空的低序位位被清除(设置为0). 如果计数操作数指定的值大于15(对于单词),31(对于双词),或63(对于四词),则目标操作数被设定为所有0s. 图4-17给出了一个在64位的操作数中移动单词的例子.

```text
                   Pre-Shift   X3                           X2             X1    X0
```

DEST

左移,零扩展

```text
       Post-Shift              X3 << COUNT              X2 << COUNT   X1 << COUNT X0 << COUNT
```

DEST

图4-17. PSLLW, PSLLD, 和 PSLLQ 指令操作 使用 64 位 操作数

(V)PSLLW 指令将 目标操作数 中每个单词向左移动,以 计数 操作数 中指定的位数; (V)PSLLD 指令将 目标操作数 中每个双词的位移; (V)PSLLQ 指令将 目标操作数 中四词(或四词)的位移.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 指令 64 位 操作数 : 目标操作数是一个MMX技术登记册;计数的操作数可以是MMX技术登记册,也可以是64位的内存位置技术登记册.

128位遗产 SSE 版本 : 目的地和第一个源操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128). 计数的操作数可以是XMM寄存器,也可以是128位的内存位置,也可以是8位的即时寄存器. 如果计数操作数是一个内存地址,则128位被加载,但上64位被忽略.

VEX.128 编码版本 : 目的地和第一个源操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零. 计数的操作数可以是XMM寄存器,也可以是128位的内存位置,也可以是8位的即时寄存器. 如果计数操作数是一个内存地址,则128位被加载,但上64位被忽略.

VEX.256 编码版本 : 目标操作数是一个YMM登记册. 源操作数是一个YMM的寄存器或内存位置. 操作数的计数可以来自XMM的寄存器,也可以来自内存位置或8位即时. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX 编码版本 : 目标操作数是一个按照写掩码更新的ZMM登记册. 计数操作数要么是一个8位即时(即时计数版本),要么是一个XMM寄存器或内存位置(可变计数版本)的8位值. 对于即时计数版本,源操作数(第二个操作数)可以是ZMM寄存器,512位内存位置或512位向量从32/64位内存位置广播. 对于可变计数版本,第一源操作数(第二个操作数)是一个ZMM的寄存器,第二源操作数(第三个操作数,8位变量计数)可以是XMM寄存器或内存位置.

说明: 在VEX/EVEX编码的有即时计数的班次版本中,vvv的VEX/EVEX编码了目的地登记册,VEX.B/EVEX.B+ModRM.r/m编码了源登记册.

说明: 对于有即时计数的班次(VEX.128.66.0F 71-73qz 6,或EVEX.128.66.0F 71-73qz 6),VEX.vvvv/EVEX.vvvv编码目的地登记册.

## 行动

```text
PSLLW (With 64-bit Operand)
    IF (COUNT > 15)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE
         DEST[15:0] := ZeroExtend(DEST[15:0] << COUNT);
          (* Repeat shift operation for 2nd and 3rd words *)
         DEST[63:48] := ZeroExtend(DEST[63:48] << COUNT);
    FI;

PSLLD (with 64-bit operand)
    IF (COUNT > 31)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE
         DEST[31:0] := ZeroExtend(DEST[31:0] << COUNT);
         DEST[63:32] := ZeroExtend(DEST[63:32] << COUNT);
    FI;

PSLLQ (With 64-bit Operand)
    IF (COUNT > 63)
    THEN
          DEST[64:0] := 0000000000000000H;
    ELSE


         DEST := ZeroExtend(DEST << COUNT);
    FI;

LOGICAL_LEFT_SHIFT_WORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 15)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[15:0] := ZeroExtend(SRC[15:0] << COUNT);
    (* Repeat shift operation for 2nd through 7th words *)
    DEST[127:112] := ZeroExtend(SRC[127:112] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[31:0] := 0
ELSE

    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
    (* Repeat shift operation for 2nd through 3rd words *)
    DEST[127:96] := ZeroExtend(SRC[127:96] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS1(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[63:0] := 0
ELSE

    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
ELSE

    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
    DEST[127:64] := ZeroExtend(SRC[127:64] << COUNT);
FI;
LOGICAL_LEFT_SHIFT_WORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];


IF (COUNT > 15)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[15:0] := ZeroExtend(SRC[15:0] << COUNT);
    (* Repeat shift operation for 2nd through 15th words *)
    DEST[255:240] := ZeroExtend(SRC[255:240] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 31)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[31:0] := ZeroExtend(SRC[31:0] << COUNT);
    (* Repeat shift operation for 2nd through 7th words *)
    DEST[255:224] := ZeroExtend(SRC[255:224] << COUNT);
FI;

LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC, COUNT_SRC)
COUNT := COUNT_SRC[63:0];
IF (COUNT > 63)
THEN

    DEST[127:0] := 00000000000000000000000000000000H
    DEST[255:128] := 00000000000000000000000000000000H
ELSE
    DEST[63:0] := ZeroExtend(SRC[63:0] << COUNT);
    DEST[127:64] := ZeroExtend(SRC[127:64] << COUNT)
    DEST[191:128] := ZeroExtend(SRC[191:128] << COUNT);
    DEST[255:192] := ZeroExtend(SRC[255:192] << COUNT);
FI;

VPSLLW (EVEX Versions, xmm/m128)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1                                 ; merging-masking
    i := j * 16
    IF k1[j] OR *no writemask*
          THEN DEST[i+15:i] := TMP_DEST[i+15:i]
          ELSE
                IF *merging-masking*


                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLW (EVEX Versions, imm8)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS_128b(SRC1[127:0], imm8)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_RIGHT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[255:0], imm8)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1[511:256], imm8)
FI;

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLW (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_WORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;

VPSLLW (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_WORD_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLW (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLW (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLW (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)


PSLLW (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_WORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSLLD (EVEX versions, imm8)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+31:i] := LOGICAL_LEFT_SHIFT_DWORDS1(SRC1[31:0], imm8)

                  ELSE DEST[i+31:i] := LOGICAL_LEFT_SHIFT_DWORDS1(SRC1[i+31:i], imm8)

             FI;

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLD (EVEX Versions, xmm/m128)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLD (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;


VPSLLD (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_DWORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLD (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLD (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLD (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSLLD (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_DWORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)

VPSLLQ (EVEX Versions, imm8)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+63:i] := LOGICAL_LEFT_SHIFT_QWORDS1(SRC1[63:0], imm8)

                  ELSE DEST[i+63:i] := LOGICAL_LEFT_SHIFT_QWORDS1(SRC1[i+63:i], imm8)

             FI;

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

VPSLLQ (EVEX Versions, xmm/m128)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF VL = 128

    TMP_DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS_128b(SRC1[127:0], SRC2)
FI;
IF VL = 256

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[255:0], SRC2)
FI;
IF VL = 512

    TMP_DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[255:0], SRC2)
    TMP_DEST[511:256] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1[511:256], SRC2)
FI;

FOR j := 0 TO KL-1
    i := j * 64


IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

        IF *merging-masking*                       ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*                 ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSLLQ (ymm, ymm, xmm/m128) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0;

VPSLLQ (ymm, imm8) - VEX.256 Encoding
DEST[255:0] := LOGICAL_LEFT_SHIFT_QWORDS_256b(SRC1, imm8)
DEST[MAXVL-1:256] := 0;

VPSLLQ (xmm, xmm, xmm/m128) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPSLLQ (xmm, imm8) - VEX.128 Encoding
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(SRC1, imm8)
DEST[MAXVL-1:128] := 0

PSLLQ (xmm, xmm, xmm/m128)
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

PSLLQ (xmm, imm8)
DEST[127:0] := LOGICAL_LEFT_SHIFT_QWORDS(DEST, imm8)
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VPSLLD __m512i _mm512_slli_epi32(__m512i a, unsigned int imm);
VPSLLD __m512i _mm512_mask_slli_epi32(__m512i s, __mmask16 k, __m512i a, unsigned int imm);
VPSLLD __m512i _mm512_maskz_slli_epi32( __mmask16 k, __m512i a, unsigned int imm);
VPSLLD __m256i _mm256_mask_slli_epi32(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSLLD __m256i _mm256_maskz_slli_epi32( __mmask8 k, __m256i a, unsigned int imm);
VPSLLD __m128i _mm_mask_slli_epi32(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLD __m128i _mm_maskz_slli_epi32( __mmask8 k, __m128i a, unsigned int imm);
VPSLLD __m512i _mm512_sll_epi32(__m512i a, __m128i cnt);
VPSLLD __m512i _mm512_mask_sll_epi32(__m512i s, __mmask16 k, __m512i a, __m128i cnt);
VPSLLD __m512i _mm512_maskz_sll_epi32( __mmask16 k, __m512i a, __m128i cnt);
VPSLLD __m256i _mm256_mask_sll_epi32(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSLLD __m256i _mm256_maskz_sll_epi32( __mmask8 k, __m256i a, __m128i cnt);
VPSLLD __m128i _mm_mask_sll_epi32(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLD __m128i _mm_maskz_sll_epi32( __mmask8 k, __m128i a, __m128i cnt);
VPSLLQ __m512i _mm512_mask_slli_epi64(__m512i a, unsigned int imm);
VPSLLQ __m512i _mm512_mask_slli_epi64(__m512i s, __mmask8 k, __m512i a, unsigned int imm);
VPSLLQ __m512i _mm512_maskz_slli_epi64( __mmask8 k, __m512i a, unsigned int imm);
VPSLLQ __m256i _mm256_mask_slli_epi64(__m256i s, __mmask8 k, __m256i a, unsigned int imm);
VPSLLQ __m256i _mm256_maskz_slli_epi64( __mmask8 k, __m256i a, unsigned int imm);
VPSLLQ __m128i _mm_mask_slli_epi64(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLQ __m128i _mm_maskz_slli_epi64( __mmask8 k, __m128i a, unsigned int imm);
VPSLLQ __m512i _mm512_mask_sll_epi64(__m512i a, __m128i cnt);
VPSLLQ __m512i _mm512_mask_sll_epi64(__m512i s, __mmask8 k, __m512i a, __m128i cnt);
VPSLLQ __m512i _mm512_maskz_sll_epi64( __mmask8 k, __m512i a, __m128i cnt);
VPSLLQ __m256i _mm256_mask_sll_epi64(__m256i s, __mmask8 k, __m256i a, __m128i cnt);
VPSLLQ __m256i _mm256_maskz_sll_epi64( __mmask8 k, __m256i a, __m128i cnt);
VPSLLQ __m128i _mm_mask_sll_epi64(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLQ __m128i _mm_maskz_sll_epi64( __mmask8 k, __m128i a, __m128i cnt);
VPSLLW __m512i _mm512_slli_epi16(__m512i a, unsigned int imm);
VPSLLW __m512i _mm512_mask_slli_epi16(__m512i s, __mmask32 k, __m512i a, unsigned int imm);
VPSLLW __m512i _mm512_maskz_slli_epi16( __mmask32 k, __m512i a, unsigned int imm);
VPSLLW __m256i _mm256_mask_slli_epi16(__m256i s, __mmask16 k, __m256i a, unsigned int imm);
VPSLLW __m256i _mm256_maskz_slli_epi16( __mmask16 k, __m256i a, unsigned int imm);
VPSLLW __m128i _mm_mask_slli_epi16(__m128i s, __mmask8 k, __m128i a, unsigned int imm);
VPSLLW __m128i _mm_maskz_slli_epi16( __mmask8 k, __m128i a, unsigned int imm);
VPSLLW __m512i _mm512_sll_epi16(__m512i a, __m128i cnt);
VPSLLW __m512i _mm512_mask_sll_epi16(__m512i s, __mmask32 k, __m512i a, __m128i cnt);
VPSLLW __m512i _mm512_maskz_sll_epi16( __mmask32 k, __m512i a, __m128i cnt);
VPSLLW __m256i _mm256_mask_sll_epi16(__m256i s, __mmask16 k, __m256i a, __m128i cnt);
VPSLLW __m256i _mm256_maskz_sll_epi16( __mmask16 k, __m256i a, __m128i cnt);
VPSLLW __m128i _mm_mask_sll_epi16(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLW __m128i _mm_maskz_sll_epi16( __mmask8 k, __m128i a, __m128i cnt);
PSLLW __m64 _mm_slli_pi16 (__m64 m, int count) PSLLW __m64 _mm_sll_pi16(__m64 m, __m64 count) (V)PSLLW __m128i _mm_slli_epi16(__m64 m, int count) (V)PSLLW __m128i _mm_sll_epi16(__m128i m, __m128i count) VPSLLW __m256i _mm256_slli_epi16 (__m256i m, int count) VPSLLW __m256i _mm256_sll_epi16 (__m256i m, __m128i count) PSLLD __m64 _mm_slli_pi32(__m64 m, int count) PSLLD __m64 _mm_sll_pi32(__m64 m, __m64 count) (V)PSLLD __m128i _mm_slli_epi32(__m128i m, int count) (V)PSLLD __m128i _mm_sll_epi32(__m128i m, __m128i count) VPSLLD __m256i _mm256_slli_epi32 (__m256i m, int count) VPSLLD __m256i _mm256_sll_epi32 (__m256i m, __m128i count) PSLLQ __m64 _mm_slli_si64(__m64 m, int count) PSLLQ __m64 _mm_sll_si64(__m64 m, __m64 count) (V)PSLLQ __m128i _mm_slli_epi64(__m128i m, int count) (V)PSLLQ __m128i _mm_sll_epi64(__m128i m, __m128i count) VPSLLQ __m256i _mm256_slli_epi64 (__m256i m, int count) VPSLLQ __m256i _mm256_sll_epi64 (__m256i m, __m128i count);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

* VEX 编码指令 :

- 语法与RM/RVM 操作数编码(操作数编码表中的A/C),参见表2-21"第4类例外条件".

--语法与MI/VMI 操作数编码(操作数编码表中的B/D),参见表2-24,"第7类例外条件".

* EVEX-encoded VPSLLW(E in the 操作数 编码表),参见表2-52中的例外类型 E4NF.nb,"Type"

E4NF 类例外条件".

* EVEX - 编码为VPSLLD/Q:

- 语法上与Mem128的tuple类型(操作数编码表中的G),参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".

- 语法与全Tuple类型(操作数编码表中的F),参见表2-51,"Type E4类例外条件".
