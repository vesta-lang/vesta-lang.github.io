---
summary: Comparar Datos empaquetados para igualar
---

## Descripción

Realiza una comparación SIMD para la igualdad de los bytes, palabras, o palabras dobles en el operando de destino (primer operando) y el operando de origen (segundo operando). Si un par de elementos de datos es igual, el elemento de datos correspondiente en el operando de destino se establece en todos los 1s; de lo contrario, se establece en todos los 0s.

La instrucción (V)PCMPEQB compara los bytes correspondientes en el destino y operandos de origen; la instrucción (V)PCMPEQW compara las palabras correspondientes en el destino y operandos de origen; y la instrucción (V)PCMPEQD compara las palabras dobles correspondientes en el destino y operandos de origen.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE instrucciones: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino puede ser un registro de tecnología MMX.

128-bit Legacy SSE versión: El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino son registros XMM. Bits (MAXVL-1:128) del registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

EVEX codificado VPCMPEQD: El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino (primer operando) es un registro de máscaras actualizado según la máscara de escritura k2.

EVEX codificado VPCMPEQB/W: El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El operando de destino (primer operando) es un registro de máscaras actualizado según la máscara de escritura k2.

## Operación

```text
PCMPEQB (With 64-bit Operands)
    IF DEST[7:0] = SRC[7:0]
          THEN DEST[7:0) := FFH;
          ELSE DEST[7:0] := 0; FI;
    (* Continue comparison of 2nd through 7th bytes in DEST and SRC *)
    IF DEST[63:56] = SRC[63:56]
          THEN DEST[63:56] := FFH;
          ELSE DEST[63:56] := 0; FI;

COMPARE_BYTES_EQUAL (SRC1, SRC2)
    IF SRC1[7:0] = SRC2[7:0]
    THEN DEST[7:0] := FFH;
    ELSE DEST[7:0] := 0; FI;

(* Continue comparison of 2nd through 15th bytes in SRC1 and SRC2 *)
    IF SRC1[127:120] = SRC2[127:120]
    THEN DEST[127:120] := FFH;
    ELSE DEST[127:120] := 0; FI;

COMPARE_WORDS_EQUAL (SRC1, SRC2)
    IF SRC1[15:0] = SRC2[15:0]
    THEN DEST[15:0] := FFFFH;
    ELSE DEST[15:0] := 0; FI;

(* Continue comparison of 2nd through 7th 16-bit words in SRC1 and SRC2 *)
    IF SRC1[127:112] = SRC2[127:112]
    THEN DEST[127:112] := FFFFH;
    ELSE DEST[127:112] := 0; FI;

COMPARE_DWORDS_EQUAL (SRC1, SRC2)
    IF SRC1[31:0] = SRC2[31:0]
    THEN DEST[31:0] := FFFFFFFFH;
    ELSE DEST[31:0] := 0; FI;

(* Continue comparison of 2nd through 3rd 32-bit dwords in SRC1 and SRC2 *)
    IF SRC1[127:96] = SRC2[127:96]
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] := 0; FI;

PCMPEQB (With 128-bit Operands)
DEST[127:0] := COMPARE_BYTES_EQUAL(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)


VPCMPEQB (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_BYTES_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[MAXVL-1:128] := 0

VPCMPEQB (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_BYTES_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_BYTES_EQUAL(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPEQB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            /* signed comparison */

            CMP := SRC1[i+7:i] == SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                      ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

PCMPEQW (With 64-bit Operands)
    IF DEST[15:0] = SRC[15:0]
          THEN DEST[15:0] := FFFFH;

          ELSE DEST[15:0] := 0; FI;

    (* Continue comparison of 2nd and 3rd words in DEST and SRC *)
    IF DEST[63:48] = SRC[63:48]

          THEN DEST[63:48] := FFFFH;

          ELSE DEST[63:48] := 0; FI;

PCMPEQW (With 128-bit Operands)
DEST[127:0] := COMPARE_WORDS_EQUAL(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

VPCMPEQW (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_WORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[MAXVL-1:128] := 0

VPCMPEQW (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_WORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_WORDS_EQUAL(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0


VPCMPEQW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k2[j] OR *no writemask*

     THEN

             /* signed comparison */

             CMP := SRC1[i+15:i] == SRC2[i+15:i];

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                     ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

PCMPEQD (With 64-bit Operands)
    IF DEST[31:0] = SRC[31:0]

          THEN DEST[31:0] := FFFFFFFFH;

          ELSE DEST[31:0] := 0; FI;
    IF DEST[63:32] = SRC[63:32]

          THEN DEST[63:32] := FFFFFFFFH;

          ELSE DEST[63:32] := 0; FI;

PCMPEQD (With 128-bit Operands)
DEST[127:0] := COMPARE_DWORDS_EQUAL(DEST[127:0],SRC[127:0])
DEST[MAXVL-1:128] (Unmodified)

VPCMPEQD (VEX.128 Encoded Version)
DEST[127:0] := COMPARE_DWORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[MAXVL-1:128] := 0

VPCMPEQD (VEX.256 Encoded Version)
DEST[127:0] := COMPARE_DWORDS_EQUAL(SRC1[127:0],SRC2[127:0])
DEST[255:128] := COMPARE_DWORDS_EQUAL(SRC1[255:128],SRC2[255:128])
DEST[MAXVL-1:256] := 0

VPCMPEQD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k2[j] OR *no writemask*

     THEN

             /* signed comparison */

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+31:i] = SRC2[31:0];

                  ELSE CMP := SRC1[i+31:i] = SRC2[i+31:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                     ; zeroing-masking only

FI;

ENDFOR


DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCMPEQB __mmask64 _mm512_cmpeq_epi8_mask(__m512i a, __m512i b);
VPCMPEQB __mmask64 _mm512_mask_cmpeq_epi8_mask(__mmask64 k, __m512i a, __m512i b);
VPCMPEQB __mmask32 _mm256_cmpeq_epi8_mask(__m256i a, __m256i b);
VPCMPEQB __mmask32 _mm256_mask_cmpeq_epi8_mask(__mmask32 k, __m256i a, __m256i b);
VPCMPEQB __mmask16 _mm_cmpeq_epi8_mask(__m128i a, __m128i b);
VPCMPEQB __mmask16 _mm_mask_cmpeq_epi8_mask(__mmask16 k, __m128i a, __m128i b);
VPCMPEQW __mmask32 _mm512_cmpeq_epi16_mask(__m512i a, __m512i b);
VPCMPEQW __mmask32 _mm512_mask_cmpeq_epi16_mask(__mmask32 k, __m512i a, __m512i b);
VPCMPEQW __mmask16 _mm256_cmpeq_epi16_mask(__m256i a, __m256i b);
VPCMPEQW __mmask16 _mm256_mask_cmpeq_epi16_mask(__mmask16 k, __m256i a, __m256i b);
VPCMPEQW __mmask8 _mm_cmpeq_epi16_mask(__m128i a, __m128i b);
VPCMPEQW __mmask8 _mm_mask_cmpeq_epi16_mask(__mmask8 k, __m128i a, __m128i b);
VPCMPEQD __mmask16 _mm512_cmpeq_epi32_mask( __m512i a, __m512i b);
VPCMPEQD __mmask16 _mm512_mask_cmpeq_epi32_mask(__mmask16 k, __m512i a, __m512i b);
VPCMPEQD __mmask8 _mm256_cmpeq_epi32_mask(__m256i a, __m256i b);
VPCMPEQD __mmask8 _mm256_mask_cmpeq_epi32_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPEQD __mmask8 _mm_cmpeq_epi32_mask(__m128i a, __m128i b);
VPCMPEQD __mmask8 _mm_mask_cmpeq_epi32_mask(__mmask8 k, __m128i a, __m128i b);
PCMPEQB __m64 _mm_cmpeq_pi8 (__m64 m1, __m64 m2) PCMPEQW __m64 _mm_cmpeq_pi16 (__m64 m1, __m64 m2) PCMPEQD __m64 _mm_cmpeq_pi32 (__m64 m1, __m64 m2) (V)PCMPEQB __m128i _mm_cmpeq_epi8 ( __m128i a, __m128i b) (V)PCMPEQW __m128i _mm_cmpeq_epi16 ( __m128i a, __m128i b) (V)PCMPEQD __m128i _mm_cmpeq_epi32 ( __m128i a, __m128i b) VPCMPEQB __m256i _mm256_cmpeq_epi8 ( __m256i a, __m256i b) VPCMPEQW __m256i _mm256_cmpeq_epi16 ( __m256i a, __m256i b) VPCMPEQD __m256i _mm256_cmpeq_epi32 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX codificado VPCMPEQD, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

EVEX-encoded VPCMPEQB/W, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
