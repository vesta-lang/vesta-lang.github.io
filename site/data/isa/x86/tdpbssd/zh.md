---
summary: 带有 Dword 的签名/ 未签名字节的点产品
---

## 说明

对于每个可能的组合(tmm2的行,tmm3的列),指令在所有对应的4个字节元素上执行一组SIMD的点产品,一个来自tmm2,一个来自tmm3,添加这些点产品的结果,然后将结果累积到tmm1的相应行和列中. 输入片 tmm2 和 tmm3 中的每个 dword 被解释为四个字节元素. 这些文件可以签署或未签署。 双字母图案SU,US,SS,UU中的每个字母分别以tmm2和tmm3表示数值的签名/未签名性质.

在Intel TSX交易中执行TDPBSSD/TDPBSUD/TDPBUSD/TDPBUUD指令的任何尝试都会导致交易中止.

## 行动

```text
define DPBD(c,x,y):// arguments are dwords

    if *x operand is signed*:
          extend_src1 := SIGN_EXTEND

    else:
          extend_src1 := ZERO_EXTEND

    if *y operand is signed*:
          extend_src2 := SIGN_EXTEND

    else:
          extend_src2 := ZERO_EXTEND

    p0dword := extend_src1(x.byte[0]) * extend_src2(y.byte[0])
    p1dword := extend_src1(x.byte[1]) * extend_src2(y.byte[1])
    p2dword := extend_src1(x.byte[2]) * extend_src2(y.byte[2])
    p3dword := extend_src1(x.byte[3]) * extend_src2(y.byte[3])

    c := c + p0dword + p1dword + p2dword + p3dword


TDPBSSD, TDPBSUD, TDPBUSD, TDPBUUD tsrcdest, tsrc1, tsrc2 (Register Only Version)
// C = m x n (tsrcdest), A = m x k (tsrc1), B = k x n (tsrc2)

tsrc1_elements_per_row := tsrc1.colsb / 4
tsrc2_elements_per_row := tsrc2.colsb / 4
tsrcdest_elements_per_row := tsrcdest.colsb / 4

for m in 0 ... tsrcdest.rows-1:
    tmp := tsrcdest.row[m]
    for k in 0 ... tsrc1_elements_per_row-1:
          for n in 0 ... tsrcdest_elements_per_row-1:
                DPBD( tmp.dword[n], tsrc1.row[m].dword[k], tsrc2.row[k].dword[n] )
    write_row_and_zero(tsrcdest, m, tmp, tsrcdest.colsb)

zero_upper_rows(tsrcdest, tsrcdest.rows)
zero_tilecfg_start()
```

## Intel C/C++ 内在编译器

```c
TDPBSSD void _tile_dpbssd(__tile dst, __tile src1, __tile src2);
TDPBSUD void _tile_dpbsud(__tile dst, __tile src1, __tile src2);
TDPBUSD void _tile_dpbusd(__tile dst, __tile src1, __tile src2);
TDPBUUD void _tile_dpbuud(__tile dst, __tile src1, __tile src2);
```

## 受影响的旗帜

None.

例外 AMX-E4;详见第2.10节,"Intel(R) AMX 指令例外类".
