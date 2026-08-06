---
summary: 从 FP16 Scalar 中提取 FP16 规范化曼提萨
---

## 说明

本指令将 第二源操作数 低元素中的 FP16 值转换为 FP16 值,使用 imm8 字节指定的 mantissa 正常化和符号控制,参见表5-17. 转换后的结果是用写掩码 k1写入目标操作数的低元素. 普通的mantissa由interv(imm8[1:0])指定,标志控制(SC)由直接字节的3:2位指定.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

对于每个输入的FP16值x,转换操作是:

GetMant(x) = +/-2k|x.significand| where:

```text
         1  |x.significand| < 2
```

无偏见的exponent k取决于interv定义的间隔范围以及源的exponent是偶数还是奇数. 最终结果的标志由标志控件和源标志以及领先分数位决定.

Imm8[1:0]的编码值和标志控件见表5-17.

每个转换后的FP16结果都按照符号控件,无偏见的exporent k(添加偏差)和与interv指定的范围正常化的mantissa进行编码.

GetMant () 函数在处理 浮点 特殊编号时遵循表 5-18 。

## 行动

```text
VGETMANTSH dest{k1}, src1, src2, imm8
sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

IF k1[0] or *no writemask*:
    dest.fp16[0] := getmant_fp16(src2.fp16[0], // see VGETMANTPH
                                        sign_control,
                                        normalization_interval)

ELSE IF *zeroing*:
    dest.fp16[0] := 0

//else dest.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETMANTSH __m128h _mm_getmant_round_sh (__m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_mask_getmant_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_maskz_getmant_round_sh (__mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_getmant_sh (__m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTSH __m128h _mm_mask_getmant_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTSH __m128h _mm_maskz_getmant_sh (__mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
```

## SIMD 浮点 例外

Invalid, Denormal

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".
