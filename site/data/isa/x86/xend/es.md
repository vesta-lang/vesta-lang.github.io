---
summary: Final de transacción
---

## Descripción

La instrucción marca el final de una región de código RTM. Si esto corresponde al alcance más externo (es decir, incluyendo esta instrucción XEND, el número de instrucciones XBEGIN es el mismo que el número de instrucciones XEND), el procesador lógico intentará comprometer el estado procesador lógico atómico. Si el commit falla, el procesador lógico revolverá todo registro arquitectónico y actualizaciones de memoria realizadas durante la ejecución de RTM. El procesador lógico reanudará la ejecución en la dirección de retroceso calculada de la instrucción XBEGIN más externa. El registro EAX se actualiza para reflejar la información de aborto RTM.

La ejecución de XEND fuera de una región transaccional causa una excepción de protección general (#GP). La ejecución de XEND mientras que en una región de seguimiento de la dirección de lectura de suspensión provoca un aborto transaccional.

## Operación

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

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XEND void _xend( void );
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

Si LOCK prefijo es usado.

```text
#GP(0)                   If RTM_ACTIVE = 0.
```
