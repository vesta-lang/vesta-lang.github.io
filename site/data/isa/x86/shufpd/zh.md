---
summary: 双精度浮点 值对等的包放间歇
---

## 说明

选择使用比特控件的输入对的双精度浮点值,然后移动到目标操作数的指定元素. 目标操作数的双精度元件的低至高序在128位的输入对的颗粒性时,在第一源操作数和第二源操作数之间互换. Imm8字节中的每个比特,从比特0开始,是目的地相应元素的选定控制,以接收一个输入对子的洗牌结果.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量通过64位内存位置的广播. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM的登记器. 选择的控件是 imm8 字节的下方 8/4/2 位.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册. 选择的控件是 imm8 字节中的位数 3:0, imm8 [7:4] 被忽略.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 上位数 (MAXVL-1: 128) of

对应的 ZMM 注册目的地 被清零。 选择的控件是 imm8 字节中的比特 1:0, imm8 [7:2] 被忽略.

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目标操作数与第一源操作数相同,是XMM的登记册. 对应的ZMM注册目的地的上位位(MAXVL-1:128)没有修改. 选择的控件是 imm8 字节中的比特 1:0, imm8 [7:2] 被忽略.

SRC1  X3        X2                                                                    X1  X0

SRC2  Y3        Y2                                                                    Y1  Y0

DEST  Y2 or Y3  X2 or X3                                        Y0 or Y1                  X0 or X1

图4-25. 256位 VSHUFPD 四对双精度浮点值的操作

## 行动

```text
VSHUFPD (EVEX Encoded Versions When SRC2 is a Vector Register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF IMM0[0] = 0

    THEN TMP_DEST[63:0] := SRC1[63:0]
    ELSE TMP_DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN TMP_DEST[127:64] := SRC2[63:0]
    ELSE TMP_DEST[127:64] := SRC2[127:64] FI;
IF VL >= 256
    IF IMM0[2] = 0

          THEN TMP_DEST[191:128] := SRC1[191:128]
          ELSE TMP_DEST[191:128] := SRC1[255:192] FI;
    IF IMM0[3] = 0
          THEN TMP_DEST[255:192] := SRC2[191:128]
          ELSE TMP_DEST[255:192] := SRC2[255:192] FI;
FI;
IF VL >= 512
    IF IMM0[4] = 0
          THEN TMP_DEST[319:256] := SRC1[319:256]
          ELSE TMP_DEST[319:256] := SRC1[383:320] FI;
    IF IMM0[5] = 0
          THEN TMP_DEST[383:320] := SRC2[319:256]
          ELSE TMP_DEST[383:320] := SRC2[383:320] FI;
    IF IMM0[6] = 0
          THEN TMP_DEST[447:384] := SRC1[447:384]
          ELSE TMP_DEST[447:384] := SRC1[511:448] FI;
    IF IMM0[7] = 0
          THEN TMP_DEST[511:448] := SRC2[447:384]
          ELSE TMP_DEST[511:448] := SRC2[511:448] FI;
FI;
FOR j := 0 TO KL-1
    i := j * 64


IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

        IF *merging-masking*                ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*          ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFPD (EVEX Encoded Versions When SRC2 is Memory)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF (EVEX.b = 1)
          THEN TMP_SRC2[i+63:i] := SRC2[63:0]
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]
    FI;

ENDFOR;
IF IMM0[0] = 0

    THEN TMP_DEST[63:0] := SRC1[63:0]
    ELSE TMP_DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN TMP_DEST[127:64] := TMP_SRC2[63:0]
    ELSE TMP_DEST[127:64] := TMP_SRC2[127:64] FI;
IF VL >= 256
    IF IMM0[2] = 0

          THEN TMP_DEST[191:128] := SRC1[191:128]
          ELSE TMP_DEST[191:128] := SRC1[255:192] FI;
    IF IMM0[3] = 0
          THEN TMP_DEST[255:192] := TMP_SRC2[191:128]
          ELSE TMP_DEST[255:192] := TMP_SRC2[255:192] FI;
FI;
IF VL >= 512
    IF IMM0[4] = 0
          THEN TMP_DEST[319:256] := SRC1[319:256]
          ELSE TMP_DEST[319:256] := SRC1[383:320] FI;
    IF IMM0[5] = 0
          THEN TMP_DEST[383:320] := TMP_SRC2[319:256]
          ELSE TMP_DEST[383:320] := TMP_SRC2[383:320] FI;
    IF IMM0[6] = 0
          THEN TMP_DEST[447:384] := SRC1[447:384]
          ELSE TMP_DEST[447:384] := SRC1[511:448] FI;
    IF IMM0[7] = 0
          THEN TMP_DEST[511:448] := TMP_SRC2[447:384]
          ELSE TMP_DEST[511:448] := TMP_SRC2[511:448] FI;
FI;
FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]


     ELSE

        IF *merging-masking*                 ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*           ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFPD (VEX.256 Encoded Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
IF IMM0[2] = 0
    THEN DEST[191:128] := SRC1[191:128]
    ELSE DEST[191:128] := SRC1[255:192] FI;
IF IMM0[3] = 0
    THEN DEST[255:192] := SRC2[191:128]
    ELSE DEST[255:192] := SRC2[255:192] FI;
DEST[MAXVL-1:256] (Unmodified)

VSHUFPD (VEX.128 Encoded Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
DEST[MAXVL-1:128] := 0

VSHUFPD (128-bit Legacy SSE Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSHUFPD __m512d _mm512_shuffle_pd(__m512d a, __m512d b, int imm);
VSHUFPD __m512d _mm512_mask_shuffle_pd(__m512d s, __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFPD __m512d _mm512_maskz_shuffle_pd( __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFPD __m256d _mm256_shuffle_pd (__m256d a, __m256d b, const int select);
VSHUFPD __m256d _mm256_mask_shuffle_pd(__m256d s, __mmask8 k, __m256d a, __m256d b, int imm);
VSHUFPD __m256d _mm256_maskz_shuffle_pd( __mmask8 k, __m256d a, __m256d b, int imm);
SHUFPD __m128d _mm_shuffle_pd (__m128d a, __m128d b, const int select);
VSHUFPD __m128d _mm_mask_shuffle_pd(__m128d s, __mmask8 k, __m128d a, __m128d b, int imm);
VSHUFPD __m128d _mm_maskz_shuffle_pd( __mmask8 k, __m128d a, __m128d b, int imm);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".
