---
summary: 在 标量 浮点64 值上进行还原转换
---

## 说明

进行二进制编码的双精度浮点值在第二源运行符(第三源运行符)的低qword元素中的减值转换,并将二进制浮点格式的减值结果存储到目的地运行符(第一源运行符)的低qword元素下写mask k1. 目标操作数的比特127:64从第一源操作数(第二个操作数)的相应qword元素复制.

还原转换从二进制浮点源值中减去整数部分和主要M分数位,其中M是imm8[7:4]指定的无符号整数,见图5-28. 具体来说,还原变换可以表示为: dest = src(ROUND(2M*src))*2-M;其中"Round()"将"src","2M",及其产物作为二进制的浮点数字,带有正统标志和偏差的引子. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

这一指令最终可能会有一套精确的例外。 然而,对于SPE set(即Sprint Precision,即imm8[3]=1),没有报告精确的例外.

手术被蒙上面具

特殊输入值的处理情况见表5-27。

## 行动

```text
ReduceArgumentDP(SRC[63:0], imm8[7:0])
{

    // Check for NaN
    IF (SRC [63:0] = NAN) THEN

          RETURN (Convert SRC[63:0] to QNaN); FI;
    M := imm8[7:4]; // Number of fraction bits of the normalized significand to be subtracted
    RC := imm8[1:0];// Round Control for ROUND() operation
    RC source := imm[2];
    SPE := imm[3];// Suppress Precision Exception
    TMP[63:0] := 2-M *{ROUND(2M*SRC[63:0], SPE, RC_source, RC)}; // ROUND() treats SRC and 2M as standard binary FP values
    TMP[63:0] := SRC[63:0]  TMP[63:0]; // subtraction under the same RC,SPE controls
    RETURN TMP[63:0]; // binary encoded FP with biased exponent and normalized significand
}

VREDUCESD

IF k1[0] or *no writemask*

     THEN DEST[63:0] := ReduceArgumentDP(SRC2[63:0], imm8[7:0])

     ELSE

     IF *merging-masking*       ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                 ; zeroing-masking

           THEN DEST[63:0] = 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VREDUCESD __m128d _mm_mask_reduce_sd( __m128d a, __m128d b, int imm, int sae) VREDUCESD __m128d _mm_mask_reduce_sd(__m128d s, __mmask16 k, __m128d a, __m128d b, int imm, int sae) VREDUCESD __m128d _mm_maskz_reduce_sd(__mmask16 k, __m128d a, __m128d b, int imm, int sae);
```

## SIMD 浮点 例外

无效, 精度 。 如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

见表2-49"E3类例外条件"。
