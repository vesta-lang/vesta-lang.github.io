---
summary: Check Lower Bound
---

## Description

Compare the address in the second operand with the lower bound in bnd. The second operand can be either a register or memory operand. If the address is lower than the lower bound in bnd.LB, it will set BNDSTATUS to 01H and signal a #BR exception.

This instruction does not cause any memory access, and does not read or write any flags.

## Operation

```text
BNDCL BND, reg
IF reg < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCL BND, mem
TEMP := LEA(mem);
IF TEMP < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ compiler intrinsics

```c
BNDCL void _bnd_chk_ptr_lbounds(const void *q);
```

## Flags affected

None
