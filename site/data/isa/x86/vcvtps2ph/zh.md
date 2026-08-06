---
summary: 将单精度 FP 值转换为 16 位 FP 值
---

## 说明

将源操作数中包装的单精度浮值转换为半精度(16位)浮点值,并存储为目标操作数. 四舍五入模式使用直接字段(imm8)指定.

下流结果(即微小结果)被转化为异常. MXCSR.FTZ被忽略了. 如果一个源元素相对于带有DM蒙面的输入格式是非正常的,并且至少有一个PM或UM未蒙面的;SIMD的例外将随着DE,UE和PE的设置而提出.

VCVTPS2PH xmm1/mem64, xmm2, imm8

```text
             127              96 95           64 63                             32 31                          0
```

VS0

```text
                  VS3                VS2                               VS1                                           xmm2
```

convert

```text
                  convert            convert                           convert
```

```text
             127              96 95           64 63                    48 47         32 31       16 15            0
```

```text
                                                                 VH3            VH2         VH1         VH0          xmm1/mem64
```

Figure 5-7. VCVTPS2PH (128-bit Version)

即时字节定义了控制四舍五入操作的几个位字段. RC字段的效果和编码见表5-3.

** 16 位 浮点 转换指令的即时字节编码**

| 位数 | 字段名称/值 | 说明 | 注释 |
| --- | --- | --- | --- |
| RC=00B | 轮到奈亚 | 如果Imm[2]= | 0 |
| RC=01B | 掉头 |  |  |
| RC=10B | 集合起来 |  |  |
| RC=11B | 截断 |  |  |

## 行动

```text
vCvt_s2h(SRC1[31:0])
{
IF Imm[2] = 0
THEN ; using Imm[1:0] for rounding control, see Table 5-3

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Imm(SRC1[31:0]);
ELSE ; using MXCSR.RC for rounding control

    RETURN Cvt_Single_Precision_To_Half_Precision_FP_Mxcsr(SRC1[31:0]);
FI;
}


VCVTPS2PH (EVEX Encoded Versions) When DEST is a Register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] :=

             vCvt_s2h(SRC[k+31:k])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0

VCVTPS2PH (EVEX Encoded Versions) When DEST is Memory
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 16
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+15:i] :=
                vCvt_s2h(SRC[k+31:k])

          ELSE
                *DEST[i+15:i] remains unchanged* ; merging-masking

    FI;
ENDFOR

VCVTPS2PH (VEX.256 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[79:64] := vCvt_s2h(SRC1[159:128]);
DEST[95:80] := vCvt_s2h(SRC1[191:160]);
DEST[111:96] := vCvt_s2h(SRC1[223:192]);
DEST[127:112] := vCvt_s2h(SRC1[255:224]);
DEST[MAXVL-1:128] := 0

VCVTPS2PH (VEX.128 Encoded Version)
DEST[15:0] := vCvt_s2h(SRC1[31:0]);
DEST[31:16] := vCvt_s2h(SRC1[63:32]);
DEST[47:32] := vCvt_s2h(SRC1[95:64]);
DEST[63:48] := vCvt_s2h(SRC1[127:96]);
DEST[MAXVL-1:64] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VCVTPS2PH __m256i _mm512_cvtps_ph(__m512 a);
VCVTPS2PH __m256i _mm512_mask_cvtps_ph(__m256i s, __mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_maskz_cvtps_ph(__mmask16 k,__m512 a);
VCVTPS2PH __m256i _mm512_cvt_roundps_ph(__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_mask_cvt_roundps_ph(__m256i s, __mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m256i _mm512_maskz_cvt_roundps_ph(__mmask16 k,__m512 a, const int imm);
VCVTPS2PH __m128i _mm256_mask_cvtps_ph(__m128i s, __mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm256_maskz_cvtps_ph(__mmask8 k,__m256 a);
VCVTPS2PH __m128i _mm_mask_cvtps_ph(__m128i s, __mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_maskz_cvtps_ph(__mmask8 k,__m128 a);
VCVTPS2PH __m128i _mm_cvtps_ph ( __m128 m1, const int imm);
VCVTPS2PH __m128i _mm256_cvtps_ph(__m256 m1, const int imm);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal (if MXCSR.DAZ=0).

## 其他例外

VEX-encoded 指令,参见表2-26,"11类例外条件"(不报告#AC); 2.

EVEX-encoded 指令,参见表2-62,"Type E11 class Exception Centers".

Additionally:     If VEX.W=1.

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
#UD
```
