---
summary: Muévete.
---

## Descripción

BNDMOV mueve un par de valores de límite inferior y superior del operando de origen (el segundo operando) al destino (el primer operando). Cada operación es de 128 bits. Las excepciones son las mismas que la instrucción MOV. El formato de memoria para los límites de carga/store en modo 64-bit se muestra en la Figura 3-5.

```text
                     Upper Bound (UB)             Lower Bound (LB)                     BNDMOV to memory in 64-bit mode
                     16                                             8                                           0 Byte offset
```

```text
             Upper Bound (UB)                     Lower Bound (LB)                     BNDMOV to memory in 32-bit mode
             16                                                     8
                                                                                    4      0 Byte offset
```

Figura 3-5. Diseño de memoria de BNDMOV a / de memoria

Esta instrucción no cambia las banderas.

## Operación

```text
BNDMOV register to register
DEST.LB := SRC.LB;
DEST.UB := SRC.UB;


BNDMOV from memory
IF 64-bit mode THEN

          DEST.LB := LOAD_QWORD(SRC);
          DEST.UB := LOAD_QWORD(SRC+8);
    ELSE
          DEST.LB := LOAD_DWORD_ZERO_EXT(SRC);
          DEST.UB := LOAD_DWORD_ZERO_EXT(SRC+4);
FI;

BNDMOV to memory
IF 64-bit mode THEN

          DEST[63:0] := SRC.LB;
          DEST[127:64] := SRC.UB;
    ELSE
          DEST[31:0] := SRC.LB;
          DEST[63:32] := SRC.UB;
FI;
```

## Intel C/C++ compilador intrínseco

```c
BNDMOV void * _bnd_copy_ptr_bounds(const void *q, const void *r);
```

## Banderas afectadas

None.
