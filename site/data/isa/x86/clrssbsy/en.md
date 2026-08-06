---
summary: Clear Busy Flag in a Supervisor Shadow Stack Token
---

## Description

Clear busy flag in supervisor shadow stack token reference by m64. Subsequent to marking the shadow stack as not busy the SSP is loaded with value 0.

This instruction cannot be executed when FRED transitions are enabled. FRED transitions do not use supervisor shadow stack tokens.

## Operation

```text
IF CR4.CET = 0 OR CR4.FRED = 1

    THEN #UD; FI;

IF IA32_S_CET.SH_STK_EN = 0
    THEN #UD; FI;

IF CPL > 0
    THEN GP(0); FI;

SSP_LA = Linear_Address(mem operand)

IF SSP_LA not aligned to 8 bytes

THEN #GP(0); FI;

expected_token_value = SSP_LA | BUSY_BIT (* busy bit - bit position 0 - must be set *)

new_token_value = SSP_LA              (* Clear the busy bit *)

IF shadow_stack_lock_cmpxchg8b(SSP_LA, new_token_value, expected_token_value) != expected_token_value

invalid_token := 1; FI

(* Set the CF if invalid token was detected *)
RFLAGS.CF = (invalid_token == 1) ? 1 : 0;
RFLAGS.ZF,PF,AF,OF,SF := 0;
SSP := 0
```

## Flags affected

CF is set if an invalid token was detected, else it is cleared. ZF, PF, AF, OF, and SF are cleared.
