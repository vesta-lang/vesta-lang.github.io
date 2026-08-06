---
summary: 右移遮罩注册
---

## 说明

在第二个 操作数 (源操作数) 右移 8/16/32/64 位数,按即时指定的计数,将结果中最不重要的 8/16/32/64 位数放在 目标操作数 中. 目的地较高的位点为零延伸. 如果计数值大于7(对于字节移位),15(对于字节移位),31(对于双字移位)或63(对于四字移位),则目的地设定为0.

## 行动

```text
KSHIFTRW
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=15

    THEN DEST[15:0] := SRC1[15:0] >> COUNT;
FI;

KSHIFTRB

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=7

            THEN DEST[7:0] := SRC1[7:0] >> COUNT;
FI;

KSHIFTRQ

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=63

            THEN DEST[63:0] := SRC1[63:0] >> COUNT;
FI;


KSHIFTRD
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=31

            THEN DEST[31:0] := SRC1[31:0] >> COUNT;
FI;
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-65"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory Arg)".
