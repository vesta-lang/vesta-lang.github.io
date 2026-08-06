---
summary: Load Status Flags Into AH Register
---

## Description

This instruction executes as described above in compatibility mode and legacy mode. It is valid in 64-bit mode only if CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1.

## Operation

```text
IF 64-Bit ModeTHENIF CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1;THEN AH := RFLAGS(SF:ZF:0:AF:0:PF:1:CF);ELSE #UD; FI;ELSEAH
:= EFLAGS(SF:ZF:0:AF:0:PF:1:CF);FI;
```

## Flags affected

None. The state of the flags in the EFLAGS register is not affected.
