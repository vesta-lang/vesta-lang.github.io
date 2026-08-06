---
summary: Write to User Shadow Stack
---

## Description

Writes bytes in register source to a user shadow stack pag.

## Operation

```text
IF CR4.CET = 0
    THEN #UD; FI;

IF CPL > 0
    THEN #GP(0); FI;

DEST_LA = Linear_Address(mem operand)
IF (operand size is 64 bit)

    THEN
          (* Destination not 8B aligned *)
          IF DEST_LA[2:0]
                THEN GP(0); FI;
          Shadow_stack_store 8 bytes of SRC to DEST_LA as user-mode access;

    ELSE
          (* Destination not 4B aligned *)
          IF DEST_LA[1:0]
                THEN GP(0); FI;
          Shadow_stack_store 4 bytes of SRC[31:0] to DEST_LA as user-mode access;

FI;
```

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent

WRUSSD void _wrussd(__int32, void *); WRUSSQ void _wrussq(__int64, void *);
