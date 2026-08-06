---
summary: Compare valores en coma flotante
---

## Descripción

Compara el contenido del registro ST(0) y el valor fuente y establece las banderas de código de condiciones C0, C2, y C3 en la palabra estado FPU según los resultados (ver la tabla abajo). El operando de origen puede ser un registro de datos o una ubicación de memoria. Si no se da operando de origen, el valor en ST(0) se compara con el valor en ST(1). El signo de cero es ignorado, por lo que 0.0 es igual a +0.0.

**FCOM/FCOMP/FCOMPP Resultados**

| Estado | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST(0) > SRC | 0 | 0 | 0 |
| ST(0) < SRC | 0 | 0 | 1 |
| ST(0) = SRC | 1 | 0 | 0 |
| Sin autorización* | 1 | 1 | 1 |

## Operación

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = NaN or unsupported format

    THEN

          #IA

        IF FPUControlWord.IM = 1

                THEN

                      C3, C2, C0 := 111;

          FI;

FI;

IF Instruction = FCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FCOMPP

    THEN
          PopRegisterStack;
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

El registro está marcado vacío.

```text
#D                  One or both operands are denormal values.
```
