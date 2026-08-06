---
summary: Return the Count of Number of Bits Set to 1
---

## Description

This instruction calculates the number of bits set to 1 in the second operand (source) and returns the count in the first operand (a destination register).

## Operation

```text
Count = 0;

For (i=0; i < OperandSize; i++)

{    IF (SRC[ i] = 1) // i'th bit

     THEN Count++; FI;

}

DEST := Count;
```

## Flags affected

OF, SF, ZF, AF, CF, PF are all cleared. ZF is set if SRC = 0, otherwise ZF is cleared.

## Intel C/C++ compiler intrinsics

```c
POPCNT int _mm_popcnt_u32(unsigned int a);
POPCNT int64_t _mm_popcnt_u64(unsigned __int64 a);
```
