---
summary: Logical AND NOT
---

## Descripción

Realiza un bitwise lógico AND de invertido segundo operando (el primer operando de origen) con el tercer operando (el segundo operando de origen). El resultado se almacena en el primer operando (operando de destino). Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
DEST := (NOT SRC1) bitwiseAND SRC2;
SF := DEST[OperandSize -1];
ZF := (DEST = 0);
```

## Banderas afectadas

SF y ZF se actualizan en función del resultado. Las banderas OF y CF se limpian. AF y PF banderas quedan indefinidas.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".
