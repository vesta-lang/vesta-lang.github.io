---
summary: Partial Tangent
---

## Descripción

Computa el tangente aproximado del operando de origen en el registro ST(0), almacena el resultado en ST(0), y empuja un 1.0 en la pila de registro FPU. El operando de origen debe ser dado en radians y debe ser inferior a +/-263. El

siguiente tabla muestra los resultados desenmascarados obtenidos al computar el tangente parcial de varias clases de

números, asumiendo que la subida no ocurre.

** Resultados FPTAN**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - | * |
| -F | - F to + F |
| -0 | -0 |
| +0 | +0 |
| +F | - F to + F |
| + | * |
| Nan | Nan |

## Operación

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fptan(ST(0)); // approximation of tan
          TOP := TOP - 1;
          ST(0) := 1.0;
    ELSE (* Source operand is out-of-range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred; set to 1 if stack overflow occurred.

                        Set if result was rounded up; cleared otherwise.

C2                      Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                  Undefined.
```

## Excepciones coma flotante

```text
#IS                     Stack underflow or overflow occurred.
```

```text
#IA                     Source operand is an SNaN value, , or unsupported format.
```

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
