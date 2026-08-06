---
summary: Make Bounds
---

## Description

Makes bounds from the second operand and stores the lower and upper bounds in the bound register bnd. The second operand must be a memory operand. The content of the base register from the memory operand is stored in the lower bound bnd.LB. The 1's complement of the effective address of m32/m64 is stored in the upper bound b.UB. Computation of m32/m64 has identical behavior to LEA.

This instruction does not cause any memory access, and does not read or write any flags.

If the instruction did not specify base register, the lower bound will be zero. The reg-reg form of this instruction retains legacy behavior (NOP).

The instruction causes an invalid-opcode exception (#UD) if executed in 64-bit mode with RIP-relative addressing.

## Operation

```text
BND.LB := SRCMEM.base;
IF 64-bit mode Then

    BND.UB := NOT(LEA.64_bits(SRCMEM));
ELSE

    BND.UB := Zero_Extend.64_bits(NOT(LEA.32_bits(SRCMEM)));
FI;
```

## Intel C/C++ compiler intrinsics

```c
BNDMKvoid * _bnd_set_ptr_bounds(const void * q, size_t size);
```

## Flags affected

None.
