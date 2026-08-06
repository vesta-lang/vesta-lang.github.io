---
summary: 用已签名的饱和度包装
---

## 说明

将打包的签名字整数转换成打包的签名字节整数(PACKSSWB)或将打包的签名双字整数转换成打包的签名字节整数(PACKSSDW),使用饱和到句柄的溢出条件. 包装作业的例子见图4-6。

```text
                               64-Bit SRC                                 64-Bit DEST
```

```text
                                                D  C                      B      A
```

D' C' B' A' 64-Bit DEST

图4-6. 使用 64 比特 操作数 操作 PACKSSDW 指令

PACKSSWB 将第一个和第二个 源操作数 中的已包装的已签名字数整数转换为已包装的已签名字节整数,使用已签名的饱和度转换为 句柄 溢出条件,超出已签名字节整数的范围. 如果签名的字值超出一个签名字节值的范围(即大于7FH或小于80H),则7FH或80H的饱和签名字节整数分别存储在目的地. PACKSSDW在第一和第二个源操作数中将包装的签名双字整数转换成包装的签名单字整数,使用签名的饱和度转换为句柄溢出条件超出7FFFH和8000H.

EVEX 编码为 PACKSSWB : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目标操作数是一个ZMM/YMM/XMM登记册,在写掩码 k1下更新条件.

EVEX 编码为 PACKSSDW : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM的收录器,一个512/256/128位的内存位置,或者一个512/256/128位的向量从32-播放.

位式为 内存位置 。 目标操作数是一个ZMM/YMM/XMM登记册,在写掩码 k1下更新条件.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:128).

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128的上位点(ZMM注册点)则未修改目的地.

## 行动

```text
PACKSSWB Instruction (128-bit Legacy SSE Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (DEST[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (DEST[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (DEST[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (DEST[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (DEST[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (DEST[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (DEST[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (DEST[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC[127:112]);
    DEST[MAXVL-1:128] (Unmodified)

PACKSSDW Instruction (128-bit Legacy SSE Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (DEST[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (DEST[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (DEST[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (DEST[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC[127:96]);
    DEST[MAXVL-1:128] (Unmodified)


VPACKSSWB Instruction (VEX.128 Encoded Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
    DEST[MAXVL-1:128] := 0;

VPACKSSDW Instruction (VEX.128 Encoded Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC2[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC2[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC2[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC2[127:96]);
    DEST[MAXVL-1:128] := 0;

VPACKSSWB Instruction (VEX.256 Encoded Version)
    DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
    DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
    DEST[135:128] := SaturateSignedWordToSignedByte (SRC1[143:128]);
    DEST[143:136] := SaturateSignedWordToSignedByte (SRC1[159:144]);
    DEST[151:144] := SaturateSignedWordToSignedByte (SRC1[175:160]);
    DEST[159:152] := SaturateSignedWordToSignedByte (SRC1[191:176]);
    DEST[167:160] := SaturateSignedWordToSignedByte (SRC1[207:192]);
    DEST[175:168] := SaturateSignedWordToSignedByte (SRC1[223:208]);
    DEST[183:176] := SaturateSignedWordToSignedByte (SRC1[239:224]);


    DEST[191:184] := SaturateSignedWordToSignedByte (SRC1[255:240]);
    DEST[199:192] := SaturateSignedWordToSignedByte (SRC2[143:128]);
    DEST[207:200] := SaturateSignedWordToSignedByte (SRC2[159:144]);
    DEST[215:208] := SaturateSignedWordToSignedByte (SRC2[175:160]);
    DEST[223:216] := SaturateSignedWordToSignedByte (SRC2[191:176]);
    DEST[231:224] := SaturateSignedWordToSignedByte (SRC2[207:192]);
    DEST[239:232] := SaturateSignedWordToSignedByte (SRC2[223:208]);
    DEST[247:240] := SaturateSignedWordToSignedByte (SRC2[239:224]);
    DEST[255:248] := SaturateSignedWordToSignedByte (SRC2[255:240]);
    DEST[MAXVL-1:256] := 0;

VPACKSSDW Instruction (VEX.256 Encoded Version)
    DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
    DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
    DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
    DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
    DEST[79:64] := SaturateSignedDwordToSignedWord (SRC2[31:0]);
    DEST[95:80] := SaturateSignedDwordToSignedWord (SRC2[63:32]);
    DEST[111:96] := SaturateSignedDwordToSignedWord (SRC2[95:64]);
    DEST[127:112] := SaturateSignedDwordToSignedWord (SRC2[127:96]);
    DEST[143:128] := SaturateSignedDwordToSignedWord (SRC1[159:128]);
    DEST[159:144] := SaturateSignedDwordToSignedWord (SRC1[191:160]);
    DEST[175:160] := SaturateSignedDwordToSignedWord (SRC1[223:192]);
    DEST[191:176] := SaturateSignedDwordToSignedWord (SRC1[255:224]);
    DEST[207:192] := SaturateSignedDwordToSignedWord (SRC2[159:128]);
    DEST[223:208] := SaturateSignedDwordToSignedWord (SRC2[191:160]);
    DEST[239:224] := SaturateSignedDwordToSignedWord (SRC2[223:192]);
    DEST[255:240] := SaturateSignedDwordToSignedWord (SRC2[255:224]);
    DEST[MAXVL-1:256] := 0;

VPACKSSWB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
TMP_DEST[7:0] := SaturateSignedWordToSignedByte (SRC1[15:0]);
TMP_DEST[15:8] := SaturateSignedWordToSignedByte (SRC1[31:16]);
TMP_DEST[23:16] := SaturateSignedWordToSignedByte (SRC1[47:32]);
TMP_DEST[31:24] := SaturateSignedWordToSignedByte (SRC1[63:48]);
TMP_DEST[39:32] := SaturateSignedWordToSignedByte (SRC1[79:64]);
TMP_DEST[47:40] := SaturateSignedWordToSignedByte (SRC1[95:80]);
TMP_DEST[55:48] := SaturateSignedWordToSignedByte (SRC1[111:96]);
TMP_DEST[63:56] := SaturateSignedWordToSignedByte (SRC1[127:112]);
TMP_DEST[71:64] := SaturateSignedWordToSignedByte (SRC2[15:0]);
TMP_DEST[79:72] := SaturateSignedWordToSignedByte (SRC2[31:16]);
TMP_DEST[87:80] := SaturateSignedWordToSignedByte (SRC2[47:32]);
TMP_DEST[95:88] := SaturateSignedWordToSignedByte (SRC2[63:48]);
TMP_DEST[103:96] := SaturateSignedWordToSignedByte (SRC2[79:64]);
TMP_DEST[111:104] := SaturateSignedWordToSignedByte (SRC2[95:80]);
TMP_DEST[119:112] := SaturateSignedWordToSignedByte (SRC2[111:96]);
TMP_DEST[127:120] := SaturateSignedWordToSignedByte (SRC2[127:112]);
IF VL >= 256

    TMP_DEST[135:128] := SaturateSignedWordToSignedByte (SRC1[143:128]);
    TMP_DEST[143:136] := SaturateSignedWordToSignedByte (SRC1[159:144]);
    TMP_DEST[151:144] := SaturateSignedWordToSignedByte (SRC1[175:160]);
    TMP_DEST[159:152] := SaturateSignedWordToSignedByte (SRC1[191:176]);
    TMP_DEST[167:160] := SaturateSignedWordToSignedByte (SRC1[207:192]);


    TMP_DEST[175:168] := SaturateSignedWordToSignedByte (SRC1[223:208]);
    TMP_DEST[183:176] := SaturateSignedWordToSignedByte (SRC1[239:224]);
    TMP_DEST[191:184] := SaturateSignedWordToSignedByte (SRC1[255:240]);
    TMP_DEST[199:192] := SaturateSignedWordToSignedByte (SRC2[143:128]);
    TMP_DEST[207:200] := SaturateSignedWordToSignedByte (SRC2[159:144]);
    TMP_DEST[215:208] := SaturateSignedWordToSignedByte (SRC2[175:160]);
    TMP_DEST[223:216] := SaturateSignedWordToSignedByte (SRC2[191:176]);
    TMP_DEST[231:224] := SaturateSignedWordToSignedByte (SRC2[207:192]);
    TMP_DEST[239:232] := SaturateSignedWordToSignedByte (SRC2[223:208]);
    TMP_DEST[247:240] := SaturateSignedWordToSignedByte (SRC2[239:224]);
    TMP_DEST[255:248] := SaturateSignedWordToSignedByte (SRC2[255:240]);
FI;
IF VL >= 512
    TMP_DEST[263:256] := SaturateSignedWordToSignedByte (SRC1[271:256]);
    TMP_DEST[271:264] := SaturateSignedWordToSignedByte (SRC1[287:272]);
    TMP_DEST[279:272] := SaturateSignedWordToSignedByte (SRC1[303:288]);
    TMP_DEST[287:280] := SaturateSignedWordToSignedByte (SRC1[319:304]);
    TMP_DEST[295:288] := SaturateSignedWordToSignedByte (SRC1[335:320]);
    TMP_DEST[303:296] := SaturateSignedWordToSignedByte (SRC1[351:336]);
    TMP_DEST[311:304] := SaturateSignedWordToSignedByte (SRC1[367:352]);
    TMP_DEST[319:312] := SaturateSignedWordToSignedByte (SRC1[383:368]);

    TMP_DEST[327:320] := SaturateSignedWordToSignedByte (SRC2[271:256]);
    TMP_DEST[335:328] := SaturateSignedWordToSignedByte (SRC2[287:272]);
    TMP_DEST[343:336] := SaturateSignedWordToSignedByte (SRC2[303:288]);
    TMP_DEST[351:344] := SaturateSignedWordToSignedByte (SRC2[319:304]);
    TMP_DEST[359:352] := SaturateSignedWordToSignedByte (SRC2[335:320]);
    TMP_DEST[367:360] := SaturateSignedWordToSignedByte (SRC2[351:336]);
    TMP_DEST[375:368] := SaturateSignedWordToSignedByte (SRC2[367:352]);
    TMP_DEST[383:376] := SaturateSignedWordToSignedByte (SRC2[383:368]);

    TMP_DEST[391:384] := SaturateSignedWordToSignedByte (SRC1[399:384]);
    TMP_DEST[399:392] := SaturateSignedWordToSignedByte (SRC1[415:400]);
    TMP_DEST[407:400] := SaturateSignedWordToSignedByte (SRC1[431:416]);
    TMP_DEST[415:408] := SaturateSignedWordToSignedByte (SRC1[447:432]);
    TMP_DEST[423:416] := SaturateSignedWordToSignedByte (SRC1[463:448]);
    TMP_DEST[431:424] := SaturateSignedWordToSignedByte (SRC1[479:464]);
    TMP_DEST[439:432] := SaturateSignedWordToSignedByte (SRC1[495:480]);
    TMP_DEST[447:440] := SaturateSignedWordToSignedByte (SRC1[511:496]);

    TMP_DEST[455:448] := SaturateSignedWordToSignedByte (SRC2[399:384]);
    TMP_DEST[463:456] := SaturateSignedWordToSignedByte (SRC2[415:400]);
    TMP_DEST[471:464] := SaturateSignedWordToSignedByte (SRC2[431:416]);
    TMP_DEST[479:472] := SaturateSignedWordToSignedByte (SRC2[447:432]);
    TMP_DEST[487:480] := SaturateSignedWordToSignedByte (SRC2[463:448]);
    TMP_DEST[495:488] := SaturateSignedWordToSignedByte (SRC2[479:464]);
    TMP_DEST[503:496] := SaturateSignedWordToSignedByte (SRC2[495:480]);
    TMP_DEST[511:504] := SaturateSignedWordToSignedByte (SRC2[511:496]);
FI;
FOR j := 0 TO KL-1
    i := j * 8
    IF k1[j] OR *no writemask*

          THEN
                DEST[i+7:i] := TMP_DEST[i+7:i]


     ELSE

         IF *merging-masking*                     ; merging-masking

             THEN *DEST[i+7:i] remains unchanged*

             ELSE *zeroing-masking*               ; zeroing-masking

             DEST[i+7:i] := 0

         FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPACKSSDW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO ((KL/2) - 1)

    i := j * 32

    IF (EVEX.b == 1) AND (SRC2 *is memory*)
          THEN
                TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE
                TMP_SRC2[i+31:i] := SRC2[i+31:i]

    FI;
ENDFOR;

TMP_DEST[15:0] := SaturateSignedDwordToSignedWord (SRC1[31:0]);
TMP_DEST[31:16] := SaturateSignedDwordToSignedWord (SRC1[63:32]);
TMP_DEST[47:32] := SaturateSignedDwordToSignedWord (SRC1[95:64]);
TMP_DEST[63:48] := SaturateSignedDwordToSignedWord (SRC1[127:96]);
TMP_DEST[79:64] := SaturateSignedDwordToSignedWord (TMP_SRC2[31:0]);
TMP_DEST[95:80] := SaturateSignedDwordToSignedWord (TMP_SRC2[63:32]);
TMP_DEST[111:96] := SaturateSignedDwordToSignedWord (TMP_SRC2[95:64]);
TMP_DEST[127:112] := SaturateSignedDwordToSignedWord (TMP_SRC2[127:96]);
IF VL >= 256

    TMP_DEST[143:128] := SaturateSignedDwordToSignedWord (SRC1[159:128]);
    TMP_DEST[159:144] := SaturateSignedDwordToSignedWord (SRC1[191:160]);
    TMP_DEST[175:160] := SaturateSignedDwordToSignedWord (SRC1[223:192]);
    TMP_DEST[191:176] := SaturateSignedDwordToSignedWord (SRC1[255:224]);
    TMP_DEST[207:192] := SaturateSignedDwordToSignedWord (TMP_SRC2[159:128]);
    TMP_DEST[223:208] := SaturateSignedDwordToSignedWord (TMP_SRC2[191:160]);
    TMP_DEST[239:224] := SaturateSignedDwordToSignedWord (TMP_SRC2[223:192]);
    TMP_DEST[255:240] := SaturateSignedDwordToSignedWord (TMP_SRC2[255:224]);
FI;
IF VL >= 512
    TMP_DEST[271:256] := SaturateSignedDwordToSignedWord (SRC1[287:256]);
    TMP_DEST[287:272] := SaturateSignedDwordToSignedWord (SRC1[319:288]);
    TMP_DEST[303:288] := SaturateSignedDwordToSignedWord (SRC1[351:320]);
    TMP_DEST[319:304] := SaturateSignedDwordToSignedWord (SRC1[383:352]);
    TMP_DEST[335:320] := SaturateSignedDwordToSignedWord (TMP_SRC2[287:256]);
    TMP_DEST[351:336] := SaturateSignedDwordToSignedWord (TMP_SRC2[319:288]);
    TMP_DEST[367:352] := SaturateSignedDwordToSignedWord (TMP_SRC2[351:320]);
    TMP_DEST[383:368] := SaturateSignedDwordToSignedWord (TMP_SRC2[383:352]);

TMP_DEST[399:384] := SaturateSignedDwordToSignedWord (SRC1[415:384]);
TMP_DEST[415:400] := SaturateSignedDwordToSignedWord (SRC1[447:416]);
TMP_DEST[431:416] := SaturateSignedDwordToSignedWord (SRC1[479:448]);


     TMP_DEST[447:432] := SaturateSignedDwordToSignedWord (SRC1[511:480]);

     TMP_DEST[463:448] := SaturateSignedDwordToSignedWord (TMP_SRC2[415:384]);

     TMP_DEST[479:464] := SaturateSignedDwordToSignedWord (TMP_SRC2[447:416]);

     TMP_DEST[495:480] := SaturateSignedDwordToSignedWord (TMP_SRC2[479:448]);

     TMP_DEST[511:496] := SaturateSignedDwordToSignedWord (TMP_SRC2[511:480]);

FI;

FOR j := 0 TO KL-1

     i := j * 16

     IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] := TMP_DEST[i+15:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+15:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+15:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPACKSSDW__m512i _mm512_packs_epi32(__m512i m1, __m512i m2);
VPACKSSDW__m512i _mm512_mask_packs_epi32(__m512i s, __mmask32 k, __m512i m1, __m512i m2);
VPACKSSDW__m512i _mm512_maskz_packs_epi32( __mmask32 k, __m512i m1, __m512i m2);
VPACKSSDW__m256i _mm256_mask_packs_epi32( __m256i s, __mmask16 k, __m256i m1, __m256i m2);
VPACKSSDW__m256i _mm256_maskz_packs_epi32( __mmask16 k, __m256i m1, __m256i m2);
VPACKSSDW__m128i _mm_mask_packs_epi32( __m128i s, __mmask8 k, __m128i m1, __m128i m2);
VPACKSSDW__m128i _mm_maskz_packs_epi32( __mmask8 k, __m128i m1, __m128i m2);
VPACKSSWB__m512i _mm512_packs_epi16(__m512i m1, __m512i m2);
VPACKSSWB__m512i _mm512_mask_packs_epi16(__m512i s, __mmask32 k, __m512i m1, __m512i m2);
VPACKSSWB__m512i _mm512_maskz_packs_epi16( __mmask32 k, __m512i m1, __m512i m2);
VPACKSSWB__m256i _mm256_mask_packs_epi16( __m256i s, __mmask16 k, __m256i m1, __m256i m2);
VPACKSSWB__m256i _mm256_maskz_packs_epi16( __mmask16 k, __m256i m1, __m256i m2);
VPACKSSWB__m128i _mm_mask_packs_epi16( __m128i s, __mmask8 k, __m128i m1, __m128i m2);
VPACKSSWB__m128i _mm_maskz_packs_epi16( __mmask8 k, __m128i m1, __m128i m2);
PACKSSWB __m128i _mm_packs_epi16(__m128i m1, __m128i m2) PACKSSDW __m128i _mm_packs_epi32(__m128i m1, __m128i m2) VPACKSSWB __m256i _mm256_packs_epi16(__m256i m1, __m256i m2) VPACKSSDW __m256i _mm256_packs_epi32(__m256i m1, __m256i m2);
```

## SIMD 浮点 例外

None.

## 其他例外

无EVEX-编码指令,见表2-21,"第4类例外条件"。EVEX- 编码VPACKSSDW,见表2-52,"TypeE4NF阶级例外条件".EVEX- 编码VPACKSSWB类型E4NF.nb表2-52中的"类型"E4NF阶级例外条件".
