---
summary: Float32 从 Float32 提取普通曼提萨的矢量
---

## 说明

将源操作数(第二个操作数)中的单精度浮点值转换为单精度浮点值,并使用由imm8字节指定的mantissa正常化和符号控制,见图5-15. 转换结果使用写掩码 k1写入目标操作数(第一个操作数). 普通的mantissa由interv(imm8[1:0])指定,标志控制(sc)由直接字节的3:2位指定.

目标操作数是一个在写掩码下更新的ZMM/YMM/XMM登记册. 源操作数可以是ZMM/YMM/XMM的寄存器,512/256/128位的内存位置,也可以是512/256/128位的向量,通过32位的内存位置广播.

对于每个输入的单精度浮点值x,转换操作是:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

无偏倚的表示k可以是0,也可以是-1,这取决于interv定义的间隔范围,符号的表示范围以及来源的表示是偶数还是奇数. 最终结果的标志由sc和源标志确定. Imm8[1:0]的编码值和签名控制值如图5-15所示.

每个转换后的单精度浮点结果都按照符号控件,无偏见的exporent k(添加偏差)和与interv指定的范围正常化的mantissa进行编码.

GetMant () 函数在处理 浮点 特殊编号时遵循表 5-16 。

此指令被写入, 因此只有那些在矢量掩码中设置了对应比特的元素 k1 被计算并存储到目的地 。 在 zmm1 中的元素,在 k1 中对应的比特清晰度保留了它们以前的值.

说明: EVEX.vvvv是保留的,必须是1111b,VEX.L必须是0;否则指令会是#UD.

## 行动

```text
def getmant_fp32(src, sign_control, normalization_interval):
    bias := 127
    dst.sign := sign_control[0] ? 0 : src.sign
    signed_one := sign_control[0] ? +1.0 : -1.0
    dst.exp := src.exp
    dst.fraction := src.fraction
    zero := (dst.exp = 0) and ((dst.fraction = 0) or (MXCSR.DAZ=1))
    denormal := (dst.exp = 0) and (dst.fraction != 0) and (MXCSR.DAZ=0)
    infinity := (dst.exp = 0xFF) and (dst.fraction = 0)
    nan := (dst.exp = 0xFF) and (dst.fraction != 0)
    src_signaling := src.fraction[22]
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
          dst.exp := bias
          while jbit = 0:
                jbit := dst.fraction[22]
                dst.fraction := dst.fraction << 1
                dst.exp : = dst.exp - 1
          MXCSR.DE := 1

    unbiased_exp := dst.exp - bias
    odd_exp := unbiased_exp[0]
    signaling_bit := dst.fraction[22]
    if normalization_interval = 0b00:

          dst.exp := bias
    else if normalization_interval = 0b01:

          dst.exp := odd_exp ? bias-1 : bias
    else if normalization_interval = 0b10:

          dst.exp := bias-1
    else if normalization_interval = 0b11:

          dst.exp := signaling_bit ? bias-1 : bias


return dst

VGETMANTPS (EVEX encoded versions)
VGETMANTPS dest{k1}, src, imm8
VL = 128, 256, or 512
KL := VL / 32
sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.float[0]
          ELSE:
                tsrc := src.float[i]
          DEST.float[i] := getmant_fp32(tsrc, sign_control, normalization_interval)
    ELSE IF *zeroing*:
          DEST.float[i] := 0
    //else DEST.float[i] remains unchanged

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VGETMANTPS __m512 _mm512_getmant_ps( __m512 a, enum intv, enum sgn);
VGETMANTPS __m512 _mm512_maskz_getmant_ps(__mmask16 k, __m512 a, enum intv, enum sgn);
VGETMANTPS __m512 _mm512_getmant_round_ps( __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m512 _mm512_mask_getmant_round_ps(__m512 s, __mmask16 k, __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m512 _mm512_maskz_getmant_round_ps(__mmask16 k, __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m256 _mm256_getmant_ps( __m256 a, enum intv, enum sgn);
VGETMANTPS __m256 _mm256_mask_getmant_ps(__m256 s, __mmask8 k, __m256 a, enum intv, enum sgn);
VGETMANTPS __m256 _mm256_maskz_getmant_ps( __mmask8 k, __m256 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_getmant_ps( __m128 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_mask_getmant_ps(__m128 s, __mmask8 k, __m128 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_maskz_getmant_ps( __mmask8 k, __m128 a, enum intv, enum sgn);
```

## SIMD 浮点 例外

Denormal, Invalid.

## 其他例外

见表2-48"E2类例外条件"。

```text
#UD               If EVEX.vvvv != 1111B.
```
