---
summary: Set AC Flag in EFLAGS Register
---

## Description

Sets the AC flag bit in EFLAGS register. This may enable alignment checking of user-mode data accesses. This allows explicit supervisor-mode data accesses to user-mode pages even if the SMAP bit is set in the CR4 register. This instruction's operation is the same in non-64-bit modes and 64-bit mode. Attempts to execute STAC when CPL > 0 cause #UD.

## Operation

```text
EFLAGS.AC := 1;
```

## Flags affected

AC set. Other flags are unaffected.
