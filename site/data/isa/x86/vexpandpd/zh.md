---
summary: 从 Dense 内存装入 Sparse 打包双精度浮点值
---

## 说明

将 源操作数(第二个操作数)中输入矢量的双精度浮点值扩展至8/4/2,毗连到由写掩码 k1选择的目标操作数(第一个操作数)中的稀疏元素.

目标操作数是一个ZMM/YMM/XMM登记册,源操作数可以是ZMM/YMM/XMM登记册或512/256/128-bit 内存位置.

输入矢量从 源操作数 中的最低元素开始. 写掩码 注册 k1 选择目标元素(如果小于 8 个元素,则选择部分矢量或稀释元素),由输入矢量中的上升元素取代. 未被 写掩码 k1 选择的目标元素不是未修改就是零,这取决于 EVEX.z.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

注意压缩的移位假设一个预缩放(N)与单个元素的大小相对应,而不是全向量的大小.

## 行动

```text
VEXPANDPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

        THEN

             DEST[i+63:i] := SRC[k+63:k];

             k := k + 64

        ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                    THEN DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VEXPANDPD __m512d _mm512_mask_expand_pd( __m512d s, __mmask8 k, __m512d a);
VEXPANDPD __m512d _mm512_maskz_expand_pd( __mmask8 k, __m512d a);
VEXPANDPD __m512d _mm512_mask_expandloadu_pd( __m512d s, __mmask8 k, void * a);
VEXPANDPD __m512d _mm512_maskz_expandloadu_pd( __mmask8 k, void * a);
VEXPANDPD __m256d _mm256_mask_expand_pd( __m256d s, __mmask8 k, __m256d a);
VEXPANDPD __m256d _mm256_maskz_expand_pd( __mmask8 k, __m256d a);
VEXPANDPD __m256d _mm256_mask_expandloadu_pd( __m256d s, __mmask8 k, void * a);
VEXPANDPD __m256d _mm256_maskz_expandloadu_pd( __mmask8 k, void * a);
VEXPANDPD __m128d _mm_mask_expand_pd( __m128d s, __mmask8 k, __m128d a);
VEXPANDPD __m128d _mm_maskz_expand_pd( __mmask8 k, __m128d a);
VEXPANDPD __m128d _mm_mask_expandloadu_pd( __m128d s, __mmask8 k, void * a);
VEXPANDPD __m128d _mm_maskz_expandloadu_pd( __mmask8 k, void * a);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51中的例外类型E4.nb,"类型E4类例外条件".

Additionally:

```text
#UD                       If EVEX.vvvv != 1111B.
```
