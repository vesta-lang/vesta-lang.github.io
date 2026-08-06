---
summary: 返回位数集数为 1
---

## 说明

本指令计算第二个操作数(来源)中设置的位数为1,并返回第一个操作数(目的地登记册)中的计数.

## 行动

```text
Count = 0;

For (i=0; i < OperandSize; i++)

{    IF (SRC[ i] = 1) // i'th bit

     THEN Count++; FI;

}

DEST := Count;
```

## 受影响的旗帜

OF, SF, ZF, AF, CF, PF are all cleared. ZF is set if SRC = 0, otherwise ZF is cleared.

## Intel C/C++ 内在编译器

```c
POPCNT int _mm_popcnt_u32(unsigned int a);
POPCNT int64_t _mm_popcnt_u64(unsigned __int64 a);
```
