---
summary: 范围限制从 标量 浮点数平方计算
---

## 说明

本指令从第一个源操作符(第二个源操作符)和第二个源操作符(第三个源操作符)的低Qword元素的两个输入双精度浮点值中计算出一个范围操作输出. 射程输出被写入目标操作数(第一个操作数)的低qword元素在写掩码 k1下.

比特7:4的imm8字节必须是0. 范围操作输出分为两个部分,每个部分由imm8 [3:0] 内的一个双位控制字段配置:

* Imm8[1:0] 指定初始比较操作为最大、最小、最小绝对值或最小值之一

输入值对的绝对值。 每次比较两个输入值都会产生一个中间结果,结合符号选择控制(imm8[3:2])来确定最终范围操作输出.

* Imm8[3:2] 指定范围操作输出的标志为以下之一: 从第一个输入

值,来自比较结果,设置或清晰。

The encodings of imm8[1:0] and imm8[3:2] are shown in Figure 5-27.

目标操作数的128:63位从第一源操作数的相应元素复制.

当一个或多个输入值是NAN时,比较操作可能会发出无效例外信号(IE). 输入值增加的一个细节是NAN,列在表5-21. 如果比较提高了一个IE,则符号选择控制(imm8[3:2])对射程操作输出无效;这也在表5-21中注明.

当两个输入值都是相反征兆的零时,在范围比较操作中MIN/MAX的比较操作与在概念上相似的浮点 MIN/MAX操作略有不同,这些操作见于指令VMAXPD/VMINPD. MIN/MAX/MIN ABS/MAQQABS操作VRANGEPD/PS/SD/SS操作的0级,反标输入箱的详情见表5-22.

此外,与表5-23所列结果相比,具有相反信号输入值的非零、等宽的MIN ABS或MAQQABS操作。

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


VRANGESD

IF k1[0] OR *no writemask*

     THEN DEST[63:0] := RangeDP (SRC1[63:0], SRC2[63:0], CmpOpCtl[1:0], SignSelCtl[1:0]);

     ELSE

     IF *merging-masking*     ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE               ; zeroing-masking

           DEST[63:0] = 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

The following example describes a common usage of this instruction for checking that the input operand is
bounded between +/-1023.

VRANGESD xmm_dst, xmm_src, xmm_1023, 02h;

Where:
xmm_dst is the destination operand.
xmm_src is the input operand to compare against +/-1023.
xmm_1023 is the reference operand, contains the value of 1023.
IMM=02(imm8[1:0]='10) selects the Min Absolute value operation with selection of src1.sign.

In case |xmm_src| < 1023, then its value will be written into xmm_dst. Otherwise, the value stored in xmm_dst
will get the value of 1023 (received on xmm_1023).
However, the sign control (imm8[3:2]='00) instructs to select the sign of SRC1 received from xmm_src. So, even
in the case of |xmm_src|  1023, the selected sign of SRC1 is kept.
Thus, if xmm_src < -1023, the result of VRANGEPD will be the minimal value of -1023while if xmm_src > +1023,
the result of VRANGE will be the maximal value of +1023.
```

## Intel C/C++ 内在编译器

```c
VRANGESD __m128d _mm_range_sd ( __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_range_round_sd ( __m128d a, __m128d b, int imm, int sae);
VRANGESD __m128d _mm_mask_range_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_mask_range_round_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int imm, int sae);
VRANGESD __m128d _mm_maskz_range_sd ( __mmask8 k, __m128d a, __m128d b, int imm);
VRANGESD __m128d _mm_maskz_range_round_sd ( __mmask8 k, __m128d a, __m128d b, int imm, int sae);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

见表2-49"E3类例外条件"。
