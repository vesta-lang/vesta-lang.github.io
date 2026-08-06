---
summary: 提取字节/字节/字节
---

## 说明

在 imm8 [3:0] 确定的字节/字节/字节中从源 XMM 寄存器中提取一个字节/字节整数值。 目的地可以是寄存器或字节/字节/qword 内存位置. 如果目的地是寄存器,则寄存器的上位是0延伸.

在遗留的非VEX编码版本中,如果目标操作数是一个寄存器,则PEXTRB/PEXTRD的64位模式中默认的操作数大小是64位,最小的字节/字节数据上方的位被零填充. PEXTRQ在非64位模式中无法编码,在64位模式中需要REX.W.

说明: 在VEX.128编码的版本中,VEX.vvvv是保留的,必须是1111b,VEX.L必须是0,否则指令会是#UD. 在EVEX.128编码的版本中,EVEX.vvvv是保留的,必须是1111b,EVEX.L"L必须是0,否则指令会是#UD. 如果目标操作数是一个寄存器,则VPEXTRB/VPEXTRD的64位模式中默认的操作数大小是64位,在最小的字节/字节/字节数据上方的位被零填充.

## 行动

```text
CASE of
    PEXTRB: SEL := COUNT[3:0];
                TEMP := (Src >> SEL*8) AND FFH;
                IF (DEST = Mem8)
                       THEN
                       Mem8 := TEMP[7:0];
                ELSE IF (64-Bit Mode and 64-bit register selected)
                       THEN
                             R64[7:0] := TEMP[7:0];
                             r64[63:8] := ZERO_FILL; };
                ELSE
                             R32[7:0] := TEMP[7:0];
                             r32[31:8] := ZERO_FILL; };
                FI;
    PEXTRD:SEL := COUNT[1:0];
                TEMP := (Src >> SEL*32) AND FFFF_FFFFH;
                DEST := TEMP;
    PEXTRQ: SEL := COUNT[0];
                TEMP := (Src >> SEL*64);
                DEST := TEMP;

EASC:

VPEXTRTD/VPEXTRQ
IF (64-Bit Mode and 64-bit dest operand)
THEN

    Src_Offset := imm8[0]
    r64/m64 := (Src >> Src_Offset * 64)
ELSE
    Src_Offset := imm8[1:0]
    r32/m32 := ((Src >> Src_Offset *32) AND 0FFFFFFFFh);
FI

VPEXTRB ( dest=m8)
SRC_Offset := imm8[3:0]
Mem8 := (Src >> Src_Offset*8)

VPEXTRB ( dest=reg)
IF (64-Bit Mode )
THEN

    SRC_Offset := imm8[3:0]
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh)
    DEST[63:8] := ZERO_FILL;
ELSE
    SRC_Offset := imm8[3:0];
    DEST[7:0] := ((Src >> Src_Offset*8) AND 0FFh);
    DEST[31:8] := ZERO_FILL;
FI
```

## Intel C/C++ 内在编译器

```c
PEXTRB int _mm_extract_epi8 (__m128i src, const int ndx);
PEXTRD int _mm_extract_epi32 (__m128i src, const int ndx);
PEXTRQ __int64 _mm_extract_epi64 (__m128i src, const int ndx);
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
#UD               If VEX.L = 1 or EVEX.L'L > 0.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
