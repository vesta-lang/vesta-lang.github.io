---
summary: Clear Task-Switched Flag in CR0
---

## Description

Clears the task-switched (TS) flag in the CR0 register. This instruction is intended for use in operating-system procedures. It is a privileged instruction that can only be executed at a CPL of 0. It is allowed to be executed in realaddress mode to allow initialization for protected mode.

The processor sets the TS flag every time a task switch occurs. The flag is used to synchronize the saving of FPU context in multitasking applications. See the description of the TS flag in the section titled "Control Registers" in Chapter 2 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A, for more information about this flag.

CLTS operation is the same in non-64-bit modes and 64-bit mode.

See Chapter 27, "Virtual Machine Control Structures," of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3C, for more information about the behavior of this instruction in VMX non-root operation.

## Operation

```text
CR0.TS[bit 3] := 0;
```

## Flags affected

The TS flag in CR0 register is cleared.
