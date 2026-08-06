---
summary: 提取单词
---

## 说明

将伯爵操作数(第三操作数)指定的源操作数(第二操作数)中的单词复制到目标操作数(第一操作数). 源操作数可以是MMX技术登记册或XMM登记册. 目标操作数可以是通用寄存器或16位内存地址的低词. 计数操作数为8位即时. 在 MMX 技术登记册中指定一个单词位置时,伯爵 操作数 的两个最小位指定了位置;对于 XMM 登记册,三个最小位指定了位置. 第16项以上目的地登记册的内容已清除(设定为所有 0s) 。

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15,R8-15). 如果 目标操作数 是 通用寄存器,默认的 操作数大小 是64位模式下的64位.

说明: 在VEX.128编码的版本中,VEX.vvvv是保留的,必须是1111b,VEX.L必须是0,否则指令会是#UD. 在EVEX.128编码版本中,EVEX.vvvv被保留,必须是1111b,EVEX.L必须是0,

否则,该指令将#UD。 如果目标操作数是一个寄存器,则VPEXTRW的64位模式中默认的操作数大小是64位,在最小的字节/字节/字节数据之上的位被零填充.

## 行动

```text
IF (DEST = Mem16)
THEN

    SEL := COUNT[2:0];
    TEMP := (Src >> SEL*16) AND FFFFH;
    Mem16 := TEMP[15:0];
ELSE IF (64-Bit Mode and destination is a general-purpose register)
    THEN

          FOR (PEXTRW instruction with 64-bit source operand)
             { SEL := COUNT[1:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r64[15:0] := TEMP[15:0];
                r64[63:16] := ZERO_FILL; };

          FOR (PEXTRW instruction with 128-bit source operand)
             { SEL := COUNT[2:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r64[15:0] := TEMP[15:0];
                r64[63:16] := ZERO_FILL; }

    ELSE
          FOR (PEXTRW instruction with 64-bit source operand)
            { SEL := COUNT[1:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r32[15:0] := TEMP[15:0];
                r32[31:16] := ZERO_FILL; };
          FOR (PEXTRW instruction with 128-bit source operand)
            { SEL := COUNT[2:0];
               TEMP := (SRC >> (SEL  16)) AND FFFFH;
                r32[15:0] := TEMP[15:0];
                r32[31:16] := ZERO_FILL; };

    FI;
FI;

VPEXTRW ( dest=m16)
SRC_Offset := imm8[2:0]
Mem16 := (Src >> Src_Offset*16)

VPEXTRW ( dest=reg)
IF (64-Bit Mode )
THEN

    SRC_Offset := imm8[2:0]
    DEST[15:0] := ((Src >> Src_Offset*16) AND 0FFFFh)
    DEST[63:16] := ZERO_FILL;
ELSE
    SRC_Offset := imm8[2:0]
    DEST[15:0] := ((Src >> Src_Offset*16) AND 0FFFFh)
    DEST[31:16] := ZERO_FILL;
FI
```

## Intel C/C++ 内在编译器

```c
PEXTRW int _mm_extract_pi16 (__m64 a, int n) PEXTRW int _mm_extract_epi16 ( __m128i a, int imm);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-22,"第5类例外条件".

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".

Additionally:

```text
#UD                   If VEX.L = 1 or EVEX.L'L > 0.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
