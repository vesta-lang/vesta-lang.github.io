---
summary: Máscaras OR y conjunto banderas
---

## Descripción

Realiza un bitwise OR entre el registro de máscaras vectoriales k2, y el registro de máscaras vectoriales k1, y establece CF y ZF basado en el resultado de la operación.

La bandera ZF se establece si ambas fuentes son 0x0. CF se establece si, después de la operación OR se hace, el resultado de la operación es de los 1's.

## Operación

```text
KORTESTW
TMP[15:0] := DEST[15:0] BITWISE OR SRC[15:0]
IF(TMP[15:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[15:0]=FFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;

KORTESTB
TMP[7:0] := DEST[7:0] BITWISE OR SRC[7:0]
IF(TMP[7:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[7:0]==FFh)
    THEN CF := 1
    ELSE CF := 0

FI;


KORTESTQ
TMP[63:0] := DEST[63:0] BITWISE OR SRC[63:0]
IF(TMP[63:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[63:0]==FFFFFFFF_FFFFFFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;

KORTESTD
TMP[31:0] := DEST[31:0] BITWISE OR SRC[31:0]
IF(TMP[31:0]=0)

    THEN ZF := 1
    ELSE ZF := 0
FI;
IF(TMP[31:0]=FFFFFFFFh)
    THEN CF := 1
    ELSE CF := 0
FI;
```

## Intel C/C++ compilador intrínseco

```c
KORTESTW __mmask16 _mm512_kortest[cz](__mmask16 a, __mmask16 b);
```

## Banderas afectadas

La bandera ZF se establece si el resultado de OR-ing ambas fuentes es todos 0s.

La bandera CF se establece si el resultado de OR-ing ambas fuentes es todos 1s.

Las banderas OF, SF, AF y PF están establecidas a 0.

## Otras excepciones

Ver Tabla 2-65, "TYPE K20 Excepción Definición (VEX-Encoded OpMask Instrucciones w/o Memoria Arg)."
