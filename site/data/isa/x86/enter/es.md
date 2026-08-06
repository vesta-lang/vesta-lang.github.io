---
summary: Haga el marco para parámetros de procedimiento
---

## Descripción

Crea un marco de pila (compuesta de espacio para almacenamiento dinámico y almacenamiento de puntero de marco 1-32) para un procedimiento. El primer operando (imm16) especifica el tamaño del almacenamiento dinámico en el marco de la pila (es decir, el número de bytes de asignación dinámica en la pila para el procedimiento). El segundo operando (imm8) da el nivel de anidación lexical (0 a 31) del procedimiento. El nivel de anidación (imm8 mod 32) y el atributo OperandSize determinan el tamaño en bytes del espacio de almacenamiento para punteros de marco.

El nivel de anidación determina el número de punteros de marcos que se copian en la "zona de reproducción" del nuevo marco de pila del marco anterior. El tamaño predeterminado del puntero de marco es el atributo StackAddrSize, pero se puede sobrescribir usando el prefijo 66H. Así, el atributo OperandSize determina el tamaño de cada puntero de marco que será copiado en el marco de la pila y los datos que se transfieren de SP/ESP/RSP registrados en el registro BP/EBP/RBP.

Las instrucciones ENTER y compañero LEAVE se proporcionan para apoyar los lenguajes estructurados bloque. La instrucción ENTER (cuando se utiliza) es típicamente la primera instrucción en un procedimiento y se utiliza para establecer un nuevo marco de pila para un procedimiento. La instrucción LEAVE se utiliza al final del procedimiento (justo antes de la instrucción RET) para liberar el marco de la pila.

Si el nivel de anidación es 0, el procesador empuja el puntero del marco desde el BP/EBP/RBPregistro en la pila, copia la corrientepuntero de piladel SP/ESP/RSPregistro en el BP/EBP/RBPregistro, y carga el SP/ESP/RSPregistro con el valor actual del puntero de pila menos el valor del tamañooperando. Para los niveles de anidación de 1 o mayor, el procesador empuja los punteros de marco adicionales en la pila antes de ajustar el puntero de pila. Estos punteros de marco adicionales proporcionan el procedimiento llamado con puntos de acceso a otros marcos anidados en la pila. Ver "Procedimiento Llama para Idiomas Estructurados por Bloques" en el Capítulo 6 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para obtener más información sobre las acciones de la instrucción ENTER.

La instrucción ENTER causa un fallo de pagina cada vez que una escritura usando el valor final del puntero de pila (dentro del segmento de pila actual) lo haría.

En modo de 64 bits, el tamaño de operación predeterminado es de 64 bits; el tamaño de operación de 32 bits no se puede codificar. Uso de 66H prefijo cambios indicador tamaño de operando a 16 bits.

Cuando se utiliza el prefijo 66H y causa que el atributo OperandSize sea inferior al StackAddrSize, el software es responsable de lo siguiente:

* La instrucción del compañero LEAVE también debe utilizar el prefijo 66H, * El valor en el registro RBP/EBP antes de ejecutar "66H ENTER" debe estar dentro de la misma región de 16KByte

el puntero de pila actual (RSP/ESP), tal que el valor de RBP/EBP después de "66H ENTER" sigue siendo una dirección válida en la pila. Esto asegura que "66H LEAVE" puede restaurar 16 bits de datos de la pila.

## Operación

```text
AllocSize := imm16;
NestingLevel := imm8 MOD 32;
IF (OperandSize = 64)

    THEN
          Push(RBP); (* RSP decrements by 8 *)
          FrameTemp := RSP;

   ELSE IF OperandSize = 32

          THEN
                Push(EBP); (* (E)SP decrements by 4 *)
                FrameTemp := ESP; FI;

   ELSE (* OperandSize = 16 *)

                Push(BP); (* RSP or (E)SP decrements by 2 *)
                FrameTemp := SP;
FI;

IF NestingLevel = 0

    THEN GOTO CONTINUE;
FI;

IF (NestingLevel > 1)
    THEN FOR i := 1 to (NestingLevel - 1)
          DO
                IF (OperandSize = 64)
                       THEN
                             RBP := RBP - 8;
                             Push([RBP]); (* Quadword push *)
                       ELSE IF OperandSize = 32
                             THEN
                                   IF StackSize = 32
                                         EBP := EBP - 4;
                                         Push([EBP]); (* Doubleword push *)
                                   ELSE (* StackSize = 16 *)
                                         BP := BP - 4;
                                         Push([BP]); (* Doubleword push *)
                                   FI;
                             FI;
                       ELSE (* OperandSize = 16 *)
                             IF StackSize = 64
                                   THEN
                                         RBP := RBP - 2;
                                         Push([RBP]); (* Word push *)
                             ELSE IF StackSize = 32
                                   THEN
                                         EBP := EBP - 2;
                                         Push([EBP]); (* Word push *)
                                   ELSE (* StackSize = 16 *)
                                         BP := BP - 2;
                                         Push([BP]); (* Word push *)
                             FI;
                       FI;
    OD;

FI;

IF (OperandSize = 64) (* nestinglevel 1 *)


    THEN
          Push(FrameTemp); (* Quadword push and RSP decrements by 8 *)

    ELSE IF OperandSize = 32
          THEN
                Push(FrameTemp); FI; (* Doubleword push and (E)SP decrements by 4 *)

    ELSE (* OperandSize = 16 *)
                Push(FrameTemp); (* Word push and RSP|ESP|SP decrements by 2 *)

FI;

CONTINUE:
IF 64-Bit Mode (StackSize = 64)

    THEN
                RBP := FrameTemp;

             RSP := RSP - AllocSize;

    ELSE IF OperandSize = 32
          THEN
                EBP := FrameTemp;

             ESP := ESP - AllocSize; FI;

    ELSE (* OperandSize = 16 *)
                BP := FrameTemp[15:1]; (* Bits 16 and above of applicable RBP/EBP are unmodified *)

             SP := SP - AllocSize;

FI;

END;
```

## Banderas afectadas

None.
