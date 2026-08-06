---
summary: 可变位右移算术
---

## 说明

将 第一源操作数(第二个操作数)中单个数据元素中的位数(word/doublewords/quadwords)按第二源操作数(第三个操作数)中相应数据元素的计数值中指定的位数向右移动. 随着数据元素中的位移右转,空高序位设为MSB(签名扩展).

计数值在 第二源操作数 的每个数据元素中分别指定. 如果第二源操作数的相应数据元素中指定的无符号整数值大于15(对于单词),31(对于双词),或63(对于一个四词),则目的地数据元素以源元素的相应符号位填充.

VEX.128 编码版本 : 目的地和第一个源操作数是XMM登记册. 计数操作数可以是XMM的寄存器,也可以是128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256 编码版本 : 目的地和第一个源操作数是YMM登记册. 计数操作数可以是YMM寄存器,也可以是256位内存. 对应目的地的比特(MAXVL-1:256)注册被清零.

EVEX.512/256/128编码为VPSRAVD/W: 目的地和第一个源操作数是ZMM/YMM/XMM登记册. 操作数的计数可以是ZMM/YMM/XMM的计数器,512/256/128位内存位置的计数器或512/256/128位向量器,通过32/64位内存位置的计数器广播. 目的地以写掩码 k1有条件更新.

EVEX.512/256/128 编码为 VPSRAVQ: 目的地和第一个源操作数是ZMM/YMM/XMM登记册. 操作数的计数可以是ZMM/YMM/XMM的计数器,即512/256/128位的内存位置. 目的地以写掩码 k1有条件更新.

## 行动

```text
VPSRAVW (EVEX encoded version)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             COUNT := SRC2[i+3:i]

             IF COUNT < 16

                 THEN DEST[i+15:i] := SignExtend(SRC1[i+15:i] >> COUNT)

                 ELSE

                    FOR k := 0 TO 15

                        DEST[i+k] := SRC1[i+15]

                    ENDFOR;

             FI

     ELSE

             IF *merging-masking*      ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSRAVD (VEX.128 version)
COUNT_0 := SRC2[31 : 0]

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[127 : 96];
DEST[31:0] := SignExtend(SRC1[31:0] >> COUNT_0);


    (* Repeat shift operation for 2nd through 4th dwords *)
DEST[127:96] := SignExtend(SRC1[127:96] >> COUNT_3);
DEST[MAXVL-1:128] := 0;

VPSRAVD (VEX.256 version)
COUNT_0 := SRC2[31 : 0];

    (* Repeat Each COUNT_i for the 2nd through 8th dwords of SRC2*)
COUNT_7 := SRC2[255 : 224];
DEST[31:0] := SignExtend(SRC1[31:0] >> COUNT_0);

    (* Repeat shift operation for 2nd through 7th dwords *)
DEST[255:224] := SignExtend(SRC1[255:224] >> COUNT_7);
DEST[MAXVL-1:256] := 0;

VPSRAVD (EVEX encoded version)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    COUNT := SRC2[4:0]

                    IF COUNT < 32

                        THEN DEST[i+31:i] := SignExtend(SRC1[i+31:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 31

                                   DEST[i+k] := SRC1[i+31]

                           ENDFOR;

                    FI

                  ELSE

                    COUNT := SRC2[i+4:i]

                    IF COUNT < 32

                        THEN DEST[i+31:i] := SignExtend(SRC1[i+31:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 31

                                   DEST[i+k] := SRC1[i+31]

                           ENDFOR;

                    FI

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[31:0] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSRAVQ (EVEX encoded version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1) AND (SRC2 *is memory*)


              THEN

               COUNT := SRC2[5:0]

               IF COUNT < 64

                        THEN DEST[i+63:i] := SignExtend(SRC1[i+63:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 63

                               DEST[i+k] := SRC1[i+63]

                           ENDFOR;

               FI

              ELSE

               COUNT := SRC2[i+5:i]

               IF COUNT < 64

                        THEN DEST[i+63:i] := SignExtend(SRC1[i+63:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 63

                               DEST[i+k] := SRC1[i+63]

                           ENDFOR;

               FI

         FI;

ELSE

     IF *merging-masking*            ; merging-masking

         THEN *DEST[63:0] remains unchanged*

         ELSE                        ; zeroing-masking

              DEST[63:0] := 0

         FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VPSRAVD __m512i _mm512_srav_epi32(__m512i a, __m512i cnt);
VPSRAVD __m512i _mm512_mask_srav_epi32(__m512i s, __mmask16 m, __m512i a, __m512i cnt);
VPSRAVD __m512i _mm512_maskz_srav_epi32(__mmask16 m, __m512i a, __m512i cnt);
VPSRAVD __m256i _mm256_srav_epi32(__m256i a, __m256i cnt);
VPSRAVD __m256i _mm256_mask_srav_epi32(__m256i s, __mmask8 m, __m256i a, __m256i cnt);
VPSRAVD __m256i _mm256_maskz_srav_epi32(__mmask8 m, __m256i a, __m256i cnt);
VPSRAVD __m128i _mm_srav_epi32(__m128i a, __m128i cnt);
VPSRAVD __m128i _mm_mask_srav_epi32(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVD __m128i _mm_maskz_srav_epi32(__mmask8 m, __m128i a, __m128i cnt);
VPSRAVQ __m512i _mm512_srav_epi64(__m512i a, __m512i cnt);
VPSRAVQ __m512i _mm512_mask_srav_epi64(__m512i s, __mmask8 m, __m512i a, __m512i cnt);
VPSRAVQ __m512i _mm512_maskz_srav_epi64( __mmask8 m, __m512i a, __m512i cnt);
VPSRAVQ __m256i _mm256_srav_epi64(__m256i a, __m256i cnt);
VPSRAVQ __m256i _mm256_mask_srav_epi64(__m256i s, __mmask8 m, __m256i a, __m256i cnt);
VPSRAVQ __m256i _mm256_maskz_srav_epi64( __mmask8 m, __m256i a, __m256i cnt);
VPSRAVQ __m128i _mm_srav_epi64(__m128i a, __m128i cnt);
VPSRAVQ __m128i _mm_mask_srav_epi64(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVQ __m128i _mm_maskz_srav_epi64( __mmask8 m, __m128i a, __m128i cnt);
VPSRAVW __m512i _mm512_srav_epi16(__m512i a, __m512i cnt);
VPSRAVW __m512i _mm512_mask_srav_epi16(__m512i s, __mmask32 m, __m512i a, __m512i cnt);
VPSRAVW __m512i _mm512_maskz_srav_epi16(__mmask32 m, __m512i a, __m512i cnt);
VPSRAVW __m256i _mm256_srav_epi16(__m256i a, __m256i cnt);
VPSRAVW __m256i _mm256_mask_srav_epi16(__m256i s, __mmask16 m, __m256i a, __m256i cnt);
VPSRAVW __m256i _mm256_maskz_srav_epi16(__mmask16 m, __m256i a, __m256i cnt);
VPSRAVW __m128i _mm_srav_epi16(__m128i a, __m128i cnt);
VPSRAVW __m128i _mm_mask_srav_epi16(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVW __m128i _mm_maskz_srav_epi32(__mmask8 m, __m128i a, __m128i cnt);
VPSRAVD __m256i _mm256_srav_epi32 (__m256i m, __m256i count);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
