---
summary: 包装方位浮点64值的幅度限制计算
---

## 说明

本指令从第一源操作数(第二个操作数)和第二源操作数(第三个操作数)的两组组合输入双精度浮点值中计算出2/4/8范围操作输出. 范围输出在写mask k1下写到目的操作(第一个操作).

比特7:4的imm8字节必须是0. 范围操作输出分为两个部分,每个部分由imm8 [3:0] 内的一个双位控制字段配置:

* Imm8[1:0] 指定初始比较操作为最大、最小、最小绝对值或最小值之一

输入值对的绝对值。 每次比较两个输入值都会产生一个中间结果,结合符号选择控制(imm8[3:2])来确定最终范围操作输出.

* Imm8[3:2] 指定范围操作输出的标志为以下之一: 从第一个输入

值,来自比较结果,设置或清晰。

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

```text
                           7  6             5        4                       3                     2  1              0
```

imm8

```text
                              Must Be Zero                                      Sign Control (SC)     Compare Operation Select
```

```text
                              Imm8[3:2] = 00b : Select sign(SRC1)                                     Imm8[1:0] = 00b : Select Min value
```

Imm8[1:0] = 01b : 选择最大值

```text
                              Imm8[3:2] = 01b : Select sign(Compare_Result)                           Imm8[1:0] = 10b : Select Min-Abs value
```

Imm8[1:0]=11b: 选择最大值Imm8[3:2]=10b: 设置为 0 Imm8 [3:2] = 11b : 设置为 1

图5-27. VRANGEPD/SD/PS/SS的Imm8控制器

当一个或多个输入值是NAN时,比较操作可能会发出无效例外信号(IE). 输入值增加的一个细节是NAN,列在表5-21. 如果比较提高了一个IE,则符号选择控制(imm8[3:2])对射程操作输出无效;这也在表5-21中注明.

当两个输入值都是相反征兆的零时,在范围比较操作中MIN/MAX的比较操作与在概念上相似的浮点 MIN/MAX操作略有不同,这些操作见于指令VMAXPD/VMINPD. MIN/MAX/MIN ABS/MAQQABS操作VRANGEPD/PS/SD/SS操作的0级,反标输入箱的详情见表5-22.

此外,与表5-23所列结果相比,具有相反信号输入值的非零、等宽的MIN ABS或MAQQABS操作。

** Imm8[3:2]的一个或多个NaN输入值和效果的比较操作的信号**

| Src1 | Src2 | 结果 | 因比较而发出 IE 信号 | Imm8[3:2] 对 | 范围输出 |
| --- | --- | --- | --- | --- | --- |
| sNaN1 | sNaN2 | 安静(sNaN1) | 对 | 已忽略 |  |
| sNaN1 | qNaN2 | 安静(sNaN1) | 对 | 已忽略 |  |
| sNaN1 | Norm2 | 安静(sNaN1) | 对 | 已忽略 |  |
| qNaN1 | sNaN2 | 安静(sNaN2) | 对 | 已忽略 |  |
| qNaN1 | qNaN2 | qNaN1 | No | 适用 |  |
| qNaN1 | Norm2 | Norm2 | No | 适用 |  |
| Norm1 | sNaN2 | 安静(sNaN2) | 对 | 已忽略 |  |
| Norm1 | qNaN2 | Norm1 | No | 适用 |  |

** 对面签署的MIN、MIN ABS和MAQQABS的MAX零案件比较结果**

| Src1 | Src2 | 结果 | Src1 | Src2 | 结果 |
| --- | --- | --- | --- | --- | --- |
| +0 | -0 | -0 | +0 | -0 | +0 |
| -0 | +0 | -0 | -0 | +0 | +0 |

** MIN ABS和MAQQABS的等比例输入案例比较结果,(|a|=|b|,a)>0, b<0)**

| Src1 | Src2 | 结果 | Src1 | Src2 | 结果 |
| --- | --- | --- | --- | --- | --- |
| a | b | b | a | b | a |
| b | a | b | b | a | a |

## 行动

```text
RangeDP(SRC1[63:0], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0])
{

    // Check if SNAN and report IE, see also Table 5-21
    IF (SRC1 = SNAN) THEN RETURN (QNAN(SRC1), set IE);
    IF (SRC2 = SNAN) THEN RETURN (QNAN(SRC2), set IE);

   Src1.exp := SRC1[62:52];
   Src1.fraction := SRC1[51:0];
   IF ((Src1.exp = 0 ) and (Src1.fraction != 0)) THEN// Src1 is a denormal number

         IF DAZ THEN Src1.fraction := 0;
         ELSE IF (SRC2 <> QNAN) Set DE; FI;
   FI;


    Src2.exp := SRC2[62:52];
    Src2.fraction := SRC2[51:0];
    IF ((Src2.exp = 0) and (Src2.fraction !=0 )) THEN// Src2 is a denormal number

          IF DAZ THEN Src2.fraction := 0;
          ELSE IF (SRC1 <> QNAN) Set DE; FI;
    FI;

    IF (SRC2 = QNAN) THEN{TMP[63:0] := SRC1[63:0]}
    ELSE IF(SRC1 = QNAN) THEN{TMP[63:0] := SRC2[63:0]}
    ELSE IF (Both SRC1, SRC2 are magnitude-0 and opposite-signed) TMP[63:0] := from Table 5-22
    ELSE IF (Both SRC1, SRC2 are magnitude-equal and opposite-signed and CmpOpCtl[1:0] > 01) TMP[63:0] := from Table 5-23
    ELSE

          Case(CmpOpCtl[1:0])
          00: TMP[63:0] := (SRC1[63:0]  SRC2[63:0]) ? SRC1[63:0] : SRC2[63:0];
          01: TMP[63:0] := (SRC1[63:0]  SRC2[63:0]) ? SRC2[63:0] : SRC1[63:0];
          10: TMP[63:0] := (ABS(SRC1[63:0])  ABS(SRC2[63:0])) ? SRC1[63:0] : SRC2[63:0];
          11: TMP[63:0] := (ABS(SRC1[63:0])  ABS(SRC2[63:0])) ? SRC2[63:0] : SRC1[63:0];
          ESAC;
    FI;

    Case(SignSelCtl[1:0])
    00: dest := (SRC1[63] << 63) OR (TMP[62:0]);// Preserve Src1 sign bit
    01: dest := TMP[63:0];// Preserve sign of compare result
    10: dest := (0 << 63) OR (TMP[62:0]);// Zero out sign bit
    11: dest := (1 << 63) OR (TMP[62:0]);// Set the sign bit
    ESAC;
    RETURN dest[63:0];
}

CmpOpCtl[1:0]= imm8[1:0];
SignSelCtl[1:0]=imm8[3:2];

VRANGEPD (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := RangeDP (SRC1[i+63:i], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0]);

                  ELSE DEST[i+63:i] := RangeDP (SRC1[i+63:i], SRC2[i+63:i], CmpOpCtl[1:0], SignSelCtl[1:0]);

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

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-1023.


VRANGEPD zmm_dst, zmm_src, zmm_1023, 02h;

Where:
            zmm_dst is the destination operand.
            zmm_src is the input operand to compare against +/-1023 (this is SRC1).
            zmm_1023 is the reference operand, contains the value of 1023 (and this is SRC2).
            IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of SRC1.sign.

In case |zmm_src| < 1023 (i.e., SRC1 is smaller than 1023 in magnitude), then its value will be written into
zmm_dst. Otherwise, the value stored in zmm_dst will get the value of 1023 (received on zmm_1023, which is
SRC2).
However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from zmm_src. So, even
in the case of |zmm_src|  1023, the selected sign of SRC1 is kept.
Thus, if zmm_src < -1023, the result of VRANGEPD will be the minimal value of -1023 while if zmm_src > +1023,
the result of VRANGE will be the maximal value of +1023.
```

## Intel C/C++ 内在编译器

```c
VRANGEPD __m512d _mm512_range_pd ( __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_range_round_pd ( __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m512d _mm512_mask_range_pd (__m512 ds, __mmask8 k, __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_mask_range_round_pd (__m512d s, __mmask8 k, __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m512d _mm512_maskz_range_pd ( __mmask8 k, __m512d a, __m512d b, int imm);
VRANGEPD __m512d _mm512_maskz_range_round_pd ( __mmask8 k, __m512d a, __m512d b, int imm, int sae);
VRANGEPD __m256d _mm256_range_pd ( __m256d a, __m256d b, int imm);
VRANGEPD __m256d _mm256_mask_range_pd (__m256d s, __mmask8 k, __m256d a, __m256d b, int imm);
VRANGEPD __m256d _mm256_maskz_range_pd ( __mmask8 k, __m256d a, __m256d b, int imm);
VRANGEPD __m128d _mm_range_pd ( __m128 a, __m128d b, int imm);
VRANGEPD __m128d _mm_mask_range_pd (__m128 s, __mmask8 k, __m128d a, __m128d b, int imm);
VRANGEPD __m128d _mm_maskz_range_pd ( __mmask8 k, __m128d a, __m128d b, int imm);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

见表2-48"E2类例外条件"。
