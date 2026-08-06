---
summary: 存储 Sparse 包装字节/ Word 整数值
---

## 说明

根据写掩码 操作数确定的活性元素,从源操作数(第二座操作数)到目标操作数(第一座操作数)压缩最高64字节值或32字节值. 说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

从 源操作数(第二个 操作数) 移动到 目标操作数(第一个 操作数) , 最多为 512 位 。 本规范用于使用操作数 写掩码中的活性元素,将矢量寄存器部分内容存储到字节矢量或单内存位置中.

内存目标版本 : 只有毗连的矢量被写入目的地内存位置. EVEX.z必须是0.

注册目标版本 : 如果毗连矢量的矢量长度小于源操作数中的输入矢量,则如果EVEX.z没有设置,则目的地寄存器的上位不修改,否则上位的被清零.

本指令支持内存断层抑制.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VPCOMPRESSB store form
(KL, VL) = (16, 128), (32, 256), (64, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.byte[k] := SRC.byte[j]
          k := k +1

VPCOMPRESSB reg-reg form
(KL, VL) = (16, 128), (32, 256), (64, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.byte[k] := SRC.byte[j]
          k := k + 1

IF *merging-masking*:
    *DEST[VL-1:k*8] remains unchanged*
    ELSE DEST[VL-1:k*8] := 0

DEST[MAX_VL-1:VL] := 0

VPCOMPRESSW store form
(KL, VL) = (8, 128), (16, 256), (32, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.word[k] := SRC.word[j]
          k := k + 1


VPCOMPRESSW reg-reg form
(KL, VL) = (8, 128), (16, 256), (32, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.word[k] := SRC.word[j]
          k := k + 1

IF *merging-masking*:
    *DEST[VL-1:k*16] remains unchanged*
    ELSE DEST[VL-1:k*16] := 0

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCOMPRESSB __m128i _mm_mask_compress_epi8(__m128i, __mmask16, __m128i);
VPCOMPRESSB __m128i _mm_maskz_compress_epi8(__mmask16, __m128i);
VPCOMPRESSB __m256i _mm256_mask_compress_epi8(__m256i, __mmask32, __m256i);
VPCOMPRESSB __m256i _mm256_maskz_compress_epi8(__mmask32, __m256i);
VPCOMPRESSB __m512i _mm512_mask_compress_epi8(__m512i, __mmask64, __m512i);
VPCOMPRESSB __m512i _mm512_maskz_compress_epi8(__mmask64, __m512i);
VPCOMPRESSB void _mm_mask_compressstoreu_epi8(void*, __mmask16, __m128i);
VPCOMPRESSB void _mm256_mask_compressstoreu_epi8(void*, __mmask32, __m256i);
VPCOMPRESSB void _mm512_mask_compressstoreu_epi8(void*, __mmask64, __m512i);
VPCOMPRESSW __m128i _mm_mask_compress_epi16(__m128i, __mmask8, __m128i);
VPCOMPRESSW __m128i _mm_maskz_compress_epi16(__mmask8, __m128i);
VPCOMPRESSW __m256i _mm256_mask_compress_epi16(__m256i, __mmask16, __m256i);
VPCOMPRESSW __m256i _mm256_maskz_compress_epi16(__mmask16, __m256i);
VPCOMPRESSW __m512i _mm512_mask_compress_epi16(__m512i, __mmask32, __m512i);
VPCOMPRESSW __m512i _mm512_maskz_compress_epi16(__mmask32, __m512i);
VPCOMPRESSW void _mm_mask_compressstoreu_epi16(void*, __mmask8, __m128i);
VPCOMPRESSW void _mm256_mask_compressstoreu_epi16(void*, __mmask16, __m256i);
VPCOMPRESSW void _mm512_mask_compressstoreu_epi16(void*, __mmask32, __m512i);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".
