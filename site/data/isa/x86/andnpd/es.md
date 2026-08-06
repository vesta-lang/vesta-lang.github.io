---
summary: Bitwise Logical AND NOT de valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza un bitwise lógico AND NOT de los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del primer operando de origen y el segundo operando de origen, y almacena el resultado en el operando de destino.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente son sin modificar.

## Operación

```text
VANDNPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

             IF (EVEX.b == 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+63:i] := (NOT(SRC1[i+63:i])) BITWISE AND SRC2[63:0]

                  ELSE

                    DEST[i+63:i] := (NOT(SRC1[i+63:i])) BITWISE AND SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*        ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                   ; zeroing-masking

                    DEST[i+63:i] = 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VANDNPD (VEX.256 Encoded Version)
DEST[63:0] := (NOT(SRC1[63:0])) BITWISE AND SRC2[63:0]
DEST[127:64] := (NOT(SRC1[127:64])) BITWISE AND SRC2[127:64]
DEST[191:128] := (NOT(SRC1[191:128])) BITWISE AND SRC2[191:128]
DEST[255:192] := (NOT(SRC1[255:192])) BITWISE AND SRC2[255:192]
DEST[MAXVL-1:256] := 0

VANDNPD (VEX.128 Encoded Version)
DEST[63:0] := (NOT(SRC1[63:0])) BITWISE AND SRC2[63:0]
DEST[127:64] := (NOT(SRC1[127:64])) BITWISE AND SRC2[127:64]
DEST[MAXVL-1:128] := 0

ANDNPD (128-bit Legacy SSE Version)
DEST[63:0] := (NOT(DEST[63:0])) BITWISE AND SRC[63:0]
DEST[127:64] := (NOT(DEST[127:64])) BITWISE AND SRC[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VANDNPD __m512d _mm512_andnot_pd (__m512d a, __m512d b);
VANDNPD __m512d _mm512_mask_andnot_pd (__m512d s, __mmask8 k, __m512d a, __m512d b);
VANDNPD __m512d _mm512_maskz_andnot_pd (__mmask8 k, __m512d a, __m512d b);
VANDNPD __m256d _mm256_mask_andnot_pd (__m256d s, __mmask8 k, __m256d a, __m256d b);
VANDNPD __m256d _mm256_maskz_andnot_pd (__mmask8 k, __m256d a, __m256d b);
VANDNPD __m128d _mm_mask_andnot_pd (__m128d s, __mmask8 k, __m128d a, __m128d b);
VANDNPD __m128d _mm_maskz_andnot_pd (__mmask8 k, __m128d a, __m128d b);
VANDNPD __m256d _mm256_andnot_pd (__m256d a, __m256d b);
ANDNPD __m128d _mm_andnot_pd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción". Instruccion codificada por EVEX, ver Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
