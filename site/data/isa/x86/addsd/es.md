---
summary: Añadir valores en coma flotante de precisión doble escalares
---

## Descripción

Añade los valores en coma flotante de precisión doble bajo del segundo operando de origen y el primer operando de origen y las tiendas la coma flotante de precisión doble resultado en el operando de destino.

El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son los mismos. Bits (MAXVL-1:64) del registro de destino correspondiente no se modifican.

EVEX y VEX.128 versión codificada: El primer operando de origen es codificado por EVEX.vvvv/VEX.vvvv. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión: El elemento de cuádpago bajo del destino se actualiza según la máscara de escritura.

El software debe asegurar que VADDSD esté codificado con VEX.L=0. Codificar VADDSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VADDSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] + SRC2[63:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VADDSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] + SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

ADDSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] + SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VADDSD __m128d _mm_mask_add_sd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VADDSD __m128d _mm_maskz_add_sd (__mmask8 k, __m128d a, __m128d b);
VADDSD __m128d _mm_add_round_sd (__m128d a, __m128d b, int);
VADDSD __m128d _mm_mask_add_round_sd (__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VADDSD __m128d _mm_maskz_add_round_sd (__mmask8 k, __m128d a, __m128d b, int);
ADDSD __m128d _mm_add_sd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucción codificada por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción". Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
