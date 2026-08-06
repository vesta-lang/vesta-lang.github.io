---
summary: Sine
---

## Descripción

Calcula una aproximación del seno del operando de origen en el registro ST(0) y almacena el resultado en ST(0). El operando de origen debe ser dado en radians y debe estar dentro del rango -263 a +263. La siguiente tabla muestra el

resultados obtenidos al tomar el seno de varias clases de números, asumiendo que el flujo no ocurre.

** Resultados FSIN**

| SRC (ST(0)) | DEST (ST(0)) |
| --- | --- |
| - | * |
| -F | - 1 to + 1 |
| -0 | -0 |
| +0 | +0 |
| +F | - 1 to +1 |
| + | * |
| Nan | Nan |

## Operación

```text
IF -263 < ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fsin(ST(0)); // approximation of the mathematical sin function
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C2                  Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3              Undefined.
```

## Excepciones coma flotante

```text
#IS         Stack underflow occurred.
```

```text
#IA         Source operand is an SNaN value, , or unsupported format.
```

```text
#D          Source operand is a denormal value.
```

```text
#P          Value cannot be represented exactly in destination format.
```
