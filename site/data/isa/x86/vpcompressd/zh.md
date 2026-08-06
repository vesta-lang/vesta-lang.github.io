---
summary: 存储 Sparse 包装的双字组值
---

## 说明

从源操作数(第二个操作数)到目标操作数(第一个操作数)的压缩(存储)最高为16/8/4双字整数. 源操作数是一个ZMM/YMM/XMM登记册,目标操作数可以是ZMM/YMM/XMM登记册或512/256/128-bit 内存位置.

Opmask 寄存器 k1 从 源操作数 中选择活性元素(部分矢量或如果少于 16 个活性元素则可能不相干),以压缩成一个毗连的矢量. 毗连矢量从目标操作数的低元素开始写到目的地.

内存目标版本 : 只有毗连的矢量被写入目的地内存位置. EVEX.z必须是0.

注册目标版本 : 如果毗连矢量的矢量长度小于源操作数中的输入矢量,则如果EVEX.z没有设置,则目的地寄存器的上位不修改,否则上位的被清零.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VPCOMPRESSD (EVEX encoded versions) store form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no controlmask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+31:i]
                k := k + SIZE

    FI;

ENDFOR;

VPCOMPRESSD (EVEX encoded versions) reg-reg form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no controlmask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+31:i]
                k := k + SIZE

    FI;
ENDFOR
IF *merging-masking*

            THEN *DEST[VL-1:k] remains unchanged*
            ELSE DEST[VL-1:k] := 0
FI
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPCOMPRESSD __m512i _mm512_mask_compress_epi32(__m512i s, __mmask16 c, __m512i a);
VPCOMPRESSD __m512i _mm512_maskz_compress_epi32( __mmask16 c, __m512i a);
VPCOMPRESSD void _mm512_mask_compressstoreu_epi32(void * a, __mmask16 c, __m512i s);
VPCOMPRESSD __m256i _mm256_mask_compress_epi32(__m256i s, __mmask8 c, __m256i a);
VPCOMPRESSD __m256i _mm256_maskz_compress_epi32( __mmask8 c, __m256i a);
VPCOMPRESSD void _mm256_mask_compressstoreu_epi32(void * a, __mmask8 c, __m256i s);
VPCOMPRESSD __m128i _mm_mask_compress_epi32(__m128i s, __mmask8 c, __m128i a);
VPCOMPRESSD __m128i _mm_maskz_compress_epi32( __mmask8 c, __m128i a);
VPCOMPRESSD void _mm_mask_compressstoreu_epi32(void * a, __mmask8 c, __m128i s);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
