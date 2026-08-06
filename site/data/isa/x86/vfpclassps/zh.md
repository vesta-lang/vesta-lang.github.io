---
summary: 包装浮点32值的测试类型
---

## 说明

FPCLASSPS 指令检查 打包单精度浮点值 特殊类别,由 imm8 字节中的设置位指定. Imm8中的每个设置位指定了浮点值的类别,输入数据元素被分类对照. 输入值所有指定类别的分类结果合并排列,形成输入元素的最后布尔结果。 每个元素的结果都按照写掩码 k1在面具寄存器k2中写入相应的位. 目的地的位 [MAQQKL-1: 16/8/4] 已清除.

Imm8指定的分类类别见图5-13. 表5-11列出了每个类别的分类测试。

源操作数是一个ZMM/YMM/XMM的登记器,一个512/256/128位的内存位置,或者从32位的内存位置广播的512/256/128位矢量.

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
CheckFPClassSP (tsrc[31:0], imm8[7:0]){

//* Start checking the source operand for special type *//
NegNum := tsrc[31];
IF (tsrc[30:23]=0FFh) Then ExpAllOnes := 1; FI;
IF (tsrc[30:23]=0h) Then ExpAllZeros := 1;

IF (ExpAllZeros AND MXCSR.DAZ) Then

      MantAllZeros := 1;
ELSIF (tsrc[22:0]=0h) Then

      MantAllZeros := 1;

FI;

ZeroNumber= ExpAllZeros AND MantAllZeros
SignalingBit= tsrc[22];


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
} //* end of CheckSPClassSP() *//

VFPCLASSPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

       THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN

                    DEST[j] := CheckFPClassDP(SRC1[31:0], imm8[7:0]);

                  ELSE

                    DEST[j] := CheckFPClassDP(SRC1[i+31:i], imm8[7:0]);

             FI;

       ELSE DEST[j] := 0                  ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VFPCLASSPS __mmask16 _mm512_fpclass_ps_mask( __m512 a, int c);
VFPCLASSPS __mmask16 _mm512_mask_fpclass_ps_mask( __mmask16 m, __m512 a, int c) VFPCLASSPS __mmask8 _mm256_fpclass_ps_mask( __m256 a, int c) VFPCLASSPS __mmask8 _mm256_mask_fpclass_ps_mask( __mmask8 m, __m256 a, int c) VFPCLASSPS __mmask8 _mm_fpclass_ps_mask( __m128 a, int c) VFPCLASSPS __mmask8 _mm_mask_fpclass_ps_mask( __mmask8 m, __m128 a, int c);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
