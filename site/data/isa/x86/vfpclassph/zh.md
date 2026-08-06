---
summary: FP16 包装值的测试类型
---

## 说明

本指令检查 源操作数 中被打包的 FP16 值为特殊类别,由 imm8 字节中的设置位指定. Imm8中的每个设置位指定了一个浮点值的类别,输入数据元素被分类为该类别;类别见表5-12. 输入值所有指定类别的分类结果合并排列,形成输入元素的最后布尔结果。 结果按照写掩码写成目的地面具登记册中相应的比特.

** VFPCLASSPH/VFPCLASSSH的分类操作**

| 位数 | 类别 | 分类符 |
| --- | --- | --- |
| [0] | QNAN | QNAN 检查 |
| [1] | 波泽罗 | 检查+0 |
| [2] | 内格泽罗 | 检查 - 0 |
| [3] | 方案信息网络 | 检查 + |
| [4] | 内盖INF | 检查 - |
| [5] | 异常 | 检查异常 |

## 行动

```text
def check_fp_class_fp16(tsrc, imm8):

    negative := tsrc[15]
    exponent_all_ones := (tsrc[14:10] == 0x1F)
    exponent_all_zeros := (tsrc[14:10] == 0)
    mantissa_all_zeros := (tsrc[9:0] == 0)
    zero := exponent_all_zeros and mantissa_all_zeros
    signaling_bit := tsrc[9]

    snan := exponent_all_ones and not(mantissa_all_zeros) and not(signaling_bit)
    qnan := exponent_all_ones and not(mantissa_all_zeros) and signaling_bit
    positive_zero := not(negative) and zero
    negative_zero := negative and zero
    positive_infinity := not(negative) and exponent_all_ones and mantissa_all_zeros
    negative_infinity := negative and exponent_all_ones and mantissa_all_zeros
    denormal := exponent_all_zeros and not(mantissa_all_zeros)
    finite_negative := negative and not(exponent_all_ones) and not(zero)

    return (imm8[0] and qnan) OR
          (imm8[1] and positive_zero) OR
          (imm8[2] and negative_zero) OR
          (imm8[3] and positive_infinity) OR
          (imm8[4] and negative_infinity) OR
          (imm8[5] and denormal) OR
          (imm8[6] and finite_negative) OR
          (imm8[7] and snan)

VFPCLASSPH dest{k2}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k2[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := SRC.fp16[0]
          ELSE:
                tsrc := SRC.fp16[i]
          DEST.bit[i] := check_fp_class_fp16(tsrc, imm8)
    ELSE:
          DEST.bit[i] := 0

DEST[MAXKL-1:kl] := 0
```

## Intel C/C++ 内在编译器

```c
VFPCLASSPH __mmask8 _mm_fpclass_ph_mask (__m128h a, int imm8);
VFPCLASSPH __mmask8 _mm_mask_fpclass_ph_mask (__mmask8 k1, __m128h a, int imm8);
VFPCLASSPH __mmask16 _mm256_fpclass_ph_mask (__m256h a, int imm8);
VFPCLASSPH __mmask16 _mm256_mask_fpclass_ph_mask (__mmask16 k1, __m256h a, int imm8);
VFPCLASSPH __mmask32 _mm512_fpclass_ph_mask (__m512h a, int imm8);
VFPCLASSPH __mmask32 _mm512_mask_fpclass_ph_mask (__mmask32 k1, __m512h a, int imm8);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-51,"Type E4类例外条件".
