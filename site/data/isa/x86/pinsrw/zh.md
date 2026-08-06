---
summary: 插入单词
---

## 说明

三个 操作数 MMX 和 SSE 指令:

从 源操作数 复制一个单词,并在 目标操作数 指定位置与 count 操作数 插入. (目的地寄存器中的其他单词不动. ) 源操作数可以是通用寄存器或16位内存位置. (当源操作数是一个通用寄存器时,寄存器的低词会被复制. ) 目标操作数可以是MMX技术寄存器或XMM寄存器. 计数操作数为8位即时. 在 MMX 技术登记册中指定一个单词位置时,伯爵 操作数 的两个最小位指定了位置;对于 XMM 登记册,三个最小位指定了位置.

相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

四个操作数 AVX和AVX-512指令:

将来自 第一源操作数 的单词与 第二源操作数 合并,并在 目标操作数 指定位置上插入 操作数 。 第二源操作数可以是通用寄存器或16位的内存位置. (当源操作数是一个通用寄存器时,寄存器的低词被复制. ) 第一个来源和目标操作数是XMM寄存器. 计数操作数为8位即时. 在指定单词位置时,3个最小位指定了位置.

目的地YMM的位数(MAXVL-1:128)登记被清零. VEX.L/EVEX.L'L必须是0,否则指令会#UD.

## 行动

```text
PINSRW dest, src, imm8 (MMX)
    SEL := imm8[1:0]
    DEST.word[SEL] := src.word[0]

PINSRW dest, src, imm8 (SSE)
    SEL := imm8[2:0]
    DEST.word[SEL] := src.word[0]

VPINSRW dest, src1, src2, imm8 (AVX/AVX512)
    SEL := imm8[2:0]
    DEST := src1
    DEST.word[SEL] := src2.word[0]
    DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
PINSRW __m64 _mm_insert_pi16 (__m64 a, int d, int n) PINSRW __m128i _mm_insert_epi16 ( __m128i a, int b, int imm);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-22,"第5类例外条件".

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".

Additionally:

```text
#UD                  If VEX.L = 1 or EVEX.L'L > 0.
```
