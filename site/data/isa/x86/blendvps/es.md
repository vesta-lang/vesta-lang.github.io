---
summary: Variable Blend valores en coma flotante de precisión simple empaquetados
---

## Descripción

Copia condicionalmente cada elemento dword de datos de valor en coma flotante de precisión simple del segundo operando de origen y el primer operando de origen dependiendo de bits de máscara definidos en el registro de máscaras operando. Los bits de máscara son el bit mas significativo en cada elemento dword del registro de máscaras.

Cada elemento de cuádpago del operando de destino es copiado de:

* el elemento dword correspondiente en el segundo operando de origen, si un bit de máscara es "1"; o * el elemento dword correspondiente en el primer operando de origen, si un bit de máscara es "0".

La asignación de registro de la máscara implícita operando para BLENDVPS se define como el registro arquitectónico XMM0.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino es el mismo. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican. El registro de máscaras operando se define implícitamente como el registro arquitectónico XMM0. Un intento de ejecutar BLENDVPS con un prefijo VEX causará #UD.

VEX.128 versión codificada: El primer operando de origen y el operando de destino son registros XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. La máscara operando es el registro de tercera fuente, y codificado en bits[7:4] del byte inmediato (imm8). Los bits[3:0] de imm8 son ignorados. En modo 32-bit, imm8[7] es ignorado. Los bits superiores (MAXVL-1:128) del registro YMM correspondiente (registro de destilación) se ponen a cero. VEX.W debe ser 0, de lo contrario, la instrucción será #UD.

VEX.256 versión codificada: El primer operando de origen y operando de destino son registros YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La máscara operando es el registro de tercera fuente, y codificado en bits[7:4] del byte inmediato (imm8). Los bits[3:0] de imm8 son ignorados. En modo 32-bit, imm8[7] es ignorado. VEX.W debe ser 0, de lo contrario, la instrucción será #UD.

VBLENDVPS permite que la máscara sea cualquier registro XMM o YMM. En cambio, BLENDVPS trata implícitamente a XMM0 como la máscara y no admite la operación de destino no destructivo.

## Operación

```text
BLENDVPS (128-bit Legacy SSE Version)
MASK := XMM0
IF (MASK[31] = 0) THEN DEST[31:0] := DEST[31:0]

          ELSE DEST [31:0] := SRC[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := DEST[63:32]

          ELSE DEST [63:32] := SRC[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := DEST[95:64]

          ELSE DEST [95:64] := SRC[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := DEST[127:96]

          ELSE DEST [127:96] := SRC[127:96] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDVPS (VEX.128 Encoded Version)
MASK := SRC3
IF (MASK[31] = 0) THEN DEST[31:0] := SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
DEST[MAXVL-1:128] := 0

VBLENDVPS (VEX.256 Encoded Version)
MASK := SRC3
IF (MASK[31] = 0) THEN DEST[31:0] := SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (MASK[63] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (MASK[95] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (MASK[127] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
IF (MASK[159] = 0) THEN DEST[159:128] := SRC1[159:128]

          ELSE DEST [159:128] := SRC2[159:128] FI
IF (MASK[191] = 0) THEN DEST[191:160] := SRC1[191:160]

          ELSE DEST [191:160] := SRC2[191:160] FI
IF (MASK[223] = 0) THEN DEST[223:192] := SRC1[223:192]

          ELSE DEST [223:192] := SRC2[223:192] FI
IF (MASK[255] = 0) THEN DEST[255:224] := SRC1[255:224]

          ELSE DEST [255:224] := SRC2[255:224] FI
```

## Intel C/C++ compilador intrínseco

```c
BLENDVPS __m128 _mm_blendv_ps(__m128 v1, __m128 v2, __m128 v3);
VBLENDVPS __m128 _mm_blendv_ps (__m128 a, __m128 b, __m128 mask);
VBLENDVPS __m256 _mm256_blendv_ps (__m256 a, __m256 b, __m256 mask);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.W = 1.
```
