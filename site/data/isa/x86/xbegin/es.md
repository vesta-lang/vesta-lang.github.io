---
summary: Comienzo Transaccional
---

## Descripción

La instrucción XBEGIN especifica el inicio de una región de código RTM. Si el procesador lógico no estaba ya en ejecución transaccional, la instrucción XBEGIN hace que el procesador lógico se transfiera a la ejecución transaccional. La instrucción XBEGIN que transfiere el procesador lógico a la ejecución transaccional se conoce como la instrucción XBEGIN más externa. La instrucción también especifica una compensación relativa para calcular la dirección de la ruta del código de caída después de un aborto transaccional. (El uso del tamaño de operando de 16 bits no hace que esta dirección sea truncada a 16 bits, a diferencia de un salto cercano a una compensación relativa.)

En un aborto RTM, el procesador lógico descarta todos los registros arquitectónicos y actualizaciones de memoria realizadas durante la ejecución RTM y restaura el estado arquitectónico a lo que corresponde a la instrucción XBEGIN más externa. La dirección de retroceso después de un aborto se calcula a partir de la instrucción XBEGIN más externa.

La ejecución de XBEGIN mientras que en una región de seguimiento de la dirección de lectura de suspensión provoca un aborto transaccional.

## Operación

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

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XBEGIN unsigned int _xbegin( void );
```

## SIMD coma flotante Excepciones

None.
