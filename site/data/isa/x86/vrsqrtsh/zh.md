---
summary: 计算 标量 FP16 值的平方根的对称性
---

## 说明

本指令对第二源操作数(第三个操作数)中低FP16值的近似对等平方根进行计算,并根据写掩码 k1(第一个操作数)将结果存储为目标操作数(第一个操作数)的低字元. 此近似的最大相对误差小于2-11+2-14.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零.

特殊情况见表5-36。

## 行动

```text
VRSQRTSH dest{k1}, src1, src2
VL = 128, 256 or 512
KL := VL/16

IF k1[0] or *no writemask*:
    DEST.fp16[0] := APPROXIMATE(1.0 / SQRT(src2.fp16[0]))

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

//else DEST.fp16[0] remains unchanged
DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VRSQRTSH __m128h _mm_mask_rsqrt_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VRSQRTSH __m128h _mm_maskz_rsqrt_sh (__mmask8 k, __m128h a, __m128h b);
VRSQRTSH __m128h _mm_rsqrt_sh (__m128h a, __m128h b);
```

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded discription,参见表2-60"Type E10类例外条件".
