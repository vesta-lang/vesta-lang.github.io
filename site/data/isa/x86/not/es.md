---
summary: Negación complementaria
---

## Descripción

Realiza una operación bitwise NOT (cada 1 se establece a 0, y cada 0 se establece a 1) en el operando de destino y almacena el resultado en la ubicación el operando de destino. El operando de destino puede ser un registro o una ubicación de memoria. Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente. En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := NOT DEST;
```

## Banderas afectadas

None.
