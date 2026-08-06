---
summary: OR 遮盖和设置旗帜
---

## 说明

在矢量掩码登记k2和矢量掩码登记k1之间执行位元OR,并根据操作结果设置CF和ZF.

如果两个来源均为0x0,则设置ZF旗. 如果在OR操作完成后,操作结果为全部1's,则CF被设定.

## 行动

```text
KORTESTW
TMP[15:0] := DEST[15:0] BITWISE OR SRC[15:0]
IF(TMP[15:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[15:0]=FFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;

KORTESTB
TMP[7:0] := DEST[7:0] BITWISE OR SRC[7:0]
IF(TMP[7:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[7:0]==FFh)
    THEN CF := 1
    ELSE CF := 0

FI;


KORTESTQ
TMP[63:0] := DEST[63:0] BITWISE OR SRC[63:0]
IF(TMP[63:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[63:0]==FFFFFFFF_FFFFFFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;

KORTESTD
TMP[31:0] := DEST[31:0] BITWISE OR SRC[31:0]
IF(TMP[31:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[31:0]=FFFFFFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;
```

## Intel C/C++ 内在编译器

```c
KORTESTW __mmask16 _mm512_kortest[cz](__mmask16 a, __mmask16 b);
```

## 受影响的旗帜

如果两个源的OR-ing结果均为0s,则设置ZF旗.

如果两个源的OR-ing结果均为1s,则设定了CF旗.

OF, SF, AF,和PF的旗帜被设定为0.

## 其他例外

参见表2-65"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory Arg)".
