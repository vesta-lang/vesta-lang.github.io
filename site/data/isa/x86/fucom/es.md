---
summary: Unordered Compare valores en coma flotante
---

## Descripción

Realiza una comparación sin orden de los contenidos del registro ST(0) y ST(i) y establece banderas de código de condiciones C0, C2, y C3 en la palabra de estado FPU según los resultados (ver la tabla de abajo). Si no se especifica operando, se comparan los contenidos de los registros ST(0) y ST(1). El signo de cero es ignorado, por lo que 0.0 es igual a +0.0.

**FUCOM/FUCOMP/FUCOMPP Resultados**

| Resultados de comparación* | C3 | C2 | C0 |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| Desordenadas | 1 | 1 | 1 |

## Operación

```text
CASE (relation of operands) OF

    ST > SRC:  C3, C2, C0 := 000;

    ST < SRC:  C3, C2, C0 := 001;

    ST = SRC:  C3, C2, C0 := 100;

ESAC;

IF ST(0) or SRC = QNaN, but not SNaN or unsupported format

    THEN
          C3, C2, C0 := 111;

    ELSE (* ST(0) or SRC is SNaN or unsupported format *)
           #IA;

        IF FPUControlWord.IM = 1

                THEN
                      C3, C2, C0 := 111;

          FI;
FI;

IF Instruction = FUCOMP

    THEN

          PopRegisterStack;

FI;

IF Instruction = FUCOMPP

    THEN

          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

C0, C2, C3          See Table 3-43.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 One or both operands are SNaN values or have unsupported formats. Detection of a QNaN
```

el valor por sí mismo no genera una excepción de operando no válido.

```text
#D                  One or both operands are denormal values.
```
