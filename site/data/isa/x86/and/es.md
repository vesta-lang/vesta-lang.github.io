---
summary: Logical AND
---

## Descripción

Realiza una operación bitwise AND en el destino (primero) y fuente (segundo) operandos y almacena el resultado en la ubicación el operando de destino. El operando de origen puede ser un registro inmediato, un registro, o una ubicación de memoria; el operando de destino puede ser un registro o una ubicación de memoria. (Sin embargo, dos operandos de memoria no se pueden utilizar en una instrucción.) Cada parte del resultado se establece a 1 si ambos bits correspondientes de la primera y segunda operandos son 1; de lo contrario, se establece a 0.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que se ejecute atómico.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := DEST AND SRC;
```

## Banderas afectadas

Las banderas OF y CF se limpian; las banderas SF, ZF y PF se establecen según el resultado. El estado de la bandera AF es indefinido.
