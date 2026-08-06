---
summary: 包装的浮点32值限制范围计算
---

## 说明

本指令从第一源操作数(第二个操作数)和第二源操作数(第三个操作数)的两组组合输入单精度浮点值中计算出4/8/16范围操作输出. 范围输出在写mask k1下写到目的操作(第一个操作).

比特7:4的imm8字节必须是0. 范围操作输出分为两个部分,每个部分由imm8 [3:0] 内的一个双位控制字段配置:

* Imm8[1:0] 指定初始比较操作为最大、最小、最小绝对值或最小值之一

输入值对的绝对值。 每次比较两个输入值都会产生一个中间结果,结合符号选择控制(imm8[3:2])来确定最终范围操作输出.

* Imm8[3:2] 指定范围操作输出的标志为以下之一: 从第一个输入

值,来自比较结果,设置或清晰。

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

当一个或多个输入值是NAN时,比较操作可能会发出无效例外信号(IE). 输入值增加的一个细节是NAN,列在表5-21. 如果比较提高了一个IE,则符号选择控制(imm8[3:2])对射程操作输出无效;这也在表5-21中注明.

当两个输入值都是相反征兆的零时,在范围比较操作中MIN/MAX的比较操作与在概念上相似的浮点 MIN/MAX操作略有不同,这些操作见于指令VMAXPD/VMINPD. MIN/MAX/MIN ABS/MAQQABS操作VRANGEPD/PS/SD/SS操作的0级,反标输入箱的详情见表5-22.

此外,与表5-23所列结果相比,具有相反信号输入值的非零、等宽的MIN ABS或MAQQABS操作。

## 行动

```text
RangeSP(SRC1[31:0], SRC2[31:0], CmpOpCtl[1:0], SignSelCtl[1:0])
{

    // Check if SNAN and report IE, see also Table 5-21
    IF (SRC1=SNAN) THEN RETURN (QNAN(SRC1), set IE);
    IF (SRC2=SNAN) THEN RETURN (QNAN(SRC2), set IE);

    Src1.exp := SRC1[30:23];
    Src1.fraction := SRC1[22:0];
    IF ((Src1.exp = 0 ) and (Src1.fraction != 0 )) THEN// Src1 is a denormal number

          IF DAZ THEN Src1.fraction := 0;
          ELSE IF (SRC2 <> QNAN) Set DE; FI;
    FI;
    Src2.exp := SRC2[30:23];
    Src2.fraction := SRC2[22:0];
    IF ((Src2.exp = 0 ) and (Src2.fraction != 0 )) THEN// Src2 is a denormal number
          IF DAZ THEN Src2.fraction := 0;
          ELSE IF (SRC1 <> QNAN) Set DE; FI;
    FI;

    IF (SRC2 = QNAN) THEN{TMP[31:0] := SRC1[31:0]}
    ELSE IF(SRC1 = QNAN) THEN{TMP[31:0] := SRC2[31:0]}
    ELSE IF (Both SRC1, SRC2 are magnitude-0 and opposite-signed) TMP[31:0] := from Table 5-22
    ELSE IF (Both SRC1, SRC2 are magnitude-equal and opposite-signed and CmpOpCtl[1:0] > 01) TMP[31:0] := from Table 5-23
    ELSE

          Case(CmpOpCtl[1:0])
          00: TMP[31:0] := (SRC1[31:0]  SRC2[31:0]) ? SRC1[31:0] : SRC2[31:0];
          01: TMP[31:0] := (SRC1[31:0]  SRC2[31:0]) ? SRC2[31:0] : SRC1[31:0];
          10: TMP[31:0] := (ABS(SRC1[31:0])  ABS(SRC2[31:0])) ? SRC1[31:0] : SRC2[31:0];
          11: TMP[31:0] := (ABS(SRC1[31:0])  ABS(SRC2[31:0])) ? SRC2[31:0] : SRC1[31:0];
          ESAC;
    FI;
    Case(SignSelCtl[1:0])
    00: dest := (SRC1[31] << 31) OR (TMP[30:0]);// Preserve Src1 sign bit
    01: dest := TMP[31:0];// Preserve sign of compare result
    10: dest := (0 << 31) OR (TMP[30:0]);// Zero out sign bit
    11: dest := (1 << 31) OR (TMP[30:0]);// Set the sign bit
    ESAC;
    RETURN dest[31:0];
}

CmpOpCtl[1:0]= imm8[1:0];

SignSelCtl[1:0]=imm8[3:2];

VRANGEPS
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b == 1) AND (SRC2 *is memory*)
                      THEN DEST[i+31:i] := RangeSP (SRC1[i+31:i], SRC2[31:0], CmpOpCtl[1:0], SignSelCtl[1:0]);
                      ELSE DEST[i+31:i] := RangeSP (SRC1[i+31:i], SRC2[i+31:i], CmpOpCtl[1:0], SignSelCtl[1:0]);

                FI;


ELSE

     IF *merging-masking*   ; merging-masking

          THEN *DEST[i+31:i] remains unchanged*

          ELSE              ; zeroing-masking

          DEST[i+31:i] = 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-150.

VRANGEPS zmm_dst, zmm_src, zmm_150, 02h;

Where:
zmm_dst is the destination operand.
zmm_src is the input operand to compare against +/-150.
zmm_150 is the reference operand, contains the value of 150.
IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of src1.sign.

In case |zmm_src| < 150, then its value will be written into zmm_dst. Otherwise, the value stored in zmm_dst
will get the value of 150 (received on zmm_150).

However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from zmm_src. So, even
in the case of |zmm_src|  150, the selected sign of SRC1 is kept.

Thus, if zmm_src < -150, the result of VRANGEPS will be the minimal value of -150 while if zmm_src > +150,
the result of VRANGE will be the maximal value of +150.
```

## Intel C/C++ 内在编译器

```c
VRANGEPS __m512 _mm512_range_ps ( __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_range_round_ps ( __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m512 _mm512_mask_range_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_mask_range_round_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m512 _mm512_maskz_range_ps ( __mmask16 k, __m512 a, __m512 b, int imm);
VRANGEPS __m512 _mm512_maskz_range_round_ps ( __mmask16 k, __m512 a, __m512 b, int imm, int sae);
VRANGEPS __m256 _mm256_range_ps ( __m256 a, __m256 b, int imm);
VRANGEPS __m256 _mm256_mask_range_ps (__m256 s, __mmask8 k, __m256 a, __m256 b, int imm);
VRANGEPS __m256 _mm256_maskz_range_ps ( __mmask8 k, __m256 a, __m256 b, int imm);
VRANGEPS __m128 _mm_range_ps ( __m128 a, __m128 b, int imm);
VRANGEPS __m128 _mm_mask_range_ps (__m128 s, __mmask8 k, __m128 a, __m128 b, int imm);
VRANGEPS __m128 _mm_maskz_range_ps ( __mmask8 k, __m128 a, __m128 b, int imm);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

见表2-48"E2类例外条件"。
