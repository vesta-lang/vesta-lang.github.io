---
summary: 从 FP16 矢量中提取 FP16 常态化曼提萨的矢量
---

## 说明

本指令将源操作数(第二个操作数)中的FP16值转换为FP16值,其mantissa正常化和签名控制由imm8字节指定,见表5-17. 转换结果使用写掩码 k1写入目标操作数(第一个操作数). 普通的mantissa由interv(imm8[1:0])指定,标志控制(SC)由直接字节的3:2位指定.

目的地元素根据写掩码更新.

imm8Bits Table 5-17 (英语).imm8用于VGETMANTPH/VGETMANTSH imm8[7:4] imm8[3:2] 定义

imm8[1:0]                        Must be zero.

信号控制( SC) 0b00 : 符号( SRC) 0b01: 0b1x: 标记( SRC) !=0

Interv 0b00: Interval is [1, 2) 0b01: Interval is [1/2, 2) 0b10: Interval is [1/2, 1) 0b11: Interval is [3/4, 3/2)

对于每个输入的FP16值x,转换操作是:

GetMant(x) = +/-2k|x.significand| where:

```text
         1  |x.significand| < 2
```

无偏见的exponent k取决于interv定义的间隔范围以及源的exponent是偶数还是奇数. 最终结果的标志由标志控件和源标志以及领先分数位决定.

Imm8[1:0]的编码值和标志控件见表5-17.

每个转换后的FP16结果都按照符号控件,无偏见的exporent k(添加偏差)和与interv指定的范围正常化的mantissa进行编码.

GetMant () 函数在处理 浮点 特殊编号时遵循表 5-18 。

** GetMant () 特殊浮点数行为**

| 投入 | 结果 | 例外/评论 |
| --- | --- | --- |
| 纳恩 | QNaN( SRC) 数据 | 忽略干涉。 如果(SRC = SNaN),则#IE. |
| + | 1.0 | 忽略干涉。 |
| +0 | 1.0 | 忽略干涉。 |
| -0 | IF (SC[0]) THEN +1.0 ELSE -1.0 | 忽略干涉。 |
| - | IF (SC[1]) THEN {QNaN_Indefinite} | 忽略干涉。 |
|  | ELSE { IF (SC[0]) THEN +1.0 ELSE -1.0 | 如果(SC[1]),则#IE. |
| 负数 | SC[1]? QNaN 无限期 : 格曼特( SRC) 1 | 如果(SC[1]),则#IE. |

## 行动

```text
def getmant_fp16(src, sign_control, normalization_interval):
    bias := 15
    dst.sign := sign_control[0] ? 0 : src.sign
    signed_one := sign_control[0] ? +1.0 : -1.0
    dst.exp := src.exp
    dst.fraction := src.fraction
    zero := (dst.exp = 0) and (dst.fraction = 0)
    denormal := (dst.exp = 0) and (dst.fraction != 0)
    infinity := (dst.exp = 0x1F) and (dst.fraction = 0)
    nan := (dst.exp = 0x1F) and (dst.fraction != 0)
    src_signaling := src.fraction[9]
    snan := nan and (src_signaling = 0)
    positive := (src.sign = 0)
    negative := (src.sign = 1)
    if nan:
          if snan:
                MXCSR.IE := 1
          return qnan(src)

    if positive and (zero or infinity):
          return 1.0

    if negative:
          if zero:
                return signed_one
          if infinity:


if sign_control[1]:

              MXCSR.IE := 1

              return QNaN_Indefinite

return signed_one

if sign_control[1]:

MXCSR.IE := 1

return QNaN_Indefinite

if denormal:

jbit := 0

dst.exp := bias              // set exponent to bias value

while jbit = 0:

jbit := dst.fraction[9]

dst.fraction := dst.fraction << 1

dst.exp : = dst.exp - 1

MXCSR.DE := 1

unbaiased_exp := dst.exp - bias
odd_exp := unbaiased_exp[0]
signaling_bit := dst.fraction[9]
if normalization_interval = 0b00:

      dst.exp := bias
else if normalization_interval = 0b01:

      dst.exp := odd_exp ? bias-1 : bias
else if normalization_interval = 0b10:

      dst.exp := bias-1
else if normalization_interval = 0b11:

      dst.exp := signaling_bit ? bias-1 : bias
return dst

VGETMANTPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := getmant_fp16(tsrc, sign_control, normalization_interval)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VGETMANTPH __m128h _mm_getmant_ph (__m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m128h _mm_mask_getmant_ph (__m128h src, __mmask8 k, __m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m128h _mm_maskz_getmant_ph (__mmask8 k, __m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_getmant_ph (__m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_mask_getmant_ph (__m256h src, __mmask16 k, __m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_maskz_getmant_ph (__mmask16 k, __m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_getmant_ph (__m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_mask_getmant_ph (__m512h src, __mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_maskz_getmant_ph (__mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_getmant_round_ph (__m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTPH __m512h _mm512_mask_getmant_round_ph (__m512h src, __mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTPH __m512h _mm512_maskz_getmant_round_ph (__mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
