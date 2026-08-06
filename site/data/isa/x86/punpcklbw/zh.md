---
summary: 解包低数据
---

## 说明

解包和间断将目标操作数(第一个操作数)和源操作数(第二个操作数)的低序数据元素(字节,单词,双字和四字)切入目标操作数. (图4-22以64位操作数显示字节的解包操作. ). 高序数据元素被忽略.

SRC Y7 Y6 Y5 Y4 Y3 Y2 Y1 Y0                                X7 X6 X5 X4 X3 X2 X1 X0 DEST

DEST Y3 X3 Y2 X2 Y1 X1 Y0 X0

图4-22. PUNPCKLBW 指令操作 使用 64 位 操作数

255  31 0                                                  255     31 0

SRC Y7 Y6 Y5 Y4 Y3 Y2 Y1 Y0                                X7 X6 X5 X4 X3 X2 X1 X0

```text
     255                                                        0
```

DEST Y5 X5 Y4 X4 Y1 X1 Y0 X0

图4-23. 256位 VPUNPCKLDQ 指令操作

当源数据来自128位的内存操作数时,一个执行可能只获取适当的64位;然而,与16位边界的对齐和正常的段段检查仍然会被执行.

(V)PUNPCKLBW 指令互换出源的低序字节和目标操作数,(V)PUNPCKLWD 指令互换出源的低序字节和目标操作数,(V)PUNP-CKLDQ 指令互换出源的低序双字(或双字)和目标操作数,(V)PUNPCKLQDQ 指令互换出源的低序四字和目标操作数.

这些指令可以分别将字节转换为单词,单词转换为双词,双词转换为四词,四词转换为双词,将所有0s放入源操作数. 在此,如果 源操作数 包含全部 0s,结果(存储于 目标操作数) 包含 目标操作数 中原值的高序数据元素的零扩展. 例如,在(V)PUNPCKLBW指令下,高序字节为0扩展(即拆解成无符号字整数),在(V)PUNPCKLWD指令下,高序字为0扩展(未包装成无符号双字整数).

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 版本 64 位 操作数 : 源操作数可以是MMX技术寄存器或32位内存位置. 目标操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数是一个XMM的寄存器或128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 目的地YMM的位数(MAXVL-1:128)登记被清零.

VEX.256 编码版本 : 第二源操作数是一个YMM的寄存器或256位的内存位置. 第一源操作数和目标操作数是YMM登记册. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX编码为VPUNPCKLDQ/QDQ: 第二源操作数是一个ZMM/YMM/XMM的登记器,512/256/128位内存位置或512/256/128位矢量从32/64位内存位置广播. 第一个来源

操作数和目标操作数是ZMM/YMM/XMM登记册. 目的地以写掩码 k1有条件更新.

EVEX编码为VPUNPCKLWD/BW: 第二源操作数是一个ZMM/YMM/XMM登记册,一个512/256/128位的内存位置. 第一源操作数和目标操作数是ZMM/YMM/XMM登记册. 目的地以写掩码 k1有条件更新.

## 行动

```text
PUNPCKLBW Instruction With 64-bit Operands:
    DEST[63:56] := SRC[31:24];
    DEST[55:48] := DEST[31:24];
    DEST[47:40] := SRC[23:16];
    DEST[39:32] := DEST[23:16];
    DEST[31:24] := SRC[15:8];
    DEST[23:16] := DEST[15:8];
    DEST[15:8] := SRC[7:0];
    DEST[7:0] := DEST[7:0];

PUNPCKLWD Instruction With 64-bit Operands:
    DEST[63:48] := SRC[31:16];
    DEST[47:32] := DEST[31:16];
    DEST[31:16] := SRC[15:0];
    DEST[15:0] := DEST[15:0];

PUNPCKLDQ Instruction With 64-bit Operands:
    DEST[63:32] := SRC[31:0];
    DEST[31:0] := DEST[31:0];

INTERLEAVE_BYTES_512b (SRC1, SRC2)
TMP_DEST[255:0] := INTERLEAVE_BYTES_256b(SRC1[255:0], SRC[255:0])
TMP_DEST[511:256] := INTERLEAVE_BYTES_256b(SRC1[511:256], SRC[511:256])

INTERLEAVE_BYTES_256b (SRC1, SRC2)
DEST[7:0] := SRC1[7:0]
DEST[15:8] := SRC2[7:0]
DEST[23:16] := SRC1[15:8]
DEST[31:24] := SRC2[15:8]
DEST[39:32] := SRC1[23:16]
DEST[47:40] := SRC2[23:16]
DEST[55:48] := SRC1[31:24]
DEST[63:56] := SRC2[31:24]
DEST[71:64] := SRC1[39:32]
DEST[79:72] := SRC2[39:32]
DEST[87:80] := SRC1[47:40]
DEST[95:88] := SRC2[47:40]
DEST[103:96] := SRC1[55:48]
DEST[111:104] := SRC2[55:48]
DEST[119:112] := SRC1[63:56]
DEST[127:120] := SRC2[63:56]
DEST[135:128] := SRC1[135:128]
DEST[143:136] := SRC2[135:128]
DEST[151:144] := SRC1[143:136]
DEST[159:152] := SRC2[143:136]
DEST[167:160] := SRC1[151:144]
DEST[175:168] := SRC2[151:144]


DEST[183:176] := SRC1[159:152]
DEST[191:184] := SRC2[159:152]
DEST[199:192] := SRC1[167:160]
DEST[207:200] := SRC2[167:160]
DEST[215:208] := SRC1[175:168]
DEST[223:216] := SRC2[175:168]
DEST[231:224] := SRC1[183:176]
DEST[239:232] := SRC2[183:176]
DEST[247:240] := SRC1[191:184]
DEST[255:248] := SRC2[191:184]

INTERLEAVE_BYTES (SRC1, SRC2)
DEST[7:0] := SRC1[7:0]
DEST[15:8] := SRC2[7:0]
DEST[23:16] := SRC1[15:8]
DEST[31:24] := SRC2[15:8]
DEST[39:32] := SRC1[23:16]
DEST[47:40] := SRC2[23:16]
DEST[55:48] := SRC1[31:24]
DEST[63:56] := SRC2[31:24]
DEST[71:64] := SRC1[39:32]
DEST[79:72] := SRC2[39:32]
DEST[87:80] := SRC1[47:40]
DEST[95:88] := SRC2[47:40]
DEST[103:96] := SRC1[55:48]
DEST[111:104] := SRC2[55:48]
DEST[119:112] := SRC1[63:56]
DEST[127:120] := SRC2[63:56]

INTERLEAVE_WORDS_512b (SRC1, SRC2)
TMP_DEST[255:0] := INTERLEAVE_WORDS_256b(SRC1[255:0], SRC[255:0])
TMP_DEST[511:256] := INTERLEAVE_WORDS_256b(SRC1[511:256], SRC[511:256])

INTERLEAVE_WORDS_256b(SRC1, SRC2)
DEST[15:0] := SRC1[15:0]
DEST[31:16] := SRC2[15:0]
DEST[47:32] := SRC1[31:16]
DEST[63:48] := SRC2[31:16]
DEST[79:64] := SRC1[47:32]
DEST[95:80] := SRC2[47:32]
DEST[111:96] := SRC1[63:48]
DEST[127:112] := SRC2[63:48]
DEST[143:128] := SRC1[143:128]
DEST[159:144] := SRC2[143:128]
DEST[175:160] := SRC1[159:144]
DEST[191:176] := SRC2[159:144]
DEST[207:192] := SRC1[175:160]
DEST[223:208] := SRC2[175:160]
DEST[239:224] := SRC1[191:176]
DEST[255:240] := SRC2[191:176]

INTERLEAVE_WORDS (SRC1, SRC2)
DEST[15:0] := SRC1[15:0]
DEST[31:16] := SRC2[15:0]


DEST[47:32] := SRC1[31:16]
DEST[63:48] := SRC2[31:16]
DEST[79:64] := SRC1[47:32]
DEST[95:80] := SRC2[47:32]
DEST[111:96] := SRC1[63:48]
DEST[127:112] := SRC2[63:48]

INTERLEAVE_DWORDS_512b (SRC1, SRC2)
TMP_DEST[255:0] := INTERLEAVE_DWORDS_256b(SRC1[255:0], SRC2[255:0])
TMP_DEST[511:256] := INTERLEAVE_DWORDS_256b(SRC1[511:256], SRC2[511:256])

INTERLEAVE_DWORDS_256b(SRC1, SRC2)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[159:128] := SRC1[159:128]
DEST[191:160] := SRC2[159:128]
DEST[223:192] := SRC1[191:160]
DEST[255:224] := SRC2[191:160]

INTERLEAVE_DWORDS(SRC1, SRC2)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
INTERLEAVE_QWORDS_512b (SRC1, SRC2)
TMP_DEST[255:0] := INTERLEAVE_QWORDS_256b(SRC1[255:0], SRC2[255:0])
TMP_DEST[511:256] := INTERLEAVE_QWORDS_256b(SRC1[511:256], SRC2[511:256])

INTERLEAVE_QWORDS_256b(SRC1, SRC2)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]
DEST[191:128] := SRC1[191:128]
DEST[255:192] := SRC2[191:128]

INTERLEAVE_QWORDS(SRC1, SRC2)
DEST[63:0] := SRC1[63:0]
DEST[127:64] := SRC2[63:0]

PUNPCKLBW
DEST[127:0] := INTERLEAVE_BYTES(DEST, SRC)
DEST[255:127] (Unmodified)

VPUNPCKLBW (VEX.128 Encoded Instruction)
DEST[127:0] := INTERLEAVE_BYTES(SRC1, SRC2)
DEST[MAXVL-1:127] := 0

VPUNPCKLBW (VEX.256 Encoded Instruction)
DEST[255:0] := INTERLEAVE_BYTES_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0


VPUNPCKLBW (EVEX.512 Encoded Instruction)
(KL, VL) = (16, 128), (32, 256), (64, 512)
IF VL = 128

    TMP_DEST[VL-1:0] := INTERLEAVE_BYTES(SRC1[VL-1:0], SRC2[VL-1:0])
FI;
IF VL = 256

    TMP_DEST[VL-1:0] := INTERLEAVE_BYTES_256b(SRC1[VL-1:0], SRC2[VL-1:0])
FI;
IF VL = 512

    TMP_DEST[VL-1:0] := INTERLEAVE_BYTES_512b(SRC1[VL-1:0], SRC2[VL-1:0])
FI;

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := TMP_DEST[i+7:i]

     ELSE

            IF *merging-masking*             ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

DEST[511:0] := INTERLEAVE_BYTES_512b(SRC1, SRC2)

PUNPCKLWD
DEST[127:0] := INTERLEAVE_WORDS(DEST, SRC)
DEST[255:127] (Unmodified)

VPUNPCKLWD (VEX.128 Encoded Instruction)
DEST[127:0] := INTERLEAVE_WORDS(SRC1, SRC2)
DEST[MAXVL-1:127] := 0

VPUNPCKLWD (VEX.256 Encoded Instruction)
DEST[255:0] := INTERLEAVE_WORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0

VPUNPCKLWD (EVEX.512 Encoded Instruction)
(KL, VL) = (8, 128), (16, 256), (32, 512)
IF VL = 128

    TMP_DEST[VL-1:0] := INTERLEAVE_WORDS(SRC1[VL-1:0], SRC2[VL-1:0])
FI;
IF VL = 256

    TMP_DEST[VL-1:0] := INTERLEAVE_WORDS_256b(SRC1[VL-1:0], SRC2[VL-1:0])
FI;
IF VL = 512

    TMP_DEST[VL-1:0] := INTERLEAVE_WORDS_512b(SRC1[VL-1:0], SRC2[VL-1:0])
FI;

FOR j := 0 TO KL-1
    i := j * 16
    IF k1[j] OR *no writemask*


     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

DEST[511:0] := INTERLEAVE_WORDS_512b(SRC1, SRC2)

PUNPCKLDQ
DEST[127:0] := INTERLEAVE_DWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

VPUNPCKLDQ (VEX.128 Encoded Instruction)
DEST[127:0] := INTERLEAVE_DWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPUNPCKLDQ (VEX.256 Encoded Instruction)
DEST[255:0] := INTERLEAVE_DWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0

VPUNPCKLDQ (EVEX Encoded Instructions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]
    FI;
ENDFOR;
IF VL = 128
    TMP_DEST[VL-1:0] := INTERLEAVE_DWORDS(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;
IF VL = 256
    TMP_DEST[VL-1:0] := INTERLEAVE_DWORDS_256b(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;
IF VL = 512
    TMP_DEST[VL-1:0] := INTERLEAVE_DWORDS_512b(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;


ENDFOR
DEST511:0] := INTERLEAVE_DWORDS_512b(SRC1, SRC2)
DEST[MAXVL-1:VL] := 0

PUNPCKLQDQ
DEST[127:0] := INTERLEAVE_QWORDS(DEST, SRC)
DEST[MAXVL-1:128] (Unmodified)

VPUNPCKLQDQ (VEX.128 Encoded Instruction)
DEST[127:0] := INTERLEAVE_QWORDS(SRC1, SRC2)
DEST[MAXVL-1:128] := 0

VPUNPCKLQDQ (VEX.256 Encoded Instruction)
DEST[255:0] := INTERLEAVE_QWORDS_256b(SRC1, SRC2)
DEST[MAXVL-1:256] := 0

VPUNPCKLQDQ (EVEX Encoded Instructions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]
    FI;
ENDFOR;
IF VL = 128
    TMP_DEST[VL-1:0] := INTERLEAVE_QWORDS(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;
IF VL = 256
    TMP_DEST[VL-1:0] := INTERLEAVE_QWORDS_256b(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;
IF VL = 512
    TMP_DEST[VL-1:0] := INTERLEAVE_QWORDS_512b(SRC1[VL-1:0], TMP_SRC2[VL-1:0])
FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPUNPCKLBW __m512i _mm512_unpacklo_epi8(__m512i a, __m512i b);
VPUNPCKLBW __m512i _mm512_mask_unpacklo_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPUNPCKLBW __m512i _mm512_maskz_unpacklo_epi8( __mmask64 k, __m512i a, __m512i b);
VPUNPCKLBW __m256i _mm256_mask_unpacklo_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPUNPCKLBW __m256i _mm256_maskz_unpacklo_epi8( __mmask32 k, __m256i a, __m256i b);
VPUNPCKLBW __m128i _mm_mask_unpacklo_epi8(v s, __mmask16 k, __m128i a, __m128i b);
VPUNPCKLBW __m128i _mm_maskz_unpacklo_epi8( __mmask16 k, __m128i a, __m128i b);
VPUNPCKLWD __m512i _mm512_unpacklo_epi16(__m512i a, __m512i b);
VPUNPCKLWD __m512i _mm512_mask_unpacklo_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPUNPCKLWD __m512i _mm512_maskz_unpacklo_epi16( __mmask32 k, __m512i a, __m512i b);
VPUNPCKLWD __m256i _mm256_mask_unpacklo_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPUNPCKLWD __m256i _mm256_maskz_unpacklo_epi16( __mmask16 k, __m256i a, __m256i b);
VPUNPCKLWD __m128i _mm_mask_unpacklo_epi16(v s, __mmask8 k, __m128i a, __m128i b);
VPUNPCKLWD __m128i _mm_maskz_unpacklo_epi16( __mmask8 k, __m128i a, __m128i b);
VPUNPCKLDQ __m512i _mm512_unpacklo_epi32(__m512i a, __m512i b);
VPUNPCKLDQ __m512i _mm512_mask_unpacklo_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPUNPCKLDQ __m512i _mm512_maskz_unpacklo_epi32( __mmask16 k, __m512i a, __m512i b);
VPUNPCKLDQ __m256i _mm256_mask_unpacklo_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPUNPCKLDQ __m256i _mm256_maskz_unpacklo_epi32( __mmask8 k, __m256i a, __m256i b);
VPUNPCKLDQ __m128i _mm_mask_unpacklo_epi32(v s, __mmask8 k, __m128i a, __m128i b);
VPUNPCKLDQ __m128i _mm_maskz_unpacklo_epi32( __mmask8 k, __m128i a, __m128i b);
VPUNPCKLQDQ __m512i _mm512_unpacklo_epi64(__m512i a, __m512i b);
VPUNPCKLQDQ __m512i _mm512_mask_unpacklo_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPUNPCKLQDQ __m512i _mm512_maskz_unpacklo_epi64( __mmask8 k, __m512i a, __m512i b);
VPUNPCKLQDQ __m256i _mm256_mask_unpacklo_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPUNPCKLQDQ __m256i _mm256_maskz_unpacklo_epi64( __mmask8 k, __m256i a, __m256i b);
VPUNPCKLQDQ __m128i _mm_mask_unpacklo_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPUNPCKLQDQ __m128i _mm_maskz_unpacklo_epi64( __mmask8 k, __m128i a, __m128i b);
PUNPCKLBW __m64 _mm_unpacklo_pi8 (__m64 m1, __m64 m2) (V)PUNPCKLBW __m128i _mm_unpacklo_epi8 (__m128i m1, __m128i m2) VPUNPCKLBW __m256i _mm256_unpacklo_epi8 (__m256i m1, __m256i m2) PUNPCKLWD __m64 _mm_unpacklo_pi16 (__m64 m1, __m64 m2) (V)PUNPCKLWD __m128i _mm_unpacklo_epi16 (__m128i m1, __m128i m2) VPUNPCKLWD __m256i _mm256_unpacklo_epi16 (__m256i m1, __m256i m2) PUNPCKLDQ __m64 _mm_unpacklo_pi32 (__m64 m1, __m64 m2) (V)PUNPCKLDQ __m128i _mm_unpacklo_epi32 (__m128i m1, __m128i m2) VPUNPCKLDQ __m256i _mm256_unpacklo_epi32 (__m256i m1, __m256i m2) (V)PUNPCKLQDQ __m128i _mm_unpacklo_epi64 (__m128i m1, __m128i m2) VPUNPCKLQDQ __m256i _mm256_unpacklo_epi64 (__m256i m1, __m256i m2);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPUNPCKLDQ/QDQ,参见表2-52"Type E4NF类例外条件".

EVEX-encoded VPUNPCKLBW/WD,参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
