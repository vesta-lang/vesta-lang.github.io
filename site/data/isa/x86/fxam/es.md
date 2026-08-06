---
summary: Examine coma flotante
---

## Descripción

Examina el contenido del registro ST(0) y establece las banderas de código de condiciones C0, C2, y C3 en la palabra estado FPU para indicar la clase de valor o número en el registro (ver el cuadro de abajo).

.                                                 Cuadro 3-44. Resultados FXAM

```text
                         Class                                C3            C2                              C0
```

Unsupported                                                0             0                               0

NaN                                                        0             0                               1

Número finito normal 0 1 0

Infinity                                                   0             1                               1

Zero                                                       1             0                               0

Empty                                                      1             0                               1

Número normal 1 1 0

La bandera C1 se fija en el signo del valor en ST(0), independientemente de si el registro está vacío o completo. La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
C1 := sign bit of ST; (* 0 for positive, 1 for negative *)

CASE (class of value or number in ST(0)) OF

    Unsupported:C3, C2, C0 := 000;

    NaN:        C3, C2, C0 := 001;

    Normal:     C3, C2, C0 := 010;

    Infinity:   C3, C2, C0 := 011;

    Zero:       C3, C2, C0 := 100;

    Empty:      C3, C2, C0 := 101;

    Denormal: C3, C2, C0 := 110;

ESAC;

FPU Flags Affected

C1                       Sign of value in ST(0).

C0, C2, C3               See Table 3-44.
```

## Excepciones coma flotante

None.
