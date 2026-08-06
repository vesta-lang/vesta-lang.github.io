---
summary: Comparación lógica
---

## Descripción

Computa el bit-wise lógico AND del primer operando (fuente 1 operando) y el segundo operando (fuente 2 operando) y establece el SF, ZF, y PF banderas de estado según el resultado. El resultado es descartado.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
TEMP := SRC1 AND SRC2;
SF := MSB(TEMP);

IF TEMP = 0
    THEN ZF := 1;
    ELSE ZF := 0;

FI:

PF := BitwiseXNOR(TEMP[0:7]);
CF := 0;
OF := 0;


(* AF is undefined *)
```

## Banderas afectadas

Las banderas OF y CF están establecidas a 0. Las banderas SF, ZF y PF se establecen según el resultado (ver la sección "Operación" arriba). El estado de la bandera AF es indefinido.
