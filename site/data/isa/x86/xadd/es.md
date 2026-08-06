---
summary: Intercambio y Add
---

## Descripción

Intercambia el primer operando (operando de destino) con el segundo operando (operando de origen), luego carga la suma de los dos valores en el operando de destino. El operando de destino puede ser un registro o una ubicación de memoria; el operando de origen es un registro.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

## Compatibilidad de arquitectura IA-32

Los procesadores IA-32 antes que el procesador Intel486 no reconocen esta instrucción. Si esta instrucción se utiliza, debe proporcionar una secuencia de código equivalente que se ejecuta en procesadores anteriores.

## Operación

```text
TEMP := SRC + DEST;
SRC := DEST;
DEST := TEMP;
```

## Banderas afectadas

Las banderas CF, PF, AF, SF, ZF y OF se establecen según el resultado de la adición, que se almacena en el operando de destino.
