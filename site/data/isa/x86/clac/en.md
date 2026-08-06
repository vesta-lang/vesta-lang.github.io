---
summary: Clear AC Flag in EFLAGS Register
---

## Description

Clears the AC flag bit in EFLAGS register. This disables any alignment checking of user-mode data accesses. If the SMAP bit is set in the CR4 register, this disallows explicit supervisor-mode data accesses to user-mode pages.

This instruction's operation is the same in non-64-bit modes and 64-bit mode. Attempts to execute CLAC when CPL > 0 cause #UD.

## Operation

```text
EFLAGS.AC := 0;
```

## Flags affected

AC cleared. Other flags are unaffected.
