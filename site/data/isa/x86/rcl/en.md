---
summary: Rotate
---

## Description

Shifts (rotates) the bits of the first operand (destination operand) the number of bit positions specified in the second operand (count operand) and stores the result in the destination operand. The destination operand can be a register or a memory location; the count operand is an unsigned integer that can be an immediate or a value in the CL register. The count is masked to 5 bits (or 6 bits if in 64-bit mode and REX.W = 1).

The rotate left (ROL) and rotate through carry left (RCL) instructions shift all the bits toward more-significant bit positions, except for the most-significant bit, which is rotated to the least-significant bit location. The rotate right (ROR) and rotate through carry right (RCR) instructions shift all the bits toward less significant bit positions, except for the least-significant bit, which is rotated to the most-significant bit location.

The RCL and RCR instructions include the CF flag in the rotation. The RCL instruction shifts the CF flag into the least-significant bit and shifts the most-significant bit into the CF flag. The RCR instruction shifts the CF flag into the most-significant bit and shifts the least-significant bit into the CF flag. For the ROL and ROR instructions, the original value of the CF flag is not a part of the result, but the CF flag receives a copy of the bit that was shifted from one end to the other.

The OF flag is defined only for the 1-bit rotates; it is undefined in all other cases (except RCL and RCR instructions only: a zero-bit rotate does nothing, that is affects no flags). For left rotates, the OF flag is set to the exclusive OR of the CF bit (after the rotate) and the most-significant bit of the result. For right rotates, the OF flag is set to the exclusive OR of the two most-significant bits of the result.

In 64-bit mode, using a REX prefix in the form of REX.R permits access to additional registers (R8-R15). Use of REX.W promotes the first operand to 64 bits and causes the count operand to become a 6-bit counter.

## IA-32 architecture compatibility

The 8086 does not mask the rotation count. However, all other IA-32 processors (starting with the Intel 286 processor) do mask the rotation count to 5 bits, resulting in a maximum count of 31. This masking is done in all operating modes (including the virtual-8086 mode) to reduce the maximum execution time of the instructions.

## Operation

```text
(* RCL and RCR Instructions *)
SIZE := OperandSize;
CASE (determine count) OF

    SIZE := 8: tempCOUNT := (COUNT AND 1FH) MOD 9;
    SIZE := 16: tempCOUNT := (COUNT AND 1FH) MOD 17;
    SIZE := 32: tempCOUNT := COUNT AND 1FH;
    SIZE := 64: tempCOUNT := COUNT AND 3FH;
ESAC;
IF OperandSize = 64
    THEN COUNTMASK = 3FH;
    ELSE COUNTMASK = 1FH;
FI;

(* RCL Instruction Operation *)
tempDEST := DEST;
WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + CF;
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;


(* RCR Instruction Operation *)
tempDEST := DEST;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
WHILE (tempCOUNT  0)
    DO

          tempCF := LSB(SRC);
          tempDEST := (tempDEST / 2) + (CF * 2SIZE);
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;
    OD;
DEST := tempDEST;

(* ROL Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := LSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;

(* ROR Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := LSB(SRC);
         tempDEST := (tempDEST / 2) + (tempCF  2SIZE);
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := MSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR MSB - 1(tempDEST);
    ELSE OF is undefined;
FI;
DEST := tempDEST;
```

## Flags affected

For RCL and RCR instructions, a zero-bit rotate does nothing, i.e., affects no flags. For ROL and ROR instructions, if the masked count is 0, the flags are not affected. If the masked count is 1, then the OF flag is affected, otherwise (masked count is greater than 1) the OF flag is undefined.

For all instructions, the CF flag is affected when the masked count is non-zero. The SF, ZF, AF, and PF flags are always unaffected.
