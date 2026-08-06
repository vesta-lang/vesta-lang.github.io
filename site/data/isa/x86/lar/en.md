---
summary: Load Access Rights
---

## Description

Loads the access rights from the segment descriptor specified by the second operand (source operand) into the first operand (destination operand) and sets the ZF flag in the EFLAGS register. The source operand (which can be a register or a memory location) contains the segment selector for the segment descriptor being accessed. If the source operand is a memory address, only 16 bits of data are accessed. The destination operand is a generalpurpose register.

The processor performs access checks as part of the loading process. Once loaded in the destination register, software can perform additional checks on the access rights information.

The access rights for a segment descriptor include fields located in the second doubleword (bytes 47) of the segment descriptor. The following fields are loaded by the LAR instruction:

* Bits 7:0 are returned as 0 * Bits 11:8 return the segment type. * Bit 12 returns the S flag. * Bits 14:13 return the DPL. * Bit 15 returns the P flag. * The following fields are returned only if the operand size is greater than 16 bits:

-- Bits 19:16 are undefined.

-- Bit 20 returns the software-available bit in the descriptor.

-- Bit 21 returns the L flag.

-- Bit 22 returns the D/B flag.

-- Bit 23 returns the G flag.

-- Bits 31:24 are returned as 0.

When the operand size is 16 bits, only the low 16 bits identified above are returned; the upper bits of the destination are unmodified. When the operand size is 32 bits, the 32-bit value identified above is loaded into the destination operand; the upper bits of the destination are cleared. When the operand is 64 bits, the 32-bit value is zeroextended to 64 bits and loaded into the destination operand. (The behavior with 32-bit and 64-bit operand sizes is identical.)

This instruction performs the following checks before it loads the access rights in the destination register:

* Checks that the segment selector is not NULL. * Checks that the segment selector points to a descriptor that is within the limits of the GDT or LDT being

accessed

* Checks that the descriptor type is valid for this instruction. All code and data segment descriptors are valid for

(can be accessed with) the LAR instruction. The valid system segment and gate descriptor types are given in

| * | If the segment is not a conforming code segment, it checks that the specified segment descriptor is visible at |
| --- | --- |
|  | the CPL (that is, if the CPL and the RPL of the segment selector are less than or equal to the DPL of the segment |
|  | selector). |

**Segment and Gate Types**

| * | If the segment is not a conforming code segment, it checks that the specified segment descriptor is visible at |
| --- | --- |
|  | the CPL (that is, if the CPL and the RPL of the segment selector are less than or equal to the DPL of the segment |
|  | selector). |

## Operation

```text
IF Offset(SRC) > descriptor table limit
    THEN
          ZF := 0;
    ELSE
          SegmentDescriptor := descriptor referenced by SRC;

        IF SegmentDescriptor(Type)  conforming code segment

          and (CPL > DPL) or (RPL > DPL)
          or SegmentDescriptor(Type) is not valid for instruction

                THEN
                      ZF := 0;

                ELSE
                      DEST := access rights from SegmentDescriptor as given in Description section;
                      ZF := 1;

          FI;
FI;
```

## Flags affected

The ZF flag is set to 1 if the access rights are loaded successfully; otherwise, it is cleared to 0.
