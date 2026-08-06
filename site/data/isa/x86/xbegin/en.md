---
summary: Transactional Begin
---

## Description

The XBEGIN instruction specifies the start of an RTM code region. If the logical processor was not already in transactional execution, then the XBEGIN instruction causes the logical processor to transition into transactional execution. The XBEGIN instruction that transitions the logical processor into transactional execution is referred to as the outermost XBEGIN instruction. The instruction also specifies a relative offset to compute the address of the fallback code path following a transactional abort. (Use of the 16-bit operand size does not cause this address to be truncated to 16 bits, unlike a near jump to a relative offset.)

On an RTM abort, the logical processor discards all architectural register and memory updates performed during the RTM execution and restores architectural state to that corresponding to the outermost XBEGIN instruction. The fallback address following an abort is computed from the outermost XBEGIN instruction.

Execution of XBEGIN while in a suspend read address tracking region causes a transactional abort.

## Operation

```text
XBEGIN
IF RTM_NEST_COUNT < MAX_RTM_NEST_COUNT AND SUSLDTRK_ACTIVE = 0

    THEN
          RTM_NEST_COUNT++
          IF RTM_NEST_COUNT = 1 THEN
                IF 64-bit Mode
                      THEN
                            IF OperandSize = 16
                                  THEN fallbackRIP := RIP + SignExtend64(rel16);
                                  ELSE fallbackRIP := RIP + SignExtend64(rel32);
                            FI;
                            IF fallbackRIP is not canonical
                                  THEN #GP(0);
                            FI;
                      ELSE
                            IF OperandSize = 16
                                  THEN fallbackEIP := EIP + SignExtend32(rel16);
                                  ELSE fallbackEIP := EIP + rel32;
                            FI;
                            IF fallbackEIP outside code segment limit
                                  THEN #GP(0);
                            FI;
                FI;


                RTM_ACTIVE := 1
                Enter RTM Execution (* record register state, start tracking memory state*)
          FI; (* RTM_NEST_COUNT = 1 *)
    ELSE (* RTM_NEST_COUNT = MAX_RTM_NEST_COUNT OR SUSLDTRK_ACTIVE = 1 *)
          GOTO RTM_ABORT_PROCESSING
FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state
    Discard memory updates performed in transaction
    Update EAX with status
    RTM_NEST_COUNT := 0
    RTM_ACTIVE := 0
    SUSLDTRK_ACTIVE := 0
    IF 64-bit mode

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
XBEGIN unsigned int _xbegin( void );
```

## SIMD Floating-Point Exceptions

None.
