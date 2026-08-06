---
summary: 在包装的浮点64值上进行还原转换
---

## 说明

在源操作器(第二操作器)中执行编组的二进制编码双精度浮点值的还原转换,并将降序结果以二进制浮点格式存储到目标操作器(第一操作器)的写法mask k1下.

还原转换从二进制浮点源值中减去整数部分和主要M分数位,其中M是imm8[7:4]指定的无符号整数,见图5-28. 具体来说,还原变换可以表示为: dest = src(ROUND(2M*src))*2-M;其中"Round()"将"src","2M",及其产物作为二进制的浮点数字,带有正统标志和偏差的引子. The magnitude of the reduced result can be expressed by considering src= 2p*man2, where `man2' is the normalized significand and `p' is the unbiased exponent Then if RC = RNE: 0<=|Reduced Result|<=2p-M-1 Then if RC  RNE: 0<=|Reduced Result|<2p-M

这一指令最终可能会有一套精确的例外。 然而,对于SPE set(即Sprint Precision,即imm8[3]=1),没有报告精确的例外.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

```text
                           7  6                 5       4             3                     2         1                   0
```

imm8

```text
                              Fixed point length                  SPE                       RS        Round Control Override
```

Imm8[7:4]: 减量的固定点数 : Imm8[3] 回合选择 : Imm8[2] Imm8[1:0]=00b: 最接近的圆形

```text
                                                   Imm8[3] = 0b : Use MXCSR exception mask  Imm8[2] = 0b : Use Imm8[1:0]  Imm8[1:0] = 01b : Round down
                                                   Imm8[3] = 1b : Suppress                  Imm8[2] = 1b : Use MXCSR      Imm8[1:0] = 10b : Round up
```

Imm8[1:0] = 11b : Truncate

图5-28. VREDUCEPD/SD/PS/SS的Imm8控制器

特殊输入值的处理情况见表5-27。

** VREDUCEPD/SD/PS/SS 特殊情况**

| \|Src1\| < 2-M-1 | RNE | Src1 |
| --- | --- | --- |
|  | RPI, Src1 > 0 | 圆( Src1-2- M) * |
|  | RPI, Src1  0 | Src1 |
|  | RNI, Src1  0 | Src1 |
| \|Src1\| < 2-M | RNI, Src1 < 0 | 圆(Src1+2-M) * |
| Src1 = +/-0, or | NOT RNI | +0.0 |
| Dest = +/-0(Src1!=INF) 互联网档案馆的存檔,存档日期2013-03-02. | RNI | -0.0 |
| Src1 = +/-INF | 任何 | +0.0 |
| Src1= +/-NAN | n/a | QNaN( 曲线1) |
| * 圆控=(imm8.MS1)?. MXCSR.RC:imm8.RC. |  |  |

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


VREDUCEPD

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := ReduceArgumentDP(SRC[63:0], imm8[7:0]);

                  ELSE DEST[i+63:i] := ReduceArgumentDP(SRC[i+63:i], imm8[7:0]);

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[i+63:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VREDUCEPD __m512d _mm512_mask_reduce_pd( __m512d a, int imm, int sae) VREDUCEPD __m512d _mm512_mask_reduce_pd(__m512d s, __mmask8 k, __m512d a, int imm, int sae) VREDUCEPD __m512d _mm512_maskz_reduce_pd(__mmask8 k, __m512d a, int imm, int sae) VREDUCEPD __m256d _mm256_mask_reduce_pd( __m256d a, int imm) VREDUCEPD __m256d _mm256_mask_reduce_pd(__m256d s, __mmask8 k, __m256d a, int imm) VREDUCEPD __m256d _mm256_maskz_reduce_pd(__mmask8 k, __m256d a, int imm) VREDUCEPD __m128d _mm_mask_reduce_pd( __m128d a, int imm) VREDUCEPD __m128d _mm_mask_reduce_pd(__m128d s, __mmask8 k, __m128d a, int imm) VREDUCEPD __m128d _mm_maskz_reduce_pd(__mmask8 k, __m128d a, int imm);
```

## SIMD 浮点 例外

无效, 精度 。 如果启用了SPE,则不报告精确例外(不管MXCSR例外面具).

## 其他例外

见表2-48"E2类例外条件"。

```text
#UD                    If EVEX.vvvv != 1111B.
```
