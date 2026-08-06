---
summary: Carga binaria Código Decimal
---

## Descripción

Convierte el BCD operando de origen en formato coma flotante de doble precisión y empuja el valor a la pila FPU. El operando de origen está cargado sin errores de redondeo. El signo del operando de origen se conserva, incluyendo el de -0.

Los dígitos BCD empaquetados se supone que están en el rango 0 a 9; la instrucción no verifica los dígitos inválidos (AH a través de FH). El intento de cargar una codificación inválida produce un resultado indefinido.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
TOP := TOP - 1;
ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## Excepciones coma flotante

```text
#IS                 Stack overflow occurred.
```
