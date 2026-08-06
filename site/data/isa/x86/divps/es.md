---
summary: Divide valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza una división SIMD de los cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados en el primer operando de origen (el segundo operando) por los cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados en el segundo operando de origen (el tercer operando). Los resultados están escritos al operando de destino (el primer operando).

EVEX versiones codificadas: El primer operando de origen (el segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados.

## Operación

```text
VDIVPS (EVEX Encoded Versions)


(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1) AND SRC2 *is a register*

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN

                       DEST[i+31:i] := SRC1[i+31:i] / SRC2[31:0]

                       ELSE

                       DEST[i+31:i] := SRC1[i+31:i] / SRC2[i+31:i]

                  FI;

          ELSE

                  IF *merging-masking*       ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE                  ; zeroing-masking

                       DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VDIVPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] / SRC2[31:0]
DEST[63:32] := SRC1[63:32] / SRC2[63:32]
DEST[95:64] := SRC1[95:64] / SRC2[95:64]
DEST[127:96] := SRC1[127:96] / SRC2[127:96]
DEST[159:128] := SRC1[159:128] / SRC2[159:128]
DEST[191:160] := SRC1[191:160] / SRC2[191:160]
DEST[223:192] := SRC1[223:192] / SRC2[223:192]
DEST[255:224] := SRC1[255:224] / SRC2[255:224].
DEST[MAXVL-1:256] := 0;

VDIVPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] / SRC2[31:0]
DEST[63:32] := SRC1[63:32] / SRC2[63:32]
DEST[95:64] := SRC1[95:64] / SRC2[95:64]
DEST[127:96] := SRC1[127:96] / SRC2[127:96]
DEST[MAXVL-1:128] := 0


DIVPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0] / SRC2[31:0]
DEST[63:32] := SRC1[63:32] / SRC2[63:32]
DEST[95:64] := SRC1[95:64] / SRC2[95:64]
DEST[127:96] := SRC1[127:96] / SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VDIVPS __m512 _mm512_div_ps( __m512 a, __m512 b);
VDIVPS __m512 _mm512_mask_div_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VDIVPS __m512 _mm512_maskz_div_ps(__mmask16 k, __m512 a, __m512 b);
VDIVPD __m256d _mm256_mask_div_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VDIVPD __m256d _mm256_maskz_div_pd( __mmask8 k, __m256d a, __m256d b);
VDIVPD __m128d _mm_mask_div_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VDIVPD __m128d _mm_maskz_div_pd( __mmask8 k, __m128d a, __m128d b);
VDIVPS __m512 _mm512_div_round_ps( __m512 a, __m512 b, int);
VDIVPS __m512 _mm512_mask_div_round_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int);
VDIVPS __m512 _mm512_maskz_div_round_ps(__mmask16 k, __m512 a, __m512 b, int);
VDIVPS __m256 _mm256_div_ps (__m256 a, __m256 b);
DIVPS __m128 _mm_div_ps (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Divide-by-Zero, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
