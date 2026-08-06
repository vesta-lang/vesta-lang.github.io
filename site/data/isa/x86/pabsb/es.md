---
summary: Valor absoluto embalado
---

## Descripción

PABSB/W/D calcula el valor absoluto de cada elemento de datos del operando de origen (el segundo operando) y almacena los resultados de UNSIGNED en el operando de destino (el primer operando). PABSB opera en bytes firmados, PABSW opera en palabras firmadas de 16 bits, y PABSD opera en enteros firmados de 32 bits.

EVEX codificado VPABSD/Q: El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura.

EVEX codificado VPABSB/W: El operando de origen es un registro ZMM/YMM/XMM, o un 512/256/128-bit ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura.

VEX.256 versiones codificadas: El operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro correspondiente se ponen a cero.

VEX.128 versiones codificadas: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro correspondiente se ponen a cero.

128-bit Legacy SSE versión: El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino es un registro XMM. Los bits superiores (VL MAX-1:128) del destino correspondiente del registro son sin modificar.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
PABSB With 64-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 7th bytes
    Unsigned DEST[63:56] := ABS(SRC[63:56])

PABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 128-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 15th bytes
    Unsigned DEST[127:120] := ABS(SRC[127:120])

VPABSB With 256-bit Operands:
    Unsigned DEST[7:0] := ABS(SRC[7: 0])
    Repeat operation for 2nd through 31st bytes
    Unsigned DEST[255:248] := ABS(SRC[255:248])

VPABSB (EVEX Encoded Versions)
    (KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN

            Unsigned DEST[i+7:i] := ABS(SRC[i+7:i])

     ELSE

            IF *merging-masking*                ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*                 ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 128-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 7th 16-bit words
    Unsigned DEST[127:112] := ABS(SRC[127:112])

VPABSW With 256-bit Operands:
    Unsigned DEST[15:0] := ABS(SRC[15:0])
    Repeat operation for 2nd through 15th 16-bit words
    Unsigned DEST[255:240] := ABS(SRC[255:240])


VPABSW (EVEX Encoded Versions)
    (KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             Unsigned DEST[i+15:i] := ABS(SRC[i+15:i])

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+15:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 128-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 3rd 32-bit double words
    Unsigned DEST[127:96] := ABS(SRC[127:96])

VPABSD With 256-bit Operands:
    Unsigned DEST[31:0] := ABS(SRC[31:0])
    Repeat operation for 2nd through 7th 32-bit double words
    Unsigned DEST[255:224] := ABS(SRC[255:224])

VPABSD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+31:i] := ABS(SRC[31:0])

                  ELSE

                    Unsigned DEST[i+31:i] := ABS(SRC[i+31:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*                ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;


DEST[MAXVL-1:VL] := 0

VPABSQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN

                    Unsigned DEST[i+63:i] := ABS(SRC[63:0])

                  ELSE

                    Unsigned DEST[i+63:i] := ABS(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*               ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*            ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPABSB__m512i _mm512_abs_epi8 ( __m512i a) VPABSW__m512i _mm512_abs_epi16 ( __m512i a) VPABSB__m512i _mm512_mask_abs_epi8 ( __m512i s, __mmask64 m, __m512i a) VPABSW__m512i _mm512_mask_abs_epi16 ( __m512i s, __mmask32 m, __m512i a) VPABSB__m512i _mm512_maskz_abs_epi8 (__mmask64 m, __m512i a) VPABSW__m512i _mm512_maskz_abs_epi16 (__mmask32 m, __m512i a) VPABSB__m256i _mm256_mask_abs_epi8 (__m256i s, __mmask32 m, __m256i a) VPABSW__m256i _mm256_mask_abs_epi16 (__m256i s, __mmask16 m, __m256i a) VPABSB__m256i _mm256_maskz_abs_epi8 (__mmask32 m, __m256i a) VPABSW__m256i _mm256_maskz_abs_epi16 (__mmask16 m, __m256i a) VPABSB__m128i _mm_mask_abs_epi8 (__m128i s, __mmask16 m, __m128i a) VPABSW__m128i _mm_mask_abs_epi16 (__m128i s, __mmask8 m, __m128i a) VPABSB__m128i _mm_maskz_abs_epi8 (__mmask16 m, __m128i a) VPABSW__m128i _mm_maskz_abs_epi16 (__mmask8 m, __m128i a) VPABSD __m256i _mm256_mask_abs_epi32(__m256i s, __mmask8 k, __m256i a);
VPABSD __m256i _mm256_maskz_abs_epi32( __mmask8 k, __m256i a);
VPABSD __m128i _mm_mask_abs_epi32(__m128i s, __mmask8 k, __m128i a);
VPABSD __m128i _mm_maskz_abs_epi32( __mmask8 k, __m128i a);
VPABSD __m512i _mm512_abs_epi32( __m512i a);
VPABSD __m512i _mm512_mask_abs_epi32(__m512i s, __mmask16 k, __m512i a);
VPABSD __m512i _mm512_maskz_abs_epi32( __mmask16 k, __m512i a);
VPABSQ __m512i _mm512_abs_epi64( __m512i a);
VPABSQ __m512i _mm512_mask_abs_epi64(__m512i s, __mmask8 k, __m512i a);
VPABSQ __m512i _mm512_maskz_abs_epi64( __mmask8 k, __m512i a);
VPABSQ __m256i _mm256_mask_abs_epi64(__m256i s, __mmask8 k, __m256i a);
VPABSQ __m256i _mm256_maskz_abs_epi64( __mmask8 k, __m256i a);
VPABSQ __m128i _mm_mask_abs_epi64(__m128i s, __mmask8 k, __m128i a);
VPABSQ __m128i _mm_maskz_abs_epi64( __mmask8 k, __m128i a);
PABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m128i _mm_abs_epi8 (__m128i a) VPABSB __m256i _mm256_abs_epi8 (__m256i a) PABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m128i _mm_abs_epi16 (__m128i a) VPABSW __m256i _mm256_abs_epi16 (__m256i a) PABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m128i _mm_abs_epi32 (__m128i a) VPABSD __m256i _mm256_abs_epi32 (__m256i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded VPABSD/Q, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

EVEX-encoded VPABSB/W, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
