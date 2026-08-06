---
summary: 可变位左移逻辑
---

## 说明

按 第二源操作数 中相应数据元素的计数值将 第一源操作数 中单个数据元素中的位数(字,双字或四字)左移. 随着数据元素中的位位左移,空的低序位位被清除(设置为0).

计数值在 第二源操作数 的每个数据元素中分别指定. 如果 第二源操作数 的相应数据元素中指定的无符号整数值大于 15(对于单词),31(对于双词),或63(对于四词),则目的地数据元素以 0 写成.

VEX.128 编码版本 : 目的地和第一个源操作数是XMM登记册. 计数操作数可以是XMM的寄存器,也可以是128位的内存位置. 对应目的地的比特(MAXVL-1:128)注册被清零.

VEX.256 编码版本 : 目的地和第一个源操作数是YMM登记册. 计数操作数可以是YMM寄存器,也可以是256位内存. 对应的ZMM注册被清零的位数(MAXVL-1:256).

EVEX编码为VPSLLVD/Q: 目的地和第一个源操作数是ZMM/YMM/XMM登记册. 操作数的计数可以是ZMM/YMM/XMM的计数器,512/256/128位内存位置的计数器或从32/64位内存位置广播的512位矢量器. 目的地以写掩码 k1有条件更新.

EVEX 编码为 VPSLLVW : 目的地和第一个源操作数是ZMM/YMM/XMM登记册. 操作数的计数可以是ZMM/YMM/XMM的计数器,即512/256/128位的内存位置. 目的地以写掩码 k1有条件更新.

## 行动

```text
VPSLLVW (EVEX encoded version)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := ZeroExtend(SRC1[i+15:i] << SRC2[i+15:i])

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;


VPSLLVD (VEX.128 version)
COUNT_0 := SRC2[31 : 0]

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[127 : 96];
IF COUNT_0 < 32 THEN
DEST[31:0] := ZeroExtend(SRC1[31:0] << COUNT_0);
ELSE
DEST[31:0] := 0;

    (* Repeat shift operation for 2nd through 4th dwords *)
IF COUNT_3 < 32 THEN
DEST[127:96] := ZeroExtend(SRC1[127:96] << COUNT_3);
ELSE
DEST[127:96] := 0;
DEST[MAXVL-1:128] := 0;

VPSLLVD (VEX.256 version)
COUNT_0 := SRC2[31 : 0];

    (* Repeat Each COUNT_i for the 2nd through 7th dwords of SRC2*)
COUNT_7 := SRC2[255 : 224];
IF COUNT_0 < 32 THEN
DEST[31:0] := ZeroExtend(SRC1[31:0] << COUNT_0);
ELSE
DEST[31:0] := 0;

    (* Repeat shift operation for 2nd through 7th dwords *)
IF COUNT_7 < 32 THEN
DEST[255:224] := ZeroExtend(SRC1[255:224] << COUNT_7);
ELSE
DEST[255:224] := 0;
DEST[MAXVL-1:256] := 0;

VPSLLVD (EVEX encoded version)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := ZeroExtend(SRC1[i+31:i] << SRC2[31:0])

                  ELSE DEST[i+31:i] := ZeroExtend(SRC1[i+31:i] << SRC2[i+31:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;


VPSLLVQ (VEX.128 version)
COUNT_0 := SRC2[63 : 0];
COUNT_1 := SRC2[127 : 64];
IF COUNT_0 < 64THEN
DEST[63:0] := ZeroExtend(SRC1[63:0] << COUNT_0);
ELSE
DEST[63:0] := 0;
IF COUNT_1 < 64 THEN
DEST[127:64] := ZeroExtend(SRC1[127:64] << COUNT_1);
ELSE
DEST[127:96] := 0;
DEST[MAXVL-1:128] := 0;

VPSLLVQ (VEX.256 version)
COUNT_0 := SRC2[63 : 0];

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[255 : 192];
IF COUNT_0 < 64THEN
DEST[63:0] := ZeroExtend(SRC1[63:0] << COUNT_0);
ELSE
DEST[63:0] := 0;

    (* Repeat shift operation for 2nd through 4th dwords *)
IF COUNT_3 < 64 THEN
DEST[255:192] := ZeroExtend(SRC1[255:192] << COUNT_3);
ELSE
DEST[255:192] := 0;
DEST[MAXVL-1:256] := 0;

VPSLLVQ (EVEX encoded version)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := ZeroExtend(SRC1[i+63:i] << SRC2[63:0])

                  ELSE DEST[i+63:i] := ZeroExtend(SRC1[i+63:i] << SRC2[i+63:i])

             FI;

     ELSE

             IF *merging-masking*        ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                   ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VPSLLVW __m512i _mm512_sllv_epi16(__m512i a, __m512i cnt);
VPSLLVW __m512i _mm512_mask_sllv_epi16(__m512i s, __mmask32 k, __m512i a, __m512i cnt);
VPSLLVW __m512i _mm512_maskz_sllv_epi16( __mmask32 k, __m512i a, __m512i cnt);
VPSLLVW __m256i _mm256_mask_sllv_epi16(__m256i s, __mmask16 k, __m256i a, __m256i cnt);
VPSLLVW __m256i _mm256_maskz_sllv_epi16( __mmask16 k, __m256i a, __m256i cnt);
VPSLLVW __m128i _mm_mask_sllv_epi16(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLVW __m128i _mm_maskz_sllv_epi16( __mmask8 k, __m128i a, __m128i cnt);
VPSLLVD __m512i _mm512_sllv_epi32(__m512i a, __m512i cnt);
VPSLLVD __m512i _mm512_mask_sllv_epi32(__m512i s, __mmask16 k, __m512i a, __m512i cnt);
VPSLLVD __m512i _mm512_maskz_sllv_epi32( __mmask16 k, __m512i a, __m512i cnt);
VPSLLVD __m256i _mm256_mask_sllv_epi32(__m256i s, __mmask8 k, __m256i a, __m256i cnt);
VPSLLVD __m256i _mm256_maskz_sllv_epi32( __mmask8 k, __m256i a, __m256i cnt);
VPSLLVD __m128i _mm_mask_sllv_epi32(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLVD __m128i _mm_maskz_sllv_epi32( __mmask8 k, __m128i a, __m128i cnt);
VPSLLVQ __m512i _mm512_sllv_epi64(__m512i a, __m512i cnt);
VPSLLVQ __m512i _mm512_mask_sllv_epi64(__m512i s, __mmask8 k, __m512i a, __m512i cnt);
VPSLLVQ __m512i _mm512_maskz_sllv_epi64( __mmask8 k, __m512i a, __m512i cnt);
VPSLLVD __m256i _mm256_mask_sllv_epi64(__m256i s, __mmask8 k, __m256i a, __m256i cnt);
VPSLLVD __m256i _mm256_maskz_sllv_epi64( __mmask8 k, __m256i a, __m256i cnt);
VPSLLVD __m128i _mm_mask_sllv_epi64(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSLLVD __m128i _mm_maskz_sllv_epi64( __mmask8 k, __m128i a, __m128i cnt);
VPSLLVD __m256i _mm256_sllv_epi32 (__m256i m, __m256i count) VPSLLVQ __m256i _mm256_sllv_epi64 (__m256i m, __m256i count);
```

## SIMD 浮点 例外

None.

## 其他例外

VEX-encoded指令,参见表2-21"第4类例外条件".

EVEX-encoded VPSLLVD/VPSLLVQ,参见表2-51,"Type E4类例外条件".

EVEX-encoded VPSLLVW,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
