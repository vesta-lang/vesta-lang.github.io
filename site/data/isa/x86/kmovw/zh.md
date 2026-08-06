---
summary: 移动到遮盖登记册
---

## 说明

从 源操作数(第二个操作数)到 目标操作数(第一个操作数)的复制值. 来源和目标操作数可以是面具登记册,内存位置或通用. 该指示不能用于在一般用途登记册和存储地点之间传输数据。

在移动到一个面具寄存器时,结果为0延伸至MAQQKL大小(即目前64位). 当移动到一个通用寄存器(GPR)时,结果为零延伸至目的地大小. 在32位模式中,默认的GPR目的地大小为32位. 在64位模式中,默认的GPR目的地大小为64位. 注意VEX.W只能用于修改在64b模式下的GPR操作器大小.

## 行动

```text
KMOVW
IF *destination is a memory location*

    DEST[15:0] := SRC[15:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[15:0])

KMOVB
IF *destination is a memory location*

    DEST[7:0] := SRC[7:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[7:0])

KMOVQ
IF *destination is a memory location or a GPR*

    DEST[63:0] := SRC[63:0]
IF *destination is a mask register*

    DEST := ZeroExtension(SRC[63:0])

KMOVD
IF *destination is a memory location*

    DEST[31:0] := SRC[31:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[31:0])
```

## Intel C/C++ 内在编译器

```c
KMOVW __mmask16 _mm512_kmov(__mmask16 a);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

带有RR 操作数编码的指令,参见表2-65,"TYPE K20例外定义(VEX-Encoded Opmask Directions w/o Memory arg)". 带有RM或MR 操作数编码的指令,参见表2-66,"TYPE K21例外定义(VEX-Encoded Opmask Directions Agreeting memory)".
