---
summary: NOT Mask Register
---

## Descripción

Realiza un bitwise NOT de máscara vectorial k2 y escribe el resultado en máscara vectorial k1.

## Operación

```text
KNOTW
DEST[15:0] := BITWISE NOT SRC[15:0]
DEST[MAX_KL-1:16] := 0

KNOTB
DEST[7:0] := BITWISE NOT SRC[7:0]
DEST[MAX_KL-1:8] := 0

KNOTQ
DEST[63:0] := BITWISE NOT SRC[63:0]
DEST[MAX_KL-1:64] := 0

KNOTD
DEST[31:0] := BITWISE NOT SRC[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ compilador intrínseco

```c
KNOTW __mmask16 _mm512_knot(__mmask16 a);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
