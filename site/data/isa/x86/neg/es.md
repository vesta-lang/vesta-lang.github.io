---
summary: Negación complementaria de dos
---

## Descripción

Sustituye el valor de operando (el operando de destino) con su complemento de dos. (Esta operación equivale a restar el operando de 0.) el operando de destino se encuentra en un registro de proposito general o una ubicación de memoria.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF DEST = 0
    THEN CF := 0;
    ELSE CF := 1;

FI;
DEST := [ (DEST)]
```

## Banderas afectadas

La bandera CF se establece a 0 si el operando de origen es 0; de lo contrario se establece a 1. Las banderas OF, SF, ZF, AF y PF se establecen según el resultado.
