---
summary: Prueba de bits y complemento
---

## Descripción

Selecciona el bit en un bit string (especificado con el primer operando, llamado la base de bits) en el bit-position designado por el bit offset operando (segundo operando), almacena el valor del bit en la bandera CF, y complementa el bit seleccionado en la cadena de bits. El bit base operando puede ser un registro o una ubicación de memoria; el bit offset operando puede ser un registro o un valor inmediato:

* Si el bit base operando especifica un registro, la instrucción toma el modulo 16, 32, o 64 del bit offset

operando (tamaño de modulo depende del modo y tamaño de registro; operandos de 64 bits están disponibles sólo en modo de 64 bits). Esto permite seleccionar cualquier posición de bits.

* Si el bit base operando especifica una ubicación de memoria, el operando representa la dirección del byte en memoria

que contiene la base bit (bit 0 del byte especificado) de la cadena bit. El rango de la posición del bit que puede ser referenciado por el operando offset depende del tamaño de operando.

See also: Bit(BitBase, BitOffset) on page 3-11.

Algunos ensambladores soportan compensaciones de bit inmediatas superiores a 31 utilizando el campo de compensación de bits inmediato en combinación con el campo de desplazamiento del operando de memoria. Vea "BT--Bit Test" en este capítulo para obtener más información sobre este mecanismo de tratamiento.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. Utilizando un prefijo REX en forma de REX.B permite el acceso a registros adicionales (R8-R15) para la base de bits. Utilizando un prefijo REX en forma de REX.R permite el acceso a R8-R15 para el offset de bits (cuando utiliza un registro). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
CF := Bit(BitBase, BitOffset);
Bit(BitBase, BitOffset) := NOT Bit(BitBase, BitOffset);
```

## Banderas afectadas

La bandera CF contiene el valor del bit seleccionado antes de que se complemente. La bandera ZF no está afectada. Las banderas OF, SF, AF y PF quedan indefinidas.
