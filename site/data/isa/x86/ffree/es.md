---
summary: Registro gratuito coma flotante
---

## Descripción

Establece la etiqueta en el registro de etiquetas FPU asociado con el registro ST(i) para vaciar (11B). El contenido de ST(i) y el puntero de pila FPU (TOP) no están afectados.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
TAG(i) := 11B;

FPU Flags Affected
C0, C1, C2, C3 undefined.
```

## Excepciones coma flotante

None
