---
summary: Load Task Register
---

## Description

Loads the source operand into the segment selector field of the task register. The source operand (a generalpurpose register or a memory location) contains a segment selector that points to a task state segment (TSS). After the segment selector is loaded in the task register, the processor uses the segment selector to locate the segment descriptor for the TSS in the global descriptor table (GDT). It then loads the segment limit and base address for the TSS from the segment descriptor into the task register. The task pointed to by the task register is marked busy, but a switch to the task does not occur.

The LTR instruction is provided for use in operating-system software; it should not be used in application programs. It can only be executed in protected mode when the CPL is 0. It is commonly used in initialization code to establish the first task to be executed.

The operand-size attribute has no effect on this instruction.

In 64-bit mode, the operand size is still fixed at 16 bits. The instruction references a 16-byte descriptor to load the 64-bit base.

## Operation

```text
IF SRC is a NULL selector

    THEN #GP(0);

IF SRC(Offset) > descriptor table limit OR IF SRC(type)  global

    THEN #GP(segment selector); FI;
Read segment descriptor;

IF segment descriptor is not for an available TSS
    THEN #GP(segment selector); FI;

IF segment descriptor is not present
    THEN #NP(segment selector); FI;

TSSsegmentDescriptor(busy) := 1;
(* Locked read-modify-write operation on the entire descriptor when setting busy flag *)
TaskRegister(SegmentSelector) := SRC;
TaskRegister(SegmentDescriptor) := TSSSegmentDescriptor;
```

## Flags affected

None.
