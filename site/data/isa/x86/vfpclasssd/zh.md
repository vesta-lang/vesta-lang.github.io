---
summary: 标量浮点数的测试类型
---

## 说明

FPCLASSSD 指令检查 源操作数 中值低的 双精度浮点 特殊类别,由 imm8 字节中的设置位指定. Imm8中的每个设置位指定了浮点值的类别,输入数据元素被分类对照. 输入值所有指定类别的分类结果合并排列,形成输入元素的最后布尔结果。 其结果被写入一个面具寄存器k2中的低位,根据写作ask k1. Bits MAQQKL-1:目的地1个被清除.

Imm8指定的分类类别见图5-13. 表5-11列出了每个类别的分类测试。

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
CheckFPClassDP (tsrc[63:0], imm8[7:0]){

NegNum := tsrc[63];
IF (tsrc[62:52]=07FFh) Then ExpAllOnes := 1; FI;
IF (tsrc[62:52]=0h) Then ExpAllZeros := 1;
IF (ExpAllZeros AND MXCSR.DAZ) Then

      MantAllZeros := 1;
ELSIF (tsrc[51:0]=0h) Then

      MantAllZeros := 1;

FI;

ZeroNumber := ExpAllZeros AND MantAllZeros
SignalingBit := tsrc[51];

sNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND NOT(SignalingBit); // sNaN
qNaN_res := ExpAllOnes AND NOT(MantAllZeros) AND SignalingBit; // qNaN
Pzero_res := NOT(NegNum) AND ExpAllZeros AND MantAllZeros; // +0
Nzero_res := NegNum AND ExpAllZeros AND MantAllZeros; // -0
PInf_res := NOT(NegNum) AND ExpAllOnes AND MantAllZeros; // +Inf
NInf_res := NegNum AND ExpAllOnes AND MantAllZeros; // -Inf
Denorm_res := ExpAllZeros AND NOT(MantAllZeros); // denorm
FinNeg_res := NegNum AND NOT(ExpAllOnes) AND NOT(ZeroNumber); // -finite

bResult = ( imm8[0] AND qNaN_res ) OR (imm8[1] AND Pzero_res ) OR
            ( imm8[2] AND Nzero_res ) OR ( imm8[3] AND PInf_res ) OR
            ( imm8[4] AND NInf_res ) OR ( imm8[5] AND Denorm_res ) OR
            ( imm8[6] AND FinNeg_res ) OR ( imm8[7] AND sNaN_res );

Return bResult;


} //* end of CheckFPClassDP() *//

VFPCLASSSD (EVEX encoded version)

IF k1[0] OR *no writemask*

     THEN DEST[0] :=

       CheckFPClassDP(SRC1[63:0], imm8[7:0])

     ELSE DEST[0] := 0             ; zeroing-masking only

FI;

DEST[MAX_KL-1:1] := 0
```

## Intel C/C++ 内在编译器

```c
VFPCLASSSD __mmask8 _mm_fpclass_sd_mask( __m128d a, int c) VFPCLASSSD __mmask8 _mm_mask_fpclass_sd_mask( __mmask8 m, __m128d a, int c);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-55"E6类例外条件".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
