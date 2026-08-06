---
summary: Compare and Add if Condition is Met
---

## Description

This instruction compares the value from memory with the value of the second operand. If the specified condition is met, then the processor will add the third operand to the memory operand and write it into memory, else the memory is unchanged by this instruction.

This instruction must have MODRM.MOD equal to 0, 1, or 2. The value 3 for MODRM.MOD is reserved and will cause an invalid opcode exception (#UD).

The second operand is always updated with the original value of the memory operand. The EFLAGS conditions are updated from the results of the comparison.The instruction uses an implicit lock. This instruction does not permit the use of an explicit lock prefix.

## Operation

```text
CMPCCXADD srcdest1, srcdest2, src3
tmp1 := load lock srcdest1
tmp2 := tmp1 + src3
EFLAGS.CS,OF,SF,ZF,AF,PF := CMP tmp1, srcdest2
IF <condition>:

    srcdest1 := store unlock tmp2
ELSE

    srcdest1 := store unlock tmp1
srcdest2 :=tmp1

1. ModRM.MOD != 011B
```

## Flags affected

The EFLAGS conditions are updated from the results of the comparison.

## Intel C/C++ compiler intrinsics

```c
CMPCCXADD int _cmpccxadd_epi32 (void* __A, int __B, int __C, const int __D);
CMPCCXADD __int64 _cmpccxadd_epi64 (void* __A, __int64 __B, __int64 __C, const int __D);
```

## SIMD Floating-Point Exceptions

None.

Exceptions Exceptions Type 14; see Table 2-31.
