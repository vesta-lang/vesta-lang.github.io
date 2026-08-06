---
summary: Cambio de bits variable derecho lógica
---

## Descripción

Cambia los bits en los elementos de datos individuales (palabras, palabras dobles o cuádpalabra) en el primer operando de origen a la derecha por el valor contable de los elementos de datos respectivos en el segundo operando de origen. A medida que los bits de los elementos de datos se desplazan a la derecha, los bits vacíos de alto orden se limpian (configurado a 0).

Los valores de cuenta se especifican individualmente en cada elemento de datos del segundo operando de origen. Si el valor entero no firmado especificado en el elemento de datos respectivo del segundo operando de origen es mayor de 15 (por palabra), 31 (para palabras dobles), o 63 (para un quadword), entonces el elemento de datos de destino se escribe con 0.

VEX.128 versión codificada: El destino y el primer operandos de origen son los registros XMM. El conteo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 versión codificada: El destino y el primer operandos de origen son los registros YMM. El conteo operando puede ser un registro YMM o una memoria de 256 bits. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX codificado VPSRLVD/Q: El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El recuento operando puede ser un ZMM/YMM/XMM registrado, una ubicación de memoria de 512/256/128 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. El destino está actualizado condicionalmente con máscara de escritura k1.

EVEX codificado VPSRLVW: El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El conteo operando puede ser un ZMM/YMM/XMM registro, un 512/256/128-bit ubicación de memoria. El destino está actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
VPSRLVW (EVEX encoded version)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := ZeroExtend(SRC1[i+15:i] >> SRC2[i+15:i])

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;


VPSRLVD (VEX.128 version)
COUNT_0 := SRC2[31 : 0]

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[127 : 96];
IF COUNT_0 < 32 THEN

    DEST[31:0] := ZeroExtend(SRC1[31:0] >> COUNT_0);
ELSE

    DEST[31:0] := 0;
    (* Repeat shift operation for 2nd through 4th dwords *)
IF COUNT_3 < 32 THEN
    DEST[127:96] := ZeroExtend(SRC1[127:96] >> COUNT_3);
ELSE
    DEST[127:96] := 0;
DEST[MAXVL-1:128] := 0;

VPSRLVD (VEX.256 version)
COUNT_0 := SRC2[31 : 0];

    (* Repeat Each COUNT_i for the 2nd through 7th dwords of SRC2*)
COUNT_7 := SRC2[255 : 224];
IF COUNT_0 < 32 THEN
DEST[31:0] := ZeroExtend(SRC1[31:0] >> COUNT_0);
ELSE
DEST[31:0] := 0;

    (* Repeat shift operation for 2nd through 7th dwords *)
IF COUNT_7 < 32 THEN

    DEST[255:224] := ZeroExtend(SRC1[255:224] >> COUNT_7);
ELSE

    DEST[255:224] := 0;
DEST[MAXVL-1:256] := 0;

VPSRLVD (EVEX encoded version)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := ZeroExtend(SRC1[i+31:i] >> SRC2[31:0])

                  ELSE DEST[i+31:i] := ZeroExtend(SRC1[i+31:i] >> SRC2[i+31:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                    ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;


VPSRLVQ (VEX.128 version)
COUNT_0 := SRC2[63 : 0];
COUNT_1 := SRC2[127 : 64];
IF COUNT_0 < 64 THEN

    DEST[63:0] := ZeroExtend(SRC1[63:0] >> COUNT_0);
ELSE

    DEST[63:0] := 0;
IF COUNT_1 < 64 THEN

    DEST[127:64] := ZeroExtend(SRC1[127:64] >> COUNT_1);
ELSE

    DEST[127:64] := 0;
DEST[MAXVL-1:128] := 0;

VPSRLVQ (VEX.256 version)
COUNT_0 := SRC2[63 : 0];

    (* Repeat Each COUNT_i for the 2nd through 4th dwords of SRC2*)
COUNT_3 := SRC2[255 : 192];
IF COUNT_0 < 64 THEN
DEST[63:0] := ZeroExtend(SRC1[63:0] >> COUNT_0);
ELSE
DEST[63:0] := 0;

    (* Repeat shift operation for 2nd through 4th dwords *)
IF COUNT_3 < 64 THEN

    DEST[255:192] := ZeroExtend(SRC1[255:192] >> COUNT_3);
ELSE

    DEST[255:192] := 0;
DEST[MAXVL-1:256] := 0;

VPSRLVQ (EVEX encoded version)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := ZeroExtend(SRC1[i+63:i] >> SRC2[63:0])

                  ELSE DEST[i+63:i] := ZeroExtend(SRC1[i+63:i] >> SRC2[i+63:i])

             FI;

     ELSE

             IF *merging-masking*        ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                   ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPSRLVW __m512i _mm512_srlv_epi16(__m512i a, __m512i cnt);
VPSRLVW __m512i _mm512_mask_srlv_epi16(__m512i s, __mmask32 k, __m512i a, __m512i cnt);
VPSRLVW __m512i _mm512_maskz_srlv_epi16( __mmask32 k, __m512i a, __m512i cnt);
VPSRLVW __m256i _mm256_mask_srlv_epi16(__m256i s, __mmask16 k, __m256i a, __m256i cnt);
VPSRLVW __m256i _mm256_maskz_srlv_epi16( __mmask16 k, __m256i a, __m256i cnt);
VPSRLVW __m128i _mm_mask_srlv_epi16(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRLVW __m128i _mm_maskz_srlv_epi16( __mmask8 k, __m128i a, __m128i cnt);
VPSRLVW __m256i _mm256_srlv_epi32 (__m256i m, __m256i count) VPSRLVD __m512i _mm512_srlv_epi32(__m512i a, __m512i cnt);
VPSRLVD __m512i _mm512_mask_srlv_epi32(__m512i s, __mmask16 k, __m512i a, __m512i cnt);
VPSRLVD __m512i _mm512_maskz_srlv_epi32( __mmask16 k, __m512i a, __m512i cnt);
VPSRLVD __m256i _mm256_mask_srlv_epi32(__m256i s, __mmask8 k, __m256i a, __m256i cnt);
VPSRLVD __m256i _mm256_maskz_srlv_epi32( __mmask8 k, __m256i a, __m256i cnt);
VPSRLVD __m128i _mm_mask_srlv_epi32(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRLVD __m128i _mm_maskz_srlv_epi32( __mmask8 k, __m128i a, __m128i cnt);
VPSRLVQ __m512i _mm512_srlv_epi64(__m512i a, __m512i cnt);
VPSRLVQ __m512i _mm512_mask_srlv_epi64(__m512i s, __mmask8 k, __m512i a, __m512i cnt);
VPSRLVQ __m512i _mm512_maskz_srlv_epi64( __mmask8 k, __m512i a, __m512i cnt);
VPSRLVQ __m256i _mm256_mask_srlv_epi64(__m256i s, __mmask8 k, __m256i a, __m256i cnt);
VPSRLVQ __m256i _mm256_maskz_srlv_epi64( __mmask8 k, __m256i a, __m256i cnt);
VPSRLVQ __m128i _mm_mask_srlv_epi64(__m128i s, __mmask8 k, __m128i a, __m128i cnt);
VPSRLVQ __m128i _mm_maskz_srlv_epi64( __mmask8 k, __m128i a, __m128i cnt);
VPSRLVQ __m256i _mm256_srlv_epi64 (__m256i m, __m256i count) VPSRLVD __m128i _mm_srlv_epi32( __m128i a, __m128i cnt);
VPSRLVQ __m128i _mm_srlv_epi64( __m128i a, __m128i cnt);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

EVEX-encoded VPSRLVD/Q, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

EVEX-encoded VPSRLVW, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
