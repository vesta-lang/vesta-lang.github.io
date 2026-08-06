---
summary: Shift Without Affecting Flags
---

## Description

Shifts the bits of the first source operand (the second operand) to the left or right by a COUNT value specified in the second source operand (the third operand). The result is written to the destination operand (the first operand).

The shift arithmetic right (SARX) and shift logical right (SHRX) instructions shift the bits of the destination operand to the right (toward less significant bit locations), SARX keeps and propagates the most significant bit (sign bit) while shifting.

The logical shift left (SHLX) shifts the bits of the destination operand to the left (toward more significant bit locations).

This instruction is not supported in real mode and virtual-8086 mode. The operand size is always 32 bits if not in 64-bit mode. In 64-bit mode operand size 64 requires VEX.W1. VEX.W1 is ignored in non-64-bit modes. An attempt to execute this instruction with VEX.L not equal to 0 will cause #UD.

If the value specified in the first source operand exceeds OperandSize -1, the COUNT value is masked.

SARX,SHRX, and SHLX instructions do not update flags.

## Operation

```text
TEMP := SRC1;
IF VEX.W1 and CS.L = 1
THEN

    countMASK := 3FH;
ELSE

    countMASK := 1FH;
FI
COUNT := SRC2 AND countMASK;

DO WHILE (COUNT  0)
    IF instruction is SHLX
          THEN
                TEMP := TEMP *2;


         ELSE IF instruction is SHRX

         THEN

                TEMP := TEMP /2; //unsigned divide

         ELSE   // SARX

                TEMP := TEMP /2; // signed divide, round toward negative infinity

    FI;

    COUNT := COUNT - 1;

OD

DEST := TEMP;
```

## Flags affected

None.

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

See Table 2-29, "Type 13 Class Exception Conditions."
