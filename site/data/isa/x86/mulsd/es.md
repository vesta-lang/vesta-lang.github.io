---
summary: Multiply valores en coma flotante de precisión doble escalares
---

## Descripción

Multiplica el valor en coma flotante de precisión doble bajo en el segundo operando de origen por el valor en coma flotante de precisión doble bajo en el primer operando de origen, y las tiendas la coma flotante de precisión doble resultado en el operando de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. El primer operando de origen y los operandos de destino son registros XMM.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:64) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versión codificada: El cuádword en bits 127:64 del operando de destino es copiado de los mismos pedazos del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de cuádpo bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VMULSD esté codificado con VEX.L=0. Codificar VMULSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VMULSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND SRC2 *is a register*

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC1[63:0] * SRC2[63:0]

     ELSE

          IF *merging-masking*            ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

               THEN DEST[63:0] := 0

           FI

     FI;

ENDFOR

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VMULSD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0] * SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

MULSD (128-bit Legacy SSE Version)
DEST[63:0] := DEST[63:0] * SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMULSD __m128d _mm_mask_mul_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VMULSD __m128d _mm_maskz_mul_sd( __mmask8 k, __m128d a, __m128d b);
VMULSD __m128d _mm_mul_round_sd( __m128d a, __m128d b, int);
VMULSD __m128d _mm_mask_mul_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int);
VMULSD __m128d _mm_maskz_mul_round_sd( __mmask8 k, __m128d a, __m128d b, int);
MULSD __m128d _mm_mul_sd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucción no-EVEX-encoded, ver Tabla 2-20, "Tipo 3 Clase Condiciones de Excepción." Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
