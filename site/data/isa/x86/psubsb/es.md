---
summary: Subtract Packed enteros con signo Con la saturación firmada
---

## Descripción

Realiza un subtracto SIMD del enteros con signo empaquetado del operando de origen (segundo operando) del enteros con signo empaquetado del operando de destino (primer operando), y almacena los resultados del entero empaquetado en el operando de destino. Ver Figura 9-4 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD. El desbordamiento se maneja con la saturación firmada, como se describe en los párrafos siguientes.

Los subtractos de instrucción (V)PSUBSB empaquetados de enteros firmados. Cuando un resultado de byte individual está más allá de la gama de un entero de byte firmado (es decir, mayor que 7FH o menos que 80H), el valor saturado de 7FH o 80H, respectivamente, está escrito al operando de destino.

La instrucción (V)PSUBSW subtracts packed sign word integers. Cuando un resultado de palabra individual está más allá de la gama de una palabra firmada entero (es decir, mayor que 7FFFH o menos que 8000H), el valor saturado de 7FFFH o 8000H, respectivamente, está escrito al operando de destino.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de destino debe ser un registro de tecnología MMX y el operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versiones codificadas: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX versión codificada: El segundo operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El primer operando de origen y operandos de destino son los registros ZMM/YMM/XMM. El destino está actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
PSUBSB (With 64-bit Operands)
    DEST[7:0] := SaturateToSignedByte (DEST[7:0] - SRC (7:0]);
    (* Repeat subtract operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToSignedByte (DEST[63:56] - SRC[63:56] );


PSUBSW (With 64-bit Operands)
    DEST[15:0] := SaturateToSignedWord (DEST[15:0] - SRC[15:0] );
    (* Repeat subtract operation for 2nd and 7th words *)
    DEST[63:48] := SaturateToSignedWord (DEST[63:48] - SRC[63:48] );

VPSUBSB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8;

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToSignedByte (SRC1[i+7:i] - SRC2[i+7:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPSUBSW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToSignedWord (SRC1[i+15:i] - SRC2[i+15:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSUBSB (VEX.256 Encoded Version)
DEST[7:0] := SaturateToSignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 31th bytes *)
DEST[255:248] := SaturateToSignedByte (SRC1[255:248] - SRC2[255:248]);
DEST[MAXVL-1:256] := 0;

VPSUBSB (VEX.128 Encoded Version)
DEST[7:0] := SaturateToSignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToSignedByte (SRC1[127:120] - SRC2[127:120]);
DEST[MAXVL-1:128] := 0;

PSUBSB (128-bit Legacy SSE Version)
DEST[7:0] := SaturateToSignedByte (DEST[7:0] - SRC[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToSignedByte (DEST[127:120] - SRC[127:120]);
DEST[MAXVL-1:128] (Unmodified);


VPSUBSW (VEX.256 Encoded Version)
DEST[15:0] := SaturateToSignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 15th words *)
DEST[255:240] := SaturateToSignedWord (SRC1[255:240] - SRC2[255:240]);
DEST[MAXVL-1:256] := 0;

VPSUBSW (VEX.128 Encoded Version)
DEST[15:0] := SaturateToSignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToSignedWord (SRC1[127:112] - SRC2[127:112]);
DEST[MAXVL-1:128] := 0;

PSUBSW (128-bit Legacy SSE Version)
DEST[15:0] := SaturateToSignedWord (DEST[15:0] - SRC[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToSignedWord (DEST[127:112] - SRC[127:112]);
DEST[MAXVL-1:128] (Unmodified);
```

## Intel C/C++ compilador intrínseco

```c
VPSUBSB __m512i _mm512_subs_epi8(__m512i a, __m512i b);
VPSUBSB __m512i _mm512_mask_subs_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSUBSB __m512i _mm512_maskz_subs_epi8( __mmask64 k, __m512i a, __m512i b);
VPSUBSB __m256i _mm256_mask_subs_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSUBSB __m256i _mm256_maskz_subs_epi8( __mmask32 k, __m256i a, __m256i b);
VPSUBSB __m128i _mm_mask_subs_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSUBSB __m128i _mm_maskz_subs_epi8( __mmask16 k, __m128i a, __m128i b);
VPSUBSW __m512i _mm512_subs_epi16(__m512i a, __m512i b);
VPSUBSW __m512i _mm512_mask_subs_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPSUBSW __m512i _mm512_maskz_subs_epi16( __mmask32 k, __m512i a, __m512i b);
VPSUBSW __m256i _mm256_mask_subs_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPSUBSW __m256i _mm256_maskz_subs_epi16( __mmask16 k, __m256i a, __m256i b);
VPSUBSW __m128i _mm_mask_subs_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPSUBSW __m128i _mm_maskz_subs_epi16( __mmask8 k, __m128i a, __m128i b);
PSUBSB __m64 _mm_subs_pi8(__m64 m1, __m64 m2) (V)PSUBSB __m128i _mm_subs_epi8(__m128i m1, __m128i m2) VPSUBSB __m256i _mm256_subs_epi8(__m256i m1, __m256i m2) PSUBSW __m64 _mm_subs_pi16(__m64 m1, __m64 m2) (V)PSUBSW __m128i _mm_subs_epi16(__m128i m1, __m128i m2) VPSUBSW __m256i _mm256_subs_epi16(__m256i m1, __m256i m2);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
