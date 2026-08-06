---
summary: 在未签名字节上双块包装的和绝对偏差( SAD)
---

## 说明

计算两个32位的词元素中未签名字节的SAD(绝对差异之和)字段结果. 包装的SAD字段结果按qword超块的倍数计算,在目的地登记册的每个64位超块中产生4个SAD字段结果.

在每块包装的单词结果的超级块中,SAD来自两个32位的单词元素的结果计算如下:

* 从 SAD 操作中计算出下两个字的结果,在内部一个滑动的词元之间

来自中间向量的qword超块,在第一个源代码的对应qword超块中带有固定的dword元素. 中间向量,见图5-8中的"Tmp1",由第二源操作数的imm8字节构建为shuffle控制,用于在第二源操作数的128位车道内选择dword元素. Tmp1的Qword超块中的两个滑动的Dword元素分别位于超块内的字节偏移0和1. 第一源操作数的qword超级块中固定的dword元素位于字节偏移0.

* 从 SAD 操作中计算出下面两个单词的结果。

一个来自中间矢量 Tmp1 的 qword 超块,在 第一源操作数 的相应 qword 超块中带有第二个固定的 dword 元素. Tmp1的Qword超块的两个滑动的Dword元素分别位于超块内的字节偏移2和3. 第一源操作数的qword超级块中的固定字元位于字节偏移4处.

* 中间向量以128位的车道构建. 在每128位车道内,

中间向量由imm8字节内的一个双位字段在第二源操作数的相应128位上选择. Imm8字节在中间向量和第二源操作数的每个128位车道内充当dwordshuffle控制,类似于PSHUFD.

第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数是一个ZMM/YMM/XMM登记册,或512/256/128位内存位置. 目标操作数基于写掩码 k1在16位单词颗粒性上有条件更新.

```text
                            127+128*n                   95+128*n                    63+128*n                               31+128*n                 128*n
                                               DW3                    DW2                        DW1                                 DW0
```

128-bit Lane of Src2

```text
                                                    imm8 shuffle control                                                                  00B: DW0
```

01B: DW1

```text
                                                                             7      5            3                 10                     10B: DW2
```

11B: DW3

```text
                                127+128*n               95+128*n                    63+128*n                               31+128*n                 128*n
```

128-bit Lane of Tmp1

Tmp1 Qword 超级块

55 47 39 31 24                                                                                      39 31 23 15 8

```text
                                      Tmp1 sliding dword                                                                                 Tmp1 sliding dword
```

63 55 47 39 32                                                                                   31 23 15 7 0

```text
                                                    Src1 stationary dword 1                       ____                                    Src1 stationary dword 0
```

_                     _     _                    _                                                abs abs abs abs

abs abs abs abs

```text
                         +                          47 39 31 23 16                                                 +
```

```text
                                                                             Tmp1 sliding dword                              31 23 15 7 0
```

Tmp1 滑动词

```text
                                                    63 55 47 39 32                                                     31 23 15 7 0                          Src1 stationary dword 0
```

Src1 固定字 1      b b b

```text
                                                    +                                                                                     +
```

```text
                                             63     47                          31                                     15                    0
```

目标Qword 超级块

图5-8. 64位SAD操作的超级区块 VDBPSADBW

## 行动

```text
VDBPSADBW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
Selection of quadruplets:
FOR I = 0 to VL step 128

    TMP1[I+31:I] := select (SRC2[I+127: I], imm8[1:0])
    TMP1[I+63: I+32] := select (SRC2[I+127: I], imm8[3:2])
    TMP1[I+95: I+64] := select (SRC2[I+127: I], imm8[5:4])
    TMP1[I+127: I+96] := select (SRC2[I+127: I], imm8[7:6])
END FOR

SAD of quadruplets:

FOR I =0 to VL step 64
    TMP_DEST[I+15:I] := ABS(SRC1[I+7: I] - TMP1[I+7: I]) +
          ABS(SRC1[I+15: I+8]- TMP1[I+15: I+8]) +


     ABS(SRC1[I+23: I+16]- TMP1[I+23: I+16]) +
     ABS(SRC1[I+31: I+24]- TMP1[I+31: I+24])

TMP_DEST[I+31: I+16] := ABS(SRC1[I+7: I] - TMP1[I+15: I+8]) +
      ABS(SRC1[I+15: I+8]- TMP1[I+23: I+16]) +
      ABS(SRC1[I+23: I+16]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+31: I+24]- TMP1[I+39: I+32])

TMP_DEST[I+47: I+32] := ABS(SRC1[I+39: I+32] - TMP1[I+23: I+16]) +
      ABS(SRC1[I+47: I+40]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+55: I+48]- TMP1[I+39: I+32]) +
      ABS(SRC1[I+63: I+56]- TMP1[I+47: I+40])

    TMP_DEST[I+63: I+48] := ABS(SRC1[I+39: I+32] - TMP1[I+31: I+24]) +
          ABS(SRC1[I+47: I+40] - TMP1[I+39: I+32]) +
          ABS(SRC1[I+55: I+48] - TMP1[I+47: I+40]) +
          ABS(SRC1[I+63: I+56] - TMP1[I+55: I+48])

ENDFOR

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

        IF *merging-masking*                ; merging-masking

             THEN *DEST[i+15:i] remains unchanged*

             ELSE                           ; zeroing-masking

                    DEST[i+15:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VDBPSADBW __m512i _mm512_dbsad_epu8(__m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_mask_dbsad_epu8(__m512i s, __mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_maskz_dbsad_epu8(__mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m256i _mm256_dbsad_epu8(__m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_mask_dbsad_epu8(__m256i s, __mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_maskz_dbsad_epu8(__mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m128i _mm_dbsad_epu8(__m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_mask_dbsad_epu8(__m128i s, __mmask8 m, __m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_maskz_dbsad_epu8(__mmask8 m, __m128i a, __m128i b int imm8);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
