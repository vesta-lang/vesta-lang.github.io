---
summary: Clear Interrupt Flag
---

## Description

In most cases, CLI clears the IF flag in the EFLAGS register and no other flags are affected. Clearing the IF flag causes the processor to ignore maskable external interrupts. The IF flag and the CLI and STI instruction have no effect on the generation of exceptions and NMI interrupts.

Operation is different in two modes defined as follows:

* PVI mode (protected-mode virtual interrupts): CR0.PE = 1, EFLAGS.VM = 0, CPL = 3, and CR4.PVI = 1; * VME mode (virtual-8086 mode extensions): CR0.PE = 1, EFLAGS.VM = 1, and CR4.VME = 1.

If IOPL < 3 and either VME mode or PVI mode is active, CLI clears the VIF flag in the EFLAGS register, leaving IF unaffected.

Table 3-7 indicates the action of the CLI instruction depending on the processor operating mode, IOPL, and CPL.

```text
                   Mode                 Table 3-7. Decision Table for CLI Results  CLI Result
              Real-address                                    IOPL                    IF = 0
          Protected, not PVI2                                  X1                     IF = 0
```

CPL

```text
             Protected, PVI3                                 < CPL                 #GP fault
                                                                3                     IF = 0
        Virtual-8086, not VME3                                02                    VIF = 0
                                                                3                     IF = 0
          Virtual-8086, VME3                                  02
                                                                3                  #GP fault
                                                              02                     IF = 0
```

VIF = 0

NOTES: 1. X = This setting has no effect on instruction operation. 2. For this table, "protected mode" applies whenever CR0.PE = 1 and EFLAGS.VM = 0; it includes compatibility mode and 64-bit mode. 3. PVI mode and virtual-8086 mode each imply CPL = 3.

## Operation

```text
IF CR0.PE = 0
    THEN IF := 0; (* Reset Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 0; (* Reset Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN VIF := 0; (* Reset Virtual Interrupt Flag *)
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## Flags affected

Either the IF flag or the VIF flag is cleared to 0. Other flags are unaffected.
