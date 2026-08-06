---
summary: 标量 FP16 值的测试类型
---

## 说明

本指令检查 源操作数 中由 imm8 字节中的设置位指定的特殊类别中的低 FP16 值. Imm8中的每个设置位指定了一个浮点值的类别,输入数据元素被分类为该类别;类别见表5-12. 输入值所有指定类别的分类结果合并排列,形成输入元素的最后布尔结果。 结果按照写掩码写到目的地面具登记册中的低位. 目的地面具中的其他比特收录被清零.

## 行动

```text
// see VFPCLASSPH

VFPCLASSSH dest{k2}, src, imm8
IF k2[0] or *no writemask*:

    DEST.bit[0] := check_fp_class_fp16(src.fp16[0], imm8)
ELSE:

    DEST.bit[0] := 0

DEST[MAXKL-1:1] := 0
```

## Intel C/C++ 内在编译器

```c
VFPCLASSSH __mmask8 _mm_fpclass_sh_mask (__m128h a, int imm8);
VFPCLASSSH __mmask8 _mm_mask_fpclass_sh_mask (__mmask8 k1, __m128h a, int imm8);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-60,"Type E10 Class Exception Centers".
