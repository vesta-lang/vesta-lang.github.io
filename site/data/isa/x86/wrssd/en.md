---
summary: Write to Shadow Stack
---

## Description

Writes bytes in register source to the shadow stack.

## Operation

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;
    IF (IA32_U_CET.WR_SHSTK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;
    IF (IA32_S_CET.WR_SHSTK_EN) = 0
          THEN #UD; FI;

FI;
DEST_LA = Linear_Address(mem operand)
IF (operand size is 64 bit)

    THEN
          (* Destination not 8B aligned *)
          IF DEST_LA[2:0]
                THEN GP(0); FI;
          Shadow_stack_store 8 bytes of SRC to DEST_LA;

    ELSE
          (* Destination not 4B aligned *)
          IF DEST_LA[1:0]
                THEN GP(0); FI;
          Shadow_stack_store 4 bytes of SRC[31:0] to DEST_LA;

FI;
```

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent

WRSSD void _wrssd(__int32, void *); WRSSQ void _wrssq(__int64, void *);
