---
summary: Unsigned Multiply
---

## Description

Performs an unsigned multiplication of the first operand (destination operand) and the second operand (source operand) and stores the result in the destination operand. The destination operand is an implied operand located in register AL, AX or EAX (depending on the size of the operand); the source operand is located in a generalpurpose register or a memory location. The action of this instruction and the location of the result depends on the opcode and the operand size as shown in Table 4-9.

The result is stored in register AX, register pair DX:AX, or register pair EDX:EAX (depending on the operand size), with the high-order bits of the product contained in register AH, DX, or EDX, respectively. If the high-order bits of the product are 0, the CF and OF flags are cleared; otherwise, the flags are set.

In 64-bit mode, the instruction's default operation size is 32 bits. Use of the REX.R prefix permits access to additional registers (R8-R15). Use of the REX.W prefix promotes operation to 64 bits.

See the summary chart at the beginning of this section for encoding data and limits.

**MUL Results**

| Operand Size | Source 1 | Source 2 | Destination |
| --- | --- | --- | --- |
| Byte | AL | r/m8 | AX |
| Word | AX | r/m16 | DX:AX |
| Doubleword | EAX | r/m32 | EDX:EAX |
| Quadword | RAX | r/m64 | RDX:RAX |

## Operation

```text
IF (Byte operation)
    THEN
          AX := AL  SRC;
    ELSE (* Word or doubleword operation *)
          IF OperandSize = 16
                THEN
                      DX:AX := AX  SRC;
                ELSE IF OperandSize = 32
                      THEN EDX:EAX := EAX  SRC; FI;
                ELSE (* OperandSize = 64 *)
                      RDX:RAX := RAX  SRC;
          FI;


FI;
```

## Flags affected

The OF and CF flags are set to 0 if the upper half of the result is 0; otherwise, they are set to 1. The SF, ZF, AF, and PF flags are undefined.
