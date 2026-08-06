---
summary: 装入未签名饱和度
---

## 说明

将 目标操作数(第一个操作数)的4,8,16,或32个签名的单词整数和源操作数(第二个操作数)的4,8,16,或32个签名的单词整数转换为8,16,32或64个未签名的字节整数,并将结果存储为目标操作数. (包装操作的示例见图4-6) 如果一个签名的单词整数值超出一个无签名的字节整数的范围(即大于FFH或小于00H),则FFH或00H的饱和无签名字节整数值分别存储在目的地.

EVEX.512 编码版本 : 第一源操作数是一个ZMM登记册. 第二源操作数是一个ZMM的寄存器或512位内存位置. 目标操作数是一个ZMM登记册.

VEX.256和EVEX.256编码版本: 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 对应的ZMM注册目的地被清零的上位(MAXVL-1:256).

VEX.128和EVEX.128编码版本: 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 相应的注册目的地被清零的上位位(MAXVL-128).

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
PACKUSWB (With 64-bit Operands)
    DEST[7:0] := SaturateSignedWordToUnsignedByte DEST[15:0];
    DEST[15:8] := SaturateSignedWordToUnsignedByte DEST[31:16];
    DEST[23:16] := SaturateSignedWordToUnsignedByte DEST[47:32];
    DEST[31:24] := SaturateSignedWordToUnsignedByte DEST[63:48];
    DEST[39:32] := SaturateSignedWordToUnsignedByte SRC[15:0];
    DEST[47:40] := SaturateSignedWordToUnsignedByte SRC[31:16];
    DEST[55:48] := SaturateSignedWordToUnsignedByte SRC[47:32];
    DEST[63:56] := SaturateSignedWordToUnsignedByte SRC[63:48];

PACKUSWB (Legacy SSE Instruction)
    DEST[7:0] := SaturateSignedWordToUnsignedByte (DEST[15:0]);
    DEST[15:8] := SaturateSignedWordToUnsignedByte (DEST[31:16]);
    DEST[23:16] := SaturateSignedWordToUnsignedByte (DEST[47:32]);
    DEST[31:24] := SaturateSignedWordToUnsignedByte (DEST[63:48]);
    DEST[39:32] := SaturateSignedWordToUnsignedByte (DEST[79:64]);
    DEST[47:40] := SaturateSignedWordToUnsignedByte (DEST[95:80]);
    DEST[55:48] := SaturateSignedWordToUnsignedByte (DEST[111:96]);
    DEST[63:56] := SaturateSignedWordToUnsignedByte (DEST[127:112]);
    DEST[71:64] := SaturateSignedWordToUnsignedByte (SRC[15:0]);
    DEST[79:72] := SaturateSignedWordToUnsignedByte (SRC[31:16]);
    DEST[87:80] := SaturateSignedWordToUnsignedByte (SRC[47:32]);
    DEST[95:88] := SaturateSignedWordToUnsignedByte (SRC[63:48]);
    DEST[103:96] := SaturateSignedWordToUnsignedByte (SRC[79:64]);
    DEST[111:104] := SaturateSignedWordToUnsignedByte (SRC[95:80]);
    DEST[119:112] := SaturateSignedWordToUnsignedByte (SRC[111:96]);
    DEST[127:120] := SaturateSignedWordToUnsignedByte (SRC[127:112]);

PACKUSWB (VEX.128 Encoded Version)
    DEST[7:0] := SaturateSignedWordToUnsignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToUnsignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToUnsignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToUnsignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToUnsignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToUnsignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToUnsignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToUnsignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToUnsignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToUnsignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToUnsignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToUnsignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToUnsignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToUnsignedByte (SRC2[95:80]);


    DEST[119:112] := SaturateSignedWordToUnsignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToUnsignedByte (SRC2[127:112]);
    DEST[MAXVL-1:128] := 0;

VPACKUSWB (VEX.256 Encoded Version)
    DEST[7:0] := SaturateSignedWordToUnsignedByte (SRC1[15:0]);
    DEST[15:8] := SaturateSignedWordToUnsignedByte (SRC1[31:16]);
    DEST[23:16] := SaturateSignedWordToUnsignedByte (SRC1[47:32]);
    DEST[31:24] := SaturateSignedWordToUnsignedByte (SRC1[63:48]);
    DEST[39:32] := SaturateSignedWordToUnsignedByte (SRC1[79:64]);
    DEST[47:40] := SaturateSignedWordToUnsignedByte (SRC1[95:80]);
    DEST[55:48] := SaturateSignedWordToUnsignedByte (SRC1[111:96]);
    DEST[63:56] := SaturateSignedWordToUnsignedByte (SRC1[127:112]);
    DEST[71:64] := SaturateSignedWordToUnsignedByte (SRC2[15:0]);
    DEST[79:72] := SaturateSignedWordToUnsignedByte (SRC2[31:16]);
    DEST[87:80] := SaturateSignedWordToUnsignedByte (SRC2[47:32]);
    DEST[95:88] := SaturateSignedWordToUnsignedByte (SRC2[63:48]);
    DEST[103:96] := SaturateSignedWordToUnsignedByte (SRC2[79:64]);
    DEST[111:104] := SaturateSignedWordToUnsignedByte (SRC2[95:80]);
    DEST[119:112] := SaturateSignedWordToUnsignedByte (SRC2[111:96]);
    DEST[127:120] := SaturateSignedWordToUnsignedByte (SRC2[127:112]);
    DEST[135:128] := SaturateSignedWordToUnsignedByte (SRC1[143:128]);
    DEST[143:136] := SaturateSignedWordToUnsignedByte (SRC1[159:144]);
    DEST[151:144] := SaturateSignedWordToUnsignedByte (SRC1[175:160]);
    DEST[159:152] := SaturateSignedWordToUnsignedByte (SRC1[191:176]);
    DEST[167:160] := SaturateSignedWordToUnsignedByte (SRC1[207:192]);
    DEST[175:168] := SaturateSignedWordToUnsignedByte (SRC1[223:208]);
    DEST[183:176] := SaturateSignedWordToUnsignedByte (SRC1[239:224]);
    DEST[191:184] := SaturateSignedWordToUnsignedByte (SRC1[255:240]);
    DEST[199:192] := SaturateSignedWordToUnsignedByte (SRC2[143:128]);
    DEST[207:200] := SaturateSignedWordToUnsignedByte (SRC2[159:144]);
    DEST[215:208] := SaturateSignedWordToUnsignedByte (SRC2[175:160]);
    DEST[223:216] := SaturateSignedWordToUnsignedByte (SRC2[191:176]);
    DEST[231:224] := SaturateSignedWordToUnsignedByte (SRC2[207:192]);
    DEST[239:232] := SaturateSignedWordToUnsignedByte (SRC2[223:208]);
    DEST[247:240] := SaturateSignedWordToUnsignedByte (SRC2[239:224]);
    DEST[255:248] := SaturateSignedWordToUnsignedByte (SRC2[255:240]);

VPACKUSWB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
TMP_DEST[7:0] := SaturateSignedWordToUnsignedByte (SRC1[15:0]);
TMP_DEST[15:8] := SaturateSignedWordToUnsignedByte (SRC1[31:16]);
TMP_DEST[23:16] := SaturateSignedWordToUnsignedByte (SRC1[47:32]);
TMP_DEST[31:24] := SaturateSignedWordToUnsignedByte (SRC1[63:48]);
TMP_DEST[39:32] := SaturateSignedWordToUnsignedByte (SRC1[79:64]);
TMP_DEST[47:40] := SaturateSignedWordToUnsignedByte (SRC1[95:80]);
TMP_DEST[55:48] := SaturateSignedWordToUnsignedByte (SRC1[111:96]);
TMP_DEST[63:56] := SaturateSignedWordToUnsignedByte (SRC1[127:112]);
TMP_DEST[71:64] := SaturateSignedWordToUnsignedByte (SRC2[15:0]);
TMP_DEST[79:72] := SaturateSignedWordToUnsignedByte (SRC2[31:16]);
TMP_DEST[87:80] := SaturateSignedWordToUnsignedByte (SRC2[47:32]);
TMP_DEST[95:88] := SaturateSignedWordToUnsignedByte (SRC2[63:48]);
TMP_DEST[103:96] := SaturateSignedWordToUnsignedByte (SRC2[79:64]);
TMP_DEST[111:104] := SaturateSignedWordToUnsignedByte (SRC2[95:80]);


TMP_DEST[119:112] := SaturateSignedWordToUnsignedByte (SRC2[111:96]);
TMP_DEST[127:120] := SaturateSignedWordToUnsignedByte (SRC2[127:112]);
IF VL >= 256

    TMP_DEST[135:128] := SaturateSignedWordToUnsignedByte (SRC1[143:128]);
    TMP_DEST[143:136] := SaturateSignedWordToUnsignedByte (SRC1[159:144]);
    TMP_DEST[151:144] := SaturateSignedWordToUnsignedByte (SRC1[175:160]);
    TMP_DEST[159:152] := SaturateSignedWordToUnsignedByte (SRC1[191:176]);
    TMP_DEST[167:160] := SaturateSignedWordToUnsignedByte (SRC1[207:192]);
    TMP_DEST[175:168] := SaturateSignedWordToUnsignedByte (SRC1[223:208]);
    TMP_DEST[183:176] := SaturateSignedWordToUnsignedByte (SRC1[239:224]);
    TMP_DEST[191:184] := SaturateSignedWordToUnsignedByte (SRC1[255:240]);
    TMP_DEST[199:192] := SaturateSignedWordToUnsignedByte (SRC2[143:128]);
    TMP_DEST[207:200] := SaturateSignedWordToUnsignedByte (SRC2[159:144]);
    TMP_DEST[215:208] := SaturateSignedWordToUnsignedByte (SRC2[175:160]);
    TMP_DEST[223:216] := SaturateSignedWordToUnsignedByte (SRC2[191:176]);
    TMP_DEST[231:224] := SaturateSignedWordToUnsignedByte (SRC2[207:192]);
    TMP_DEST[239:232] := SaturateSignedWordToUnsignedByte (SRC2[223:208]);
    TMP_DEST[247:240] := SaturateSignedWordToUnsignedByte (SRC2[239:224]);
    TMP_DEST[255:248] := SaturateSignedWordToUnsignedByte (SRC2[255:240]);
FI;
IF VL >= 512
    TMP_DEST[263:256] := SaturateSignedWordToUnsignedByte (SRC1[271:256]);
    TMP_DEST[271:264] := SaturateSignedWordToUnsignedByte (SRC1[287:272]);
    TMP_DEST[279:272] := SaturateSignedWordToUnsignedByte (SRC1[303:288]);
    TMP_DEST[287:280] := SaturateSignedWordToUnsignedByte (SRC1[319:304]);
    TMP_DEST[295:288] := SaturateSignedWordToUnsignedByte (SRC1[335:320]);
    TMP_DEST[303:296] := SaturateSignedWordToUnsignedByte (SRC1[351:336]);
    TMP_DEST[311:304] := SaturateSignedWordToUnsignedByte (SRC1[367:352]);
    TMP_DEST[319:312] := SaturateSignedWordToUnsignedByte (SRC1[383:368]);

    TMP_DEST[327:320] := SaturateSignedWordToUnsignedByte (SRC2[271:256]);
    TMP_DEST[335:328] := SaturateSignedWordToUnsignedByte (SRC2[287:272]);
    TMP_DEST[343:336] := SaturateSignedWordToUnsignedByte (SRC2[303:288]);
    TMP_DEST[351:344] := SaturateSignedWordToUnsignedByte (SRC2[319:304]);
    TMP_DEST[359:352] := SaturateSignedWordToUnsignedByte (SRC2[335:320]);
    TMP_DEST[367:360] := SaturateSignedWordToUnsignedByte (SRC2[351:336]);
    TMP_DEST[375:368] := SaturateSignedWordToUnsignedByte (SRC2[367:352]);
    TMP_DEST[383:376] := SaturateSignedWordToUnsignedByte (SRC2[383:368]);

    TMP_DEST[391:384] := SaturateSignedWordToUnsignedByte (SRC1[399:384]);
    TMP_DEST[399:392] := SaturateSignedWordToUnsignedByte (SRC1[415:400]);
    TMP_DEST[407:400] := SaturateSignedWordToUnsignedByte (SRC1[431:416]);
    TMP_DEST[415:408] := SaturateSignedWordToUnsignedByte (SRC1[447:432]);
    TMP_DEST[423:416] := SaturateSignedWordToUnsignedByte (SRC1[463:448]);
    TMP_DEST[431:424] := SaturateSignedWordToUnsignedByte (SRC1[479:464]);
    TMP_DEST[439:432] := SaturateSignedWordToUnsignedByte (SRC1[495:480]);
    TMP_DEST[447:440] := SaturateSignedWordToUnsignedByte (SRC1[511:496]);

    TMP_DEST[455:448] := SaturateSignedWordToUnsignedByte (SRC2[399:384]);
    TMP_DEST[463:456] := SaturateSignedWordToUnsignedByte (SRC2[415:400]);
    TMP_DEST[471:464] := SaturateSignedWordToUnsignedByte (SRC2[431:416]);
    TMP_DEST[479:472] := SaturateSignedWordToUnsignedByte (SRC2[447:432]);
    TMP_DEST[487:480] := SaturateSignedWordToUnsignedByte (SRC2[463:448]);
    TMP_DEST[495:488] := SaturateSignedWordToUnsignedByte (SRC2[479:464]);


     TMP_DEST[503:496] := SaturateSignedWordToUnsignedByte (SRC2[495:480]);

     TMP_DEST[511:504] := SaturateSignedWordToUnsignedByte (SRC2[511:496]);

FI;

FOR j := 0 TO KL-1

     i := j * 8

     IF k1[j] OR *no writemask*

          THEN

                 DEST[i+7:i] := TMP_DEST[i+7:i]

          ELSE

                 IF *merging-masking*            ; merging-masking

                     THEN *DEST[i+7:i] remains unchanged*

                     ELSE *zeroing-masking*      ; zeroing-masking

                     DEST[i+7:i] := 0

                 FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPACKUSWB __m512i _mm512_packus_epi16(__m512i m1, __m512i m2);
VPACKUSWB __m512i _mm512_mask_packus_epi16(__m512i s, __mmask64 k, __m512i m1, __m512i m2);
VPACKUSWB __m512i _mm512_maskz_packus_epi16(__mmask64 k, __m512i m1, __m512i m2);
VPACKUSWB __m256i _mm256_mask_packus_epi16(__m256i s, __mmask32 k, __m256i m1, __m256i m2);
VPACKUSWB __m256i _mm256_maskz_packus_epi16(__mmask32 k, __m256i m1, __m256i m2);
VPACKUSWB __m128i _mm_mask_packus_epi16(__m128i s, __mmask16 k, __m128i m1, __m128i m2);
VPACKUSWB __m128i _mm_maskz_packus_epi16(__mmask16 k, __m128i m1, __m128i m2);
PACKUSWB __m64 _mm_packs_pu16(__m64 m1, __m64 m2) (V)PACKUSWB __m128i _mm_packus_epi16(__m128i m1, __m128i m2) VPACKUSWB __m256i _mm256_packus_epi16(__m256i m1, __m256i m2);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF Class Except Convention Centers".
