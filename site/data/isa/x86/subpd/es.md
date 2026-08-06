---
summary: Subtract valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza un subtracto SIMD de los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del segundo operando de origen del primer operando de origen, y almacena los resultados de coma flotante de precisión doble empaquetados en el operando de destino.

VEX.128 y EVEX.128 versiones codificadas: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 y EVEX.256 versiones codificadas: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

EVEX.512 versión codificada: El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El primer operando de origen y operandos de destino son registros ZMM. El operando de destino es actualizado condicionalmente según la máscara de escritura.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente no están modificados.

## Operación

```text
VSUBPD (EVEX Encoded Versions When SRC2 Operand is a Vector Register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i]

ELSE

     IF *merging-masking*          ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                  ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSUBPD (EVEX Encoded Versions When SRC2 Operand is a Memory Source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1)

                  THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[63:0];

                  ELSE EST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i];

             FI;

ELSE

     IF *merging-masking*          ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                  ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSUBPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] - SRC2[127:64]
DEST[191:128] := SRC1[191:128] - SRC2[191:128]
DEST[255:192] := SRC1[255:192] - SRC2[255:192]
DEST[MAXVL-1:256] := 0


VSUBPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] - SRC2[63:0]
DEST[127:64] := SRC1[127:64] - SRC2[127:64]
DEST[MAXVL-1:128] := 0

SUBPD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] - SRC[63:0]
DEST[127:64] := DEST[127:64] - SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSUBPD __m512d _mm512_sub_pd (__m512d a, __m512d b);
VSUBPD __m512d _mm512_mask_sub_pd (__m512d s, __mmask8 k, __m512d a, __m512d b);
VSUBPD __m512d _mm512_maskz_sub_pd (__mmask8 k, __m512d a, __m512d b);
VSUBPD __m512d _mm512_sub_round_pd (__m512d a, __m512d b, int);
VSUBPD __m512d _mm512_mask_sub_round_pd (__m512d s, __mmask8 k, __m512d a, __m512d b, int);
VSUBPD __m512d _mm512_maskz_sub_round_pd (__mmask8 k, __m512d a, __m512d b, int);
VSUBPD __m256d _mm256_sub_pd (__m256d a, __m256d b);
VSUBPD __m256d _mm256_mask_sub_pd (__m256d s, __mmask8 k, __m256d a, __m256d b);
VSUBPD __m256d _mm256_maskz_sub_pd (__mmask8 k, __m256d a, __m256d b);
SUBPD __m128d _mm_sub_pd (__m128d a, __m128d b);
VSUBPD __m128d _mm_mask_sub_pd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VSUBPD __m128d _mm_maskz_sub_pd (__mmask8 k, __m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
