---
summary: Exclusivo lógico
---

## Descripción

Realiza un funcionamiento exclusivo de OR (XOR) en el destino (primero) y fuente (segundo) operandos y almacena el resultado en la ubicación del operando de destino. El operando de origen puede ser un registro inmediato, un registro, o una ubicación de memoria; el operando de destino puede ser un registro o una ubicación de memoria. (Sin embargo, dos operandos de memoria no se pueden utilizar en una instrucción.) Cada parte del resultado es 1 si los bits correspondientes de los operandos son diferentes; cada bit es 0 si los bits correspondientes son los mismos.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := DEST XOR SRC;
```

## Banderas afectadas

Las banderas OF y CF se limpian; las banderas SF, ZF y PF se establecen según el resultado. El estado de la bandera AF es indefinido.
