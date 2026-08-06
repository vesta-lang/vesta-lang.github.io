---
summary: 扩展字节/字节值
---

## 说明

扩展(loads)最多64字节整数值或32字节整数值,从源操作(memory opend)到目的操作(register opend),基于writemask opend确定的活性元素.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

将128,256或512位块的包装字节整数从源操作数(内存操作数)移动到目标操作数(登记操作数). 此指令用于从 int8 向量寄存器或 内存位置 装入

,同时使用 操作数 写掩码 指出的活性元素将数据插入到目的地矢量登记册的稀疏元素中。

本指令支持内存断层抑制.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VPEXPANDB

(KL, VL) = (16, 128), (32, 256), (64, 512)

k := 0

FOR j := 0 TO KL-1:

IF k1[j] OR *no writemask*:

        DEST.byte[j] := SRC.byte[k];

        k := k + 1

        ELSE:

           IF *merging-masking*:

                    *DEST.byte[j] remains unchanged*

                    ELSE:                   ; zeroing-masking

                     DEST.byte[j] := 0

DEST[MAX_VL-1:VL] := 0

VPEXPANDW

(KL, VL) = (8,128), (16,256), (32, 512)

k := 0

FOR j := 0 TO KL-1:

IF k1[j] OR *no writemask*:

        DEST.word[j] := SRC.word[k];

        k := k + 1

        ELSE:

           IF *merging-masking*:

                    *DEST.word[j] remains unchanged*

                    ELSE:                   ; zeroing-masking

                     DEST.word[j] := 0

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPEXPAND __m128i _mm_mask_expand_epi8(__m128i, __mmask16, __m128i);
VPEXPAND __m128i _mm_maskz_expand_epi8(__mmask16, __m128i);
VPEXPAND __m128i _mm_mask_expandloadu_epi8(__m128i, __mmask16, const void*);
VPEXPAND __m128i _mm_maskz_expandloadu_epi8(__mmask16, const void*);
VPEXPAND __m256i _mm256_mask_expand_epi8(__m256i, __mmask32, __m256i);
VPEXPAND __m256i _mm256_maskz_expand_epi8(__mmask32, __m256i);
VPEXPAND __m256i _mm256_mask_expandloadu_epi8(__m256i, __mmask32, const void*);
VPEXPAND __m256i _mm256_maskz_expandloadu_epi8(__mmask32, const void*);
VPEXPAND __m512i _mm512_mask_expand_epi8(__m512i, __mmask64, __m512i);
VPEXPAND __m512i _mm512_maskz_expand_epi8(__mmask64, __m512i);
VPEXPAND __m512i _mm512_mask_expandloadu_epi8(__m512i, __mmask64, const void*);
VPEXPAND __m512i _mm512_maskz_expandloadu_epi8(__mmask64, const void*);
VPEXPANDW __m128i _mm_mask_expand_epi16(__m128i, __mmask8, __m128i);
VPEXPANDW __m128i _mm_maskz_expand_epi16(__mmask8, __m128i);
VPEXPANDW __m128i _mm_mask_expandloadu_epi16(__m128i, __mmask8, const void*);
VPEXPANDW __m128i _mm_maskz_expandloadu_epi16(__mmask8, const void *);
VPEXPANDW __m256i _mm256_mask_expand_epi16(__m256i, __mmask16, __m256i);
VPEXPANDW __m256i _mm256_maskz_expand_epi16(__mmask16, __m256i);
VPEXPANDW __m256i _mm256_mask_expandloadu_epi16(__m256i, __mmask16, const void*);
VPEXPANDW __m256i _mm256_maskz_expandloadu_epi16(__mmask16, const void*);
VPEXPANDW __m512i _mm512_mask_expand_epi16(__m512i, __mmask32, __m512i);
VPEXPANDW __m512i _mm512_maskz_expand_epi16(__mmask32, __m512i);
VPEXPANDW __m512i _mm512_mask_expandloadu_epi16(__m512i, __mmask32, const void*);
VPEXPANDW __m512i _mm512_maskz_expandloadu_epi16(__mmask32, const void*);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
