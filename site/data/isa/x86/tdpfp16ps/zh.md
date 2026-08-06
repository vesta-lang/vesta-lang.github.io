---
summary: FP16 叠加成包装的单精度图案的点产品
---

## 说明

本规范执行两个FP16元素的一组SIMD点产物,并将结果堆积成一个包装的单精度瓦. 输入瓦片 tmm2 和 tmm3 中的每个 dword 元素被解释为 FP16 配对. 对于每个可能的组合(tmm2的一行,tmm3的一列),指令在所有对应的FP16对上执行一组SIMD的点产品(一对来自tmm2,一对来自tmm3),添加这些点产品的结果,然后将结果累积到对应的一行和一列的tmm1.

在进行Fused Multiply-Add(FMA)的每次堆积时,均使用"向最近的偶数"四舍五入模式。 输出 FP32 异常现象总是被冲到零. 输入FP16异常常被处理,不作为零处理.

MXCSR不咨询也不更新.

在 Intel TSX 交易中执行 TDPFP16PS 指令的任何尝试都会导致交易中止.

## 行动

```text
TDPFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_src2 := tsrc2.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1 ] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:

// For this operation:
// Handle FP16 denorms. Not forcing input FP16 denorms to 0.
// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

      temp1.fp32[2*n+0] += cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0]) *cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])
      temp1.fp32[2*n+1] += cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+1]) *cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])

for n in 0 ... elements_dest-1:
      // DAZ=FTZ=1, RNE rounding.
      // MXCSR is neither consulted nor updated.


          // No exceptions raised or denoted.
          tmpf32 := temp1.fp32[2*n] + temp1.fp32[2*n+1]
          srcdest.row[m].fp32[n] := srcdest.row[m].fp32[n] + tmpf32
    write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)
zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tileconfig_start()
```

## 受影响的旗帜

None.

Exceptions

AMX-E4;详见第2.10节,"Intel(R)AMX 指令例外类".
