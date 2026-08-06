---
summary: Transactional Abort
---

## Description

XABORT forces an RTM abort. Following an RTM abort, the logical processor resumes execution at the fallback address computed through the outermost XBEGIN instruction. The EAX register is updated to reflect an XABORT instruction caused the abort, and the imm8 argument will be provided in bits 31:24 of EAX.

## Operation

```text
XABORT
IF RTM_ACTIVE = 0

    THEN
          Treat as NOP;

    ELSE
          GOTO RTM_ABORT_PROCESSING;

FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state;
    Discard memory updates performed in transaction;
    Update EAX with status and XABORT argument;
    RTM_NEST_COUNT:= 0;
    RTM_ACTIVE:= 0;
    SUSLDTRK_ACTIVE := 0;
    IF 64-bit Mode

          THEN
                RIP:= fallbackRIP;

          ELSE
                EIP := fallbackEIP;

    FI;
END
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XABORT void _xabort( unsigned int);
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

If LOCK prefix is used.
