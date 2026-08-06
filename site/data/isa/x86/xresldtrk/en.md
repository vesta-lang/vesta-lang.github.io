---
summary: Resume Tracking Load Addresses
---

## Description

The instruction marks the end of an Intel TSX (RTM) suspend load address tracking region. If the instruction is used inside a suspend load address tracking region it will end the suspend region and all following load addresses will be added to the transaction read set. If this instruction is used inside an active transaction but not in a suspend region it will cause transaction abort.

If the instruction is used outside of a transactional region it behaves like a NOP. Chapter 16, "Programming with Intel(R) Transactional Synchronization Extensions," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 1 provides additional information on Intel(R) TSX Suspend Load Address Tracking.

## Operation

```text
XRESLDTRK
IF RTM_ACTIVE = 1:

    IF SUSLDTRK_ACTIVE = 1:
          SUSLDTRK_ACTIVE := 0

    ELSE:
          RTM_ABORT

ELSE:
    NOP
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XRESLDTRK void _xresldtrk(void);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

If CPUID.07H.00H:EDX.TSXLDTRK[16] = 0.

```text
#UD                    If the LOCK prefix is used.
```
