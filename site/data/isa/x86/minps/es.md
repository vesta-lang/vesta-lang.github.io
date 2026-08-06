---
summary: Mínimo de valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza una comparación SIMD de los valores en coma flotante de precisión simple empaquetados en el primer operando de origen y el segundo operando de origen y devuelve el valor mínimo para cada par de valores al operando de destino.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando (operando de origen) es devuelto. Si un valor en el segundo operando es un SNaN, entonces SNaN se envía sin cambios al destino (es decir, una versión QNaN del SNaN no se devuelve).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando (operando de origen), ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que el NaN operando de origen (a partir del primer o segundo operando) sea devuelto, la acción de MINPS se puede emular utilizando una secuencia de instrucciones, como, una comparación seguida por AND, ANDN y OR.

EVEX versiones codificadas: El primer operando de origen (el segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

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

VMINPS (EVEX Encoded Version)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    DEST[i+31:i] := MIN(SRC1[i+31:i], SRC2[31:0])

                  ELSE

                    DEST[i+31:i] := MIN(SRC1[i+31:i], SRC2[i+31:i])

             FI;

             ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE DEST[i+31:i] := 0  ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMINPS (VEX.256 Encoded Version)
DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])
DEST[63:32] := MIN(SRC1[63:32], SRC2[63:32])
DEST[95:64] := MIN(SRC1[95:64], SRC2[95:64])
DEST[127:96] := MIN(SRC1[127:96], SRC2[127:96])
DEST[159:128] := MIN(SRC1[159:128], SRC2[159:128])
DEST[191:160] := MIN(SRC1[191:160], SRC2[191:160])
DEST[223:192] := MIN(SRC1[223:192], SRC2[223:192])
DEST[255:224] := MIN(SRC1[255:224], SRC2[255:224])


VMINPS (VEX.128 Encoded Version)
DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])
DEST[63:32] := MIN(SRC1[63:32], SRC2[63:32])
DEST[95:64] := MIN(SRC1[95:64], SRC2[95:64])
DEST[127:96] := MIN(SRC1[127:96], SRC2[127:96])
DEST[MAXVL-1:128] := 0

MINPS (128-bit Legacy SSE Version)
DEST[31:0] := MIN(SRC1[31:0], SRC2[31:0])
DEST[63:32] := MIN(SRC1[63:32], SRC2[63:32])
DEST[95:64] := MIN(SRC1[95:64], SRC2[95:64])
DEST[127:96] := MIN(SRC1[127:96], SRC2[127:96])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMINPS __m512 _mm512_min_ps( __m512 a, __m512 b);
VMINPS __m512 _mm512_mask_min_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VMINPS __m512 _mm512_maskz_min_ps( __mmask16 k, __m512 a, __m512 b);
VMINPS __m512 _mm512_min_round_ps( __m512 a, __m512 b, int);
VMINPS __m512 _mm512_mask_min_round_ps(__m512 s, __mmask16 k, __m512 a, __m512 b, int);
VMINPS __m512 _mm512_maskz_min_round_ps( __mmask16 k, __m512 a, __m512 b, int);
VMINPS __m256 _mm256_mask_min_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VMINPS __m256 _mm256_maskz_min_ps( __mmask8 k, __m256 a, __m25 b);
VMINPS __m128 _mm_mask_min_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VMINPS __m128 _mm_maskz_min_ps( __mmask8 k, __m128 a, __m128 b);
VMINPS __m256 _mm256_min_ps (__m256 a, __m256 b);
MINPS __m128 _mm_min_ps (__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

Inválido (incluyendo QNaN operando de origen), Denormal.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
