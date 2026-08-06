---
summary: Máscaras Bitwise Logical AND
---

## Descripción

Realiza un bitwise AND entre la máscara vectorial k2 y la máscara vectorial k3, y escribe el resultado en máscara vectorial k1.

## Operación

```text
KANDW
DEST[15:0] := SRC1[15:0] BITWISE AND SRC2[15:0]
DEST[MAX_KL-1:16] := 0

KANDB
DEST[7:0] := SRC1[7:0] BITWISE AND SRC2[7:0]
DEST[MAX_KL-1:8] := 0

KANDQ
DEST[63:0] := SRC1[63:0] BITWISE AND SRC2[63:0]
DEST[MAX_KL-1:64] := 0

KANDD
DEST[31:0] := SRC1[31:0] BITWISE AND SRC2[31:0]
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ compilador intrínseco

```c
KANDW __mmask16 _mm512_kand(__mmask16 a, __mmask16 b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
