---
summary: 用无符号饱和度添加包装的 无符号整数
---

## 说明

执行SIMD从源操作数(第二位操作数)和目标操作数(第一位操作数)中添加的包装的无符号整数,并将包装的整数结果存储在目标操作数中. 参见Intel(R)64和IA-32 Architectures Software开发者手册第1卷图9-4中的SIMD操作的插图. 如以下各段所述,处理过度流量时未加标记的饱和度。

(V)PADDUSB在第一源操作数和第二源操作数的饱和度下,执行SIMD加载的无符号整数,并将包装整数结果存储在目标操作数中. 当单个字节结果超出一个无符号字节整数的范围(即大于FFH)时,FFH的饱和值会被写成目标操作数.

(V)PADDUSW执行一个SIMD 加装了来自第一源操作数和第二源操作数饱和的无符号单词整数,并将所装的整数结果存储在目标操作数. 当单个单词结果超出一个无符号单词整数的范围(即大于FFFFH)时,FFFFH的饱和值会被写入目标操作数.

EVEX 编码版本 : 第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM的登记册或512/256/128位内存位置. 目的地为ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

VEX.128 编码版本 : 第一源操作数是一个XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应目的地的上位(MAXVL-1:128)注册目的地被清零.

128位遗产 SSE 版本 : 第一源操作数是一个XMM登记册. 第二个操作数可以是XMM寄存器或128位内存位置. 目的地与第一个来源的XMM寄存器没有区别,对应寄存器目的地的上位(MAXVL-1:128)没有修改.

## 行动

```text
PADDUSB (With 64-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte(DEST[7:0] + SRC (7:0] );
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToUnsignedByte(DEST[63:56] + SRC[63:56]

PADDUSB (With 128-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] + SRC[7:0]);
    (* Repeat add operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToUnSignedByte (DEST[127:120] + SRC[127:120]);

VPADDUSB (VEX.128 Encoded Version)
    DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat subtract operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToUnsignedByte (SRC1[111:120] + SRC2[127:120]);
    DEST[MAXVL-1:128] := 0


VPADDUSB (VEX.256 Encoded Version)
    DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat add operation for 2nd through 31st bytes *)
    DEST[255:248] := SaturateToUnsignedByte (SRC1[255:248] + SRC2[255:248]);

PADDUSW (With 64-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord(DEST[15:0] + SRC[15:0] );
    (* Repeat add operation for 2nd and 3rd words *)
    DEST[63:48] := SaturateToUnsignedWord(DEST[63:48] + SRC[63:48] );

PADDUSW (With 128-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] + SRC[15:0]);
    (* Repeat add operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToUnSignedWord (DEST[127:112] + SRC[127:112]);

VPADDUSW (VEX.128 Encoded Version)
    DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat subtract operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToUnsignedWord (SRC1[127:112] + SRC2[127:112]);
    DEST[MAXVL-1:128] := 0

VPADDUSW (VEX.256 Encoded Version)
    DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat add operation for 2nd through 15th words *)
    DEST[255:240] := SaturateToUnsignedWord (SRC1[255:240] + SRC2[255:240])

VPADDUSB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToUnsignedByte (SRC1[i+7:i] + SRC2[i+7:i])

     ELSE

            IF *merging-masking*            ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPADDUSW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToUnsignedWord (SRC1[i+15:i] + SRC2[i+15:i])

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
PADDUSB __m64 _mm_adds_pu8(__m64 m1, __m64 m2) PADDUSW __m64 _mm_adds_pu16(__m64 m1, __m64 m2) (V)PADDUSB __m128i _mm_adds_epu8 ( __m128i a, __m128i b) (V)PADDUSW __m128i _mm_adds_epu16 ( __m128i a, __m128i b) VPADDUSB __m256i _mm256_adds_epu8 ( __m256i a, __m256i b) VPADDUSW __m256i _mm256_adds_epu16 ( __m256i a, __m256i b) VPADDUSB __m512i _mm512_adds_epu8 ( __m512i a, __m512i b) VPADDUSW __m512i _mm512_adds_epu16 ( __m512i a, __m512i b) VPADDUSB __m512i _mm512_mask_adds_epu8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDUSW __m512i _mm512_mask_adds_epu16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDUSB __m512i _mm512_maskz_adds_epu8 (__mmask64 m, __m512i a, __m512i b) VPADDUSW __m512i _mm512_maskz_adds_epu16 (__mmask32 m, __m512i a, __m512i b) VPADDUSB __m256i _mm256_mask_adds_epu8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDUSW __m256i _mm256_mask_adds_epu16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDUSB __m256i _mm256_maskz_adds_epu8 (__mmask32 m, __m256i a, __m256i b) VPADDUSW __m256i _mm256_maskz_adds_epu16 (__mmask16 m, __m256i a, __m256i b) VPADDUSB __m128i _mm_mask_adds_epu8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDUSW __m128i _mm_mask_adds_epu16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDUSB __m128i _mm_maskz_adds_epu8 (__mmask16 m, __m128i a, __m128i b) VPADDUSW __m128i _mm_maskz_adds_epu16 (__mmask8 m, __m128i a, __m128i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

非EVEX-encoded指令,参见表2-21"第4类例外条件". EVEX-encoded指令,参见表2-51"第E4类例外条件"中的例外类型E4.nb.
