---
summary: Extracto Empaquetado coma flotante de precisión simple Sign Mask
---

## Descripción

Extrae los bits de señal de los valores en coma flotante de precisión simple empaquetados en el operando de origen (segundo operando), los convierte en una máscara de 4 o 8 bits, y almacena la máscara en el operando de destino (primer operando). El operando de origen es un registro XMM o YMM, y el operando de destino es un registro de proposito general. La máscara se almacena en los 4 o 8 bits de orden bajo del operando de destino. Las partes superiores del operando de destino más allá de la máscara están llenas de ceros.

En modo de 64 bits, la instrucción puede acceder a registros adicionales (XMM8-XMM15, R8-R15) cuando se utiliza con un prefijo REX.R. El tamaño de operando predeterminado es de 64 bits en modo 64-bit.

Versión 128-bit: El operando de origen es un registro YMM. El operando de destino es un registro de proposito general.

VEX.256 versión codificada: El operando de origen es un registro YMM. El operando de destino es un registro de proposito general.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
DEST[0] := SRC[31];
DEST[1] := SRC[63];
DEST[2] := SRC[95];
DEST[3] := SRC[127];

IF DEST = r32
    THEN DEST[31:4] := ZeroExtend;
    ELSE DEST[63:4] := ZeroExtend;

FI;

1. ModRM.MOD = 011B required


(V)MOVMSKPS (128-bit version)
DEST[0] := SRC[31]
DEST[1] := SRC[63]
DEST[2] := SRC[95]
DEST[3] := SRC[127]
IF DEST = r32

    THEN DEST[31:4] := 0;
    ELSE DEST[63:4] := 0;
FI

VMOVMSKPS (VEX.256 encoded version)
DEST[0] := SRC[31]
DEST[1] := SRC[63]
DEST[2] := SRC[95]
DEST[3] := SRC[127]
DEST[4] := SRC[159]
DEST[5] := SRC[191]
DEST[6] := SRC[223]
DEST[7] := SRC[255]
IF DEST = r32

    THEN DEST[31:8] := 0;
    ELSE DEST[63:8] := 0;
FI
```

## Intel C/C++ compilador intrínseco

```c
int _mm_movemask_ps(__m128 a) int _mm256_movemask_ps(__m256 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-24, "Tipo 7 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
