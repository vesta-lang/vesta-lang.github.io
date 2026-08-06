---
summary: Mínimo de enteros sin signo empacado
---

## Descripción

Realiza una comparación de SIMD de los enteros empaquetados de byte o palabra enteros en el segundo operando de origen y el primer operando de origen y devuelve el valor mínimo para cada par de enteros al operando de destino.

Legacy SSE versión PMINUB: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino puede ser un registro de tecnología MMX.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 versión codificada: El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La primera fuente y operandos de destino son registros YMM.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM; El segundo operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El operando de destino es actualizado condicionalmente basado en máscara de escritura k1.

## Operación

```text
PMINUB (64-bit Operands)
    IF DEST[7:0] < SRC[17:0] THEN
          DEST[7:0] := DEST[7:0];
    ELSE
          DEST[7:0] := SRC[7:0]; FI;
    (* Repeat operation for 2nd through 7th bytes in source and destination operands *)
    IF DEST[63:56] < SRC[63:56] THEN
          DEST[63:56] := DEST[63:56];
    ELSE
          DEST[63:56] := SRC[63:56]; FI;

PMINUB (128-bit Operands)
    IF DEST[7:0] < SRC[7:0] THEN
          DEST[7:0] := DEST[7:0];
    ELSE
          DEST[15:0] := SRC[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF DEST[127:120] < SRC[127:120] THEN
          DEST[127:120] := DEST[127:120];
    ELSE
          DEST[127:120] := SRC[127:120]; FI;

DEST[MAXVL-1:128] (Unmodified)


VPMINUB (VEX.128 Encoded Version)
    IF SRC1[7:0] < SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[7:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 15th bytes in source and destination operands *)
    IF SRC1[127:120] < SRC2[127:120] THEN
          DEST[127:120] := SRC1[127:120];
    ELSE
          DEST[127:120] := SRC2[127:120]; FI;

DEST[MAXVL-1:128] := 0

VPMINUB (VEX.256 Encoded Version)
    IF SRC1[7:0] < SRC2[7:0] THEN
          DEST[7:0] := SRC1[7:0];
    ELSE
          DEST[15:0] := SRC2[7:0]; FI;
    (* Repeat operation for 2nd through 31st bytes in source and destination operands *)
    IF SRC1[255:248] < SRC2[255:248] THEN
          DEST[255:248] := SRC1[255:248];
    ELSE
          DEST[255:248] := SRC2[255:248]; FI;

DEST[MAXVL-1:256] := 0

VPMINUB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+7:i] < SRC2[i+7:i]

            THEN DEST[i+7:i] := SRC1[i+7:i];

            ELSE DEST[i+7:i] := SRC2[i+7:i];

     FI;

     ELSE

            IF *merging-masking*                    ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE                                ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PMINUW (128-bit Operands)
    IF DEST[15:0] < SRC[15:0] THEN
          DEST[15:0] := DEST[15:0];
    ELSE
          DEST[15:0] := SRC[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF DEST[127:112] < SRC[127:112] THEN
          DEST[127:112] := DEST[127:112];
    ELSE
          DEST[127:112] := SRC[127:112]; FI;

DEST[MAXVL-1:128] (Unmodified)


VPMINUW (VEX.128 Encoded Version)
    IF SRC1[15:0] < SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 7th words in source and destination operands *)
    IF SRC1[127:112] < SRC2[127:112] THEN
          DEST[127:112] := SRC1[127:112];
    ELSE
          DEST[127:112] := SRC2[127:112]; FI;

DEST[MAXVL-1:128] := 0

VPMINUW (VEX.256 Encoded Version)
    IF SRC1[15:0] < SRC2[15:0] THEN
          DEST[15:0] := SRC1[15:0];
    ELSE
          DEST[15:0] := SRC2[15:0]; FI;
    (* Repeat operation for 2nd through 15th words in source and destination operands *)
    IF SRC1[255:240] < SRC2[255:240] THEN
          DEST[255:240] := SRC1[255:240];
    ELSE
          DEST[255:240] := SRC2[255:240]; FI;

DEST[MAXVL-1:256] := 0

VPMINUW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask* THEN

     IF SRC1[i+15:i] < SRC2[i+15:i]

             THEN DEST[i+15:i] := SRC1[i+15:i];

             ELSE DEST[i+15:i] := SRC2[i+15:i];

     FI;

     ELSE

             IF *merging-masking*                   ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                               ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMINUB __m512i _mm512_min_epu8( __m512i a, __m512i b);
VPMINUB __m512i _mm512_mask_min_epu8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPMINUB __m512i _mm512_maskz_min_epu8( __mmask64 k, __m512i a, __m512i b);
VPMINUW __m512i _mm512_min_epu16( __m512i a, __m512i b);
VPMINUW __m512i _mm512_mask_min_epu16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMINUW __m512i _mm512_maskz_min_epu16( __mmask32 k, __m512i a, __m512i b);
VPMINUB __m256i _mm256_mask_min_epu8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPMINUB __m256i _mm256_maskz_min_epu8( __mmask32 k, __m256i a, __m256i b);
VPMINUW __m256i _mm256_mask_min_epu16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMINUW __m256i _mm256_maskz_min_epu16( __mmask16 k, __m256i a, __m256i b);
VPMINUB __m128i _mm_mask_min_epu8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPMINUB __m128i _mm_maskz_min_epu8( __mmask16 k, __m128i a, __m128i b);
VPMINUW __m128i _mm_mask_min_epu16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMINUW __m128i _mm_maskz_min_epu16( __mmask8 k, __m128i a, __m128i b);
(V)PMINUB __m128i _mm_min_epu8 ( __m128i a, __m128i b) (V)PMINUW __m128i _mm_min_epu16 ( __m128i a, __m128i b);
VPMINUB __m256i _mm256_min_epu8 ( __m256i a, __m256i b) VPMINUW __m256i _mm256_min_epu16 ( __m256i a, __m256i b);
PMINUB __m64 _m_min_pu8 (__m64 a, __m64 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
