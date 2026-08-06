---
summary: Signed Divide
---

## Description

Divides the (signed) value in the AX, DX:AX, or EDX:EAX (dividend) by the source operand (divisor) and stores the result in the AX (AH:AL), DX:AX, or EDX:EAX registers. The source operand can be a general-purpose register or a memory location. The action of this instruction depends on the operand size (dividend/divisor).

Non-integral results are truncated (chopped) towards 0. The remainder is always less than the divisor in magnitude. Overflow is indicated with the #DE (divide error) exception rather than with the CF flag.

In 64-bit mode, the instruction's default operation size is 32 bits. Use of the REX.R prefix permits access to additional registers (R8-R15). Use of the REX.W prefix promotes operation to 64 bits. In 64-bit mode when REX.W is applied, the instruction divides the signed value in RDX:RAX by the source operand. RAX contains a 64-bit quotient; RDX contains a 64-bit remainder.

See the summary chart at the beginning of this section for encoding data and limits. See Table 3-53.

**IDIV Results**

| Operand Size | Dividend | Divisor | Quotient | Remainder | Quotient Range |
| --- | --- | --- | --- | --- | --- |
| e                           AX |  | r/m8           AL |  | AH | -128 to +127 |

## Operation

```text
IF SRC = 0

    THEN #DE; (* Divide error *)
FI;

IF OperandSize = 8 (* Word/byte operation *)

    THEN
          temp := AX / SRC; (* Signed division *)
          IF (temp > 7FH) or (temp < 80H)
          (* If a positive result is greater than 7FH or a negative result is less than 80H *)
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX SignedModulus SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC; (* Signed division *)
                IF (temp > 7FFFH) or (temp < 8000H)
                (* If a positive result is greater than 7FFFH
                or a negative result is less than 8000H *)
                       THEN
                             #DE; (* Divide error *)
                       ELSE
                             AX := temp;
                             DX := DX:AX SignedModulus SRC;
                FI;

          FI;
    ELSE IF OperandSize = 32 (* Quadword/doubleword operation *)

                temp := EDX:EAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFH) or (temp < 80000000H)
                (* If a positive result is greater than 7FFFFFFFH
                or a negative result is less than 80000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             EAX := temp;
                             EDX := EDXE:AX SignedModulus SRC;

                FI;
          FI;
    ELSE IF OperandSize = 64 (* Doublequadword/quadword operation *)

                temp := RDX:RAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFFFFFFFFFH) or (temp < 8000000000000000H)
                (* If a positive result is greater than 7FFFFFFFFFFFFFFFH
                or a negative result is less than 8000000000000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             RAX := temp;
                             RDX := RDE:RAX SignedModulus SRC;

                FI;
          FI;
FI;
```

## Flags affected

The CF, OF, SF, ZF, AF, and PF flags are undefined.
