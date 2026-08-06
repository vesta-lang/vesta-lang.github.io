---
summary: 位元逻辑
---

## 说明

VPTERNLOGD/Q取3位向量长度为512位(在第一,第二,第三位操作数)作为输入数据,形成一组512指数,每个指数由每个输入向量的1位组成. Imm8字节指定了一个布尔逻辑表,为每个3位指数值产生二进制值. 最终的512位布尔结果被写入目标操作数(第一个操作数),使用写掩码 k1的颗粒性双字元素或四字元素进入目的地.

目标操作数是一个ZMM(EVEX.512)/YMM(EVEX.256)/XMM(EVEX.128)的登记册. 第一源操作数是一个ZMM/YMM/XMM登记册. 第二个源代码可是一个ZMM/YMM/XMM的寄存器,512/256/128位内存位置或512/256/128位内存位置广播的矢量. 目的地代码可是一个ZMM的寄存器,有条件的更新有writemask k1.

表5-20显示了由0xE2和0xE4直接值指定的布尔函数的两个实例,在包含3位索引所有可能值的三列之后的第四列中列出了抬头结果.

** VPTERNLOGD/Q Imm8布尔函数和输入索引值实例**

| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## 行动

```text
VPTERNLOGD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

        THEN

                FOR k := 0 TO 31

                IF (EVEX.b = 1) AND (SRC2 *is memory*)

                      THEN DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ k ]]

                      ELSE DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ i+k ]]

                FI;

                           ; table lookup of immediate bellow;

   ELSE

        IF *merging-masking*                 ; merging-masking

                THEN *DEST[31+i:i] remains unchanged*

                ELSE                         ; zeroing-masking

                DEST[31+i:i] := 0

        FI;

   FI;

ENDFOR;


DEST[MAXVL-1:VL] := 0

VPTERNLOGQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             FOR k := 0 TO 63

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ k ]]

                       ELSE DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ i+k ]]

                  FI;                    ; table lookup of immediate bellow;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[63+i:i] remains unchanged*

                  ELSE                        ; zeroing-masking

                       DEST[63+i:i] := 0

             FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPTERNLOGD __m512i _mm512_ternarylogic_epi32(__m512i a, __m512i b, int imm);
VPTERNLOGD __m512i _mm512_mask_ternarylogic_epi32(__m512i s, __mmask16 m, __m512i a, __m512i b, int imm);
VPTERNLOGD __m512i _mm512_maskz_ternarylogic_epi32(__mmask m, __m512i a, __m512i b, int imm);
VPTERNLOGD __m256i _mm256_ternarylogic_epi32(__m256i a, __m256i b, int imm);
VPTERNLOGD __m256i _mm256_mask_ternarylogic_epi32(__m256i s, __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGD __m256i _mm256_maskz_ternarylogic_epi32( __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGD __m128i _mm_ternarylogic_epi32(__m128i a, __m128i b, int imm);
VPTERNLOGD __m128i _mm_mask_ternarylogic_epi32(__m128i s, __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGD __m128i _mm_maskz_ternarylogic_epi32( __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGQ __m512i _mm512_ternarylogic_epi64(__m512i a, __m512i b, int imm);
VPTERNLOGQ __m512i _mm512_mask_ternarylogic_epi64(__m512i s, __mmask8 m, __m512i a, __m512i b, int imm);
VPTERNLOGQ __m512i _mm512_maskz_ternarylogic_epi64( __mmask8 m, __m512i a, __m512i b, int imm);
VPTERNLOGQ __m256i _mm256_ternarylogic_epi64(__m256i a, __m256i b, int imm);
VPTERNLOGQ __m256i _mm256_mask_ternarylogic_epi64(__m256i s, __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGQ __m256i _mm256_maskz_ternarylogic_epi64( __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGQ __m128i _mm_ternarylogic_epi64(__m128i a, __m128i b, int imm);
VPTERNLOGQ __m128i _mm_mask_ternarylogic_epi64(__m128i s, __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGQ __m128i _mm_maskz_ternarylogic_epi64( __mmask8 m, __m128i a, __m128i b, int imm);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
