---
summary: Mover datos después de intercambiar bytes
---

## Descripción

Realiza una operación de intercambio de bytes en los datos copiados del segundo operando (operando de origen) y almacena el resultado en el primer operando (operando de destino). El operando de origen puede ser un registro de proposito general, o ubicación de memoria; el registro de destino puede ser un registro de proposito general, o una ubicación de memoria; sin embargo, ambos operandos no pueden ser registros, y sólo un operando puede ser una ubicación de memoria. Ambos operandos deben ser del mismo tamaño, que puede ser una palabra, una palabra doble o cuádword.

La instrucción MOVBE se proporciona para intercambiar los bytes en una lectura de la memoria o en un escrito a la memoria; por lo tanto, proporcionar apoyo para la conversión de valores poco-endianos a formato grande y viceversa.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
TEMP := SRC

IF ( OperandSize = 16)

    THEN
          DEST[7:0] := TEMP[15:8];
          DEST[15:8] := TEMP[7:0];

   ELES IF ( OperandSize = 32)

          DEST[7:0] := TEMP[31:24];
          DEST[15:8] := TEMP[23:16];
          DEST[23:16] := TEMP[15:8];
          DEST[31:23] := TEMP[7:0];

   ELSE IF ( OperandSize = 64)

          DEST[7:0] := TEMP[63:56];
          DEST[15:8] := TEMP[55:48];


          DEST[23:16] := TEMP[47:40];
          DEST[31:24] := TEMP[39:32];
          DEST[39:32] := TEMP[31:24];
          DEST[47:40] := TEMP[23:16];
          DEST[55:48] := TEMP[15:8];
          DEST[63:56] := TEMP[7:0];

FI;
```

## Banderas afectadas

None.
