---
summary: 单精度浮点 值的四边形四面体的包装间歇
---

## 说明

选择使用双位控件的输入四进制的 单精度浮点 值,然后移动到 目标操作数 的指定元素. 目标操作数128位车道的每个64位元素-pair在颗粒化128位处的第一源操作数和第二源操作数对应车道之间互换. Imm8字节中的每个两个比特,从比特0开始,是目的地128位车道相应元素的选定控制,以接收一个输入四进制的洗牌结果. 目的地128位车道的两个下层元素得到第一源操作数四重奏的洗牌结果. 目的地接下来的两个元素收到第二源操作数四重奏的洗牌结果.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从32位内存位置广播. 目标操作数是一个ZMM/YMM/XMM的登记册,根据写掩码更新. imm8[7:0]为目的地每个适用的128位车道提供4个选择控制.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册. Imm8[7:0]为目的地的高低128位提供了4个选择控制.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128). Imm8[7:0]为目的地的每个元素提供4个选择的控制.

128位遗产 SSE 版本 : 来源可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(ZMM注册点)没有修改. Imm8[7:0]为目的地的每个元素提供4个选择的控制.

SRC1 X7  X6  X5  X4  X3  X2                                                                 X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3  Y2                                                                 Y1  Y0

DEST Y7 .. Y4 Y7 .. Y4 X7 .. X4 X7 .. X4 Y3 ..Y0 Y3 ..Y0 X3 .. X0 X3 .. X0

图4-26. 256位 VSHUFPS 从输入四方和对等互换结果中选择操作

## 行动

```text
Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[31:0];
    1: TMP := SRC[63:32];
    2: TMP := SRC[95:64];
    3: TMP := SRC[127:96];
ESAC;
RETURN TMP
}

VPSHUFPS (EVEX Encoded Versions When SRC2 is a Vector Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)

TMP_DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
TMP_DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
TMP_DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
TMP_DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
IF VL >= 256

    TMP_DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
    TMP_DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
    TMP_DEST[223:192] := Select4(SRC2[255:128], imm8[5:4]);
    TMP_DEST[255:224] := Select4(SRC2[255:128], imm8[7:6]);
FI;
IF VL >= 512
    TMP_DEST[287:256] := Select4(SRC1[383:256], imm8[1:0]);
    TMP_DEST[319:288] := Select4(SRC1[383:256], imm8[3:2]);
    TMP_DEST[351:320] := Select4(SRC2[383:256], imm8[5:4]);
    TMP_DEST[383:352] := Select4(SRC2[383:256], imm8[7:6]);
    TMP_DEST[415:384] := Select4(SRC1[511:384], imm8[1:0]);
    TMP_DEST[447:416] := Select4(SRC1[511:384], imm8[3:2]);
    TMP_DEST[479:448] := Select4(SRC2[511:384], imm8[5:4]);
    TMP_DEST[511:480] := Select4(SRC2[511:384], imm8[7:6]);
FI;
FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*


          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*         ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPSHUFPS (EVEX Encoded Versions When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

TMP_DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);

TMP_DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);

TMP_DEST[95:64] := Select4(TMP_SRC2[127:0], imm8[5:4]);

TMP_DEST[127:96] := Select4(TMP_SRC2[127:0], imm8[7:6]);

IF VL >= 256

     TMP_DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);

     TMP_DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);

     TMP_DEST[223:192] := Select4(TMP_SRC2[255:128], imm8[5:4]);

     TMP_DEST[255:224] := Select4(TMP_SRC2[255:128], imm8[7:6]);

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(SRC1[383:256], imm8[1:0]);

     TMP_DEST[319:288] := Select4(SRC1[383:256], imm8[3:2]);

     TMP_DEST[351:320] := Select4(TMP_SRC2[383:256], imm8[5:4]);

     TMP_DEST[383:352] := Select4(TMP_SRC2[383:256], imm8[7:6]);

     TMP_DEST[415:384] := Select4(SRC1[511:384], imm8[1:0]);

     TMP_DEST[447:416] := Select4(SRC1[511:384], imm8[3:2]);

     TMP_DEST[479:448] := Select4(TMP_SRC2[511:384], imm8[5:4]);

     TMP_DEST[511:480] := Select4(TMP_SRC2[511:384], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*         ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VSHUFPS (VEX.256 Encoded Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
DEST[223:192] := Select4(SRC2[255:128], imm8[5:4]);
DEST[255:224] := Select4(SRC2[255:128], imm8[7:6]);
DEST[MAXVL-1:256] := 0

VSHUFPS (VEX.128 Encoded Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[MAXVL-1:128] := 0

SHUFPS (128-bit Legacy SSE Version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC2[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC2[127:0], imm8[7:6]);
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VSHUFPS __m512 _mm512_shuffle_ps(__m512 a, __m512 b, int imm);
VSHUFPS __m512 _mm512_mask_shuffle_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFPS __m512 _mm512_maskz_shuffle_ps(__mmask16 k, __m512 a, __m512 b, int imm);
VSHUFPS __m256 _mm256_shuffle_ps (__m256 a, __m256 b, const int select);
VSHUFPS __m256 _mm256_mask_shuffle_ps(__m256 s, __mmask8 k, __m256 a, __m256 b, int imm);
VSHUFPS __m256 _mm256_maskz_shuffle_ps(__mmask8 k, __m256 a, __m256 b, int imm);
SHUFPS __m128 _mm_shuffle_ps (__m128 a, __m128 b, const int select);
VSHUFPS __m128 _mm_mask_shuffle_ps(__m128 s, __mmask8 k, __m128 a, __m128 b, int imm);
VSHUFPS __m128 _mm_maskz_shuffle_ps(__mmask8 k, __m128 a, __m128 b, int imm);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".
