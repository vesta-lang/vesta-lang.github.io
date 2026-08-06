---
summary: Divide valores en coma flotante de precisión doble escalares
---

## Descripción

Divide el valor en coma flotante de precisión doble bajo en el primer operando de origen por el valor en coma flotante de precisión doble bajo en el segundo operando de origen, y las tiendas la coma flotante de precisión doble resultado en el operando de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y destino son los registros XMM.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:64) del registro de destino ZMM correspondiente no se modifican.

VEX.128 versión codificada: El primer operando de origen es un registro xmm codificado por VEX.vvvv. El cuadword en bits 127:64 del operando de destino es copiado del cuadword correspondiente del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX.128 versión codificada: El primer operando de origen es un registro xmm codificado por EVEX.vvvv. El elemento quadword del operando de destino en bits 127:64 son copiados del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión: El elemento de cuádpago bajo del destino se actualiza según la máscara de escritura.

El software debe asegurar que VDIVSD esté codificado con VEX.L=0. Codificar VDIVSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VDIVSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] / SRC2[63:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VDIVSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] / SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

DIVSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] / SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VDIVSD __m128d _mm_mask_div_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VDIVSD __m128d _mm_maskz_div_sd( __mmask8 k, __m128d a, __m128d b);
VDIVSD __m128d _mm_div_round_sd( __m128d a, __m128d b, int);
VDIVSD __m128d _mm_mask_div_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VDIVSD __m128d _mm_maskz_div_round_sd( __mmask8 k, __m128d a, __m128d b, int);
DIVSD __m128d _mm_div_sd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Divide-by-Zero, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
