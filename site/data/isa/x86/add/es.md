---
summary: Añadir
---

## Descripción

Añade el operando de destino (primer operando) y el operando de origen (segundo operando) y luego almacena el resultado en el operando de destino. El operando de destino puede ser un registro o una ubicación de memoria; el operando de origen puede ser un registro inmediato, o una ubicación de memoria. (Sin embargo, dos operandos de memoria no se pueden utilizar en una instrucción.) Cuando un valor inmediato se utiliza como un operando, se muestra-extended a la longitud del formato el operando de destino.

La instrucción ADD realiza adición entero. Evalua el resultado tanto para el entero firmado y no firmado operandos y establece las banderas OF y CF para indicar un port (overflow) en el resultado con o sin signo, respectivamente. La bandera SF indica el signo del resultado con signo.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := DEST + SRC;
```

## Banderas afectadas

Las banderas OF, SF, ZF, AF, CF y PF se establecen según el resultado.
