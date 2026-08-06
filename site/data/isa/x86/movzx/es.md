---
summary: Muévete con Zero-Extend
---

## Descripción

Copia el contenido de la fuente operand (registr o ubicación de memoria) al destino operand (register) y cero extiende el valor. El tamaño del valor convertido depende del atributo el operando-size.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits operandos. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := ZeroExtend(SRC);
```

## Banderas afectadas

None.
