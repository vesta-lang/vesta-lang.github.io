---
summary: Máscaras Bitwise Logical XNOR
---

## Descripción

Realiza un bitwise XNOR entre la máscara vectorial k2 y la máscara vectorial k3, y escribe el resultado en máscara vectorial k1 (forma de tres-operando).

## Operación

```text
KXNORW
DEST[15:0] := NOT (SRC1[15:0] BITWISE XOR SRC2[15:0])
DEST[MAX_KL-1:16] := 0

KXNORB
DEST[7:0] := NOT (SRC1[7:0] BITWISE XOR SRC2[7:0])
DEST[MAX_KL-1:8] := 0

KXNORQ
DEST[63:0] := NOT (SRC1[63:0] BITWISE XOR SRC2[63:0])
DEST[MAX_KL-1:64] := 0

KXNORD
DEST[31:0] := NOT (SRC1[31:0] BITWISE XOR SRC2[31:0])
DEST[MAX_KL-1:32] := 0
```

## Intel C/C++ compilador intrínseco

```c
KXNORW __mmask16 _mm512_kxnor(__mmask16 a, __mmask16 b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
