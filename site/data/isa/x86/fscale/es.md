---
summary: Escala
---

## Descripción

Trunca el valor en el operando de origen (hasta 0) a un valor integral y añade ese valor al exponente del operando de destino. El destino y operandos de origen son valores en coma flotante ubicados en los registros ST(0) y ST(1), respectivamente. Esta instrucción proporciona una rápida multiplicación o división por poderes integrales de 2. El siguiente cuadro muestra los resultados obtenidos al escalar varias clases de números, asumiendo que no se produce desbordamiento ni desbordamiento.

** Resultados FSCALE**

| ST(0) | -F | -0 | -F | -F | -F | -F | - | Nan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | -0 | -0 | -0 | -0 | -0 | Nan | Nan |
|  | +0 | +0 | +0 | +0 | +0 | +0 | Nan | Nan |
|  | +F | +0 | +F | +F | +F | +F | + | Nan |
|  | + | Nan | + | + | + | + | + | Nan |
|  | Nan | Nan | Nan Nan |  | Nan | Nan | Nan | Nan |

## Operación

```text
ST(0) := ST(0)  2RoundTowardZero(ST(1));

FPU Flags Affected

C1                    Set to 0 if stack underflow occurred.

                      Set if result was rounded up; cleared otherwise.

C0, C2, C3            Undefined.
```

## Excepciones coma flotante

```text
#IS            Stack underflow occurred.
```

```text
#IA            Source operand is an SNaN value or unsupported format.
```

```text
#D             Source operand is a denormal value.
```

```text
#U             Result is too small for destination format.
```

```text
#O             Result is too large for destination format.
```

```text
#P             Value cannot be represented exactly in destination format.
```
