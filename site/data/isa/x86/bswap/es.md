---
summary: Byte Swap
---

## Descripción

Invierte el orden de byte de un registro de 32 bits o 64 bits (destinación). Esta instrucción se proporciona para convertir los valores pocoendianos a formato grande y viceversa. Para cambiar bytes en un valor de palabra (16-bit registro), utilice la instrucción XCHG. Cuando la instrucción BSWAP hace referencia a un registro de 16 bits, el resultado no está definido.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.B permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Compatibilidad de arquitectura IA-32

La instrucción BSWAP no es compatible con procesadores IA-32 antes que la familia procesadora Intel486TM. Para la compatibilidad con esta instrucción, el software debe incluir código funcionalmente equivalente para la ejecución en procesadores Intel antes que la familia procesadora Intel486.

## Operación

```text
TEMP := DEST
IF 64-bit mode AND OperandSize = 64

    THEN
          DEST[7:0] := TEMP[63:56];
          DEST[15:8] := TEMP[55:48];
          DEST[23:16] := TEMP[47:40];
          DEST[31:24] := TEMP[39:32];
          DEST[39:32] := TEMP[31:24];
          DEST[47:40] := TEMP[23:16];
          DEST[55:48] := TEMP[15:8];
          DEST[63:56] := TEMP[7:0];

    ELSE
          DEST[7:0] := TEMP[31:24];
          DEST[15:8] := TEMP[23:16];
          DEST[23:16] := TEMP[15:8];
          DEST[31:24] := TEMP[7:0];

FI;
```

## Banderas afectadas

None.
