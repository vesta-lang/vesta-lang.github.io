---
summary: Sine y Cosine
---

## Descripción

Computa tanto el seno aproximado como el cosine del operando de origen en el registro ST(0), almacena el seno en ST(0), y empuja el cosine en la parte superior de la pila de registro FPU. (Esta instrucción es más rápida que ejecutar las instrucciones FSIN y FCOS en sucesión.)

El operando de origen debe ser dado en radians y debe estar dentro del rango -263 a +263. La siguiente tabla muestra los resultados obtenidos al tomar el seno y el cosino de varias clases de números, asumiendo que el flujo no ocurre.

** Resultados FSINCOS**

| ST(0) | ST(1) Cosine | ST(0) Sine |
| --- | --- | --- |
| - | * | * |
| -F | - 1 to + 1 | - 1 to + 1 |
| -0 | +1 | -0 |
| +0 | +1 | +0 |
| +F | - 1 to + 1 | - 1 to + 1 |
| + | * | * |
| Nan | Nan | Nan |

## Operación

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          TEMP := fcos(ST(0)); // approximation of cosine
          ST(0) := fsin(ST(0)); // approximation of sine
          TOP := TOP - 1;
          ST(0) := TEMP;
    ELSE (* Source operand out of range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred; set to 1 of stack overflow occurs.

                          Set if result was rounded up; cleared otherwise.

C2                        Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                    Undefined.
```

## Excepciones coma flotante

```text
#IS                       Stack underflow or overflow occurred.
```

```text
#IA                       Source operand is an SNaN value, , or unsupported format.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
