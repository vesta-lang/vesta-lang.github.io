---
summary: 包装的 单精度浮点 倍增
---

## 说明

本指令计算了4个按顺序包装的单精度浮点乘法加法指令,在4个步骤中每个步骤中都有一个按顺序选择的内存操作数.

在上述框中,使用"+3"的标记来表示该指令基于操作数的4源注册;来源是连续的,从4个边界的多个开始,并包含编码的注册号操作数.

本指令支持内存断层抑制. 整个内存操作数如果16个最低显著的面具比特中任何一个被设定为1,或者使用"无面具"编码,则被加载.

Tuple类型Tuple1 4X意味着四个32位元素(16字节)被本指令的内存操作部分引用.

在每个FMA(喷出乘数和添加)边界进行四舍五入。 例外情况也按顺序处理。 第一个FMA的计算前和计算后例外优先于第二个FMA的计算前和计算后例外等.

## 行动

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

define NFMA_PS(kl, vl, dest, k1, msrc, regs_loaded, src_base, posneg):
    tmpdest := dest

// reg[] is an array representing the SIMD register file.
FOR j := 0 to regs_loaded-1:

     FOR i := 0 to kl-1:

            IF k1[i] or *no writemask*:

                  IF posneg = 0:
                     tmpdest.single[i] := RoundFPControl_MXCSR(tmpdest.single[i] - reg[src_base + j ].single[i] * msrc.single[j])

                  ELSE:
                     tmpdest.single[i] := RoundFPControl_MXCSR(tmpdest.single[i] + reg[src_base + j ].single[i] * msrc.single[j])

            ELSE IF *zeroing*:
                tmpdest.single[i] := 0

dest := tmpdst
dest[MAX_VL-1:VL] := 0

V4FMADDPS and V4FNMADDPS dest{k1}, src1, msrc (AVX512)
KL, VL = (16,512)

regs_loaded := 4
src_base := src_reg_id & ~3 // for src1 operand
posneg := 0 if negative form, 1 otherwise
NFMA_PS(kl, vl, dest, k1, msrc, regs_loaded, src_base, posneg)
```

## Intel C/C++ 内在编译器

```c
V4FMADDPS __m512 _mm512_4fmadd_ps( __m512, __m512x4, __m128 *);
V4FMADDPS __m512 _mm512_mask_4fmadd_ps(__m512, __mmask16, __m512x4, __m128 *);
V4FMADDPS __m512 _mm512_maskz_4fmadd_ps(__mmask16, __m512, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_4fnmadd_ps(__m512, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_mask_4fnmadd_ps(__m512, __mmask16, __m512x4, __m128 *);
V4FNMADDPS __m512 _mm512_maskz_4fnmadd_ps(__mmask16, __m512, __m512x4, __m128 *);
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
