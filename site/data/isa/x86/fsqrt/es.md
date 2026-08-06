---
summary: Cuadrado
---

## Descripción

Calcula la raíz cuadrada del valor fuente en el registro ST(0) y almacena el resultado en ST(0).

El siguiente cuadro muestra los resultados obtenidos al tomar la raíz cuadrada de varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

** Resultados FSQRT**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | * |
| -0 | -0 |
| +0 | +0 |
| +F | +F |
| + | + |
| Nan | Nan |

## Operación

```text
ST(0) := SquareRoot(ST(0));

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

Operando de origen es un valor negativo (excepto para -0).

```text
#D                  Source operand is a denormal value.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
