---
summary: 包装浮点64值的测试类型
---

## 说明

FPCLASSPD 指令检查 打包双精度浮点值 特殊类别,由 imm8 字节中的设置位指定. Imm8中的每个设置位指定了浮点值的类别,输入数据元素被分类对照. 输入值所有指定类别的分类结果合并排列,形成输入元素的最后布尔结果。 每个元素的结果都按照写掩码 k1在面具寄存器k2中写入相应的位. 目的地的位数[MAQQKL-1:8/4/2]被清除.

Imm8指定的分类类别见图5-13. 表5-11列出了每个类别的分类测试。

```text
                                7        6              5     4            3          2          1     0
                            SNaN   Neg. Finite    Denormal  Neg. INF    +INF       Neg. 0  +0        QNaN
```

图5-13. Imm8 指定 VFPCLASSPD/SD/PS/SS 特殊大小写浮点值的字节

** VFPCLASSPD/SD/PS/SS的分类操作**

| 位数 | Imm8[0] | Imm8[1] | Imm8[2] | Imm8[3] | Imm8[4] | Imm8[5] | Imm8[6] | Imm8[7] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 类别 | QNAN | 波泽罗 | 内格泽罗 | 方案信息网络 | 内盖INF | 异常 | 负数 | SNAN |
| 分类符 | 检查 | 检查 | 检查 - | 检查 | 检查 - | 检查 | 检查 | 检查 |
|  | 卡塔尔 | +0 | 0 | +INF | INF | 异常 | 负限值 | 南锡 |

## 行动

```text
CheckFPClassDP (tsrc[63:0], imm8[7:0]){

    //* Start checking the source operand for special type *//
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


VFPCLASSPD (EVEX Encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

       THEN

             IF (EVEX.b == 1) AND (SRC *is memory*)

                  THEN

                    DEST[j] := CheckFPClassDP(SRC1[63:0], imm8[7:0]);

                  ELSE

                    DEST[j] := CheckFPClassDP(SRC1[i+63:i], imm8[7:0]);

             FI;

       ELSE DEST[j] := 0                 ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ 内在编译器

```c
VFPCLASSPD __mmask8 _mm512_fpclass_pd_mask( __m512d a, int c);
VFPCLASSPD __mmask8 _mm512_mask_fpclass_pd_mask( __mmask8 m, __m512d a, int c) VFPCLASSPD __mmask8 _mm256_fpclass_pd_mask( __m256d a, int c) VFPCLASSPD __mmask8 _mm256_mask_fpclass_pd_mask( __mmask8 m, __m256d a, int c) VFPCLASSPD __mmask8 _mm_fpclass_pd_mask( __m128d a, int c) VFPCLASSPD __mmask8 _mm_mask_fpclass_pd_mask( __mmask8 m, __m128d a, int c);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-51"E4类例外条件".

Additionally:           If EVEX.vvvv != 1111B.

```text
#UD
```
