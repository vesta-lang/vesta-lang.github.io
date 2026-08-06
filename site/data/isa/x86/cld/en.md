---
summary: Clear Direction Flag
---

## Description

Clears the DF flag in the EFLAGS register. When the DF flag is set to 0, string operations increment the index registers (ESI and/or EDI). Operation is the same in all modes.

## Operation

```text
DF := 0;
```

## Flags affected

The DF flag is set to 0. The CF, OF, ZF, SF, AF, and PF flags are unaffected.
