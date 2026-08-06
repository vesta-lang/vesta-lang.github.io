---
summary: Parallel Bits Deposit
---

## Description

PDEP uses a mask in the second source operand (the third operand) to transfer/scatter contiguous low order bits in the first source operand (the second operand) into the destination (the first operand). PDEP takes the low bits from the first source operand and deposit them in the destination operand at the corresponding bit locations that are set in the second source operand (mask). All other bits (bits not set in mask) in destination are set to zero.

```text
             SRC1 S31 S30 S29 S28 S27                   S7 S6 S5 S4 S3 S2 S1 S0
```

```text
             SRC2 0              0 01 0                 10 1 0 0 1 0 0
```

(mask)

```text
             DEST 0 0 0 S3 0                            S2 0 S1 0       0 S0 0 0
                      bit 31                                                             bit 0
```

Figure 4-8. PDEP Example

This instruction is not supported in real mode and virtual-8086 mode. The operand size is always 32 bits if not in 64-bit mode. In 64-bit mode operand size 64 requires VEX.W1. VEX.W1 is ignored in non-64-bit modes. An attempt to execute this instruction with VEX.L not equal to 0 will cause #UD.

## Operation

```text
TEMP := SRC1;
MASK := SRC2;
DEST := 0 ;
m := 0, k := 0;
DO WHILE m < OperandSize

          IF MASK[ m] = 1 THEN
                DEST[ m] := TEMP[ k];
                k := k+ 1;

          FI
          m := m+ 1;
OD
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
PDEP unsigned __int32 _pdep_u32(unsigned __int32 src, unsigned __int32 mask);
PDEP unsigned __int64 _pdep_u64(unsigned __int64 src, unsigned __int32 mask);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-29, "Type 13 Class Exception Conditions."
