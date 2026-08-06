---
summary: Shift Right Mask Registers
---

## Description

Shifts 8/16/32/64 bits in the second operand (source operand) right by the count specified in immediate and place the least significant 8/16/32/64 bits of the result in the destination operand. The higher bits of the destination are zero-extended. The destination is set to zero if the count value is greater than 7 (for byte shift), 15 (for word shift), 31 (for doubleword shift) or 63 (for quadword shift).

## Operation

```text
KSHIFTRW
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=15

    THEN DEST[15:0] := SRC1[15:0] >> COUNT;
FI;

KSHIFTRB

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=7

            THEN DEST[7:0] := SRC1[7:0] >> COUNT;
FI;

KSHIFTRQ

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=63

            THEN DEST[63:0] := SRC1[63:0] >> COUNT;
FI;


KSHIFTRD
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=31

            THEN DEST[31:0] := SRC1[31:0] >> COUNT;
FI;
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-65, "TYPE K20 Exception Definition (VEX-Encoded OpMask Instructions w/o Memory Arg)."
