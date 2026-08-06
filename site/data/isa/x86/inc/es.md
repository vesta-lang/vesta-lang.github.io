---
summary: Incremento por 1
---

## Descripción

Añade 1 al operando de destino, preservando el estado de la bandera CF. El operando de destino puede ser un registro o una ubicación de memoria. Esta instrucción permite actualizar un contador de bucle sin perturbar la bandera CF. (Utilice una instrucción ADD con un operando inmediato de 1 para realizar una operación de aumento que actualiza la bandera CF.)

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, INC r16 y INC r32 no son encodables (porque códigos de operación 40H a través de 47H son prefijos REX). De lo contrario, el tamaño de operación predeterminado de 64 bits de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits.

## Operación

```text
DEST := DEST + 1;
```

## Banderas afectadas

La bandera CF no está afectada. Las banderas OF, SF, ZF, AF y PF se establecen según el resultado.
