---
summary: 存储已包装的四字形整数值
---

## 说明

从源操作数(第二个操作数)到目标操作数(第一个操作数)的压缩(存储)最高可达8/4/2的四字整数. 源操作数是一个ZMM/YMM/XMM登记册,目标操作数可以是ZMM/YMM/XMM登记册或512/256/128-bit 内存位置.

Opmask 寄存器 k1 从 源操作数 中选择活性元素(部分矢量或如果少于 8 个活性元素则可能不相干),以压缩成一个毗连的矢量. 毗连矢量从目标操作数的低元素开始写到目的地.

内存目标版本 : 只有毗连的矢量被写入目的地内存位置. EVEX.z必须是0.

注册目标版本 : 如果毗连矢量的矢量长度小于源操作数中的输入矢量,则如果EVEX.z没有设置,则目的地寄存器的上位不修改,否则上位的被清零.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VPCOMPRESSQ (EVEX encoded versions) store form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no controlmask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+63:i]
                k := k + SIZE

    FI;

ENFOR

VPCOMPRESSQ (EVEX encoded versions) reg-reg form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no controlmask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+63:i]
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
VPCOMPRESSQ __m512i _mm512_mask_compress_epi64(__m512i s, __mmask8 c, __m512i a);
VPCOMPRESSQ __m512i _mm512_maskz_compress_epi64( __mmask8 c, __m512i a);
VPCOMPRESSQ void _mm512_mask_compressstoreu_epi64(void * a, __mmask8 c, __m512i s);
VPCOMPRESSQ __m256i _mm256_mask_compress_epi64(__m256i s, __mmask8 c, __m256i a);
VPCOMPRESSQ __m256i _mm256_maskz_compress_epi64( __mmask8 c, __m256i a);
VPCOMPRESSQ void _mm256_mask_compressstoreu_epi64(void * a, __mmask8 c, __m256i s);
VPCOMPRESSQ __m128i _mm_mask_compress_epi64(__m128i s, __mmask8 c, __m128i a);
VPCOMPRESSQ __m128i _mm_maskz_compress_epi64( __mmask8 c, __m128i a);
VPCOMPRESSQ void _mm_mask_compressstoreu_epi64(void * a, __mmask8 c, __m128i s);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".
