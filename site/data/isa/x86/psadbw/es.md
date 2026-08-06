---
summary: Compute Sum of Absolute Differences
---

## Descripción

Cubre el valor absoluto de la diferencia de 8 enteros de byte sin firmar del operando de origen (segundo operando) y del operando de destino (primer operando). Estas 8 diferencias se resumen entonces para producir un resultado entero de palabra sin firma que se almacena en el operando de destino. La Figura 4-14 muestra el funcionamiento de la instrucción PSADBW al usar operandos de 64 bits.

Al operar en operandos de 64 bits, el resultado entero de la palabra se almacena en la palabra baja del operando de destino, y los bytes restantes en el operando de destino se limpian a todos los 0s.

Al operar en 128 bits operandos, se computan dos resultados empaquetados. Aquí, los 8 bytes de bajo orden de la fuente y operandos de destino son operados para producir un resultado de palabra que se almacena en la palabra baja del operando de destino, y los 8 bytes de alto orden son operados para producir un resultado de palabra que se almacena en bits 64 a 79 del operando de destino. Los bytes restantes del operando de destino se limpian.

Para la versión 256-bit, el tercer grupo de 8 diferencias se resumen para producir una palabra no firmada en bits[143:128] del registro de destino y el cuarto grupo de 8 diferencias se resumen para producir una palabra no firmada en bits[207:192] del registro de destino. Las palabras restantes del destino se fijan en 0.

Para versión 512-bit, el quinto resultado del grupo se almacena en bits [271:256] del destino. El resultado del sexto grupo se almacena en bits [335:320]. Los resultados para el séptimo y octavo grupo se almacenan respectivamente en bits [399:384] y bits [463:447], respectivamente. Los bits restantes en el destino están fijados a 0.

En modo de 64 bits y no codificado por VEX/EVEX prefijo, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX.

128-bit Legacy SSE versión: El primer operando de origen y el registro de destino son los registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican.

VEX.128 y EVEX.128 versiones codificadas: El primer operando de origen y el registro de destino son los registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro ZMM correspondiente se ponen a cero.

VEX.256 y EVEX.256 versiones codificadas: El primer operando de origen y el registro de destino son los registros YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX.512 versión codificada: El primer operando de origen y el registro de destino son los registros ZMM. El segundo operando de origen es un registro ZMM o una ubicación de memoria de 512 bits.

SRC X7                                       X6   X5   X4  X3   X2  X1  X0

DEST Y7                                      Y6   Y5   Y4  Y3   Y2  Y1  Y0

TEMP ABS(X7:Y7) ABS(X6:Y6) ABS(X5:Y5) ABS(X4:Y4) ABS(X3:Y3) ABS(X2:Y2) ABS(X1:Y1) ABS(X

DEST 00H                                     00H  00H  00H 00H  00H SUM(TEMP7...TEMP0)

Figura 4-14. PSADBW Instruction Operation Using 64-bit operandos

## Operación

```text
VPSADBW (EVEX Encoded Versions)
VL = 128, 256, 512
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 1 through 15 *)
TEMP15 := ABS(SRC1[127:120] - SRC2[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H

IF VL >= 256
    (* Repeat operation for bytes 16 through 31*)
    TEMP31 := ABS(SRC1[255:248] - SRC2[255:248])
    DEST[143:128] := SUM(TEMP16:TEMP23)
    DEST[191:144] := 000000000000H
    DEST[207:192] := SUM(TEMP24:TEMP31)
    DEST[223:208] := 00000000000H

FI;
IF VL >= 512
(* Repeat operation for bytes 32 through 63*)

    TEMP63 := ABS(SRC1[511:504] - SRC2[511:504])
    DEST[271:256] := SUM(TEMP0:TEMP7)
    DEST[319:272] := 000000000000H
    DEST[335:320] := SUM(TEMP8:TEMP15)
    DEST[383:336] := 00000000000H
    DEST[399:384] := SUM(TEMP16:TEMP23)
    DEST[447:400] := 000000000000H
    DEST[463:448] := SUM(TEMP24:TEMP31)
    DEST[511:464] := 00000000000H
FI;
DEST[MAXVL-1:VL] := 0

VPSADBW (VEX.256 Encoded Version)
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 2 through 30*)
TEMP31 := ABS(SRC1[255:248] - SRC2[255:248])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H
DEST[143:128] := SUM(TEMP16:TEMP23)
DEST[191:144] := 000000000000H
DEST[207:192] := SUM(TEMP24:TEMP31)
DEST[223:208] := 00000000000H
DEST[MAXVL-1:256] := 0


VPSADBW (VEX.128 Encoded Version)
TEMP0 := ABS(SRC1[7:0] - SRC2[7:0])
(* Repeat operation for bytes 2 through 14 *)
TEMP15 := ABS(SRC1[127:120] - SRC2[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000H
DEST[MAXVL-1:128] := 0

PSADBW (128-bit Legacy SSE Version)
TEMP0 := ABS(DEST[7:0] - SRC[7:0])
(* Repeat operation for bytes 2 through 14 *)
TEMP15 := ABS(DEST[127:120] - SRC[127:120])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
DEST[79:64] := SUM(TEMP8:TEMP15)
DEST[127:80] := 00000000000
DEST[MAXVL-1:128] (Unmodified)

PSADBW (64-bit Operand)
TEMP0 := ABS(DEST[7:0] - SRC[7:0])
(* Repeat operation for bytes 2 through 6 *)
TEMP7 := ABS(DEST[63:56] - SRC[63:56])
DEST[15:0] := SUM(TEMP0:TEMP7)
DEST[63:16] := 000000000000H
```

## Intel C/C++ compilador intrínseco

```c
VPSADBW __m512i _mm512_sad_epu8( __m512i a, __m512i b) PSADBW __m64 _mm_sad_pu8(__m64 a,__m64 b) (V)PSADBW __m128i _mm_sad_epu8(__m128i a, __m128i b) VPSADBW __m256i _mm256_sad_epu8( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded instruction, ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
