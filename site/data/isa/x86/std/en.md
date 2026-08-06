---
summary: Set Direction Flag
---

## Description

Sets the DF flag in the EFLAGS register. When the DF flag is set to 1, string operations decrement the index registers (ESI and/or EDI). Operation is the same in all modes.

## Operation

```text
DF := 1;
```

## Flags affected

The DF flag is set. The CF, OF, ZF, SF, AF, and PF flags are unaffected.
