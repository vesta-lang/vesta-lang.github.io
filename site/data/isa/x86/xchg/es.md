---
summary: Registro de intercambio / memoria con registro
---

## Descripción

Intercambia el contenido del destino (primero) y fuente (segundo) operandos. Los operandos puede ser dos registros generales o un registro y una ubicación de memoria. Si se hace referencia a un operando de memoria, el protocolo de bloqueo del procesador se implementa automáticamente durante la operación de intercambio, independientemente de la presencia o ausencia del prefijo LOCK o del valor del IOPL. (Véase la descripción prefijo LOCK en este capítulo para más información sobre el protocolo de bloqueo.)

Esta instrucción es útil para implementar semáforos o estructuras de datos similares para la sincronización de procesos. (Ver "Bus Locking" en el capítulo 9 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para obtener más información sobre el bloqueo de bus.)

La instrucción XCHG también se puede utilizar en lugar de la instrucción BSWAP de 16 bits operandos.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

NOTE

XCHG (E)AX, (E)AX (encoded instruction byte is 90H) es un alias para NOP independientemente de los prefijos del tamaño de los datos, incluyendo REX.W.

## Operación

```text
TEMP := DEST;
DEST := SRC;
SRC := TEMP;
```

## Banderas afectadas

None.
