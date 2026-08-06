---
summary: Añadir valores en coma flotante de precisión simple escalares
---

## Descripción

Añade los valores en coma flotante de precisión simple bajo del segundo operando de origen y el primer operando de origen, y las tiendas la coma flotante de precisión doble resultan en el operando de destino.

El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son los mismos. Bits (MAXVL-1:32) del correspondiente registro de destino no se modifican.

EVEX y VEX.128 versión codificada: El primer operando de origen es codificado por EVEX.vvvv/VEX.vvvv. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión: El elemento de doble palabra bajo del destino se actualiza según la máscara de escritura.

El software debe asegurar que VADDSS esté codificado con VEX.L=0. Codificar VADDSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VADDSS (EVEX Encoded Versions)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] + SRC2[31:0]

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VADDSS DEST, SRC1, SRC2 (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] + SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

ADDSS DEST, SRC (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] + SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VADDSS __m128 _mm_mask_add_ss (__m128 s, __mmask8 k, __m128 a, __m128 b);
VADDSS __m128 _mm_maskz_add_ss (__mmask8 k, __m128 a, __m128 b);
VADDSS __m128 _mm_add_round_ss (__m128 a, __m128 b, int);
VADDSS __m128 _mm_mask_add_round_ss (__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VADDSS __m128 _mm_maskz_add_round_ss (__mmask8 k, __m128 a, __m128 b, int);
ADDSS __m128 _mm_add_ss (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucción codificada por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción". Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
