---
summary: Carga Integer
---

## Descripción

Convierte el archivo operando de origen en formato coma flotante de doble precisión y empuja el valor a la pila de registro FPU. El operando de origen puede ser una palabra, una palabra doble o un entero de cuádbo. Se carga sin errores de redondeo. Se conserva la señal del operando de origen.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
TOP := TOP - 1;

ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; set to 0 otherwise.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack overflow occurred.
```
