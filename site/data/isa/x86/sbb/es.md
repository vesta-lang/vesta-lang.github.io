---
summary: Sutracción de enteros con el aburrimiento
---

## Descripción

Añade el operando de origen (segundo operando) y la bandera de acarreo (CF), y resta el resultado del operando de destino (primer operando). El resultado de la resta se almacena en el operando de destino. El operando de destino puede ser un registro o una ubicación de memoria; el operando de origen puede ser un registro inmediato, o una ubicación de memoria. (Sin embargo, dos operandos de memoria no se pueden utilizar en una instrucción.) El estado de la bandera CF representa un préstamo de una resta anterior.

Cuando un valor inmediato se utiliza como un operando, se muestra en la longitud del formato el operando de destino.

La instrucción SBB no distingue entre operandos con o sin signo. En su lugar, el procesador evalúa el resultado para ambos tipos de datos y establece las banderas OF y CF para indicar un préstamo en el resultado con o sin signo, respectivamente. La bandera SF indica el signo del resultado con signo.

La instrucción SBB generalmente se ejecuta como parte de una resta multibyte o multipalabra en la que una instrucción SUB es seguida por una instrucción SBB.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := (DEST  (SRC + CF));
```

## Intel C/C++ compilador intrínseco

```c
SBB extern unsigned char _subborrow_u8(unsigned char c_in, unsigned char src1, unsigned char src2, unsigned char *diff_out);
SBB extern unsigned char _subborrow_u16(unsigned char c_in, unsigned short src1, unsigned short src2, unsigned short *diff_out);
SBB extern unsigned char _subborrow_u32(unsigned char c_in, unsigned int src1, unsigned char int, unsigned int *diff_out);
SBB extern unsigned char _subborrow_u64(unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *diff_out);
```

## Banderas afectadas

Las banderas OF, SF, ZF, AF, PF y CF se establecen según el resultado.
