---
summary: Extracto Empaquetado coma flotante de precisión doble Sign Mask
---

## Descripción

Extrae los bits de señal de los valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando), los formatos en una máscara de 2 bits, y almacena la máscara en el operando de destino (primer operando). El operando de origen es un registro XMM, y el operando de destino es un registro de proposito general. La máscara se almacena en los 2 pedazos de orden bajo del operando de destino. Extiendan las partes superiores del destino.

En modo de 64 bits, la instrucción puede acceder a registros adicionales (XMM8-XMM15, R8-R15) cuando se utiliza con un prefijo REX.R. El tamaño de operando predeterminado es de 64 bits en modo 64-bit.

Versión 128-bit: El operando de origen es un registro YMM. El operando de destino es un registro de proposito general.

VEX.256 versión codificada: El operando de origen es un registro YMM. El operando de destino es un registro de proposito general.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
(V)MOVMSKPD (128-bit Versions)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
IF DEST = r32

    THEN DEST[31:2] := 0;
    ELSE DEST[63:2] := 0;
FI

VMOVMSKPD (VEX.256 Encoded Version)
DEST[0] := SRC[63]
DEST[1] := SRC[127]
DEST[2] := SRC[191]
DEST[3] := SRC[255]
IF DEST = r32

    THEN DEST[31:4] := 0;
    ELSE DEST[63:4] := 0;
FI
```

## Intel C/C++ compilador intrínseco

```c
MOVMSKPD int _mm_movemask_pd ( __m128d a) VMOVMSKPD _mm256_movemask_pd(__m256d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-24, "Tipo 7 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
