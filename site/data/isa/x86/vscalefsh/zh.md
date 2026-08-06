---
summary: 缩放 标量 FP16 值与 FP16 值
---

## 说明

本指令通过将第一源操作数中低的FP16元素乘以2来达到FP16元素在第二源操作数中的功率,实现浮点比例,存储目标操作数中低的元素的结果.

目标操作数的比特127:16从第一源操作数的相应比特复制. 比特斯MAXVL-1:128 其中目标操作数为被清零. 目的地的低FP16元素根据写掩码更新.

此操作的方程式由:

```text
     xmm1 := xmm2 * 2floor(xmm3).
```

地板(xmm3)是指最大整数值xmm3.

如果结果无法在 FP16 中表示,则会发出适当的溢出响应(对于正缩放 操作数),或者适当的下流响应(对于负缩放 操作数). 溢出和下流响应取决于四舍五入模式(对于符合IEEE的四舍五入),以及MXCSR的其他设置(例外面具位,FTZ位),以及SAE位.

表5-39和表5-40列出了特殊情况输入值的处理情况。

## 行动

```text
VSCALEFSH dest{k1}, src1, src2
IF (EVEX.b = 1) and no memory operand:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] or *no writemask*:
    dest.fp16[0] := scale_fp16(src1.fp16[0], src2.fp16[0]) // see VSCALEFPH

ELSE IF *zeroing*:
    dest.fp16[0] := 0

//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VSCALEFSH __m128h _mm_mask_scalef_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_maskz_scalef_round_sh (__mmask8 k, __m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_scalef_round_sh (__m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_mask_scalef_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VSCALEFSH __m128h _mm_maskz_scalef_sh (__mmask8 k, __m128h a, __m128h b);
VSCALEFSH __m128h _mm_scalef_sh (__m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Underflow, Overflow, Precision, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-49"Type E3类例外条件".

异常-操作数例外(#D)为src1 操作数进行检查和信号,但不为src2 操作数. 只有在src2 操作数不是NaN的情况下,才会检查src1 操作数的异常-操作数例外. 如果src2 操作数是NaN,则处理器生成NaN,不信号异常-操作数例外,即使src1 操作数是异常的.
