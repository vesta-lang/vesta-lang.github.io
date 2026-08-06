---
summary: Cuadrícula cuadrada de valor de precisión simple escalar
---

## Descripción

Calcula la raíz cuadrada del valor flotante-punto de baja precisión en el operado de segunda fuente y almacena el resultado flotante-punto de precisión único en el operado de destino. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. La primera fuente y operandos de destino es un registro XMM.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 y EVEX versiones codificadas: Los bits 127:32 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits (MAXVL-1:128) del destino ZMM registro se ponen a cero.

EVEX versión codificada: El elemento de palabra doble bajo del operando de destino se actualiza según la máscara de escritura.

El software debe asegurar que VSQRTSS esté codificado con VEX.L=0. Codificar VSQRTSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VSQRTSS (EVEX Encoded Version)

IF (EVEX.b = 1) AND (SRC2 *is register*)

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SQRT(SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0

VSQRTSS (VEX.128 Encoded Version)
DEST[31:0] := SQRT(SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

SQRTSS (128-bit Legacy SSE Version)
DEST[31:0] := SQRT(SRC2[31:0])
DEST[MAXVL-1:32] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSQRTSS __m128 _mm_sqrt_round_ss(__m128 a, __m128 b, int r);
VSQRTSS __m128 _mm_mask_sqrt_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int r);
VSQRTSS __m128 _mm_maskz_sqrt_round_ss( __mmask8 k, __m128 a, __m128 b, int r);
SQRTSS __m128 _mm_sqrt_ss(__m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Precision, Denormal.

## Otras excepciones

Instrucción no-EVEX-encoded, ver Tabla 2-20, "Tipo 3 Clase Condiciones de Excepción." Instrucción codificada por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
