---
summary: Índices de Registro de Cambios
---

## Descripción

Intercambia el contenido de los registros ST(0) y ST(i). Si no se especifica operando de origen, se intercambian los contenidos de ST(0) y ST(1).

Esta instrucción proporciona un medio simple de mover valores en la pila de registro FPU a la parte superior de la pila [ST(0)], para que puedan ser operados por las instrucciones coma flotante que sólo pueden operar en valores en ST(0). Por ejemplo, la siguiente secuencia de instrucciones toma la raíz cuadrada del tercer registro desde la parte superior del registro de la pila:

FXCH ST(3); FSQRT; FXCH ST(3);

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
IF (Number-of-operands) is 1
    THEN
          temp := ST(0);
          ST(0) := SRC;
          SRC := temp;
    ELSE
          temp := ST(0);
          ST(0) := ST(1);
          ST(1) := temp;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```
