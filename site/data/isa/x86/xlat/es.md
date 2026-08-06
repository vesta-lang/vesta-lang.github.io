---
summary: Table Lookup Translation
---

## Descripción

Localiza una entrada de byte en una tabla en memoria, utilizando el contenido del registro AL como índice de tabla, luego copia el contenido de la entrada de tabla de nuevo en el registro AL. El índice en el registro de AL es tratado como un entero no firmado. Las instrucciones XLAT y XLATB obtienen la dirección base de la tabla en memoria de los registros DS:EBX o DS:BX (dependiendo del atributo tamaño de la instrucción, 32 o 16, respectivamente). (El segmento DS puede ser anulado con un prefijo de anulación de segmento.)

En el nivel de código de montaje se permiten dos formas de esta instrucción: la forma "explicit-operando" y la forma "nooperand". La forma explícita-operando (especificada con el XLAT mnemonic) permite que la dirección base de la tabla se especifique explícitamente con un símbolo. Esta forma explícita-operandos se proporciona para permitir la documentación; sin embargo, tenga en cuenta que la documentación proporcionada por este formulario puede ser engañosa. Es decir, el símbolo no tiene que especificar la dirección base correcta. La dirección base es siempre especificada por los registros DS:(E)BX, que deben ser cargados correctamente antes de que se ejecute la instrucción XLAT.

La forma no-operandos (XLATB) proporciona una "forma corta" de las instrucciones XLAT. Aquí también el procesador asume que los registros DS:(E)BX contienen la dirección base de la tabla.

En modo de 64 bits, la operación es similar a la de modo legado o compatibilidad. AL se utiliza para especificar el índice de tabla (el tamaño de operando se fija en 8 bits). RBX, sin embargo, se utiliza para especificar la dirección base de la tabla. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF AddressSize = 16
    THEN
          AL := (DS:BX + ZeroExtend(AL));
    ELSE IF (AddressSize = 32)
          AL := (DS:EBX + ZeroExtend(AL)); FI;
    ELSE (AddressSize = 64)
          AL := (RBX + ZeroExtend(AL));

FI;
```

## Banderas afectadas

None.
