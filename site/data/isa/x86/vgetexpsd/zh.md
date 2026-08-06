---
summary: 将 标量 双精度浮点 值转换为双倍值
---

## 说明

从源操作数(第三个操作数)的低qword数据元素的正态化 双精度浮点 表示法中提取偏差的表示法,作为无偏差的签名整数值,或者将输入数据的非正常表示法转换为无偏差的负整数值. 无偏差的解码器的整数值被转换成双精度浮点值,并将目标操作数(第一个操作数)写成双精度浮点数字. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制.

目的地必须是XMM登记册,源操作数可以是XMM登记册,也可以是浮点64 内存位置.

如果使用书写方式,则根据写掩码注册k1的值,对目标操作数的低四字元素进行有条件更新. 如果不使用书面拼写,则目标操作数的低四字元素将无条件更新.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 表5-13列出了输入值的特殊情况。

The formula is:

GETEXP(x) = 地板(log2(Xx|)) 标记地板(x) 代表最大整数不超过实际数字x.

## 行动

```text
// NormalizeExpTinyDPFP(SRC[63:0]) is defined in the Operation section of VGETEXPPD

// ConvertExpDPFP(SRC[63:0]) is defined in the Operation section of VGETEXPPD


VGETEXPSD (EVEX encoded version)

IF k1[0] OR *no writemask*

     THEN DEST[63:0] :=

           ConvertExpDPFP(SRC2[63:0])

     ELSE

     IF *merging-masking*              ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                        ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETEXPSD __m128d _mm_getexp_sd( __m128d a, __m128d b);
VGETEXPSD __m128d _mm_mask_getexp_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VGETEXPSD __m128d _mm_maskz_getexp_sd( __mmask8 k, __m128d a, __m128d b);
VGETEXPSD __m128d _mm_getexp_round_sd( __m128d a, __m128d b, int sae);
VGETEXPSD __m128d _mm_mask_getexp_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int sae);
VGETEXPSD __m128d _mm_maskz_getexp_round_sd( __mmask8 k, __m128d a, __m128d b, int sae);
```

## SIMD 浮点 例外

Invalid, Denormal

## 其他例外

见表2-49"E3类例外条件"。
