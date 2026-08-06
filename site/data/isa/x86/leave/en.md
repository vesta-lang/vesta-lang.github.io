---
summary: High Level Procedure Exit
---

## Description

Releases the stack frame set up by an earlier ENTER instruction. The LEAVE instruction copies the frame pointer (in the EBP register) into the stack pointer register (ESP), which releases the stack space allocated to the stack frame. The old frame pointer (the frame pointer for the calling procedure that was saved by the ENTER instruction) is then popped from the stack into the EBP register, restoring the calling procedure's stack frame.

A RET instruction is commonly executed following a LEAVE instruction to return program control to the calling procedure.

See "Procedure Calls for Block-Structured Languages" in Chapter 6 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1, for detailed information on the use of the ENTER and LEAVE instructions.

In 64-bit mode, the instruction's default operation size is 64 bits; 32-bit operation cannot be encoded. See the summary chart at the beginning of this section for encoding data and limits.

## Operation

```text
IF StackAddressSize = 32

    THEN
          ESP := EBP;

   ELSE IF StackAddressSize = 64

          THEN RSP := RBP; FI;

   ELSE IF StackAddressSize = 16

          THEN SP := BP; FI;
FI;

IF OperandSize = 32

    THEN EBP := Pop();

   ELSE IF OperandSize = 64

          THEN RBP := Pop(); FI;

   ELSE IF OperandSize = 16

          THEN BP := Pop(); FI;
FI;
```

## Flags affected

None.
