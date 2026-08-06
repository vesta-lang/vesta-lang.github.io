---
summary: Cambio de bits variable derecha Aritmetic
---

## Descripción

Cambia los bits en los elementos de datos individuales (palabra/doblewords/quadword) en el primer operando de origen (el segundo operando) a la derecha por el número de bits especificados en el valor de cuenta de los elementos de datos respectivos en el segundo operando de origen (el tercer operando). A medida que los bits en los elementos de datos se desplazan a la derecha, los bits vacíos de alto orden se fijan en el MSB (extensión de firma).

Los valores de cuenta se especifican individualmente en cada elemento de datos del segundo operando de origen. Si el valor entero no firmado especificado en el elemento de datos correspondiente del segundo operando de origen es superior a 15 (para palabras), 31 (para palabras dobles), o 63 (para un cuadpacio), entonces el elemento de datos de destino se llena con el signo correspondiente del elemento fuente.

VEX.128 versión codificada: El destino y el primer operandos de origen son los registros XMM. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 versión codificada: El destino y el primer operandos de origen son los registros YMM. El conteo operando puede ser un registro YMM o una memoria de 256 bits. Bits (MAXVL-1:256) del registro de destino correspondiente se ponen a cero.

EVEX.512/256/128 codificado VPSRAVD/W: El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El conteo operando puede ser un ZMM/YMM/XMM registro, una ubicación de memoria 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El destino está actualizado condicionalmente con máscara de escritura k1.

EVEX.512/256/128 codificado VPSRAVQ: El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El conteo operando puede ser un ZMM/YMM/XMM registro, un 512/256/128-bit ubicación de memoria. El destino está actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
VPSRAVW (EVEX encoded version)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN

             COUNT := SRC2[i+3:i]

             IF COUNT < 16

                 THEN DEST[i+15:i] := SignExtend(SRC1[i+15:i] >> COUNT)

                 ELSE

                    FOR k := 0 TO 15

                        DEST[i+k] := SRC1[i+15]

                    ENDFOR;

             FI

     ELSE

             IF *merging-masking*      ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSRAVD (VEX.128 version)
COUNT_0 := SRC2[31 : 0]

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[127 : 96];
DEST[31:0] := SignExtend(SRC1[31:0] >> COUNT_0);


    (* Repeat shift operation for 2nd through 4th dwords *)
DEST[127:96] := SignExtend(SRC1[127:96] >> COUNT_3);
DEST[MAXVL-1:128] := 0;

VPSRAVD (VEX.256 version)
COUNT_0 := SRC2[31 : 0];

    (* Repeat Each COUNT_i for the 2nd through 8th dwords of SRC2*)
COUNT_7 := SRC2[255 : 224];
DEST[31:0] := SignExtend(SRC1[31:0] >> COUNT_0);

    (* Repeat shift operation for 2nd through 7th dwords *)
DEST[255:224] := SignExtend(SRC1[255:224] >> COUNT_7);
DEST[MAXVL-1:256] := 0;

VPSRAVD (EVEX encoded version)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    COUNT := SRC2[4:0]

                    IF COUNT < 32

                        THEN DEST[i+31:i] := SignExtend(SRC1[i+31:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 31

                                   DEST[i+k] := SRC1[i+31]

                           ENDFOR;

                    FI

                  ELSE

                    COUNT := SRC2[i+4:i]

                    IF COUNT < 32

                        THEN DEST[i+31:i] := SignExtend(SRC1[i+31:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 31

                                   DEST[i+k] := SRC1[i+31]

                           ENDFOR;

                    FI

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[31:0] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSRAVQ (EVEX encoded version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1) AND (SRC2 *is memory*)


              THEN

               COUNT := SRC2[5:0]

               IF COUNT < 64

                        THEN DEST[i+63:i] := SignExtend(SRC1[i+63:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 63

                               DEST[i+k] := SRC1[i+63]

                           ENDFOR;

               FI

              ELSE

               COUNT := SRC2[i+5:i]

               IF COUNT < 64

                        THEN DEST[i+63:i] := SignExtend(SRC1[i+63:i] >> COUNT)

                        ELSE

                           FOR k := 0 TO 63

                               DEST[i+k] := SRC1[i+63]

                           ENDFOR;

               FI

         FI;

ELSE

     IF *merging-masking*            ; merging-masking

         THEN *DEST[63:0] remains unchanged*

         ELSE                        ; zeroing-masking

              DEST[63:0] := 0

         FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPSRAVD __m512i _mm512_srav_epi32(__m512i a, __m512i cnt);
VPSRAVD __m512i _mm512_mask_srav_epi32(__m512i s, __mmask16 m, __m512i a, __m512i cnt);
VPSRAVD __m512i _mm512_maskz_srav_epi32(__mmask16 m, __m512i a, __m512i cnt);
VPSRAVD __m256i _mm256_srav_epi32(__m256i a, __m256i cnt);
VPSRAVD __m256i _mm256_mask_srav_epi32(__m256i s, __mmask8 m, __m256i a, __m256i cnt);
VPSRAVD __m256i _mm256_maskz_srav_epi32(__mmask8 m, __m256i a, __m256i cnt);
VPSRAVD __m128i _mm_srav_epi32(__m128i a, __m128i cnt);
VPSRAVD __m128i _mm_mask_srav_epi32(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVD __m128i _mm_maskz_srav_epi32(__mmask8 m, __m128i a, __m128i cnt);
VPSRAVQ __m512i _mm512_srav_epi64(__m512i a, __m512i cnt);
VPSRAVQ __m512i _mm512_mask_srav_epi64(__m512i s, __mmask8 m, __m512i a, __m512i cnt);
VPSRAVQ __m512i _mm512_maskz_srav_epi64( __mmask8 m, __m512i a, __m512i cnt);
VPSRAVQ __m256i _mm256_srav_epi64(__m256i a, __m256i cnt);
VPSRAVQ __m256i _mm256_mask_srav_epi64(__m256i s, __mmask8 m, __m256i a, __m256i cnt);
VPSRAVQ __m256i _mm256_maskz_srav_epi64( __mmask8 m, __m256i a, __m256i cnt);
VPSRAVQ __m128i _mm_srav_epi64(__m128i a, __m128i cnt);
VPSRAVQ __m128i _mm_mask_srav_epi64(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVQ __m128i _mm_maskz_srav_epi64( __mmask8 m, __m128i a, __m128i cnt);
VPSRAVW __m512i _mm512_srav_epi16(__m512i a, __m512i cnt);
VPSRAVW __m512i _mm512_mask_srav_epi16(__m512i s, __mmask32 m, __m512i a, __m512i cnt);
VPSRAVW __m512i _mm512_maskz_srav_epi16(__mmask32 m, __m512i a, __m512i cnt);
VPSRAVW __m256i _mm256_srav_epi16(__m256i a, __m256i cnt);
VPSRAVW __m256i _mm256_mask_srav_epi16(__m256i s, __mmask16 m, __m256i a, __m256i cnt);
VPSRAVW __m256i _mm256_maskz_srav_epi16(__mmask16 m, __m256i a, __m256i cnt);
VPSRAVW __m128i _mm_srav_epi16(__m128i a, __m128i cnt);
VPSRAVW __m128i _mm_mask_srav_epi16(__m128i s, __mmask8 m, __m128i a, __m128i cnt);
VPSRAVW __m128i _mm_maskz_srav_epi32(__mmask8 m, __m128i a, __m128i cnt);
VPSRAVD __m256i _mm256_srav_epi32 (__m256i m, __m256i count);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
