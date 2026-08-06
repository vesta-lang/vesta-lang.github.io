---
summary: Aborto Transaccional
---

## Descripción

XABORT obliga a un RTM abortar. Después de un aborto RTM, el procesador lógico reanudará la ejecución en la dirección descomposición computada a través de la instrucción XBEGIN más externa. El registro EAX se actualiza para reflejar una instrucción XABORT causada el aborto, y el argumento imm8 se proporcionará en los bits 31:24 de EAX.

## Operación

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

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XABORT void _xabort( unsigned int);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

Si LOCK prefijo es usado.
