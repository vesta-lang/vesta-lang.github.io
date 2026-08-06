---
summary: Comparar Integer
---

## Descripción

Compara el valor en ST(0) con un entero operando de origen y establece las banderas de código de condiciones C0, C2, y C3 en la palabra de estado FPU según los resultados (ver tabla abajo). El valor entero se convierte en formato coma flotante de doble precisión antes de hacer la comparación.

** Resultados FICOM/FICOMP**

| Estado | C3 | C2 | C0 |
| --- | --- | --- | --- |
| > SRC | 0 | 0 | 0 |
| < SRC | 0 | 0 | 1 |
| = SRC | 1 | 0 | 0 |
| Desordenadas | 1 | 1 | 1 |

## Operación

```text
CASE (relation of operands) OF

    ST(0) > SRC:  C3, C2, C0 := 000;

    ST(0) < SRC:  C3, C2, C0 := 001;

    ST(0) = SRC:  C3, C2, C0 := 100;

    Unordered:    C3, C2, C0 := 111;

ESAC;

IF Instruction = FICOMP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See table on previous page.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are NaN values or have unsupported formats.
```

```text
#D                  One or both operands are denormal values.
```
