---
summary: Load Far Pointer
---

## Description

Loads a far pointer (segment selector and offset) from the second operand (source operand) into a segment register and the first operand (destination operand). The source operand specifies a 48-bit or a 32-bit pointer in memory depending on the current setting of the operand-size attribute (32 bits or 16 bits, respectively). The instruction opcode and the destination operand specify a segment register/general-purpose register pair. The 16-bit segment selector from the source operand is loaded into the segment register specified with the opcode (DS, SS, ES, FS, or GS). The 32-bit or 16-bit offset is loaded into the register specified with the destination operand.

If one of these instructions is executed in protected mode, additional information from the segment descriptor pointed to by the segment selector in the source operand is loaded in the hidden part of the selected segment register.

Also in protected mode, a NULL selector (values 0000 through 0003) can be loaded into DS, ES, FS, or GS registers without causing a protection exception. (Any subsequent reference to a segment whose corresponding segment register is loaded with a NULL selector, causes a general-protection exception (#GP) and no memory reference to the segment occurs.)

In 64-bit mode, the instruction's default operation size is 32 bits. Using a REX prefix in the form of REX.W promotes operation to specify a source operand referencing an 80-bit pointer (16-bit selector, 64-bit offset) in memory. Using a REX prefix in the form of REX.R permits access to additional registers (R8-R15). See the summary chart at the beginning of this section for encoding data and limits.

## Operation

```text
64-BIT_MODE
    IF SS is loaded
          THEN

             IF SegmentSelector = NULL and ( (RPL = 3) or
                       (RPL  3 and RPL  CPL) )

                      THEN #GP(0);
                ELSE IF descriptor is in non-canonical space


                       THEN #GP(selector); FI;
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF attempt to load DS, or ES
          THEN #UD;
    ELSE IF FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and ( RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) ;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                       not accessible by software *)
    FI;
    DEST := Offset(SRC);

PREOTECTED MODE OR COMPATIBILITY MODE;
    IF SS is loaded
          THEN

             IF SegementSelector = NULL

                       THEN #GP(0);
                ELSE IF Segment selector index is not within descriptor table limits

                       or segment selector RPL  CPL

                             or access rights indicate nonwritable data segment

                       or DPL  CPL

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present

                       THEN #SS(selector); FI;
                FI;
                SS := SegmentSelector(SRC);
                SS := SegmentDescriptor([SRC]);
    ELSE IF DS, ES, FS, or GS is loaded with non-NULL segment selector
          THEN IF Segment selector index is not within descriptor table limits
                or access rights indicate segment neither data nor readable code segment
                or segment is data or nonconforming-code segment
                and (RPL > DPL or CPL > DPL)

                       THEN #GP(selector); FI;
                ELSE IF Segment marked not present


                      THEN #NP(selector); FI;
                FI;
                SegmentRegister := SegmentSelector(SRC) AND RPL;
                SegmentRegister := SegmentDescriptor([SRC]);
          FI;
    ELSE IF DS, ES, FS, or GS is loaded with a NULL selector:
          THEN
                SegmentRegister := NULLSelector;
                SegmentRegister(DescriptorValidBit) := 0; FI; (* Hidden flag;

                      not accessible by software *)
    FI;
    DEST := Offset(SRC);

Real-Address or Virtual-8086 Mode
    SegmentRegister := SegmentSelector(SRC); FI;
    DEST := Offset(SRC);
```

## Flags affected

None.
