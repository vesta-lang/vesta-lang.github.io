---
summary: 乘并添加已签名和未签名字节
---

## 说明

(V)PMADDUBSW垂直地将目标操作数(第一个操作数)的每个未签名字节与源操作数(第二个操作数)的相应签名字节相乘,生成中间体签名16位整数. 每个相邻的一对签名单词被添加,饱和结果被包装到目标操作数上. 例如,源代码和目标操作数中的最低顺序字节(bits 7-0)被乘以,中间签名的单词结果与操作数中第2位最低顺序字节(bits 15-8)的相应中间结果一起加入;符号饱和结果存储在目的地寄存器(15-0)的最低单词中. 同一操作在相邻的字节的其他对上进行. 操作数既可以是MMX注册,也可以是XMM注册. 当源操作数是128位的内存操作数时,操作数必须在16字节边界或一般保护例外(#GP)上对齐.

在64位模式中,不使用VEX/EVEX编码,使用REX前缀访问XMM8-XMM15.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册保持不变.

VEX.128和EVEX.128编码版本: 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256和EVEX.256编码版本: 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 第一个来源和目标操作数是YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX.512 编码版本 : 第二源操作数可以是ZMM寄存器或512位内存位置. 第一个来源和目标操作数是ZMM登记册.

## 行动

```text
PMADDUBSW (With 64-bit Operands)
    DEST[15-0] = SaturateToSignedWord(SRC[15-8]*DEST[15-8]+SRC[7-0]*DEST[7-0]);
    DEST[31-16] = SaturateToSignedWord(SRC[31-24]*DEST[31-24]+SRC[23-16]*DEST[23-16]);
    DEST[47-32] = SaturateToSignedWord(SRC[47-40]*DEST[47-40]+SRC[39-32]*DEST[39-32]);
    DEST[63-48] = SaturateToSignedWord(SRC[63-56]*DEST[63-56]+SRC[55-48]*DEST[55-48]);

PMADDUBSW (With 128-bit Operands)
    DEST[15-0] = SaturateToSignedWord(SRC[15-8]* DEST[15-8]+SRC[7-0]*DEST[7-0]);
    // Repeat operation for 2nd through 7th word
    SRC1/DEST[127-112] = SaturateToSignedWord(SRC[127-120]*DEST[127-120]+ SRC[119-112]* DEST[119-112]);

VPMADDUBSW (VEX.128 Encoded Version)
DEST[15:0] := SaturateToSignedWord(SRC2[15:8]* SRC1[15:8]+SRC2[7:0]*SRC1[7:0])
// Repeat operation for 2nd through 7th word
DEST[127:112] := SaturateToSignedWord(SRC2[127:120]*SRC1[127:120]+ SRC2[119:112]* SRC1[119:112])
DEST[MAXVL-1:128] := 0

VPMADDUBSW (VEX.256 Encoded Version)
DEST[15:0] := SaturateToSignedWord(SRC2[15:8]* SRC1[15:8]+SRC2[7:0]*SRC1[7:0])
// Repeat operation for 2nd through 15th word
DEST[255:240] := SaturateToSignedWord(SRC2[255:248]*SRC1[255:248]+ SRC2[247:240]* SRC1[247:240])
DEST[MAXVL-1:256] := 0

VPMADDUBSW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToSignedWord(SRC2[i+15:i+8]* SRC1[i+15:i+8] + SRC2[i+7:i]*SRC1[i+7:i])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*    ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPMADDUBSW __m512i _mm512_maddubs_epi16( __m512i a, __m512i b);
VPMADDUBSW __m512i _mm512_mask_maddubs_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMADDUBSW __m512i _mm512_maskz_maddubs_epi16( __mmask32 k, __m512i a, __m512i b);
VPMADDUBSW __m256i _mm256_mask_maddubs_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMADDUBSW __m256i _mm256_maskz_maddubs_epi16( __mmask16 k, __m256i a, __m256i b);
VPMADDUBSW __m128i _mm_mask_maddubs_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMADDUBSW __m128i _mm_maskz_maddubs_epi16( __mmask8 k, __m128i a, __m128i b);
PMADDUBSW __m64 _mm_maddubs_pi16 (__m64 a, __m64 b) (V)PMADDUBSW __m128i _mm_maddubs_epi16 (__m128i a, __m128i b) VPMADDUBSW __m256i _mm256_maddubs_epi16 (__m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-编码指令,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
