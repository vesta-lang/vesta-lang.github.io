---
summary: Loop According to ECX Counter
---

## Description

Performs a loop operation using the RCX, ECX or CX register as a counter (depending on whether address size is 64 bits, 32 bits, or 16 bits). Note that the LOOP instruction ignores REX.W; but 64-bit address size can be over-ridden using a 67H prefix.

Each time the LOOP instruction is executed, the count register is decremented, then checked for 0. If the count is 0, the loop is terminated and program execution continues with the instruction following the LOOP instruction. If the count is not zero, a near jump is performed to the destination (target) operand, which is presumably the instruction at the beginning of the loop.

The target instruction is specified with a relative offset (a signed offset relative to the current value of the instruction pointer in the IP/EIP/RIP register). This offset is generally specified as a label in assembly code, but at the machine code level, it is encoded as a signed, 8-bit immediate value, which is added to the instruction pointer. Offsets of 128 to +127 are allowed with this instruction.

Some forms of the loop instruction (LOOPcc) also accept the ZF flag as a condition for terminating the loop before the count reaches zero. With these forms of the instruction, a condition code (cc) is associated with each instruction to indicate the condition being tested for. Here, the LOOPcc instruction itself does not affect the state of the ZF flag; the ZF flag is changed by other instructions in the loop.

## Operation

```text
IF (AddressSize = 32)

    THEN Count is ECX;
ELSE IF (AddressSize = 64)

    Count is RCX;
ELSE Count is CX;
FI;

Count := Count  1;

IF Instruction is not LOOP
    THEN
          IF (Instruction := LOOPE) or (Instruction := LOOPZ)

             THEN IF (ZF = 1) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;

             ELSE (Instruction = LOOPNE) or (Instruction = LOOPNZ)
                  IF (ZF = 0 ) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;


          FI;

   ELSE (* Instruction = LOOP *)
        IF (Count  0)

                THEN BranchCond := 1;

                ELSE BranchCond := 0;

          FI;

FI;

IF BranchCond = 1

    THEN
          IF in 64-bit mode (* OperandSize = 64 *)
                THEN
                      tempRIP := RIP + SignExtend(DEST);
                      IF tempRIP is not canonical
                            THEN #GP(0);
                      ELSE RIP := tempRIP;
                      FI;
                ELSE
                      tempEIP := EIP SignExtend(DEST);
                      IF OperandSize 16
                            THEN tempEIP := tempEIP AND 0000FFFFH;
                      FI;
                      IF tempEIP is not within code segment limit
                            THEN #GP(0);
                            ELSE EIP := tempEIP;
                      FI;
          FI;

    ELSE
          Terminate loop and continue program execution at (R/E)IP;

FI;
```

## Flags affected

None.
