---
summary: BF16 叠加成包装的单精度图案的点产品
---

## 说明

本规范执行两个BF16元素的一组SIMD点产物,并将结果堆积成一个包装的单精度瓦. 输入瓦片 tmm2 和 tmm3 中的每个 dword 元素被解释为 BF16 配对. 对于每个可能的组合(tmm2的一行,tmm3的一列),指令在所有对应的BF16对上执行一组SIMD的点产品(一对来自tmm2,一对来自tmm3),添加这些点产品的结果,然后将结果累积到对应的一行和一列的tmm1.

在进行FMA的每次堆积时,使用"径向最近的偶数"四舍五入模式. 输出异常常被冲到零,输入异常常被作为零处理. MXCSR不咨询也不更新.

在 TSX 交易中执行 TDPBF16PS 指令的任何尝试都会导致交易中止.

## 行动

```text
define make_fp32(x):
    // The x parameter is bfloat16. Pack it in to upper 16b of a dword.
    // The bit pattern is a legal fp32 value. Return that bit pattern.
    dword: = 0
    dword[31:16] := x

return dword

TDPBF16PS tsrcdest, tsrc1, tsrc2
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

# src1 and src2 elements are pairs of bfloat16

elements_src1 := tsrc1.colsb / 4

elements_src2 := tsrc2.colsb / 4

elements_dest := tsrcdest.colsb / 4

elements_temp := tsrcdest.colsb / 2        // Count is in bfloat16 prior to horizontal

for m in 0 ... tsrcdest.rows-1:
    temp1[ 0 ... elements_temp-1 ] := 0
    for k in 0 ... elements_src1-1:
          for n in 0 ... elements_dest-1:

             // FP32 FMA with DAZ=FTZ=1, RNE rounding.
             // MXCSR is neither consulted nor updated.
             // No exceptions raised or denoted.

             temp1.fp32[2*n+0] += make_fp32(tsrc1.row[m].bfloat16[2*k+0]) * make_fp32(tsrc2.row[k].bfloat16[2*n+0])
             temp1.fp32[2*n+1] += make_fp32(tsrc1.row[m].bfloat16[2*k+1]) * make_fp32(tsrc2.row[k].bfloat16[2*n+1])


    for n in 0 ... elements_dest-1:
          // DAZ=FTZ=1, RNE rounding.
          // MXCSR is neither consulted nor updated.
          // No exceptions raised or denoted.
          tmpf32 := temp1.fp32[2*n] + temp1.fp32[2*n+1]
          tsrcdest.row[m].fp32[n] := tsrcdest.row[m].fp32[n] + tmpf32

    write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)

zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tilecfg_start()
```

## Intel C/C++ 内在编译器

```c
TDPBF16PS void _tile_dpbf16ps(__tile dst, __tile src1, __tile src2);
```

## 受影响的旗帜

None.

例外 AMX-E4;详见第2.10节,"Intel(R) AMX 指令例外类".
