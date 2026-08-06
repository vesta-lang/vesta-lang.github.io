---
summary: 移动四方字
---

## 说明

从 源操作数(第二个操作数)复制到 目标操作数(第一个操作数)的四字. 来源和目标操作数可以是MMX技术登记册,XMM登记册,或64位内存位置. 本规范可用于移动两个MMX技术登记册或一个MMX技术登记册和一个64位内存位置之间的四字,也可以用于移动两个XMM登记册或一个XMM登记册和一个64位内存位置之间的数据. 该指令不能用于在内存位置之间传输数据.

当源操作数是一个XMM寄存器时,低四字被移动;当目标操作数是一个XMM寄存器时,四字被存储到寄存器的低四字,高四字被清除到所有0s.

在64位模式中,如果不使用VEX/EVEX编码,使用REX前缀的形式使用REX.R允许此指令访问额外的注册(XMM8-XMM15).

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果 VMOVQ 以 VEX.L = 1 编码,则试图执行以 VEX.L = 1 编码的指令将会导致

```text
#UD exception.
```

## 行动

```text
MOVQ Instruction When Operating on MMX Technology Registers and Memory Locations

    DEST := SRC;

MOVQ Instruction When Source and Destination Operands are XMM Registers
    DEST[63:0] := SRC[63:0];


    DEST[127:64] := 0000000000000000H;

MOVQ Instruction When Source Operand is XMM Register and Destination
operand is memory location:

    DEST := SRC[63:0];

MOVQ Instruction When Source Operand is Memory Location and Destination
operand is XMM register:

    DEST[63:0] := SRC;
    DEST[127:64] := 0000000000000000H;

VMOVQ (VEX.128.F3.0F 7E) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (VEX.128.66.0F D6) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E - EVEX Encoded Version) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (D6 - EVEX Encoded Version) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E) With Memory Source
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E - EVEX Encoded Version) With Memory Source
DEST[63:0] := SRC[63:0]
DEST[:MAXVL-1:64] := 0

VMOVQ (D6) With Memory DEST
DEST[63:0] := SRC2[63:0]
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VMOVQ __m128i _mm_loadu_si64( void * s);
VMOVQ void _mm_storeu_si64( void * d, __m128i s);
MOVQ m128i _mm_move_epi64(__m128i a);
```

## SIMD 浮点 例外

None.

## 其他例外

见Intel(R)64和IA-32架构软件开发者手册第3B卷第25.25.3节"SIMD在MMX注册上操作的遗产指令的例外条件".
