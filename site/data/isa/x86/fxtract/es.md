---
summary: Extract Exponent and Significand
---

## Descripción

Separa el valor fuente en el registro ST(0) en su exponente y su significado, almacena el exponente en ST(0), y empuja el significado en la pila de registro. Después de esta operación, el nuevo registro ST(0) contiene el valor del significado original expresado como un valor en coma flotante. El signo y el significado de este valor son los mismos que los encontrados en el operando de origen, y el exponente es 3FFFH (valor imparcial para un verdadero exponente de cero). El registro ST(1) contiene el valor del verdadero exponente de operando (sin prejuicio) original expresado como un valor en coma flotante. (La operación realizada por esta instrucción es un superset de la función logb(x) recomendada por IEEE.)

Esta instrucción y la instrucción F2XM1 son útiles para realizar operaciones de escalado de potencia y rango. La instrucción FXTRACT también es útil para convertir números en formato coma flotante de doble precisión a representaciones decimales (por ejemplo, para impresión o visualización).

Si la coma flotante la excepción de división cero (#Z) está enmascarada y el operando de origen es cero, un valor exponente de se almacena en el registro ST(1) y 0 con el signo del operando de origen se almacena en el registro ST(0).

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
TEMP := Significand(ST(0));
ST(0) := Exponent(ST(0));

TOP := TOP - 1;

ST(0) := TEMP;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred; set to 1 if stack overflow occurred.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow or overflow occurred.
```

```text
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#Z                  ST(0) operand is +/-0.
```

```text
#D                  Source operand is a denormal value.
```
