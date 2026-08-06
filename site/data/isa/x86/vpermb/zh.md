---
summary: 永久包装字节元素
---

## 说明

根据第一源操作数(第二个操作数)中的字节指数,从第二源操作数(第三个操作数)到目标操作数(第一个操作数)的复制字节. 请注意,本指令允许将 源操作数 中的字节复制到 目标操作数 中多个位置.

只使用每个字节指数的低6(EVEX.512)/5(EVEX.256)/4(EVEX.128)位点从第二源操作数中选择源字节的位置.

第一源操作数是一个ZMM/YMM/XMM登记册. 第二源操作数可以是ZMM/YMM/XMM登记器,512/256/128位内存位置. 目标操作数是一个ZMM/YMM/XMM的寄存器,由写掩码k1按字节颗粒更新.

## 行动

```text
VPERMB (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
IF VL = 128:

    n := 3;
ELSE IF VL = 256:

    n := 4;
ELSE IF VL = 512:

    n := 5;
FI;
FOR j := 0 TO KL-1:

    id := SRC1[j*8 + n : j*8] ; // location of the source byte
    IF k1[j] OR *no writemask* THEN

          DEST[j*8 + 7: j*8] := SRC2[id*8 +7: id*8];
    ELSE IF zeroing-masking THEN

          DEST[j*8 + 7: j*8] := 0;
    *ELSE

          DEST[j*8 + 7: j*8] remains unchanged*
    FI
ENDFOR
DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ 内在编译器

```c
VPERMB __m512i _mm512_permutexvar_epi8( __m512i idx, __m512i a);
VPERMB __m512i _mm512_mask_permutexvar_epi8(__m512i s, __mmask64 k, __m512i idx, __m512i a);
VPERMB __m512i _mm512_maskz_permutexvar_epi8( __mmask64 k, __m512i idx, __m512i a);
VPERMB __m256i _mm256_permutexvar_epi8( __m256i idx, __m256i a);
VPERMB __m256i _mm256_mask_permutexvar_epi8(__m256i s, __mmask32 k, __m256i idx, __m256i a);
VPERMB __m256i _mm256_maskz_permutexvar_epi8( __mmask32 k, __m256i idx, __m256i a);
VPERMB __m128i _mm_permutexvar_epi8( __m128i idx, __m128i a);
VPERMB __m128i _mm_mask_permutexvar_epi8(__m128i s, __mmask16 k, __m128i idx, __m128i a);
VPERMB __m128i _mm_maskz_permutexvar_epi8( __mmask16 k, __m128i idx, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52中的例外类型E4NF.nb,"Type E4NF类例外条件".
