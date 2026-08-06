---
summary: Read Processor ID
---

## Description

Reads the value of the IA32_TSC_AUX MSR (address C0000103H) into the destination register. The value of CS.D and operand-size prefixes (66H and REX.W) do not affect the behavior of the RDPID instruction.

## Operation

```text
DEST := IA32_TSC_AUX
```

## Flags affected

None.
