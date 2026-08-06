---
summary: Añadir Packed enteros con signo con la saturación firmada
---

## Descripción

Realiza una adición SIMD de los enteros con signo empaquetada del operando de origen (segundo operando) y el operando de destino (primer operando), y almacena los resultados del entero empaquetado en el operando de destino. Ver Figura 9-4 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD. El desbordamiento se maneja con la saturación firmada, como se describe en los párrafos siguientes.

(V)PADDSB realiza una adición de SIMD empaquetado enteros con signo con saturación del primer operando de origen y segundo operando de origen y almacena los resultados del entero empaquetado en el operando de destino. Cuando un resultado de byte individual está más allá de la gama de un entero de byte firmado (es decir, mayor que 7FH o menos que 80H), el valor saturado de 7FH o 80H, respectivamente, está escrito al operando de destino.

(V)PADDSW realiza una adición SIMD de los enteros de palabras firmadas empaquetados con saturación del primer operando de origen y segundo operando de origen y almacena los resultados de enteros empaquetados en el operando de destino. Cuando un resultado de palabra individual está más allá de la gama de una palabra firmada entero (es decir, mayor que 7FFFH o menos que 8000H), el valor saturado de 7FFFH o 8000H, respectivamente, está escrito al operando de destino.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM o una ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro correspondiente se ponen a cero.

128-bit Legacy SSE versión: El primer operando de origen es un registro XMM. El segundo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente son sin modificar.

## Operación

```text
PADDSB (With 64-bit Operands)
    DEST[7:0] := SaturateToSignedByte(DEST[7:0] + SRC (7:0]);
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToSignedByte(DEST[63:56] + SRC[63:56] );

PADDSB (With 128-bit Operands)
    DEST[7:0] := SaturateToSignedByte (DEST[7:0] + SRC[7:0]);
    (* Repeat add operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToSignedByte (DEST[111:120] + SRC[127:120]);

VPADDSB (VEX.128 Encoded Version)
    DEST[7:0] := SaturateToSignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat subtract operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToSignedByte (SRC1[111:120] + SRC2[127:120]);
    DEST[MAXVL-1:128] := 0

VPADDSB (VEX.256 Encoded Version)
    DEST[7:0] := SaturateToSignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat add operation for 2nd through 31st bytes *)
    DEST[255:248] := SaturateToSignedByte (SRC1[255:248] + SRC2[255:248]);


VPADDSB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToSignedByte (SRC1[i+7:i] + SRC2[i+7:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

PADDSW (with 64-bit operands)
    DEST[15:0] := SaturateToSignedWord(DEST[15:0] + SRC[15:0] );
    (* Repeat add operation for 2nd and 7th words *)
    DEST[63:48] := SaturateToSignedWord(DEST[63:48] + SRC[63:48] );

PADDSW (with 128-bit operands)
    DEST[15:0] := SaturateToSignedWord (DEST[15:0] + SRC[15:0]);
    (* Repeat add operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToSignedWord (DEST[127:112] + SRC[127:112]);

VPADDSW (VEX.128 Encoded Version)
    DEST[15:0] := SaturateToSignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat subtract operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToSignedWord (SRC1[127:112] + SRC2[127:112]);
    DEST[MAXVL-1:128] := 0

VPADDSW (VEX.256 Encoded Version)
    DEST[15:0] := SaturateToSignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat add operation for 2nd through 15th words *)
    DEST[255:240] := SaturateToSignedWord (SRC1[255:240] + SRC2[255:240])

VPADDSW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToSignedWord (SRC1[i+15:i] + SRC2[i+15:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
PADDSB __m64 _mm_adds_pi8(__m64 m1, __m64 m2) (V)PADDSB __m128i _mm_adds_epi8 ( __m128i a, __m128i b) VPADDSB __m256i _mm256_adds_epi8 ( __m256i a, __m256i b) PADDSW __m64 _mm_adds_pi16(__m64 m1, __m64 m2) (V)PADDSW __m128i _mm_adds_epi16 ( __m128i a, __m128i b) VPADDSW __m256i _mm256_adds_epi16 ( __m256i a, __m256i b) VPADDSB __m512i _mm512_adds_epi8 ( __m512i a, __m512i b) VPADDSW __m512i _mm512_adds_epi16 ( __m512i a, __m512i b) VPADDSB __m512i _mm512_mask_adds_epi8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDSW __m512i _mm512_mask_adds_epi16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDSB __m512i _mm512_maskz_adds_epi8 (__mmask64 m, __m512i a, __m512i b) VPADDSW __m512i _mm512_maskz_adds_epi16 (__mmask32 m, __m512i a, __m512i b) VPADDSB __m256i _mm256_mask_adds_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDSW __m256i _mm256_mask_adds_epi16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDSB __m256i _mm256_maskz_adds_epi8 (__mmask32 m, __m256i a, __m256i b) VPADDSW __m256i _mm256_maskz_adds_epi16 (__mmask16 m, __m256i a, __m256i b) VPADDSB __m128i _mm_mask_adds_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDSW __m128i _mm_mask_adds_epi16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDSB __m128i _mm_maskz_adds_epi8 (__mmask16 m, __m128i a, __m128i b) VPADDSW __m128i _mm_maskz_adds_epi16 (__mmask8 m, __m128i a, __m128i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
