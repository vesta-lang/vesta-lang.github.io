---
summary: 将 无符号整数 装入未标记的饱和度减法
---

## 说明

执行 SIMD 从目标操作器(第一个操作器)的无符号整数中减去源操作器的无符号整数(第二个操作器),并将无符号整数结果存储在目标操作器中。 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图9-4中的SIMD操作的插图. 如以下各段所述,处理过度流量时未加标记的饱和度。

这些指令可以在64位或128位操作数上运行.

(V) PSUBUSB 指令减去无符号字节整数。 当单个字节结果小于零时,00H的饱和值会写入目标操作数.

(V)PSUBUSW 指令减去已打包的无符号字整数。 当单个单词结果小于零时,0000H的饱和值会被写入目标操作数.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE版本 64位 操作数: 目标操作数必须是MMX技术登记册,源操作数可以是MMX技术登记册,也可以是64位内存位置技术登记册.

128位遗产 SSE 版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX 编码版本 : 第二源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 第一源操作数和目标操作数是ZMM/YMM/XMM登记册. 目的地以写掩码 k1有条件更新.

## 行动

```text
PSUBUSB (With 64-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] - SRC (7:0] );
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToUnsignedByte (DEST[63:56] - SRC[63:56];


PSUBUSW (With 64-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] - SRC[15:0] );
    (* Repeat add operation for 2nd and 3rd words *)
    DEST[63:48] := SaturateToUnsignedWord (DEST[63:48] - SRC[63:48] );

VPSUBUSB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8;

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToUnsignedByte (SRC1[i+7:i] - SRC2[i+7:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSUBUSW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16;

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToUnsignedWord (SRC1[i+15:i] - SRC2[i+15:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSUBUSB (VEX.256 Encoded Version)
DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 31st bytes *)
DEST[255:148] := SaturateToUnsignedByte (SRC1[255:248] - SRC2[255:248]);
DEST[MAXVL-1:256] := 0;

VPSUBUSB (VEX.128 Encoded Version)
DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToUnsignedByte (SRC1[127:120] - SRC2[127:120]);
DEST[MAXVL-1:128] := 0

PSUBUSB (128-bit Legacy SSE Version)
DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] - SRC[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToUnsignedByte (DEST[127:120] - SRC[127:120]);
DEST[MAXVL-1:128] (Unmodified)


VPSUBUSW (VEX.256 Encoded Version)
DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 15th words *)
DEST[255:240] := SaturateToUnsignedWord (SRC1[255:240] - SRC2[255:240]);
DEST[MAXVL-1:256] := 0;

VPSUBUSW (VEX.128 Encoded Version)
DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToUnsignedWord (SRC1[127:112] - SRC2[127:112]);
DEST[MAXVL-1:128] := 0

PSUBUSW (128-bit Legacy SSE Version)
DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] - SRC[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToUnsignedWord (DEST[127:112] - SRC[127:112]);
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ 内在编译器

```c
VPSUBUSB __m512i _mm512_subs_epu8(__m512i a, __m512i b);
VPSUBUSB __m512i _mm512_mask_subs_epu8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSUBUSB __m512i _mm512_maskz_subs_epu8( __mmask64 k, __m512i a, __m512i b);
VPSUBUSB __m256i _mm256_mask_subs_epu8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSUBUSB __m256i _mm256_maskz_subs_epu8( __mmask32 k, __m256i a, __m256i b);
VPSUBUSB __m128i _mm_mask_subs_epu8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSUBUSB __m128i _mm_maskz_subs_epu8( __mmask16 k, __m128i a, __m128i b);
VPSUBUSW __m512i _mm512_subs_epu16(__m512i a, __m512i b);
VPSUBUSW __m512i _mm512_mask_subs_epu16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPSUBUSW __m512i _mm512_maskz_subs_epu16( __mmask32 k, __m512i a, __m512i b);
VPSUBUSW __m256i _mm256_mask_subs_epu16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPSUBUSW __m256i _mm256_maskz_subs_epu16( __mmask16 k, __m256i a, __m256i b);
VPSUBUSW __m128i _mm_mask_subs_epu16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPSUBUSW __m128i _mm_maskz_subs_epu16( __mmask8 k, __m128i a, __m128i b);
PSUBUSB __m64 _mm_subs_pu8(__m64 m1, __m64 m2) (V)PSUBUSB __m128i _mm_subs_epu8(__m128i m1, __m128i m2) VPSUBUSB __m256i _mm256_subs_epu8(__m256i m1, __m256i m2) PSUBUSW __m64 _mm_subs_pu16(__m64 m1, __m64 m2) (V)PSUBUSW __m128i _mm_subs_epu16(__m128i m1, __m128i m2) VPSUBUSW __m256i _mm256_subs_epu16(__m256i m1, __m256i m2);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21,"第4类例外条件". EVEX-encoded discription,参见表2-51,"第E4类例外条件".
