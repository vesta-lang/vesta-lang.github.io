---
summary: Set Interrupt Flag
---

## Description

In most cases, STI sets the interrupt flag (IF) in the EFLAGS register. This allows the processor to respond to maskable hardware interrupts.

If IF = 0, maskable hardware interrupts remain inhibited on the instruction boundary following an execution of STI. (The delayed effect of this instruction is provided to allow interrupts to be enabled just before returning from a procedure or subroutine. For instance, if an STI instruction is followed by an RET instruction, the RET instruction is allowed to execute before external interrupts are recognized. No interrupts can be recognized if an execution of CLI immediately follow such an execution of STI.) The inhibition ends after delivery of another event (e.g., exception) or the execution of the next instruction.

The IF flag and the STI and CLI instructions do not prohibit the generation of exceptions and nonmaskable interrupts (NMIs). However, NMIs (and system-management interrupts) may be inhibited on the instruction boundary following an execution of STI that begins with IF = 0.

Operation is different in two modes defined as follows:

* PVI mode (protected-mode virtual interrupts): CR0.PE = 1, EFLAGS.VM = 0, CPL = 3, and CR4.PVI = 1; * VME mode (virtual-8086 mode extensions): CR0.PE = 1, EFLAGS.VM = 1, and CR4.VME = 1.

If IOPL < 3, EFLAGS.VIP = 1, and either VME mode or PVI mode is active, STI sets the VIF flag in the EFLAGS register, leaving IF unaffected.

Table 4-22 indicates the action of the STI instruction depending on the processor operating mode, IOPL, CPL, and EFLAGS.VIP.

**Decision Table for STI Results**

| Mode | IOPL | EFLAGS.VIP | STI Result |
| --- | --- | --- | --- |
| l-address | X1 | X | IF = 1 |
| , not PVI2 | CPL | X | IF = 1 |
|  | < CPL | X | #GP fault |
|  | 3 | X | IF = 1 |

## Operation

```text
IF CR0.PE = 0 (* Executing in real-address mode *)
    THEN IF := 1; (* Set Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 1; (* Set Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN
                                  IF EFLAGS.VIP = 0
                                        THEN VIF := 1; (* Set Virtual Interrupt Flag *)
                                        ELSE #GP(0);
                                  FI;
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## Flags affected

Either the IF flag or the VIF flag is set to 1. Other flags are unaffected.
