---
summary: 将两个包装的单一数据转换成一个包装的BF16数据
---

## 说明

将两个 SIMD 包装单数据的登记器转换成一个包装BF16数据的登记器。

本指令不支持内存断层抑制.

本指令使用"距离最近的(甚至)"四舍五入模式. 输出异常常被冲到零,输入异常常被作为零处理. MXCSR不咨询也不更新. 没有生成 浮点 例外 。

## 行动

```text
VCVTNE2PS2BF16 dest, src1, src2
VL = (128, 256, 512)
KL = VL/16

origdest := dest
FOR i := 0 to KL-1:

    IF k1[ i ] or *no writemask*:
          IF i < KL/2:
                IF src2 is memory and evex.b == 1:
                    t := src2.fp32[0]
                ELSE:
                    t := src2.fp32[ i ]
          ELSE:
               t := src1.fp32[ i-KL/2]

// See VCVTNEPS2BF16 for definition of convert helper function
dest.word[i] := convert_fp32_to_bfloat16(t)

    ELSE IF *zeroing*:
         dest.word[ i ] := 0

    ELSE: // Merge masking, dest element unchanged
         dest.word[ i ] := origdest.word[ i ]

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTNE2PS2BF16 __m128bh _mm_cvtne2ps_pbh (__m128, __m128);
VCVTNE2PS2BF16 __m128bh _mm_mask_cvtne2ps_pbh (__m128bh, __mmask8, __m128, __m128);
VCVTNE2PS2BF16 __m128bh _mm_maskz_cvtne2ps_pbh (__mmask8, __m128, __m128);
VCVTNE2PS2BF16 __m256bh _mm256_cvtne2ps_pbh (__m256, __m256);
VCVTNE2PS2BF16 __m256bh _mm256_mask_cvtne2ps_pbh (__m256bh, __mmask16, __m256, __m256);
VCVTNE2PS2BF16 __m256bh _mm256_maskz_cvtne2ps_ pbh (__mmask16, __m256, __m256);
VCVTNE2PS2BF16 __m512bh _mm512_cvtne2ps_pbh (__m512, __m512);
VCVTNE2PS2BF16 __m512bh _mm512_mask_cvtne2ps_pbh (__m512bh, __mmask32, __m512, __m512);
VCVTNE2PS2BF16 __m512bh _mm512_maskz_cvtne2ps_pbh (__mmask32, __m512, __m512);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-52"Type E4NF类例外条件".
