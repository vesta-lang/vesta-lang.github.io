---
summary: Bandera Busy clara en un Supervisor Shadow Stack Token
---

## Descripción

Bandera ocupada clara en la referencia token de la pila de sombra de supervisor por m64. Después de marcar la pila de sombras como no ocupado el SSP está cargado con el valor 0.

Esta instrucción no se puede ejecutar cuando las transiciones FRED están habilitadas. Las transiciones FRED no utilizan tokens de apilamiento de sombras supervisor.

## Operación

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

## Banderas afectadas

CF se establece si se detecta una ficha inválida, de lo contrario se pone a cero. ZF, PF, AF, OF y SF están despejados.
