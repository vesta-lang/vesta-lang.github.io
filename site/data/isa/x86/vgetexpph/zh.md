---
summary: 将包装的 FP16 值转换为 FP16 值
---

## 说明

本指令从源操作数(第二个操作数)每个词元的正态化的FP16表示法中提取出偏差的表示法,作为无偏差的签名整数,或者将输入数据的非正常表示法转换为无偏差的负整数. 无偏差代词的每个整数值被转换成FP16值,并将目标操作数(第一个操作数)的相应单词元素写成FP16数字.

目的地元素根据写掩码更新.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 输入值的特殊情况见表5-8。

The formula is:

GETEXP(x) = 地板(log2(Xx|)) 标记地板(x) 代表最大整数不超过实际数字x.

VGETEXPxx和VGETMANTxxx指令的软件使用一般涉及GETEXP操作和GETMANT操作的组合(参见VGETMANTPH). 因此,VGETEXPPH指令对句柄 SIMD 浮点的例外不需要软件.

** VGETEXPPH/VGETEXPSH 特殊情况**

| 输入 操作数 | 结果 | 评论 |
| --- | --- | --- |
| src1=纳恩 | QNaN( 弧1) |  |
| 0 < \|src1\| < INF | 楼层(log2(\|src1\|)) | 如果(SRC = SNaN),则#IE. |
| \| src1\| = +INF | +INF | 如果(SRC = 异常),则#DE. |
| \| src1\| = 0 | -INF |  |

## 行动

```text
def normalize_exponent_tiny_fp16(src):

jbit := 0

// src & dst are FP16 numbers with sign(1b), exp(5b) and fraction (10b) fields

dst.exp := 1                    // write bits 14:10

dst.fraction := src.fraction // copy bits 9:0

while jbit == 0:

       jbit := dst.fraction[9]  // msb of the fraction

       dst.fraction := dst.fraction << 1

       dst.exp := dst.exp - 1

dst.fraction := 0

return dst

def getexp_fp16(src):

src.sign := 0                   // make positive

exponent_all_ones := (src[14:10] == 0x1F)

exponent_all_zeros := (src[14:10] == 0)

mantissa_all_zeros := (src[9:0] == 0)

zero := exponent_all_zeros and mantissa_all_zeros

signaling_bit := src[9]

nan := exponent_all_ones and not(mantissa_all_zeros)
snan := nan and not(signaling_bit)
qnan := nan and signaling_bit
positive_infinity := not(negative) and exponent_all_ones and mantissa_all_zeros
denormal := exponent_all_zeros and not(mantissa_all_zeros)

if nan:

       if snan:

           MXCSR.IE := 1

       return qnan(src)         // convert snan to a qnan

if positive_infinity:

       return src

if zero:

       return -INF

if denormal:

       tmp := normalize_exponent_tiny_fp16(src)

       MXCSR.DE := 1

else:

       tmp := src

tmp := SAR(tmp, 10)             // shift arithmetic right

tmp := tmp - 15                 // subtract bias

return convert_integer_to_fp16(tmp)


VGETEXPPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := getexp_fp16(tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VGETEXPPH __m128h _mm_getexp_ph (__m128h a);
VGETEXPPH __m128h _mm_mask_getexp_ph (__m128h src, __mmask8 k, __m128h a);
VGETEXPPH __m128h _mm_maskz_getexp_ph (__mmask8 k, __m128h a);
VGETEXPPH __m256h _mm256_getexp_ph (__m256h a);
VGETEXPPH __m256h _mm256_mask_getexp_ph (__m256h src, __mmask16 k, __m256h a);
VGETEXPPH __m256h _mm256_maskz_getexp_ph (__mmask16 k, __m256h a);
VGETEXPPH __m512h _mm512_getexp_ph (__m512h a);
VGETEXPPH __m512h _mm512_mask_getexp_ph (__m512h src, __mmask32 k, __m512h a);
VGETEXPPH __m512h _mm512_maskz_getexp_ph (__mmask32 k, __m512h a);
VGETEXPPH __m512h _mm512_getexp_round_ph (__m512h a, const int sae);
VGETEXPPH __m512h _mm512_mask_getexp_round_ph (__m512h src, __mmask32 k, __m512h a, const int sae);
VGETEXPPH __m512h _mm512_maskz_getexp_round_ph (__mmask32 k, __m512h a, const int sae);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-48,"Type E2 Class Exception Centers".
