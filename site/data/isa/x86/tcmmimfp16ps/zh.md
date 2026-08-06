---
summary: 复合梯子积成的乘法
---

## 说明

这些指令执行包含复杂元素的两块瓷砖的矩阵乘法,并将结果堆积成一个包装的单精度瓷砖. 输入瓦片 tmm2 和 tmm3 中的每个 dword 元素被解释为包含 FP16 真实部分和 FP16 想象部分的复数.

TCMMRLFP16PS计算结果的真实部分. 对于每个可能的组合(tmm2之行,列为tmm3),指令在所有相应的复合数上进行一组乘积(一个来自tmm2,一个来自tmm3). Tmm2元素的真实部分与对应的tmm3元素的真实部分相乘,否定的假想部分与对应的tmm3元素的假想部分相乘. 两项累积结果相加,然后累积为tmm1的相应行和列.

TCMMIMFP16PS计算结果的假想部分. 对于每个可能的组合(tmm2之行,列为tmm3),指令在所有相应的复合数上进行一组乘积(一个来自tmm2,一个来自tmm3). Tmm2元素的假想部分与对应的tmm3元素的真实部分相乘,而tmm2元素的真实部分与对应的tmm3元素的假想部分相乘. 两项累积结果相加,然后累积为tmm1的相应行和列.

在进行FMA的每次堆积时,使用"径向最近的偶数"四舍五入模式. 输出异常常被冲到零,但FP16输入异常不作为零处理.

MXCSR不咨询也不更新.

在 Intel TSX 交易中执行这些指令的任何尝试都会导致交易中止.

## 行动

```text
TCMMIMFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:


s1e = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0])                 // real
s2e = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])                 // real
s1o = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+1])                 // imaginary
s2o = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])                 // imaginary

// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

temp1.fp32[2*n+0] = fma32(temp1.fp32[2*n+0], s1o, s2e, daz=1, ftz=1, sae=1, rc=RNE)
temp1.fp32[2*n+1] = fma32(temp1.fp32[2*n+1], s1e, s2o, daz=1, ftz=1, sae=1, rc=RNE)

for n in 0 ... elements_dest-1:
      // DAZ=FTZ=1, RNE rounding.
      // MXCSR is neither consulted nor updated.
      // No exceptions raised or denoted.
      tmpf32 := temp1.fp32[2*n] + temp1.fp32[2*n+1]
      srcdest.row[m].fp32[n] := srcdest.row[m].fp32[n] + tmpf32

write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)

zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tileconfig_start()

TCMMRLFP16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of fp16
elements_src1 := tsrc1.colsb / 4
elements_dest := tsrcdest.colsb / 4
elements_temp := tsrcdest.colsb / 2 // Count is in fp16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1 ] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:

s1e = cvt_fp16_to_fp32(tsrc1.row[m].fp16[2*k+0])                 // real
s2e = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+0])                 // real
s1o = cvt_fp16_to_fp32(-tsrc1.row[m].fp16[2*k+1])                // imaginary: "-" is for imaginary*imaginary
s2o = cvt_fp16_to_fp32(tsrc2.row[k].fp16[2*n+1])                 // imaginary

// FP32 FMA with DAZ=FTZ=1, RNE rounding.
// MXCSR is neither consulted nor updated.
// No exceptions raised or denoted.

temp1.fp32[2*n+0] = fma32(temp1.fp32[2*n+0], s1e, s2e, daz=1, ftz=1, sae=1, rc=RNE) // real
temp1.fp32[2*n+1] = fma32(temp1.fp32[2*n+1], s1o, s2o, daz=1, ftz=1, sae=1, rc=RNE) // imaginary

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

例外 AMX-E4;详见第2.10节,"Intel(R) AMX 指令例外类".
