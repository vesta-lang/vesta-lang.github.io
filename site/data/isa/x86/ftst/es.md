---
summary: TEST
---

## Descripción

Compara el valor en el registro ST(0) con 0.0 y establece las banderas de código de condiciones C0, C2, y C3 en la palabra estado FPU según los resultados (ver tabla abajo).

** Resultados FTST**

| Estado | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST(0) > 0.0 | 0 | 0 | 0 |
| ST(0) < 0.0 | 0 | 0 | 1 |
| ST(0) = 0.0 | 1 | 0 | 0 |
| Desordenadas | 1 | 1 | 1 |

## Operación

```text
CASE (relation of operands) OF

    Not comparable: C3, C2, C0 := 111;

    ST(0) > 0.0:  C3, C2, C0 := 000;

    ST(0) < 0.0:  C3, C2, C0 := 001;

    ST(0) = 0.0:  C3, C2, C0 := 100;

ESAC;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          See Table 3-42.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 The source operand is a NaN value or is in an unsupported format.
```

```text
#D                  The source operand is a denormal value.
```
