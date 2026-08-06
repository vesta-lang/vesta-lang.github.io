---
summary: Mark Shadow Stack Busy
---

## Description

The SETSSBSY instruction verifies the presence of a non-busy supervisor shadow stack token at the address in the IA32_PL0_SSP MSR and marks it busy. Following successful execution of the instruction, the SSP is set to the value of the IA32_PL0_SSP MSR.

This instruction cannot be executed when FRED transitions are enabled. FRED transitions do not use supervisor shadow stack tokens.

## Operation

```text
IF CR4.CET = 0 OR CR4.FRED = 1
    THEN #UD; FI;

IF IA32_S_CET.SH_STK_EN = 0
    THEN #UD; FI;

IF CPL > 0
    THEN GP(0); FI;

SSP_LA = IA32_PL0_SSP
If SSP_LA not aligned to 8 bytes

    THEN #GP(0); FI;

expected_token_value = SSP_LA              (* busy bit must not be set *)

new_token_value  = SSP_LA | BUSY_BIT       (* set busy bit; bit position 0 *)

IF shadow_stack_lock_cmpxchg8B(SSP_LA, new_token_value, expected_token_value) != expected_token_value

THEN #CP(SETSSBSY); FI;

SSP = SSP_LA
```

## Flags affected

None.

C/C++ Compiler Intrinsic Equivalent SETSSBSYvoid _setssbsy(void);
