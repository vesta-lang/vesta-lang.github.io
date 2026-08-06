---
summary: 存储 Sparse 打包双精度浮点值 输入深色
---

## 说明

压缩(存储)最多8个双精度浮点值,从源操作(第二位操作)作为连接矢量到目的操作(第一位操作) 源操作是一个ZMM/YMM/XMM的寄存器,目的操作可以是ZMM/YMM/XMM寄存器或512/256/128位内存位置.

Opmask 寄存器 k1 从 源操作数 中选择活性元素(部分矢量或如果少于 8 个活性元素则可能不相干),以压缩成一个毗连的矢量. 毗连矢量从目标操作数的低元素开始写到目的地.

内存目标版本 : 只有毗连的矢量被写入目的地内存位置. EVEX.z必须是0.

注册目标版本 : 如果毗连矢量的矢量长度小于源操作数中的输入矢量,则如果EVEX.z没有设置,则目的地寄存器的上位不修改,否则上位的被清零.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VCOMPRESSPD (EVEX Encoded Versions) Store Form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+63:i]
                k := k + SIZE

    FI;

ENDFOR

VCOMPRESSPD (EVEX Encoded Versions) Reg-Reg Form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

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
VCOMPRESSPD __m512d _mm512_mask_compress_pd( __m512d s, __mmask8 k, __m512d a);
VCOMPRESSPD __m512d _mm512_maskz_compress_pd( __mmask8 k, __m512d a);
VCOMPRESSPD void _mm512_mask_compressstoreu_pd( void * d, __mmask8 k, __m512d a);
VCOMPRESSPD __m256d _mm256_mask_compress_pd( __m256d s, __mmask8 k, __m256d a);
VCOMPRESSPD __m256d _mm256_maskz_compress_pd( __mmask8 k, __m256d a);
VCOMPRESSPD void _mm256_mask_compressstoreu_pd( void * d, __mmask8 k, __m256d a);
VCOMPRESSPD __m128d _mm_mask_compress_pd( __m128d s, __mmask8 k, __m128d a);
VCOMPRESSPD __m128d _mm_maskz_compress_pd( __mmask8 k, __m128d a);
VCOMPRESSPD void _mm_mask_compressstoreu_pd( void * d, __mmask8 k, __m128d a);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4 Class Exception Centers".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
