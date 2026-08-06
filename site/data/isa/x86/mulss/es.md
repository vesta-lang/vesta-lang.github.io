---
summary: Multiply valores en coma flotante de precisión simple escalares
---

## Descripción

Multiplica el valor en coma flotante de precisión simple bajo del segundo operando de origen por el valor en coma flotante de precisión simple bajo en el primer operando de origen, y las tiendas la coma flotante de precisión simple resultado en el operando de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El primer operando de origen y los operandos de destino son registros XMM.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 y EVEX versión codificada: El primer operando de origen es un registro xmm codificado por VEX.vvvv. Las tres palabras dobles de alto orden del operando de destino son copiadas del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de palabra doble bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VMULSS esté codificado con VEX.L=0. Codificar VMULSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VMULSS (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC1[31:0] * SRC2[31:0]

     ELSE

          IF *merging-masking*            ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

               THEN DEST[31:0] := 0

           FI

     FI;

ENDFOR

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VMULSS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

MULSS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] * SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMULSS __m128 _mm_mask_mul_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VMULSS __m128 _mm_maskz_mul_ss( __mmask8 k, __m128 a, __m128 b);
VMULSS __m128 _mm_mul_round_ss( __m128 a, __m128 b, int);
VMULSS __m128 _mm_mask_mul_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VMULSS __m128 _mm_maskz_mul_round_ss( __mmask8 k, __m128 a, __m128 b, int);
MULSS __m128 _mm_mul_ss(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Underflow, Overflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucción no-EVEX-encoded, ver Tabla 2-20, "Tipo 3 Clase Condiciones de Excepción." Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
