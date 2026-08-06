---
summary: Serialize Instruction Execution
---

## Description

Serializes instruction execution. Before the next instruction is fetched and executed, the SERIALIZE instruction ensures that all modifications to flags, registers, and memory by previous instructions are completed, draining all buffered writes to memory. This instruction is also a serializing instruction as defined in the section "Serializing Instructions" in Chapter 11 of the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A.

SERIALIZE does not modify registers, arithmetic flags, or memory.

## Operation

```text
Wait_On_Fetch_And_Execution_Of_Next_Instruction_Until(preceding_instructions_complete_and_preceding_stores_globally_visible);
```

## Intel C/C++ compiler intrinsics

```c
SERIALIZE void _serialize(void);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

If the LOCK prefix is used.

```text
#UD                 If CPUID.07H.00H:EDX.SERIALIZE[14] = 0.
```
