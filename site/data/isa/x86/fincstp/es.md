---
summary: Increment Stack-Top Pointer
---

## Descripción

Añade uno al campo TOP de la palabra de estado FPU (incrementos el top-of-puntero de pila). Si el campo TOP contiene un 7, se establece a 0. El efecto de esta instrucción es girar la pila por una posición. El contenido de los registros de datos FPU y el registro de etiquetas no están afectados. Esta operación no es equivalente a cortar la pila, porque la etiqueta para el registro anterior superior de la caja no está marcada vacía.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
IF TOP = 7

    THEN TOP := 0;
    ELSE TOP := TOP + 1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## Excepciones coma flotante

None.
