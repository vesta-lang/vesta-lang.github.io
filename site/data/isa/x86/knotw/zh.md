---
summary: NOT 面具登记册
---

## 说明

执行向量掩码k2的位元NOT,并将结果写入向量掩码k1.

## 行动

```text
KNOTW
DEST[15:0] := BITWISE NOT SRC[15:0]
DEST[MAX_KL-1:16] := 0

KNOTB
DEST[7:0] := BITWISE NOT SRC[7:0]
DEST[MAX_KL-1:8] := 0

KNOTQ
DEST[63:0] := BITWISE NOT SRC[63:0]
DEST[MAX_KL-1:64] := 0

KNOTD
DEST[31:0] := BITWISE NOT SRC[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ 内在编译器

```c
KNOTW __mmask16 _mm512_knot(__mmask16 a);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-65"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory Arg)".
