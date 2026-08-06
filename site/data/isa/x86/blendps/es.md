---
summary: Blend valores en coma flotante de precisión simple empaquetados
---

## Descripción

Valores en coma flotante de precisión simple empaquetados del segundo operando de origen (tercer operando) se fusionan condicionalmente con valores del primer operando de origen (segundo operando) y escrito al operando de destino (primer operando). Los bits inmediatos [7:0] determinan si el valor en coma flotante de precisión simple correspondiente en el destino es copiado de la segunda fuente o primera fuente. Si un poco en la máscara, correspondiente a una palabra, es "1", entonces el valor en coma flotante de precisión simple en el segundo operando de origen es copiado, de lo contrario el valor en el primer operando de origen es copiado.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: El primer operando de origen un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
BLENDPS (128-bit Legacy SSE Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=DEST[31:0]

          ELSE DEST [31:0] := SRC[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := DEST[63:32]

          ELSE DEST [63:32] := SRC[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := DEST[95:64]

          ELSE DEST [95:64] := SRC[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := DEST[127:96]

          ELSE DEST [127:96] := SRC[127:96] FI
DEST[MAXVL-1:128] (Unmodified)


VBLENDPS (VEX.128 Encoded Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
DEST[MAXVL-1:128] := 0

VBLENDPS (VEX.256 Encoded Version)
IF (IMM8[0] = 0) THEN DEST[31:0] :=SRC1[31:0]

          ELSE DEST [31:0] := SRC2[31:0] FI
IF (IMM8[1] = 0) THEN DEST[63:32] := SRC1[63:32]

          ELSE DEST [63:32] := SRC2[63:32] FI
IF (IMM8[2] = 0) THEN DEST[95:64] := SRC1[95:64]

          ELSE DEST [95:64] := SRC2[95:64] FI
IF (IMM8[3] = 0) THEN DEST[127:96] := SRC1[127:96]

          ELSE DEST [127:96] := SRC2[127:96] FI
IF (IMM8[4] = 0) THEN DEST[159:128] := SRC1[159:128]

          ELSE DEST [159:128] := SRC2[159:128] FI
IF (IMM8[5] = 0) THEN DEST[191:160] := SRC1[191:160]

          ELSE DEST [191:160] := SRC2[191:160] FI
IF (IMM8[6] = 0) THEN DEST[223:192] := SRC1[223:192]

          ELSE DEST [223:192] := SRC2[223:192] FI
IF (IMM8[7] = 0) THEN DEST[255:224] := SRC1[255:224]

          ELSE DEST [255:224] := SRC2[255:224] FI.
```

## Intel C/C++ compilador intrínseco

```c
BLENDPS __m128 _mm_blend_ps (__m128 v1, __m128 v2, const int mask);
VBLENDPS __m256 _mm256_blend_ps (__m256 a, __m256 b, const int mask);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
