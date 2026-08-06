---
summary: Mark Shadow Stack Busy
---

## Descripción

La instrucción SETSSBSY verifica la presencia de un apilador de sombras de supervisor no abusado en la dirección del IA32 PL0 SSP MSR y la marca ocupada. Después de la ejecución exitosa de la instrucción, el SSP se establece en el valor del IA32 PL0 SSP MSR.

Esta instrucción no se puede ejecutar cuando las transiciones FRED están habilitadas. Las transiciones FRED no utilizan tokens de apilamiento de sombras supervisor.

## Operación

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

## Banderas afectadas

None.

C/C++ Compiler Intrinsic Equivalent SETSSBSYvoid  setssbsy(void);
