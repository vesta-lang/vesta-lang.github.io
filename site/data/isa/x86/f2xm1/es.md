---
summary: Computación 2x1
---

## Descripción

Cubre el valor exponencial de 2 al poder del operando de origen menos 1. El operando de origen se encuentra en el registro ST(0) y el resultado también se almacena en ST(0). El valor del operando de origen debe estar en el rango 1.0 a +1.0. Si el valor fuente está fuera de este rango, el resultado es indefinido.

El siguiente cuadro muestra los resultados obtenidos al calcular el valor exponencial de varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

**Resultados obtenidos de F2XM1**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - 1.0 to -0 | - 0.5 to - 0 |
| -0 | -0 |
| +0 | +0 |
| + 0 to +1.0 | + 0 to 1.0 |
| ser exponente usando la siguiente fórmula: |  |
| tion es el mismo en modos no-64-bit y modo 64-bit. |  |

## Operación

```text
ST(0) := (2ST(0) - 1);

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## Excepciones coma flotante

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Source operand is an SNaN value or unsupported format.
```

```text
#D                      Source is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
