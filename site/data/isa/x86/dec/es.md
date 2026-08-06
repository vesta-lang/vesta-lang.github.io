---
summary: Decremento por 1
---

## Descripción

Subtracts 1 del operando de destino, mientras preserva el estado de la bandera CF. El operando de destino puede ser un registro o una ubicación de memoria. Esta instrucción permite actualizar un contador de bucle sin perturbar la bandera CF. (Para realizar una operación de decremento que actualiza la bandera CF, utilice una instrucción SUB con un operando inmediato de 1.)

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, DEC r16 y DEC r32 no son encodables (porque códigos de operación 48H a través de 4FH son prefijos REX). De lo contrario, el tamaño de operación predeterminado de 64 bits de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits.

Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := DEST  1;
```

## Banderas afectadas

La bandera CF no está afectada. Las banderas OF, SF, ZF, AF y PF se establecen según el resultado.
