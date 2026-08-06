---
summary: Variable Blend valores en coma flotante de precisión doble empaquetados
---

## Descripción

Copie condicionalmente cada elemento de datos de cuádwords de valor en coma flotante de precisión doble del segundo operando de origen y el primer operando de origen dependiendo de bits de máscara definidos en el registro de máscaras operando. Los bits de máscara son el bit mas significativo en cada elemento de cuádpo del registro de máscaras.

Cada elemento de cuádpago del operando de destino es copiado de:

* el elemento cuádword correspondiente en el segundo operando de origen, si un bit de máscara es "1"; o * el elemento cuádword correspondiente en el primer operando de origen, si un bit de máscara es "0"

La asignación de registro de la máscara implícita operando para BLENDVPD se define como el registro arquitectónico XMM0.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino es el mismo. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican. El registro de máscaras operando se define implícitamente como el registro arquitectónico XMM0. Un intento de ejecutar BLENDVPD con un prefijo VEX causará #UD.

VEX.128 versión codificada: El primer operando de origen y el operando de destino son registros XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. La máscara operando es el registro de tercera fuente, y codificado en bits[7:4] del byte inmediato (imm8). Los bits[3:0] de imm8 son ignorados. En modo 32-bit, imm8[7] es ignorado. Los bits superiores (MAXVL-1:128) del registro YMM correspondiente (registro de destilación) se ponen a cero. VEX.W debe ser 0, de lo contrario, la instrucción será #UD.

VEX.256 versión codificada: El primer operando de origen y operando de destino son registros YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La máscara operando es el registro de tercera fuente, y codificado en bits[7:4] del byte inmediato (imm8). Los bits[3:0] de imm8 son ignorados. En modo 32-bit, imm8[7] es ignorado. VEX.W debe ser 0, de lo contrario, la instrucción será #UD.

VBLENDVPD permite que la máscara sea cualquier registro XMM o YMM. En cambio, BLENDVPD trata implícitamente a XMM0 como la máscara y no admite la operación de destino no destructivo.

## Operación

```text
BLENDVPD (128-bit Legacy SSE Version)
MASK := XMM0
IF (MASK[63] = 0) THEN DEST[63:0] := DEST[63:0]

          ELSE DEST [63:0] := SRC[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := DEST[127:64]

          ELSE DEST [127:64] := SRC[127:64] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDVPD (VEX.128 Encoded Version)
MASK := SRC3
IF (MASK[63] = 0) THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
DEST[MAXVL-1:128] := 0

VBLENDVPD (VEX.256 Encoded Version)
MASK := SRC3
IF (MASK[63] = 0) THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (MASK[127] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
IF (MASK[191] = 0) THEN DEST[191:128] := SRC1[191:128]

          ELSE DEST [191:128] := SRC2[191:128] FI
IF (MASK[255] = 0) THEN DEST[255:192] := SRC1[255:192]

          ELSE DEST [255:192] := SRC2[255:192] FI
```

## Intel C/C++ compilador intrínseco

```c
BLENDVPD __m128d _mm_blendv_pd(__m128d v1, __m128d v2, __m128d v3);
VBLENDVPD __m128 _mm_blendv_pd (__m128d a, __m128d b, __m128d mask);
VBLENDVPD __m256 _mm256_blendv_pd (__m256d a, __m256d b, __m256d mask);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.W = 1.
```
