---
summary: Decrement Stack-Top Pointer
---

## Descripción

Se resta uno del campo TOP de la palabra de estado FPU (declara el top-of-puntero de pila). Si el campo TOP contiene un 0, se establece a 7. El efecto de esta instrucción es girar la pila por una posición. El contenido de los registros de datos FPU y el registro de etiquetas no están afectados.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
IF TOP = 0

    THEN TOP := 7;
    ELSE TOP := TOP  1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## Excepciones coma flotante

None.
