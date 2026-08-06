---
summary: Compare Dos operandos
---

## Descripción

Compara el primer operando de origen con el segundo operando de origen y establece las banderas de estado en el registro EFLAGS según los resultados. La comparación se realiza restando el segundo operando del primer operando y luego estableciendo las banderas de estado de la misma manera que la instrucción SUB. Cuando un valor inmediato se utiliza como un operando, se muestra en la longitud del primer operando.

Los códigos de condiciones utilizados por las instrucciones Jcc, CMOVcc y SETcc se basan en los resultados de una instrucción CMP. Apéndice B, "EFLAGS Códigos de Estado", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, muestra la relación de las banderas de estado y los códigos de condiciones.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
temp := SRC1 - SignExtend(SRC2);
ModifyStatusFlags; (* Modify status flags in the same manner as the SUB instruction*)
```

## Banderas afectadas

Las banderas CF, OF, SF, ZF, AF y PF se establecen según el resultado.
