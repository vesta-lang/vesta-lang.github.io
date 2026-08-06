---
summary: Blend valores en coma flotante de precisión doble empaquetados
---

## Descripción

Valores en coma flotante de precisión doble del segundo operando de origen (tercer operando) se fusionan condicionalmente con valores del primer operando de origen (segundo operando) y escrito al operando de destino (primer operando). Los bits inmediatos [3:0] determinan si el valor en coma flotante de precisión doble correspondiente en el destino es copiado de la segunda fuente o primera fuente. Si un poco en la máscara, correspondiente a una palabra, es "1", entonces el valor en coma flotante de precisión doble en el segundo operando de origen es copiado, de lo contrario el valor en el primer operando de origen es copiado.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

## Operación

```text
BLENDPD (128-bit Legacy SSE Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := DEST[63:0]

          ELSE DEST [63:0] := SRC[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := DEST[127:64]

          ELSE DEST [127:64] := SRC[127:64] FI
DEST[MAXVL-1:128] (Unmodified)

VBLENDPD (VEX.128 Encoded Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
DEST[MAXVL-1:128] := 0


VBLENDPD (VEX.256 Encoded Version)
IF (IMM8[0] = 0)THEN DEST[63:0] := SRC1[63:0]

          ELSE DEST [63:0] := SRC2[63:0] FI
IF (IMM8[1] = 0) THEN DEST[127:64] := SRC1[127:64]

          ELSE DEST [127:64] := SRC2[127:64] FI
IF (IMM8[2] = 0) THEN DEST[191:128] := SRC1[191:128]

          ELSE DEST [191:128] := SRC2[191:128] FI
IF (IMM8[3] = 0) THEN DEST[255:192] := SRC1[255:192]

          ELSE DEST [255:192] := SRC2[255:192] FI
```

## Intel C/C++ compilador intrínseco

```c
BLENDPD __m128d _mm_blend_pd (__m128d v1, __m128d v2, const int mask);
VBLENDPD __m256d _mm256_blend_pd (__m256d a, __m256d b, const int mask);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
