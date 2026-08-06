---
summary: 标量 单精度浮点 引信倍增
---

## 说明

本指令计算了4个顺序的标量 引信单精度浮点 乘法加法指令,在4个步骤中每个步骤都有一个顺序选择的内存操作数.

在上述框中,使用"+3"的标记来表示指令访问 4 源注册基于 操作数;来源是连续的,从4个边界的多个开始,并包含编码的注册 操作数.

本指令支持内存断层抑制. 如果最小的口罩位设为1,或者使用"无口罩"编码,则整个内存操作数被加载.

Tuple类型Tuple1 4X意味着四个32位元素(16字节)被本指令的内存操作部分引用.

在每个 FMA 边界进行四舍五入。 例外情况也按顺序处理。 第一个FMA的计算前和计算后例外优先于第二个FMA的计算前和计算后例外等.

## 行动

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

define NFMA_SS(vl, dest, k1, msrc, regs_loaded, src_base, posneg):
    tmpdest := dest

    // reg[] is an array representing the SIMD register file.

    IF k1[0] or *no writemask*:
         FOR j := 0 to regs_loaded - 1:

                IF posneg = 0:
                    tmpdest.single[0] := RoundFPControl_MXCSR(tmpdest.single[0] - reg[src_base + j ].single[0] * msrc.single[j])

                ELSE:
                    tmpdest.single[0] := RoundFPControl_MXCSR(tmpdest.single[0] + reg[src_base + j ].single[0] * msrc.single[j])

    ELSE IF *zeroing*:
         tmpdest.single[0] := 0

    dest := tmpdst
    dest[MAX_VL-1:VL] := 0



V4FMADDSS and V4FNMADDSS dest{k1}, src1, msrc (AVX512)
VL = 128

regs_loaded := 4
src_base := src_reg_id & ~3 // for src1 operand
posneg := 0 if negative form, 1 otherwise
NFMA_SS(vl, dest, k1, msrc, regs_loaded, src_base, posneg)
```

## Intel C/C++ 内在编译器

```c
V4FMADDSS __m128 _mm_4fmadd_ss(__m128, __m128x4, __m128 *);
V4FMADDSS __m128 _mm_mask_4fmadd_ss(__m128, __mmask8, __m128x4, __m128 *);
V4FMADDSS __m128 _mm_maskz_4fmadd_ss(__mmask8, __m128, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_4fnmadd_ss(__m128, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_mask_4fnmadd_ss(__m128, __mmask8, __m128x4, __m128 *);
V4FNMADDSS __m128 _mm_maskz_4fnmadd_ss(__mmask8, __m128, __m128x4, __m128 *);
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

See Type E2; additionally:

```text
#UD               If the EVEX broadcast bit is set to 1.
```

```text
#UD               If the MODRM.mod = 0b11.
```
