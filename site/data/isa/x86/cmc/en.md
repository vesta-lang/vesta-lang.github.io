---
summary: Complement Carry Flag
---

## Description

Complements the CF flag in the EFLAGS register. CMC operation is the same in non-64-bit modes and 64-bit mode.

## Operation

```text
EFLAGS.CF[bit 0] := NOT EFLAGS.CF[bit 0];
```

## Flags affected

The CF flag contains the complement of its original value. The OF, ZF, SF, AF, and PF flags are unaffected.
