---
summary: Unpack for Mask Registers
---

## Descripción

Desempaca los 8/16/32 bits inferiores de la segunda y tercera operandos (operandos de origen) en la parte baja de la primera operando (operando de destino), a partir de los bytes bajos. El resultado es cero-extended en el destino.

## Operación

```text
KUNPCKBW
DEST[7:0] := SRC2[7:0]
DEST[15:8] := SRC1[7:0]
DEST[MAX_KL-1:16] := 0

KUNPCKWD

DEST[15:0] := SRC2[15:0]
DEST[31:16] := SRC1[15:0]
DEST[MAX_KL-1:32] := 0

KUNPCKDQ

DEST[31:0] := SRC2[31:0]
DEST[63:32] := SRC1[31:0]
DEST[MAX_KL-1:64] := 0
```

## Intel C/C++ compilador intrínseco

```c
KUNPCKBW __mmask16 _mm512_kunpackb(__mmask16 a, __mmask16 b);
KUNPCKDQ __mmask64 _mm512_kunpackd(__mmask64 a, __mmask64 b);
KUNPCKWD __mmask32 _mm512_kunpackw(__mmask32 a, __mmask32 b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
