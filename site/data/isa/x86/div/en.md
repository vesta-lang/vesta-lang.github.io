---
summary: Unsigned Divide
---

## Description

Divides unsigned the value in the AX, DX:AX, EDX:EAX, or RDX:RAX registers (dividend) by the source operand (divisor) and stores the result in the AX (AH:AL), DX:AX, EDX:EAX, or RDX:RAX registers. The source operand can be a general-purpose register or a memory location. The action of this instruction depends on the operand size (dividend/divisor). Division using 64-bit operand is available only in 64-bit mode.

Non-integral results are truncated (chopped) towards 0. The remainder is always less than the divisor in magnitude. Overflow is indicated with the #DE (divide error) exception rather than with the CF flag.

In 64-bit mode, the instruction's default operation size is 32 bits. Use of the REX.R prefix permits access to additional registers (R8-R15). Use of the REX.W prefix promotes operation to 64 bits. In 64-bit mode when REX.W is applied, the instruction divides the unsigned value in RDX:RAX by the source operand and stores the quotient in RAX, the remainder in RDX.

See the summary chart at the beginning of this section for encoding data and limits. See Table 3-17.

**DIV Action**

| Word/byte | AX | r/m8 | AL | AH | 255 |
| --- | --- | --- | --- | --- | --- |
| Doubleword/word | DX:AX | r/m16 | AX | DX | 65,535 |
| Quadword/doubleword | EDX:EAX | r/m32 | EAX | EDX | 232 - 1 |
| Doublequadword/ | RDX:RAX | r/m64 | RAX | RDX | 264 - 1 |
| quadword |  |  |  |  |  |
| DIV--Unsigned Divide |  |  |  |  |  |

## Operation

```text
IF SRC = 0

    THEN #DE; FI; (* Divide Error *)
IF OperandSize = 8 (* Word/Byte Operation *)

    THEN
          temp := AX / SRC;
          IF temp > FFH
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX MOD SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC;
                IF temp > FFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       AX := temp;
                       DX := DX:AX MOD SRC;
                FI;

          FI;
    ELSE IF Operandsize = 32 (* Quadword/doubleword operation *)

          THEN
                temp := EDX:EAX / SRC;
                IF temp > FFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       EAX := temp;
                       EDX := EDX:EAX MOD SRC;
                FI;

          FI;
    ELSE IF 64-Bit Mode and Operandsize = 64 (* Doublequadword/quadword operation *)

          THEN
                temp := RDX:RAX / SRC;
                IF temp > FFFFFFFFFFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       RAX := temp;
                       RDX := RDX:RAX MOD SRC;
                FI;

          FI;
FI;
```

## Flags affected

The CF, OF, SF, ZF, AF, and PF flags are undefined.
