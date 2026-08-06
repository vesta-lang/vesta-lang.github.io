---
summary: 将 标量 单精度浮点 值转换为单值
---

## 说明

从源操作数(第三个操作数)低双词数据元素的正态化的 单精度浮点 表示法中提取偏差的表示法,作为无偏差的签名整数值,或者将输入数据的非正常表示法转换为无偏差的负整数值. 无偏差的解码器的整数值被转换成单精度浮点值,并将目标操作数(第一个操作数)写成单精度浮点数字. XMM注册目的地的比特(127:32)从第一源操作数中的相应比特复制.

目的地必须是XMM登记册,源操作数可以是XMM登记册,也可以是浮点32 内存位置.

如果使用书写方式,则根据写掩码注册k1的值,对目标操作数的低双字元素进行有条件更新. 如果不使用写作,则目标操作数的低双字元素将无条件更新.

每个 GETEXP 操作将表示值转换为 浮点 数字(在非正常表示中允许输入值). 表5-15列出了输入值的特殊情况。

The formula is:

GETEXP(x) = 地板(log2(Xx|)) 标记地板(x) 代表最大整数不超过实际数字x.

VGETEXPxx和VGETMANTxxx指令的软件使用一般涉及GETEXP操作和GETMANT操作的组合(参见VGETMANTPD). 因此,VGETEXPxx指令对句柄 SIMD 浮点的例外不需要软件.

## 行动

```text
// NormalizeExpTinySPFP(SRC[31:0]) is defined in the Operation section of VGETEXPPS
// ConvertExpSPFP(SRC[31:0]) is defined in the Operation section of VGETEXPPS


VGETEXPSS (EVEX encoded version)

IF k1[0] OR *no writemask*

THEN DEST[31:0] :=

        ConvertExpDPFP(SRC2[31:0])

ELSE

     IF *merging-masking*           ; merging-masking

        THEN *DEST[31:0] remains unchanged*

        ELSE                        ; zeroing-masking

            DEST[31:0]:= 0

        FI

FI;

ENDFOR

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VGETEXPSS __m128 _mm_getexp_ss( __m128 a, __m128 b);
VGETEXPSS __m128 _mm_mask_getexp_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VGETEXPSS __m128 _mm_maskz_getexp_ss( __mmask8 k, __m128 a, __m128 b);
VGETEXPSS __m128 _mm_getexp_round_ss( __m128 a, __m128 b, int sae);
VGETEXPSS __m128 _mm_mask_getexp_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int sae);
VGETEXPSS __m128 _mm_maskz_getexp_round_ss( __mmask8 k, __m128 a, __m128 b, int sae);
```

## SIMD 浮点 例外

Invalid, Denormal

## 其他例外

见表2-49"E3类例外条件"。
