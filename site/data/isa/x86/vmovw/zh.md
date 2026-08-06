---
summary: 移动单词
---

## 说明

此指令或 (a) 将一个字元素从 XMM 寄存器复制到 通用寄存器 或 内存位置 或 (b) 将一个字元素从 通用寄存器 或 内存位置 寄存器复制到 XMM 寄存器 。 当写入 通用寄存器时,寄存器的下16位将包含字值. 通用寄存器的上位是零写法.

## 行动

```text
VMOVW dest, src (two operand load)
DEST.word[0] := SRC.word[0]
DEST[MAXVL:16] := 0

VMOVW dest, src (two operand store)
DEST.word[0] := SRC.word[0]
// upper bits of GPR DEST are zeroed
```

## Intel C/C++ 内在编译器

```c
VMOVW short _mm_cvtsi128_si16 (__m128i a);
VMOVW __m128i _mm_cvtsi16_si128 (short a);
```

## SIMD 浮点 例外

None

## 其他例外

EVEX-encoded 指令,参见表2-59,"Type E9NF class Exception Centers".
