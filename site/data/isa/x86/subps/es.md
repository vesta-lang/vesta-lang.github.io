---
summary: Subtract valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza un subtracto SIMD de los valores en coma flotante de precisión simple empaquetados en el segundo operando de origen del primer operando de origen, y almacena los resultados de coma flotante de precisión simple empaquetados en el operando de destino.

VEX.128 y EVEX.128 versiones codificadas: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 y EVEX.256 versiones codificadas: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

EVEX.512 versión codificada: El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El primer operando de origen y operandos de destino son registros ZMM. El operando de destino es actualizado condicionalmente según la máscara de escritura.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente no están modificados.

## Operación

```text
VSUBPS (EVEX Encoded Versions When SRC2 Operand is a Vector Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC1[i+31:i] - SRC2[i+31:i]

ELSE

     IF *merging-masking*     ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE             ; zeroing-masking

             DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VSUBPS (EVEX Encoded Versions When SRC2 Operand is a Memory Source)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1)
                      THEN DEST[i+31:i] := SRC1[i+31:i] - SRC2[31:0];
                      ELSE DEST[i+31:i] := SRC1[i+31:i] - SRC2[i+31:i];

                FI;

ELSE

     IF *merging-masking*     ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE             ; zeroing-masking

             DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC2[159:128]
DEST[191:160] := SRC1[191:160] - SRC2[191:160]
DEST[223:192] := SRC1[223:192] - SRC2[223:192]
DEST[255:224] := SRC1[255:224] - SRC2[255:224].
DEST[MAXVL-1:256] := 0


VSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[MAXVL-1:128] := 0

SUBPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] - SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] - SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSUBPS __m512 _mm512_sub_ps (__m512 a, __m512 b);
VSUBPS __m512 _mm512_mask_sub_ps (__m512 s, __mmask16 k, __m512 a, __m512 b);
VSUBPS __m512 _mm512_maskz_sub_ps (__mmask16 k, __m512 a, __m512 b);
VSUBPS __m512 _mm512_sub_round_ps (__m512 a, __m512 b, int);
VSUBPS __m512 _mm512_mask_sub_round_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int);
VSUBPS __m512 _mm512_maskz_sub_round_ps (__mmask16 k, __m512 a, __m512 b, int);
VSUBPS __m256 _mm256_sub_ps (__m256 a, __m256 b);
VSUBPS __m256 _mm256_mask_sub_ps (__m256 s, __mmask8 k, __m256 a, __m256 b);
VSUBPS __m256 _mm256_maskz_sub_ps (__mmask16 k, __m256 a, __m256 b);
SUBPS __m128 _mm_sub_ps (__m128 a, __m128 b);
VSUBPS __m128 _mm_mask_sub_ps (__m128 s, __mmask8 k, __m128 a, __m128 b);
VSUBPS __m128 _mm_maskz_sub_ps (__mmask16 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
