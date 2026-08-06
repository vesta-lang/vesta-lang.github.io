---
summary: History Reset
---

## Description

Requests the processor to selectively reset selected components of hardware history maintained by the current logical processor. HRESET operation is controlled by the implicit EAX operand. The value of the explicit imm8 operand is ignored. This instruction can only be executed at privilege level 0.

The HRESET instruction can be used to request reset of multiple components of hardware history. Prior to the execution of HRESET, the system software must take the following steps:

1. Enumerate the HRESET capabilities via CPUID.20H.00H:EBX, which indicates what components of hardware history can be reset.

2. Only the bits enumerated by CPUID.20H.00H:EBX can be set in the IA32_HRESET_ENABLE MSR.

HRESET causes a general-protection exception (#GP) if EAX sets any bits that are not set in the IA32_HRESET_EN- ABLE MSR.

Any attempt to execute the HRESET instruction inside a transactional region will result in a transaction abort.

## Operation

```text
IF EAX = 0

  THEN NOP
  ELSE

      FOREACH i such that EAX[i] = 1
         Reset prediction history for feature i

FI
```

## Flags affected

None.
