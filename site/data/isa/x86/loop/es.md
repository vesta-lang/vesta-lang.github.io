---
summary: Loop Según ECX Counter
---

## Descripción

Realiza una operación de bucle usando el registro RCX, ECX o CX como contador (dependiendo de si el tamaño de la dirección es de 64 bits, 32 bits, o 16 bits). Tenga en cuenta que la instrucción LOOP ignora REX.W; pero el tamaño de la dirección de 64 bits puede ser over-ridden utilizando un prefijo 67H.

Cada vez que se ejecuta la instrucción LOOP, el registro de cuenta es decrementado, y luego se verifica para 0. Si el recuento es 0, el bucle se termina y la ejecución del programa continúa con la instrucción siguiendo la instrucción LOOP. Si el conteo no es cero, un salto cercano se realiza al destino (target) operando, que es presumiblemente la instrucción al comienzo del bucle.

La instrucción de destino se especifica con un offset relativo (un offset firmado en relación con el valor actual del puntero de instruccion en el registro IP/EIP/RIP). Este offset se especifica generalmente como una etiqueta en código de montaje, pero a nivel de código de máquina, se codifica como un valor inmediato firmado de 8 bits, que se añade al puntero de instruccion. Se admiten desactivaciones de 128 a +127 con esta instrucción.

Algunas formas de la instrucción del bucle (LOOPcc) también aceptan la bandera ZF como condición para terminar el bucle antes de que el conteo llegue a cero. Con estas formas de la instrucción, un código de condición (cc) se asocia con cada instrucción para indicar la condición que se está probando. Aquí, la instrucción LOOPcc en sí no afecta el estado de la bandera ZF; la bandera ZF se cambia por otras instrucciones en el bucle.

## Operación

```text
IF (AddressSize = 32)

    THEN Count is ECX;
ELSE IF (AddressSize = 64)

    Count is RCX;
ELSE Count is CX;
FI;

Count := Count  1;

IF Instruction is not LOOP
    THEN
          IF (Instruction := LOOPE) or (Instruction := LOOPZ)

             THEN IF (ZF = 1) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;

             ELSE (Instruction = LOOPNE) or (Instruction = LOOPNZ)
                  IF (ZF = 0 ) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;


          FI;

   ELSE (* Instruction = LOOP *)
        IF (Count  0)

                THEN BranchCond := 1;

                ELSE BranchCond := 0;

          FI;

FI;

IF BranchCond = 1

    THEN
          IF in 64-bit mode (* OperandSize = 64 *)
                THEN
                      tempRIP := RIP + SignExtend(DEST);
                      IF tempRIP is not canonical
                            THEN #GP(0);
                      ELSE RIP := tempRIP;
                      FI;
                ELSE
                      tempEIP := EIP SignExtend(DEST);
                      IF OperandSize 16
                            THEN tempEIP := tempEIP AND 0000FFFFH;
                      FI;
                      IF tempEIP is not within code segment limit
                            THEN #GP(0);
                            ELSE EIP := tempEIP;
                      FI;
          FI;

    ELSE
          Terminate loop and continue program execution at (R/E)IP;

FI;
```

## Banderas afectadas

None.
