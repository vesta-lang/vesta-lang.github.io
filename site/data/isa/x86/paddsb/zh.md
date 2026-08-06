---
summary: 用已签名的饱和度添加包装的 有符号整数
---

## 说明

执行SIMD从源操作数(第二位操作数)和目标操作数(第一位操作数)中添加的包装的有符号整数,并将包装的整数结果存储在目标操作数中. 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图9-4中的SIMD操作的插图. 如以下各段所述,通过签名饱和处理过度流量。

(V)PADDSB在第一源操作数和第二源操作数的饱和度下,执行SIMD加载的有符号整数,并将包装整数结果存储在目标操作数中. 当单个字节结果超出一个签名字节整数的范围(即大于7FH或小于80H)时,7FH或80H的饱和值分别写成目标操作数.

(V)PADDSW 执行 SIMD 添加了来自 第一源操作数 和 第二源操作数 的已装入的签名单词整数,并将已装入的整数结果存储在 目标操作数 中. 当单个单词结果超过签名单词整数的范围(即大于7FFFH或小于8000H)时,7FFFH或8000H的饱和值分别写成目标操作数.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM登记册或内存位置. 目标操作数是一个ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应注册目的地MAXVL-1:128的上位数(MAXVL): 被清零.

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
PADDSB (With 64-bit Operands)
    DEST[7:0] := SaturateToSignedByte(DEST[7:0] + SRC (7:0]);
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToSignedByte(DEST[63:56] + SRC[63:56] );

PADDSB (With 128-bit Operands)
    DEST[7:0] := SaturateToSignedByte (DEST[7:0] + SRC[7:0]);
    (* Repeat add operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToSignedByte (DEST[111:120] + SRC[127:120]);

VPADDSB (VEX.128 Encoded Version)
    DEST[7:0] := SaturateToSignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat subtract operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToSignedByte (SRC1[111:120] + SRC2[127:120]);
    DEST[MAXVL-1:128] := 0

VPADDSB (VEX.256 Encoded Version)
    DEST[7:0] := SaturateToSignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat add operation for 2nd through 31st bytes *)
    DEST[255:248] := SaturateToSignedByte (SRC1[255:248] + SRC2[255:248]);


VPADDSB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToSignedByte (SRC1[i+7:i] + SRC2[i+7:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PADDSW (with 64-bit operands)
    DEST[15:0] := SaturateToSignedWord(DEST[15:0] + SRC[15:0] );
    (* Repeat add operation for 2nd and 7th words *)
    DEST[63:48] := SaturateToSignedWord(DEST[63:48] + SRC[63:48] );

PADDSW (with 128-bit operands)
    DEST[15:0] := SaturateToSignedWord (DEST[15:0] + SRC[15:0]);
    (* Repeat add operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToSignedWord (DEST[127:112] + SRC[127:112]);

VPADDSW (VEX.128 Encoded Version)
    DEST[15:0] := SaturateToSignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat subtract operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToSignedWord (SRC1[127:112] + SRC2[127:112]);
    DEST[MAXVL-1:128] := 0

VPADDSW (VEX.256 Encoded Version)
    DEST[15:0] := SaturateToSignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat add operation for 2nd through 15th words *)
    DEST[255:240] := SaturateToSignedWord (SRC1[255:240] + SRC2[255:240])

VPADDSW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToSignedWord (SRC1[i+15:i] + SRC2[i+15:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
PADDSB __m64 _mm_adds_pi8(__m64 m1, __m64 m2) (V)PADDSB __m128i _mm_adds_epi8 ( __m128i a, __m128i b) VPADDSB __m256i _mm256_adds_epi8 ( __m256i a, __m256i b) PADDSW __m64 _mm_adds_pi16(__m64 m1, __m64 m2) (V)PADDSW __m128i _mm_adds_epi16 ( __m128i a, __m128i b) VPADDSW __m256i _mm256_adds_epi16 ( __m256i a, __m256i b) VPADDSB __m512i _mm512_adds_epi8 ( __m512i a, __m512i b) VPADDSW __m512i _mm512_adds_epi16 ( __m512i a, __m512i b) VPADDSB __m512i _mm512_mask_adds_epi8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDSW __m512i _mm512_mask_adds_epi16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDSB __m512i _mm512_maskz_adds_epi8 (__mmask64 m, __m512i a, __m512i b) VPADDSW __m512i _mm512_maskz_adds_epi16 (__mmask32 m, __m512i a, __m512i b) VPADDSB __m256i _mm256_mask_adds_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDSW __m256i _mm256_mask_adds_epi16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDSB __m256i _mm256_maskz_adds_epi8 (__mmask32 m, __m256i a, __m256i b) VPADDSW __m256i _mm256_maskz_adds_epi16 (__mmask16 m, __m256i a, __m256i b) VPADDSB __m128i _mm_mask_adds_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDSW __m128i _mm_mask_adds_epi16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDSB __m128i _mm_maskz_adds_epi8 (__mmask16 m, __m128i a, __m128i b) VPADDSW __m128i _mm_maskz_adds_epi16 (__mmask8 m, __m128i a, __m128i b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
