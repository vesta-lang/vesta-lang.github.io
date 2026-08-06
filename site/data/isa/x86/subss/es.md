---
summary: Subtract valores en coma flotante de precisión simple escalares
---

## Descripción

Subir el valor en coma flotante de precisión simple bajo del segundo operando de origen y el primer operando de origen y almacenar la coma flotante de precisión doble resultado en la palabra doble baja del operando de destino.

El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: El destino y primer operando de origen son los mismos. Bits (MAXVL-1:32) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versiones codificadas: Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de palabra doble bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VSUBSS esté codificado con VEX.L=0. Codificar VSUBSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VSUBSS (EVEX Encoded Version)

IF (SRC2 *is register*) AND (EVEX.b = 1)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] - SRC2[31:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VSUBSS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

SUBSS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] - SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSUBSS __m128 _mm_mask_sub_ss (__m128 s, __mmask8 k, __m128 a, __m128 b);
VSUBSS __m128 _mm_maskz_sub_ss (__mmask8 k, __m128 a, __m128 b);
VSUBSS __m128 _mm_sub_round_ss (__m128 a, __m128 b, int);
VSUBSS __m128 _mm_mask_sub_round_ss (__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VSUBSS __m128 _mm_maskz_sub_round_ss (__mmask8 k, __m128 a, __m128 b, int);
SUBSS __m128 _mm_sub_ss (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
