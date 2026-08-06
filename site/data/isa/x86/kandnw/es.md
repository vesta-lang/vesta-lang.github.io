---
summary: Bitwise Logical AND NOT Masks
---

## Descripción

Realiza un bitwise AND NOT entre la máscara vectorial k2 y la máscara vectorial k3, y escribe el resultado en máscara vectorial k1.

## Operación

```text
KANDNW
DEST[15:0] := (BITWISE NOT SRC1[15:0]) BITWISE AND SRC2[15:0]
DEST[MAX_KL-1:16] := 0

KANDNB
DEST[7:0] := (BITWISE NOT SRC1[7:0]) BITWISE AND SRC2[7:0]
DEST[MAX_KL-1:8] := 0

KANDNQ
DEST[63:0] := (BITWISE NOT SRC1[63:0]) BITWISE AND SRC2[63:0]
DEST[MAX_KL-1:64] := 0

KANDND
DEST[31:0] := (BITWISE NOT SRC1[31:0]) BITWISE AND SRC2[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ compilador intrínseco

```c
KANDNW __mmask16 _mm512_kandn(__mmask16 a, __mmask16 b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
