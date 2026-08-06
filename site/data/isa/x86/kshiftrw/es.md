---
summary: Registros de máscaras de derechas
---

## Descripción

Cambios 8/16/32/64 bits en el segundo operand (source operand) derecho por el conteo especificado en inmediata y coloque los menos significativos 8/16/32/64 bits del resultado en el operado de destino. Los bits más altos del destino son cero-extended. El destino está fijado a cero si el valor de cuenta es mayor que 7 (para el cambio de byte), 15 (para el cambio de palabra), 31 (para el cambio de doble palabra) o 63 (para el cambio de cuadrilátero).

## Operación

```text
KSHIFTRW
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=15

    THEN DEST[15:0] := SRC1[15:0] >> COUNT;
FI;

KSHIFTRB

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=7

            THEN DEST[7:0] := SRC1[7:0] >> COUNT;
FI;

KSHIFTRQ

COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=63

            THEN DEST[63:0] := SRC1[63:0] >> COUNT;
FI;


KSHIFTRD
COUNT := imm8[7:0]
DEST[MAX_KL-1:0] := 0
IF COUNT <=31

            THEN DEST[31:0] := SRC1[31:0] >> COUNT;
FI;
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
