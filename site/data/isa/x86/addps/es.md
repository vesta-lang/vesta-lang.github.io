---
summary: Añadir valores en coma flotante de precisión simple empaquetados
---

## Descripción

Añade cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados del primer operando de origen con el segundo operando de origen, y almacena el resultado coma flotante de precisión simple empaquetado en el operando de destino.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 versión codificada: el primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los Bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados.

## Operación

```text
VADDPS (EVEX Encoded Versions) When SRC2 Operand is a Register

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

          THEN DEST[i+31:i] := SRC1[i+31:i] + SRC2[i+31:i]

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VADDPS (EVEX Encoded Versions) When SRC2 Operand is a Memory Source
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+31:i] := SRC1[i+31:i] + SRC2[31:0]

                       ELSE

                       DEST[i+31:i] := SRC1[i+31:i] + SRC2[i+31:i]

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VADDPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] + SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] + SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[159:128] := SRC1[159:128] + SRC2[159:128]
DEST[191:160]:= SRC1[191:160] + SRC2[191:160]
DEST[223:192] := SRC1[223:192] + SRC2[223:192]
DEST[255:224] := SRC1[255:224] + SRC2[255:224].
DEST[MAXVL-1:256] := 0

VADDPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] + SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] + SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[MAXVL-1:128] := 0

ADDPS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] + SRC[31:0]
DEST[63:32] := DEST[63:32] + SRC[63:32]
DEST[95:64] := DEST[95:64] + SRC[95:64]
DEST[127:96] := DEST[127:96] + SRC[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VADDPS __m512 _mm512_add_ps (__m512 a, __m512 b);
VADDPS __m512 _mm512_mask_add_ps (__m512 s, __mmask16 k, __m512 a, __m512 b);
VADDPS __m512 _mm512_maskz_add_ps (__mmask16 k, __m512 a, __m512 b);
VADDPS __m256 _mm256_mask_add_ps (__m256 s, __mmask8 k, __m256 a, __m256 b);
VADDPS __m256 _mm256_maskz_add_ps (__mmask8 k, __m256 a, __m256 b);
VADDPS __m128 _mm_mask_add_ps (__m128d s, __mmask8 k, __m128 a, __m128 b);
VADDPS __m128 _mm_maskz_add_ps (__mmask8 k, __m128 a, __m128 b);
VADDPS __m512 _mm512_add_round_ps (__m512 a, __m512 b, int);
VADDPS __m512 _mm512_mask_add_round_ps (__m512 s, __mmask16 k, __m512 a, __m512 b, int);
VADDPS __m512 _mm512_maskz_add_round_ps (__mmask16 k, __m512 a, __m512 b, int);
ADDPS __m256 _mm256_add_ps (__m256 a, __m256 b);
ADDPS __m128 _mm_add_ps (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
