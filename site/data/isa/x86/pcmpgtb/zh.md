---
summary: 比较包装的 有符号整数 大于
---

## 说明

在目标操作数(第一个操作数)和源操作数(第二个操作数)中,执行一个SIMD签名的对打包字节,单词或双字整数的较大值进行比较. 如果目标操作数中的数据元素大于源操作数中的相应日期元素,则目标操作数中的相应数据元素设定为全部1s;否则,设定为全部0s.

PCMPGTB指令比较目的地对应的签名字节整数和源操作数;PCMPGTW指令比较目的地对应的签名字节整数和源操作数;PCMPGTD指令比较目的地对应的签名字节整数和源操作数.

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R允许此指令访问额外的注册(XMM8-XMM15).

遗产 SSE 指令 : 源操作数可以是MMX技术寄存器或64位内存位置. 目标操作数可以是MMX技术登记册.

128位遗产 SSE 版本 : 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第二源操作数可以是XMM的寄存器,也可以是128位的内存位置. 第一源操作数和目标操作数是XMM登记册. 对应的YMM注册被清零的位数(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册.

EVEX 编码为 VPCMPGTD : 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位向量从32位内存位置广播. 目标操作数(第一个操作数)是一个根据写掩码 k2更新的面具寄存器.

EVEX编码为VPCMPGTB/W: 第一源操作数(第二个操作数)是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM登记器,512/256/128位内存位置. 目标操作数(第一个操作数)是一个根据写掩码 k2更新的面具寄存器.

## 行动

```text
PCMPGTB (With 64-bit Operands)
    IF DEST[7:0] > SRC[7:0]
          THEN DEST[7:0) := FFH;
          ELSE DEST[7:0] := 0; FI;
    (* Continue comparison of 2nd through 7th bytes in DEST and SRC *)
    IF DEST[63:56] > SRC[63:56]
          THEN DEST[63:56] := FFH;
          ELSE DEST[63:56] := 0; FI;

COMPARE_BYTES_GREATER (SRC1, SRC2)
    IF SRC1[7:0] > SRC2[7:0]
    THEN DEST[7:0] := FFH;
    ELSE DEST[7:0] := 0; FI;

(* Continue comparison of 2nd through 15th bytes in SRC1 and SRC2 *)
    IF SRC1[127:120] > SRC2[127:120]
    THEN DEST[127:120] := FFH;
    ELSE DEST[127:120] := 0; FI;

COMPARE_WORDS_GREATER (SRC1, SRC2)
    IF SRC1[15:0] > SRC2[15:0]
    THEN DEST[15:0] := FFFFH;
    ELSE DEST[15:0] := 0; FI;

(* Continue comparison of 2nd through 7th 16-bit words in SRC1 and SRC2 *)
    IF SRC1[127:112] > SRC2[127:112]
    THEN DEST[127:112] := FFFFH;
    ELSE DEST[127:112] := 0; FI;

COMPARE_DWORDS_GREATER (SRC1, SRC2)
    IF SRC1[31:0] > SRC2[31:0]
    THEN DEST[31:0] := FFFFFFFFH;
    ELSE DEST[31:0] := 0; FI;

(* Continue comparison of 2nd through 3rd 32-bit dwords in SRC1 and SRC2 *)
    IF SRC1[127:96] > SRC2[127:96]
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] := 0; FI;

PCMPGTB (With 128-bit Operands)
DEST[127:0] := COMPARE_BYTES_GREATER(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)


VPCMPGTB (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_BYTES_GREATER(SRC1,SRC2)
DEST[MAXVL-1:128] := 0

VPCMPGTB (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_BYTES_GREATER(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_BYTES_GREATER(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPGTB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            /* signed comparison */

            CMP := SRC1[i+7:i] > SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                         ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

PCMPGTW (With 64-bit Operands)
    IF DEST[15:0] > SRC[15:0]
          THEN DEST[15:0] := FFFFH;
          ELSE DEST[15:0] := 0; FI;
    (* Continue comparison of 2nd and 3rd words in DEST and SRC *)
    IF DEST[63:48] > SRC[63:48]
          THEN DEST[63:48] := FFFFH;
          ELSE DEST[63:48] := 0; FI;

PCMPGTW (With 128-bit Operands)
DEST[127:0] := COMPARE_WORDS_GREATER(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

VPCMPGTW (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_WORDS_GREATER(SRC1,SRC2)
DEST[MAXVL-1:128] := 0

VPCMPGTW (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_WORDS_GREATER(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_WORDS_GREATER(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0


VPCMPGTW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k2[j] OR *no writemask*

     THEN

             /* signed comparison */

             CMP := SRC1[i+15:i] > SRC2[i+15:i];

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                     ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

PCMPGTD (With 64-bit Operands)
    IF DEST[31:0] > SRC[31:0]
          THEN DEST[31:0] := FFFFFFFFH;
          ELSE DEST[31:0] := 0; FI;
    IF DEST[63:32] > SRC[63:32]
          THEN DEST[63:32] := FFFFFFFFH;
          ELSE DEST[63:32] := 0; FI;

PCMPGTD (With 128-bit Operands)
DEST[127:0] := COMPARE_DWORDS_GREATER(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

VPCMPGTD (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_DWORDS_GREATER(SRC1,SRC2)
DEST[MAXVL-1:128] := 0

VPCMPGTD (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_DWORDS_GREATER(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_DWORDS_GREATER(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPGTD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k2[j] OR *no writemask*

     THEN

             /* signed comparison */

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+31:i] > SRC2[31:0];

                  ELSE CMP := SRC1[i+31:i] > SRC2[i+31:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                     ; zeroing-masking only

FI;

ENDFOR


DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCMPGTB __mmask64 _mm512_cmpgt_epi8_mask(__m512i a, __m512i b);
VPCMPGTB __mmask64 _mm512_mask_cmpgt_epi8_mask(__mmask64 k, __m512i a, __m512i b);
VPCMPGTB __mmask32 _mm256_cmpgt_epi8_mask(__m256i a, __m256i b);
VPCMPGTB __mmask32 _mm256_mask_cmpgt_epi8_mask(__mmask32 k, __m256i a, __m256i b);
VPCMPGTB __mmask16 _mm_cmpgt_epi8_mask(__m128i a, __m128i b);
VPCMPGTB __mmask16 _mm_mask_cmpgt_epi8_mask(__mmask16 k, __m128i a, __m128i b);
VPCMPGTD __mmask16 _mm512_cmpgt_epi32_mask(__m512i a, __m512i b);
VPCMPGTD __mmask16 _mm512_mask_cmpgt_epi32_mask(__mmask16 k, __m512i a, __m512i b);
VPCMPGTD __mmask8 _mm256_cmpgt_epi32_mask(__m256i a, __m256i b);
VPCMPGTD __mmask8 _mm256_mask_cmpgt_epi32_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPGTD __mmask8 _mm_cmpgt_epi32_mask(__m128i a, __m128i b);
VPCMPGTD __mmask8 _mm_mask_cmpgt_epi32_mask(__mmask8 k, __m128i a, __m128i b);
VPCMPGTW __mmask32 _mm512_cmpgt_epi16_mask(__m512i a, __m512i b);
VPCMPGTW __mmask32 _mm512_mask_cmpgt_epi16_mask(__mmask32 k, __m512i a, __m512i b);
VPCMPGTW __mmask16 _mm256_cmpgt_epi16_mask(__m256i a, __m256i b);
VPCMPGTW __mmask16 _mm256_mask_cmpgt_epi16_mask(__mmask16 k, __m256i a, __m256i b);
VPCMPGTW __mmask8 _mm_cmpgt_epi16_mask(__m128i a, __m128i b);
VPCMPGTW __mmask8 _mm_mask_cmpgt_epi16_mask(__mmask8 k, __m128i a, __m128i b);
PCMPGTB __m64 _mm_cmpgt_pi8 (__m64 m1, __m64 m2) PCMPGTW __m64 _mm_cmpgt_pi16 (__m64 m1, __m64 m2) PCMPGTD __m64 _mm_cmpgt_pi32 (__m64 m1, __m64 m2) (V)PCMPGTB __m128i _mm_cmpgt_epi8 ( __m128i a, __m128i b) (V)PCMPGTW __m128i _mm_cmpgt_epi16 ( __m128i a, __m128i b) (V)DCMPGTD __m128i _mm_cmpgt_epi32 ( __m128i a, __m128i b) VPCMPGTB __m256i _mm256_cmpgt_epi8 ( __m256i a, __m256i b) VPCMPGTW __m256i _mm256_cmpgt_epi16 ( __m256i a, __m256i b) VPCMPGTD __m256i _mm256_cmpgt_epi32 ( __m256i a, __m256i b);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPCMPGTD,参见表2-51"Type E4类例外条件".

EVEX-encoded VPCMPGTB/W,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
