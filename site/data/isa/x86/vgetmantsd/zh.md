---
summary: 从 Float64 标量 提取正常化的 Mantissa 的浮图64
---

## 说明

将第二源操作数(第三代操作数)低四字元中的双精度浮动值转换为双精度浮点值,并使用imm8字节指定的mantissa正常化和符号控制,见图5-15. 转换的结果是用写掩码 k1写成目标操作数(第一个操作数)的低四字元素. XMM注册目的地的比特(127:64)从第一源操作数中的相应比特复制. 普通的mantissa由interv(imm8[1:0])指定,标志控制(sc)由直接字节的3:2位指定.

转换操作为:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

无偏倚的表示k可以是0,也可以是-1,这取决于interv定义的间隔范围,符号的表示范围以及来源的表示是偶数还是奇数. 最终结果的标志由sc和源标志确定. Imm8[1:0]的编码值和签名控制值如图5-15所示.

转换后的双精度浮点结果按照符号控件编码,无偏见的exporent k(添加偏差)和与interv指定的范围正常化的mantissa.

GetMant () 函数在处理 浮点 特殊编号时遵循表 5-16 。

如果使用书写方式,则根据写掩码注册k1的值,对目标操作数的低四字元素进行有条件更新. 如果不使用书面拼写,则目标操作数的低四字元素将无条件更新.

## 行动

```text
// getmant_fp64(src, sign_control, normalization_interval) is defined in the operation section of VGETMANTPD

VGETMANTSD (EVEX encoded version)

SignCtrl[1:0] := IMM8[3:2];

Interv[1:0] := IMM8[1:0];

IF k1[0] OR *no writemask*

     THEN DEST[63:0] :=

           getmant_fp64(src, sign_control, normalization_interval)

     ELSE

     IF *merging-masking*          ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                    ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETMANTSD __m128d _mm_getmant_sd( __m128d a, __m128 b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_mask_getmant_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_maskz_getmant_sd( __mmask8 k, __m128 a, __m128d b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_getmant_round_sd( __m128d a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSD __m128d _mm_mask_getmant_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn, int r);
VGETMANTSD __m128d _mm_maskz_getmant_round_sd( __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn, int r);
```

## SIMD 浮点 例外

Denormal, Invalid

## 其他例外

见表2-49"E3类例外条件"。
