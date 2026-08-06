---
summary: Load Effective Address
---

## Description

Computes the effective address of the second operand (the source operand) and stores it in the first operand (destination operand). The source operand is a memory address (offset part) specified with one of the processors addressing modes; the destination operand is a general-purpose register. The address-size and operand-size attributes affect the action performed by this instruction, as shown in the following table. The operand-size attribute of the instruction is determined by the chosen register; the address-size attribute is determined by the attribute of the code segment.

**Non-64-bit Mode LEA Operation with Address and Operand Size Attributes**

| Operand Size | Address Size | Action Performed |
| --- | --- | --- |
| 16 | 16           16-bit effective address is calculated a | nd stored in requested 16-bit register destination. |
| 16 | 32           32-bit effective address is calculated. requested 16-bit register destination. | The lower 16 bits of the address are stored in the |
| 32 | 16           16-bit effective address is calculated. requested 32-bit register destination. | The 16-bit address is zero-extended and stored in the |

**64-bit Mode LEA Operation with Address and Operand Size Attributes**

| Operand Size | Address Size | Action Performed |
| --- | --- | --- |
| 16 | 32           32-bit effective address is calculated ( | using 67H prefix). The lower 16 bits of the address are |
|  | stored in the requested 16-bit register | destination (using 66H prefix). |
| 16 | 64           64-bit effective address is calculated ( | default address size). The lower 16 bits of the address |

## Operation

```text
IF OperandSize = 16 and AddressSize = 16

    THEN
          DEST := EffectiveAddress(SRC); (* 16-bit address *)

   ELSE IF OperandSize = 16 and AddressSize = 32

          THEN
                temp := EffectiveAddress(SRC); (* 32-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 16

          THEN
                temp := EffectiveAddress(SRC); (* 16-bit address *)
                DEST := ZeroExtend(temp); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 32

          THEN
                DEST := EffectiveAddress(SRC); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 16 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:31]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 64 and AddressSize = 64

          THEN
                DEST := EffectiveAddress(SRC); (* 64-bit address *)

          FI;
FI;
```

## Flags affected

None.
