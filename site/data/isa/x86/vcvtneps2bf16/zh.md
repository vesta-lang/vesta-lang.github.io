---
summary: 将打包的单个数据转换为打包的 BF16 数据
---

## 说明

此指令从 SIMD 寄存器或内存中装入 FP32 元素,将元素转换为 BF16,并将结果写入目的地 SIMD 寄存器.

目的地的上位寄存器超出下位转换的BF16元素被清零.

本指令使用"距离最近的(甚至)"四舍五入模式. 输出异常常被冲到零,输入异常常被作为零处理. MXCSR不咨询也不更新.

如指令操作数编码表所示,EVEX.vvvv字段不用于编码一个操作数. EVEX.vvvv是保留的,必须0b1111否则指令会#UD.

## 行动

```text
Define convert_fp32_to_bfloat16(x):
    IF x is zero or denormal:
         dest[15] := x[31] // sign preserving zero (denormal go to zero)
         dest[14:0] := 0
    ELSE IF x is infinity:
         dest[15:0] := x[31:16]
    ELSE IF x is NAN:
         dest[15:0] := x[31:16] // truncate and set MSB of the mantissa to force QNAN
         dest[6] := 1
    ELSE // normal number
         LSB := x[16]
         rounding_bias := 0x00007FFF + LSB
         temp[31:0] := x[31:0] + rounding_bias // integer add
         dest[15:0] := temp[31:16]
    RETURN dest


VCVTNEPS2BF16 dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/16

FOR i := 0 to KL/2-1:
    t := src.fp32[i]
    dest.word[i] := convert_fp32_to_bfloat16(t)

DEST[MAXVL-1:VL/2] := 0

VCVTNEPS2BF16 dest, src (EVEX encoded version)
VL = (128, 256, 512)
KL = VL/16

origdest := dest
FOR i := 0 to KL/2-1:

    IF k1[ i ] or *no writemask*:
          IF src is memory and evex.b == 1:
               t := src.fp32[0]
          ELSE:
               t := src.fp32[ i ]

         dest.word[i] := convert_fp32_to_bfloat16(t)

    ELSE IF *zeroing*:
         dest.word[ i ] := 0

    ELSE: // Merge masking, dest element unchanged
         dest.word[ i ] := origdest.word[ i ]

DEST[MAXVL-1:VL/2] := 0
```

## Intel C/C++ 内在编译器

```c
VCVTNEPS2BF16 __m128bh _mm_cvtneps_avx_pbh (__m128 __A);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_avx_pbh (__m256 __A);
VCVTNEPS2BF16 __m128bh _mm_cvtneps_pbh (__m128 a);
VCVTNEPS2BF16 __m128bh _mm_cvtneps_pbh (__m128 __A);
VCVTNEPS2BF16 __m128bh _mm_mask_cvtneps_pbh (__m128bh src, __mmask8 k, __m128 a);
VCVTNEPS2BF16 __m128bh _mm_maskz_cvtneps_pbh (__mmask8 k, __m128 a);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_pbh (__m256 a);
VCVTNEPS2BF16 __m128bh _mm256_cvtneps_pbh (__m256 __A);
VCVTNEPS2BF16 __m128bh _mm256_mask_cvtneps_pbh (__m128bh src, __mmask8 k, __m256 a);
VCVTNEPS2BF16 __m128bh _mm256_maskz_cvtneps_pbh (__mmask8 k, __m256 a);
VCVTNEPS2BF16 __m256bh _mm512_cvtneps_pbh (__m512 a);
VCVTNEPS2BF16 __m256bh _mm512_mask_cvtneps_pbh (__m256bh src, __mmask16 k, __m512 a);
VCVTNEPS2BF16 __m256bh _mm512_maskz_cvtneps_pbh (__mmask16 k, __m512 a);
```

## SIMD 浮点 例外

None.

## 其他例外

VEX-encoded 指令,参见表2-21,"第4类例外条件". EVEX-encoded 指令,参见表2-51,"第E4类例外条件".
