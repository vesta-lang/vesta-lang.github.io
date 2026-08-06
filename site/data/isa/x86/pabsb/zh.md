---
summary: 包装的绝对值
---

## 说明

PABSB/W/D计算源操作数(第二个操作数)中每个数据元素的绝对值,并将UNSIGNED结果存储在目标操作数(第一个操作数)中. PABSB运行在签名字节上,PABSW运行在签名的16位词上,PABSD运行在签名的32位整数上.

EVEX编码为VPABSD/Q: 源操作数是一个ZMM/YMM/XMM的注册器,一个512/256/128位的内存位置,或者从32/64位的内存位置广播的512/256/128位矢量. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

EVEX编码为VPABSB/W: 源操作数是一个ZMM/YMM/XMM登记册,或512/256/128位内存位置. 目标操作数是一个按照写掩码更新的ZMM/YMM/XMM登记册.

VEX.256 编码版本 : 源操作数是一个YMM的寄存器或256位的内存位置. 目标操作数是一个YMM登记册. 相应的注册目的地的上位数(MAXVL-1:256)为零.

VEX.128 编码版本 : 源操作数是一个XMM的寄存器或128位的内存位置. 目标操作数是一个XMM登记册. 对应注册目的地MAXVL-1:128的上位数(MAXVL): 被清零.

128位遗产 SSE 版本 : 源操作数可以是XMM的寄存器,也可以是128位的内存位置. 目的地为XMM登记册. 对应注册目的地的上位位(VL MAX-1:128)没有修改.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
PABSB With 64-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 7th bytes
    Unsigned DEST[63:56] := ABS(SRC[63:56])

PABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 256-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 31st bytes
    Unsigned DEST[255:248] := ABS(SRC[255:248])

VPABSB (EVEX Encoded Versions)
    (KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN

            Unsigned DEST[i+7:i] := ABS(SRC[i+7:i])

     ELSE

            IF *merging-masking*                ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*                 ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 256-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 15th 16-bit words
    Unsigned DEST[255:240] := ABS(SRC[255:240])


VPABSW (EVEX Encoded Versions)
    (KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             Unsigned DEST[i+15:i] := ABS(SRC[i+15:i])

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+15:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 256-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 7th 32-bit double words
    Unsigned DEST[255:224] := ABS(SRC[255:224])

VPABSD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+31:i] := ABS(SRC[31:0])

                  ELSE

                    Unsigned DEST[i+31:i] := ABS(SRC[i+31:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;


DEST[MAXVL-1:VL] := 0

VPABSQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+63:i] := ABS(SRC[63:0])

                  ELSE

                    Unsigned DEST[i+63:i] := ABS(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPABSB__m512i _mm512_abs_epi8 ( __m512i a) VPABSW__m512i _mm512_abs_epi16 ( __m512i a) VPABSB__m512i _mm512_mask_abs_epi8 ( __m512i s, __mmask64 m, __m512i a) VPABSW__m512i _mm512_mask_abs_epi16 ( __m512i s, __mmask32 m, __m512i a) VPABSB__m512i _mm512_maskz_abs_epi8 (__mmask64 m, __m512i a) VPABSW__m512i _mm512_maskz_abs_epi16 (__mmask32 m, __m512i a) VPABSB__m256i _mm256_mask_abs_epi8 (__m256i s, __mmask32 m, __m256i a) VPABSW__m256i _mm256_mask_abs_epi16 (__m256i s, __mmask16 m, __m256i a) VPABSB__m256i _mm256_maskz_abs_epi8 (__mmask32 m, __m256i a) VPABSW__m256i _mm256_maskz_abs_epi16 (__mmask16 m, __m256i a) VPABSB__m128i _mm_mask_abs_epi8 (__m128i s, __mmask16 m, __m128i a) VPABSW__m128i _mm_mask_abs_epi16 (__m128i s, __mmask8 m, __m128i a) VPABSB__m128i _mm_maskz_abs_epi8 (__mmask16 m, __m128i a) VPABSW__m128i _mm_maskz_abs_epi16 (__mmask8 m, __m128i a) VPABSD __m256i _mm256_mask_abs_epi32(__m256i s, __mmask8 k, __m256i a);
VPABSD __m256i _mm256_maskz_abs_epi32( __mmask8 k, __m256i a);
VPABSD __m128i _mm_mask_abs_epi32(__m128i s, __mmask8 k, __m128i a);
VPABSD __m128i _mm_maskz_abs_epi32( __mmask8 k, __m128i a);
VPABSD __m512i _mm512_abs_epi32( __m512i a);
VPABSD __m512i _mm512_mask_abs_epi32(__m512i s, __mmask16 k, __m512i a);
VPABSD __m512i _mm512_maskz_abs_epi32( __mmask16 k, __m512i a);
VPABSQ __m512i _mm512_abs_epi64( __m512i a);
VPABSQ __m512i _mm512_mask_abs_epi64(__m512i s, __mmask8 k, __m512i a);
VPABSQ __m512i _mm512_maskz_abs_epi64( __mmask8 k, __m512i a);
VPABSQ __m256i _mm256_mask_abs_epi64(__m256i s, __mmask8 k, __m256i a);
VPABSQ __m256i _mm256_maskz_abs_epi64( __mmask8 k, __m256i a);
VPABSQ __m128i _mm_mask_abs_epi64(__m128i s, __mmask8 k, __m128i a);
VPABSQ __m128i _mm_maskz_abs_epi64( __mmask8 k, __m128i a);
PABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m256i _mm256_abs_epi8 (__m256i a) PABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m256i _mm256_abs_epi16 (__m256i a) PABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m256i _mm256_abs_epi32 (__m256i a);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded VPABSD/Q,参见表2-51"Type E4类例外条件".

EVEX-encoded VPABSB/W,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
