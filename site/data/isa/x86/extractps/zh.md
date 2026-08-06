---
summary: 提取包装的 浮点值
---

## 说明

从 源操作数(第二个操作数)中提取一个单精度浮点值,其位数为 imm8指定的32位偏移. 直接比值高于矢量长度最显著的抵消值会被忽略.

提取的 单精度浮点 值存储在 目标操作数 的低位 32 位

在64位模式中,目的地注册操作数默认操作数大小为64位. 寄存器的上方32位是零填充. REX.W被忽略了.

VEX.128和EVEX编码版本: 当VEX.W1或EVEX.W1形式以64位模式使用具有通用目的寄存器(GPR)作为目标操作数时,包装的单量为零,扩展至64位.

VEX.vvvv/EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

128位遗产 SSE 版本 : 当一个REX.W的前缀被作为目标操作数的通用寄存器(GPR)在64位模式下使用时,被包装的单数为零延伸至64位.

源注册是XMM注册. Imm8[1:0]确定起始的 DWORD 偏移以提取32位的 浮点 值.

如果VEXTRACTPS被用VEX.L=1编码,试图执行用VEX.L=1编码的指令,将导致#UD例外.

## 行动

```text
VEXTRACTPS (EVEX and VEX.128 Encoded Version)
SRC_OFFSET := IMM8[1:0]
IF (64-Bit Mode and DEST is register)

    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
    DEST[63:32] := 0
ELSE
    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
FI

EXTRACTPS (128-bit Legacy SSE Version)
SRC_OFFSET := IMM8[1:0]
IF (64-Bit Mode and DEST is register)

    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
    DEST[63:32] := 0
ELSE
    DEST[31:0] := (SRC[127:0] >> (SRC_OFFSET*32)) AND 0FFFFFFFFh
FI
```

## Intel C/C++ 内在编译器

```c
EXTRACTPS int _mm_extract_ps (__m128 a, const int nidx);
```

## SIMD 浮点 例外

None.

## 其他例外

VEX-encoded指令,参见表2-22,"第5类例外条件".

EVEX-encoded 指令,参见表2-59,"Type E9NF class Exception Centers".

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
