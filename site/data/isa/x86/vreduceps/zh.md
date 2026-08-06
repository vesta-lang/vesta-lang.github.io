---
summary: 在包装的浮点32值上进行还原转换
---

## 说明

在源操作(第二操作)中执行编组二进制编码的单精度浮点值的还原转换,并将降级结果以二进制浮点格式存储到目的操作(第一操作)中,置于写入mask k1下.

还原转换从二进制浮点源值中减去整数部分和主要M分数位,其中M是imm8[7:4]指定的无符号整数,见图5-28. 具体来说,还原变换可以表示为: dest = src(ROUND(2M*src))*2-M;其中"Round()"将"src","2M",及其产物作为二进制的浮点数字,带有正统标志和偏差的引子. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

这一指令最终可能会有一套精确的例外。 然而,对于SPE set(即Sprint Precision,即imm8[3]=1),没有报告精确的例外.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

特殊输入值的处理情况见表5-27。

## 行动

```text
ReduceArgumentSP(SRC[31:0], imm8[7:0])
{

    // Check for NaN
    IF (SRC [31:0] = NAN) THEN

          RETURN (Convert SRC[31:0] to QNaN); FI
    M := imm8[7:4]; // Number of fraction bits of the normalized significand to be subtracted
    RC := imm8[1:0];// Round Control for ROUND() operation
    RC source := imm[2];
    SPE := imm[3];// Suppress Precision Exception
    TMP[31:0] := 2-M *{ROUND(2M*SRC[31:0], SPE, RC_source, RC)}; // ROUND() treats SRC and 2M as standard binary FP values
    TMP[31:0] := SRC[31:0]  TMP[31:0]; // subtraction under the same RC,SPE controls
RETURN TMP[31:0]; // binary encoded FP with biased exponent and normalized significand
}

VREDUCEPS

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := ReduceArgumentSP(SRC[31:0], imm8[7:0]);

                  ELSE DEST[i+31:i] := ReduceArgumentSP(SRC[i+31:i], imm8[7:0]);

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VREDUCEPS __m512 _mm512_mask_reduce_ps( __m512 a, int imm, int sae) VREDUCEPS __m512 _mm512_mask_reduce_ps(__m512 s, __mmask16 k, __m512 a, int imm, int sae) VREDUCEPS __m512 _mm512_maskz_reduce_ps(__mmask16 k, __m512 a, int imm, int sae) VREDUCEPS __m256 _mm256_mask_reduce_ps( __m256 a, int imm) VREDUCEPS __m256 _mm256_mask_reduce_ps(__m256 s, __mmask8 k, __m256 a, int imm) VREDUCEPS __m256 _mm256_maskz_reduce_ps(__mmask8 k, __m256 a, int imm) VREDUCEPS __m128 _mm_mask_reduce_ps( __m128 a, int imm) VREDUCEPS __m128 _mm_mask_reduce_ps(__m128 s, __mmask8 k, __m128 a, int imm) VREDUCEPS __m128 _mm_maskz_reduce_ps(__mmask8 k, __m128 a, int imm);
```

## SIMD 浮点 例外

无效, 精度 。 如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

见表2-48,"E2类型例外条件";此外:

```text
#UD                    If EVEX.vvvv != 1111B.
```
