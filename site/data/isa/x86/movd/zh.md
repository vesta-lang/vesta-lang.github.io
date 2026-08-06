---
summary: 移动双字/ 移动四方字
---

## 说明

从源操作数(第二个操作数)复制到目标操作数(第一个操作数)的双字. 来源和目标操作数可以是通用寄存器,MMX技术登记册,XMM登记册,或32位内存位置. 本指令可用于将双字移动到MMX技术寄存器和通用寄存器或32位内存位置的低双字,也可以将双字移动到XMM寄存器和通用寄存器或32位内存位置的低双字. 该指令不能用于在MMX技术登记册之间,XMM登记册之间,通用寄存器之间,或内存位置之间传输数据.

当目标操作数是一个MMX技术登记册时,源操作数被写到寄存器的低双字,寄存器为零延伸至64位. 当目标操作数是XMM的寄存器时,源操作数会写到寄存器的低双字,寄存器为零延伸至128位.

在64位模式下,指令的默认操作大小为32位. 使用REX.B前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 参见本节开头的汇总图,用于编码数据和限制.

MOVD/Q 有 XMM 目的地 :

从 源操作数 移动一个 dword/qword 整数,并将其存储在目的地 XMM 登记册的低位 32/64 位中. 目的地的上位点 被清零. 源操作数可以是32/64位的寄存器,也可以是32/64位的内存位置.

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128). Qword操作需要使用REX.W=1.

VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零. Qword操作需要使用VEX.W=1.

EVEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零. Qword操作需要使用EVEX.W=1.

MOVD/Q with 32/64 reg/mem destination:

将来源 XMM 寄存器的低dword/qword存储到 32/64位 内存位置 或 通用寄存器 。 单词操作需要使用REX.W=1,VEX.W=1或EVEX.W=1.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

如果VMOVD或VMOVQ用VEX.L=1编码,试图执行用VEX.L=1编码的指令,将会导致#UD例外.

## 行动

```text
MOVD (When Destination Operand is an MMX Technology Register)

    DEST[31:0] := SRC;
    DEST[63:32] := 00000000H;

MOVD (When Destination Operand is an XMM Register)
    DEST[31:0] := SRC;
    DEST[127:32] := 000000000000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVD (When Source Operand is an MMX Technology or XMM Register)
    DEST := SRC[31:0];


VMOVD (VEX-Encoded Version when Destination is an XMM Register)
    DEST[31:0] := SRC[31:0]
    DEST[MAXVL-1:32] := 0

MOVQ (When Destination Operand is an XMM Register)
    DEST[63:0] := SRC[63:0];
    DEST[127:64] := 0000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVQ (When Destination Operand is r/m64)
    DEST[63:0] := SRC[63:0];

MOVQ (When Source Operand is an XMM Register or r/m64)
    DEST := SRC[63:0];

VMOVQ (VEX-Encoded Version When Destination is an XMM Register)
    DEST[63:0] := SRC[63:0]
    DEST[MAXVL-1:64] := 0

VMOVD (EVEX-Encoded Version When Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] := 0

VMOVQ (EVEX-Encoded Version When Destination is an XMM Register)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0
```

## Intel C/C++ 内在编译器

```c
MOVD __m64 _mm_cvtsi32_si64 (int i ) MOVD int _mm_cvtsi64_si32 ( __m64m ) MOVD __m128i _mm_cvtsi32_si128 (int a) MOVD int _mm_cvtsi128_si32 ( __m128i a) MOVQ __int64 _mm_cvtsi128_si64(__m128i);
MOVQ __m128i _mm_cvtsi64_si128(__int64);
VMOVD __m128i _mm_cvtsi32_si128( int);
VMOVD int _mm_cvtsi128_si32( __m128i );
VMOVQ __m128i _mm_cvtsi64_si128 (__int64);
VMOVQ __int64 _mm_cvtsi128_si64(__m128i );
VMOVQ __m128i _mm_loadl_epi64( __m128i * s);
VMOVQ void _mm_storel_epi64( __m128i * d, __m128i s);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件".

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".

Additionally:

```text
#UD               If VEX.L = 1.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
