---
summary: Cuadrícula cuadrada de valores en coma flotante de precisión doble escalares
---

## Descripción

Computa la raíz cuadrada del valor flotante de doble precisión bajo en el operado de segunda fuente y almacena el resultado flotante de doble precisión en el operado de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. La primera fuente y operandos de destino son registros XMM.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. El quadword en bits 127:64 del operando de destino permanece sin cambios. Bits (MAXVL-1:64) del registro de destino correspondiente no se modifican.

VEX.128 y EVEX versiones codificadas: Los bits 127:64 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de cuádpo bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VSQRTSD esté codificado con VEX.L=0. Codificar VSQRTSD con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VSQRTSD (EVEX Encoded Version)

IF (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SQRT(SRC2[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

VSQRTSD (VEX.128 Encoded Version)
DEST[63:0] := SQRT(SRC2[63:0])
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

SQRTSD (128-bit Legacy SSE Version)
DEST[63:0] := SQRT(SRC[63:0])
DEST[MAXVL-1:64] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSQRTSD __m128d _mm_sqrt_round_sd(__m128d a, __m128d b, int r);
VSQRTSD __m128d _mm_mask_sqrt_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int r);
VSQRTSD __m128d _mm_maskz_sqrt_round_sd(__mmask8 k, __m128d a, __m128d b, int r);
SQRTSD __m128d _mm_sqrt_sd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Invalid, Precision, Denormal.

## Otras excepciones

Instrucción no-EVEX-encoded, ver Tabla 2-20, "Tipo 3 Clase Condiciones de Excepción." Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
