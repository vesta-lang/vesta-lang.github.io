---
summary: Transactional End
---

## Description

The instruction marks the end of an RTM code region. If this corresponds to the outermost scope (that is, including this XEND instruction, the number of XBEGIN instructions is the same as number of XEND instructions), the logical processor will attempt to commit the logical processor state atomically. If the commit fails, the logical processor will rollback all architectural register and memory updates performed during the RTM execution. The logical processor will resume execution at the fallback address computed from the outermost XBEGIN instruction. The EAX register is updated to reflect RTM abort information.

Execution of XEND outside a transactional region causes a general-protection exception (#GP). Execution of XEND while in a suspend read address tracking region causes a transactional abort.

## Operation

```text
XEND
IF (RTM_ACTIVE = 0) THEN

    SIGNAL #GP
ELSE

    IF SUSLDTRK_ACTIVE = 1
          THEN GOTO RTM_ABORT_PROCESSING;

    FI;
    RTM_NEST_COUNT--
    IF (RTM_NEST_COUNT = 0) THEN

          Try to commit transaction
          IF fail to commit transactional execution

                THEN
                      GOTO RTM_ABORT_PROCESSING;

                ELSE (* commit success *)
                      RTM_ACTIVE := 0

          FI;
    FI;
FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state
    Discard memory updates performed in transaction
    Update EAX with status
    RTM_NEST_COUNT := 0
    RTM_ACTIVE := 0
    SUSLDTRK_ACTIVE := 0
    IF 64-bit Mode

          THEN


               RIP := fallbackRIP
         ELSE

               EIP := fallbackEIP

    FI;
END
```

## Flags affected

None.

## Intel C/C++ compiler intrinsics

```c
XEND void _xend( void );
```

## SIMD Floating-Point Exceptions

None.

## Other Exceptions

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

If LOCK prefix is used.

```text
#GP(0)                   If RTM_ACTIVE = 0.
```
