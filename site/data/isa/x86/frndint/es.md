---
summary: Ronda a entero
---

## Descripción

Redondea el valor fuente en el registro ST(0) al valor integral más cercano, dependiendo del modo de redondeo actual (ajuste del campo RC de la palabra de control FPU), y almacena el resultado en ST(0).

Si el valor fuente es , el valor no se cambia. Si el valor fuente no es un valor integral, la coma flotante inexact-result excepción (#P) se genera.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
ST(0) := RoundToIntegralValue(ST(0));

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#P                  Source operand is not an integral value.
```
