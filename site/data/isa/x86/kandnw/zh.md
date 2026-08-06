---
summary: 逻辑 AND NOT 面具
---

## 说明

在向量掩码k2和向量掩码k3之间执行一个位元化的AND NOT,并将结果写入向量掩码k1.

## 行动

```text
KANDNW
DEST[15:0] := (BITWISE NOT SRC1[15:0]) BITWISE AND SRC2[15:0]
DEST[MAX_KL-1:16] := 0

KANDNB
DEST[7:0] := (BITWISE NOT SRC1[7:0]) BITWISE AND SRC2[7:0]
DEST[MAX_KL-1:8] := 0

KANDNQ
DEST[63:0] := (BITWISE NOT SRC1[63:0]) BITWISE AND SRC2[63:0]
DEST[MAX_KL-1:64] := 0

KANDND
DEST[31:0] := (BITWISE NOT SRC1[31:0]) BITWISE AND SRC2[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ 内在编译器

```c
KANDNW __mmask16 _mm512_kandn(__mmask16 a, __mmask16 b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-65"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory Arg)".
