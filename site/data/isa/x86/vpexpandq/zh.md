---
summary: 从 Dense 内存/ 注册器装入包装的四字形整数值
---

## 说明

将源操作数(第二个操作数)的最多8个四字整数扩展为目标操作数(第一个操作数)中的稀疏元素,由写掩码 k1选择. 目标操作数是一个ZMM登记册,源操作数可以是ZMM登记册或内存位置.

输入矢量从 源操作数 中的最低元素开始. Opmask 注册 k1 选择目标元素(如果小于 8 个元素,则选择部分矢量或稀释元素),由输入矢量中的升量元素取代. 未被 写掩码 k1 选择的目标元素不是未修改就是零,这取决于 EVEX.z.

说明: EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VPEXPANDQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

        THEN

             DEST[i+63:i] := SRC[k+63:k];

             k := k + 64

        ELSE

             IF *merging-masking*              ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                          ; zeroing-masking

                    THEN DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPEXPANDQ __m512i _mm512_mask_expandloadu_epi64(__m512i s, __mmask8 k, void * a);
VPEXPANDQ __m512i _mm512_maskz_expandloadu_epi64( __mmask8 k, void * a);
VPEXPANDQ __m512i _mm512_mask_expand_epi64(__m512i s, __mmask8 k, __m512i a);
VPEXPANDQ __m512i _mm512_maskz_expand_epi64( __mmask8 k, __m512i a);
VPEXPANDQ __m256i _mm256_mask_expandloadu_epi64(__m256i s, __mmask8 k, void * a);
VPEXPANDQ __m256i _mm256_maskz_expandloadu_epi64( __mmask8 k, void * a);
VPEXPANDQ __m256i _mm256_mask_expand_epi64(__m256i s, __mmask8 k, __m256i a);
VPEXPANDQ __m256i _mm256_maskz_expand_epi64( __mmask8 k, __m256i a);
VPEXPANDQ __m128i _mm_mask_expandloadu_epi64(__m128i s, __mmask8 k, void * a);
VPEXPANDQ __m128i _mm_maskz_expandloadu_epi64( __mmask8 k, void * a);
VPEXPANDQ __m128i _mm_mask_expand_epi64(__m128i s, __mmask8 k, __m128i a);
VPEXPANDQ __m128i _mm_maskz_expand_epi64( __mmask8 k, __m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51中的例外类型E4.nb,"Type E4类例外条件".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
