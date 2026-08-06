---
summary: Valor absoluto
---

## Descripción

Limpia el signo de ST(0) para crear el valor absoluto del operando. La siguiente tabla muestra los resultados obtenidos al crear el valor absoluto de varias clases de números.

```text
                                 ST(0) SRC  Table 3-19. Results Obtained from FABS
```

ST(0) DEST -

```text
                                      -F                                                                   +
                                      -0                                                                          +F
                                      +0                                                                          +0
                                      +F                                                                          +0
```

+F +

```text
                                     NaN                                                                   +
```

NOTES:                                                                                                           NaN F significa valor en coma flotante finito.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
ST(0) := |ST(0)|;

FPU Flags Affected

C1                    Set to 0.

C0, C2, C3            Undefined.
```

## Excepciones coma flotante

```text
#IS                   Stack underflow occurred.
```
