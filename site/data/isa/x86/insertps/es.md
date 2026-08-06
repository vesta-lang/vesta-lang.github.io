---
summary: Insertar valores en coma flotante de precisión simple escalares
---

## Descripción

(forma de fuente registrada)

Copie un solo elemento escalar coma flotante de precisión en un registro vectorial de 128 bits. El operando inmediato tiene tres campos, donde los bits ZMask especifican qué elementos del destino se establecerán a cero, los bits Count D especifican qué elemento del destino será sobrescrito con el valor escalar, y para fuentes de registro de vectores los bits Count S especifican qué elemento de la fuente será copiado. Cuando la fuente escalar es un operando de memoria se ignoran los bits Count S.

(forma de fuente de memoria)

Cargue el elemento una coma flotante de una ubicación de memoria de 32 bits y operando de destino en la primera fuente en la ubicación indicada por los bits condes D del operando inmediato. Almacene en el destino y cero elementos de destino basados en los bits ZMask del operando inmediato.

128-bit Legacy SSE versión: El primer registro de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 32 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente son sin modificar.

VEX.128 y EVEX versión codificada: El registro de destino y primera fuente es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 32 bits. Los bits superiores (MAXVL-1:128) del destino de registro correspondiente se ponen a cero.

Si VINSERTPS está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará una excepción #UD.

## Operación

```text
VINSERTPS (VEX.128 and EVEX Encoded Version)
IF (SRC = REG) THEN COUNT_S := imm8[7:6]

    ELSE COUNT_S := 0
COUNT_D := imm8[5:4]
ZMASK := imm8[3:0]
CASE (COUNT_S) OF

    0: TMP := SRC2[31:0]
    1: TMP := SRC2[63:32]
    2: TMP := SRC2[95:64]
    3: TMP := SRC2[127:96]
ESAC;
CASE (COUNT_D) OF
    0: TMP2[31:0] := TMP

          TMP2[127:32] := SRC1[127:32]
    1: TMP2[63:32] := TMP

          TMP2[31:0] := SRC1[31:0]
          TMP2[127:64] := SRC1[127:64]
    2: TMP2[95:64] := TMP
          TMP2[63:0] := SRC1[63:0]
          TMP2[127:96] := SRC1[127:96]
    3: TMP2[127:96] := TMP
          TMP2[95:0] := SRC1[95:0]
ESAC;

IF (ZMASK[0] = 1) THEN DEST[31:0] := 00000000H
    ELSE DEST[31:0] := TMP2[31:0]

IF (ZMASK[1] = 1) THEN DEST[63:32] := 00000000H
    ELSE DEST[63:32] := TMP2[63:32]

IF (ZMASK[2] = 1) THEN DEST[95:64] := 00000000H
    ELSE DEST[95:64] := TMP2[95:64]

IF (ZMASK[3] = 1) THEN DEST[127:96] := 00000000H
    ELSE DEST[127:96] := TMP2[127:96]

DEST[MAXVL-1:128] := 0

INSERTPS (128-bit Legacy SSE Version)
IF (SRC = REG) THEN COUNT_S :=imm8[7:6]

    ELSE COUNT_S :=0
COUNT_D := imm8[5:4]
ZMASK := imm8[3:0]
CASE (COUNT_S) OF

    0: TMP := SRC[31:0]
    1: TMP := SRC[63:32]
    2: TMP := SRC[95:64]
    3: TMP := SRC[127:96]
ESAC;

CASE (COUNT_D) OF
    0: TMP2[31:0] := TMP
          TMP2[127:32] := DEST[127:32]
    1: TMP2[63:32] := TMP
          TMP2[31:0] := DEST[31:0]
          TMP2[127:64] := DEST[127:64]
    2: TMP2[95:64] := TMP


          TMP2[63:0] := DEST[63:0]
          TMP2[127:96] := DEST[127:96]
    3: TMP2[127:96] := TMP
          TMP2[95:0] := DEST[95:0]
ESAC;

IF (ZMASK[0] = 1) THEN DEST[31:0] := 00000000H
    ELSE DEST[31:0] := TMP2[31:0]

IF (ZMASK[1] = 1) THEN DEST[63:32] := 00000000H
    ELSE DEST[63:32] := TMP2[63:32]

IF (ZMASK[2] = 1) THEN DEST[95:64] := 00000000H
    ELSE DEST[95:64] := TMP2[95:64]

IF (ZMASK[3] = 1) THEN DEST[127:96] := 00000000H
    ELSE DEST[127:96] := TMP2[127:96]

DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VINSERTPS __m128 _mm_insert_ps(__m128 dst, __m128 src, const int nidx);
INSETRTPS __m128 _mm_insert_ps(__m128 dst, __m128 src, const int nidx);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.L = 0.
```

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."
