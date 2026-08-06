---
summary: Mínimo de valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza una comparación SIMD de los valores en coma flotante de precisión doble empaquetados en el primer operando de origen y el segundo operando de origen y devuelve el valor mínimo para cada par de valores al operando de destino.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando (operando de origen) es devuelto. Si un valor en el segundo operando es un SNaN, entonces SNaN se envía sin cambios al destino (es decir, una versión QNaN del SNaN no se devuelve).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando (operando de origen), ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que el NaN operando de origen (a partir del primer o segundo operando) sea devuelto, la acción de MINPD se puede emular utilizando una secuencia de instrucciones, como, una comparación seguida por AND, ANDN y OR.

EVEX versiones codificadas: El primer operando de origen (el segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados.

## Operación

```text
MIN(SRC1, SRC2)
{

    IF ((SRC1 = 0.0) and (SRC2 = 0.0)) THEN DEST := SRC2;
          ELSE IF (SRC1 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC2 = NaN) THEN DEST := SRC2; FI;
          ELSE IF (SRC1 < SRC2) THEN DEST := SRC1;
          ELSE DEST := SRC2;

    FI;
}

VMINPD (EVEX Encoded Version)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+63:i] := MIN(SRC1[i+63:i], SRC2[63:0])

                  ELSE

                    DEST[i+63:i] := MIN(SRC1[i+63:i], SRC2[i+63:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE DEST[i+63:i] := 0  ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMINPD (VEX.256 Encoded Version)
DEST[63:0] := MIN(SRC1[63:0], SRC2[63:0])
DEST[127:64] := MIN(SRC1[127:64], SRC2[127:64])
DEST[191:128] := MIN(SRC1[191:128], SRC2[191:128])
DEST[255:192] := MIN(SRC1[255:192], SRC2[255:192])

VMINPD (VEX.128 Encoded Version)
DEST[63:0] := MIN(SRC1[63:0], SRC2[63:0])
DEST[127:64] := MIN(SRC1[127:64], SRC2[127:64])
DEST[MAXVL-1:128] := 0

MINPD (128-bit Legacy SSE Version)
DEST[63:0] := MIN(SRC1[63:0], SRC2[63:0])
DEST[127:64] := MIN(SRC1[127:64], SRC2[127:64])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMINPD __m512d _mm512_min_pd( __m512d a, __m512d b);
VMINPD __m512d _mm512_mask_min_pd(__m512d s, __mmask8 k, __m512d a, __m512d b);
VMINPD __m512d _mm512_maskz_min_pd( __mmask8 k, __m512d a, __m512d b);
VMINPD __m512d _mm512_min_round_pd( __m512d a, __m512d b, int);
VMINPD __m512d _mm512_mask_min_round_pd(__m512d s, __mmask8 k, __m512d a, __m512d b, int);
VMINPD __m512d _mm512_maskz_min_round_pd( __mmask8 k, __m512d a, __m512d b, int);
VMINPD __m256d _mm256_mask_min_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VMINPD __m256d _mm256_maskz_min_pd( __mmask8 k, __m256d a, __m256d b);
VMINPD __m128d _mm_mask_min_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VMINPD __m128d _mm_maskz_min_pd( __mmask8 k, __m128d a, __m128d b);
VMINPD __m256d _mm256_min_pd (__m256d a, __m256d b);
MINPD __m128d _mm_min_pd (__m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

Inválido (incluyendo QNaN operando de origen), Denormal.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
