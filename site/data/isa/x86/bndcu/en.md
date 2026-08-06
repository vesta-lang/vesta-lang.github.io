---
summary: Check Upper Bound
---

## Description

Compare the address in the second operand with the upper bound in bnd. The second operand can be either a register or a memory operand. If the address is higher than the upper bound in bnd.UB, it will set BNDSTATUS to 01H and signal a #BR exception.

BNDCU perform 1's complement operation on the upper bound of bnd first before proceeding with address comparison. BNDCN perform address comparison directly using the upper bound in bnd that is already reverted out of 1's complement form.

This instruction does not cause any memory access, and does not read or write any flags.

Effective address computation of m32/64 has identical behavior to LEA

## Operation

```text
BNDCU BND, reg
IF reg > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCU BND, mem
TEMP := LEA(mem);
IF TEMP > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCN BND, reg
IF reg > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;


BNDCN BND, mem
TEMP := LEA(mem);
IF TEMP > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ compiler intrinsics

```c
BNDCU .void _bnd_chk_ptr_ubounds(const void *q);
```

## Flags affected

None
