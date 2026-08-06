---
summary: Load Segment Limit
---

## Description

Loads the segment limit from the segment descriptor (see below) specified with the second operand (source operand) into the first operand (destination operand) and sets the ZF flag in the EFLAGS register. The source operand (which can be a register or a memory location) contains the segment selector for the segment descriptor being accessed. If the source operand is a memory address, only 16 bits of data are accessed. The destination operand is a general-purpose register.

The processor performs access checks as part of the loading process. Once loaded in the destination register, software can compare the segment limit with the offset of a pointer.

The segment limit is a 20-bit value contained in bytes 0 and 1 and in the first 4 bits of byte 6 of the segment descriptor. If the descriptor has a byte granular segment limit (the granularity flag is set to 0), the destination operand is loaded with a byte granular value (byte limit) as read from the descriptor. If the descriptor has a page granular segment limit (the granularity flag is set to 1), the LSL instruction will translate the page granular limit (page limit) into a byte limit before loading it into the destination operand. The translation is performed by shifting the 20-bit "raw" limit left 12 bits and filling the low-order 12 bits with 1s.

When the operand size is 16 bits, a valid 32-bit byte limit is computed; however, the upper 16 bits are truncated and only the low-order 16 bits are loaded into the destination operand; the upper bits of the destination are unmodified. When the operand size is 32 bits, the 32-bit byte limit is loaded into the destination operand; the upper bits of the destination are cleared. When the operand is 64 bits, the 32-bit byte limit is zero-extended to 64 bits and loaded into the destination operand. (The behavior with 32-bit and 64-bit operand sizes is identical.)

This instruction performs the following checks before it loads the segment limit into the destination register:

* Checks that the segment selector is not NULL. * Checks that the segment selector points to a descriptor that is within the limits of the GDT or LDT being

accessed

* Checks that the descriptor type is valid for this instruction. All code and data segment descriptors are valid for

(can be accessed with) the LSL instruction. The valid special segment and gate descriptor types are given in the

| * | If the segment is not a conforming code segment, the instruction checks that the specified segment descriptor |
| --- | --- |
|  | is visible at the CPL (that is, if the CPL and the RPL of the segment selector are less than or equal to the DPL of |
|  | the segment selector). |
| If | the segment descriptor cannot be accessed or is an invalid type for the instruction, the ZF flag is cleared and no |

**Segment and Gate Descriptor Types**

| * | If the segment is not a conforming code segment, the instruction checks that the specified segment descriptor |
| --- | --- |
|  | is visible at the CPL (that is, if the CPL and the RPL of the segment selector are less than or equal to the DPL of |
|  | the segment selector). |
| If | the segment descriptor cannot be accessed or is an invalid type for the instruction, the ZF flag is cleared and no |

## Operation

```text
IF SRC(Offset) > descriptor table limit
    THEN ZF := 0; FI;

Read segment descriptor;

IF SegmentDescriptor(Type)  conforming code segment

and (CPL > DPL) OR (RPL > DPL)
or Segment type is not valid for instruction

          THEN
                ZF := 0;

          ELSE
                temp := SegmentLimit([SRC]);
                IF (SegmentDescriptor(G) = 1)
                      THEN temp := (temp << 12) OR 00000FFFH;

             ELSE IF OperandSize = 32

                      THEN DEST := temp; FI;

             ELSE IF OperandSize = 64 (* REX.W used *)

                      THEN DEST := temp(* Zero-extended *); FI;

             ELSE (* OperandSize = 16 *)

                      DEST := temp AND FFFFH;
                FI;
FI;
```

## Flags affected

The ZF flag is set to 1 if the segment limit is loaded successfully; otherwise, it is set to 0. The CF, OF, SF, AF, and PF flags are not modified.
