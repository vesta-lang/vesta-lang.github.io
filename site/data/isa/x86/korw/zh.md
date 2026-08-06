---
summary: 逻辑或遮罩
---

## 说明

执行向量掩码k2和向量掩码k3之间的位元OR,并将结果写入向量掩码k1(3-操作数形式).

## 行动

```text
KORW
DEST[15:0] := SRC1[15:0] BITWISE OR SRC2[15:0]
DEST[MAX_KL-1:16] := 0

KORB
DEST[7:0] := SRC1[7:0] BITWISE OR SRC2[7:0]
DEST[MAX_KL-1:8] := 0

KORQ
DEST[63:0] := SRC1[63:0] BITWISE OR SRC2[63:0]
DEST[MAX_KL-1:64] := 0

KORD
DEST[31:0] := SRC1[31:0] BITWISE OR SRC2[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ 内在编译器

```c
KORW __mmask16 _mm512_kor(__mmask16 a, __mmask16 b);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-65"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory Arg)".
