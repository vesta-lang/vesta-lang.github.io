---
summary: Divide valores en coma flotante de precisión simple escalares
---

## Descripción

Divide el bajo valor en coma flotante de precisión simple en el primer operando de origen por el valor de punto flotante de baja precisión en el segundo operando de origen, y las tiendas la coma flotante de precisión simple resultan en el operando de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 versión codificada: El primer operando de origen es un registro xmm codificado por VEX.vvvv. Las tres palabras dobles de alto orden del operando de destino son copiadas del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX.128 versión codificada: El primer operando de origen es un registro xmm codificado por EVEX.vvvv. Los elementos de doble palabra del operando de destino en bits 127:32 son copiados del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión: El elemento de doble palabra bajo del destino se actualiza según la máscara de escritura.

El software debe asegurar que VDIVSS esté codificado con VEX.L=0. Codificar VDIVSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VDIVSS (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] / SRC2[31:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VDIVSS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] / SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

DIVSS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] / SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VDIVSS __m128 _mm_mask_div_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VDIVSS __m128 _mm_maskz_div_ss( __mmask8 k, __m128 a, __m128 b);
VDIVSS __m128 _mm_div_round_ss( __m128 a, __m128 b, int);
VDIVSS __m128 _mm_mask_div_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VDIVSS __m128 _mm_maskz_div_round_ss( __mmask8 k, __m128 a, __m128 b, int);
DIVSS __m128 _mm_div_ss(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Divide-by-Zero, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
