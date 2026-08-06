---
summary: Parallel Bits Extract
---

## Description

PEXT uses a mask in the second source operand (the third operand) to transfer either contiguous or non-contiguous bits in the first source operand (the second operand) to contiguous low order bit positions in the destination (the first operand). For each bit set in the MASK, PEXT extracts the corresponding bits from the first source operand and writes them into contiguous lower bits of destination operand. The remaining upper bits of destination are zeroed.

```text
             SRC1 S31 S30 S29 S28 S27                 S7 S6 S5 S4 S3 S2 S1 S0
```

```text
             SRC2            0  0 01 0                10 1 0 0 1 0 0
```

(mask)

```text
             DEST 0 0 0 0 0                           00               0 0 S28 S7 S5 S2
                     bit 31                                                                         bit 0
```

Figure 4-9. PEXT Example

This instruction is not supported in real mode and virtual-8086 mode. The operand size is always 32 bits if not in 64-bit mode. In 64-bit mode operand size 64 requires VEX.W1. VEX.W1 is ignored in non-64-bit modes. An attempt to execute this instruction with VEX.L not equal to 0 will cause #UD.

## Operation

```text
TEMP := SRC1;
MASK := SRC2;
DEST := 0 ;
m := 0, k := 0;
DO WHILE m < OperandSize

          IF MASK[ m] = 1 THEN
                DEST[ k] := TEMP[ m];
                k := k+ 1;

          FI
          m := m+ 1;

OD
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
PEXT unsigned __int32 _pext_u32(unsigned __int32 src, unsigned __int32 mask);
PEXT unsigned __int64 _pext_u64(unsigned __int64 src, unsigned __int32 mask);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-29, "Type 13 Class Exception Conditions."
