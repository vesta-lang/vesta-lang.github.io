---
summary: 由两个表格构成的字节全长
---

## 说明

Permutes字节值来自两个表格,包括第一个操作数(也是目标操作数)和第三个操作数(第二源操作数). 第二个操作数(第一源操作数)提供字节指数来选择两个表格的字节结果. 选定的字节元素在 写掩码 k1 下以字节颗粒形式写到目的地.

第一个和第二个操作数是ZMM/YMM/XMM登记册. 第二个操作数包含输入指数,从第1和第3个操作数的两个输入表中选择元素. 第一个操作数也是结果的目的地. 第二源操作数可以是ZMM/YMM/XMM注册,也可以是512/256/128位内存位置. 在每个索引字节中,用于表格选择的id位是比特6/5/4,比特[5:0]/[4:0]/[3:0]在每个输入表中选择元素.

注意这些指令允许将 源操作数 中的字节值复制到 目标操作数 中的多个位置. 另外,第二表和指数可以在之后的重复中重复使用,但第一张表是覆写.

目的地被清零=256,128.

## 行动

```text
VPERMT2B (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
IF VL = 128:

    id := 3;
ELSE IF VL = 256:

    id := 4;
ELSE IF VL = 512:

    id := 5;
FI;
TMP_DEST[VL-1:0] := DEST[VL-1:0];
FOR j := 0 TO KL-1

    off := 8*SRC1[j*8 + id: j*8] ;
    IF k1[j] OR *no writemask*:

          DEST[j*8 + 7: j*8] := SRC1[j*8+id+1]? SRC2[off+7:off] : TMP_DEST[off+7:off];
    ELSE IF *zeroing-masking*

          DEST[j*8 + 7: j*8] := 0;
    *ELSE

          DEST[j*8 + 7: j*8] remains unchanged*
    FI;
ENDFOR
DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VPERMT2B __m512i _mm512_permutex2var_epi8(__m512i a, __m512i idx, __m512i b);
VPERMT2B __m512i _mm512_mask_permutex2var_epi8(__m512i a, __mmask64 k, __m512i idx, __m512i b);
VPERMT2B __m512i _mm512_maskz_permutex2var_epi8(__mmask64 k, __m512i a, __m512i idx, __m512i b);
VPERMT2B __m256i _mm256_permutex2var_epi8(__m256i a, __m256i idx, __m256i b);
VPERMT2B __m256i _mm256_mask_permutex2var_epi8(__m256i a, __mmask32 k, __m256i idx, __m256i b);
VPERMT2B __m256i _mm256_maskz_permutex2var_epi8(__mmask32 k, __m256i a, __m256i idx, __m256i b);
VPERMT2B __m128i _mm_permutex2var_epi8(__m128i a, __m128i idx, __m128i b);
VPERMT2B __m128i _mm_mask_permutex2var_epi8(__m128i a, __mmask16 k, __m128i idx, __m128i b);
VPERMT2B __m128i _mm_maskz_permutex2var_epi8(__mmask16 k, __m128i a, __m128i idx, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
