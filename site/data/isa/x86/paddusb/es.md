---
summary: Añadir Packed enteros sin signo Con Saturación Insignia
---

## Descripción

Realiza una adición SIMD de los enteros sin signo empaquetada del operando de origen (segundo operando) y el operando de destino (primer operando), y almacena los resultados del entero empaquetado en el operando de destino. Ver Figura 9-4 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD. El desbordamiento se maneja con saturación insignia, como se describe en los párrafos siguientes.

(V)PADDUSB realiza una adición de SIMD empaquetado enteros sin signo con saturación del primer operando de origen y segundo operando de origen y almacena los resultados del entero empaquetado en el operando de destino. Cuando un resultado de byte individual está más allá de la gama de un entero de byte sin firma (es decir, mayor que FFH), el valor saturado de FFH está escrito al operando de destino.

(V)PADDUSW realiza una adición SIMD de los enteros de palabras sin firma empaquetados con saturación del primer operando de origen y segundo operando de origen y almacena los resultados enteros empaquetados en el operando de destino. Cuando un resultado de palabra individual está más allá de la gama de un entero de palabras sin firma (es decir, mayor que FFFFH), el valor saturado de FFFFH está escrito al operando de destino.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El destino es un registro ZMM/YMM/XMM.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino correspondiente del registro de destino se ponen a cero.

128-bit Legacy SSE versión: El primer operando de origen es un registro XMM. El segundo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro correspondiente son sin modificar.

## Operación

```text
PADDUSB (With 64-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte(DEST[7:0] + SRC (7:0] );
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToUnsignedByte(DEST[63:56] + SRC[63:56]

PADDUSB (With 128-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] + SRC[7:0]);
    (* Repeat add operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToUnSignedByte (DEST[127:120] + SRC[127:120]);

VPADDUSB (VEX.128 Encoded Version)
    DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat subtract operation for 2nd through 14th bytes *)
    DEST[127:120] := SaturateToUnsignedByte (SRC1[111:120] + SRC2[127:120]);
    DEST[MAXVL-1:128] := 0


VPADDUSB (VEX.256 Encoded Version)
    DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] + SRC2[7:0]);
    (* Repeat add operation for 2nd through 31st bytes *)
    DEST[255:248] := SaturateToUnsignedByte (SRC1[255:248] + SRC2[255:248]);

PADDUSW (With 64-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord(DEST[15:0] + SRC[15:0] );
    (* Repeat add operation for 2nd and 3rd words *)
    DEST[63:48] := SaturateToUnsignedWord(DEST[63:48] + SRC[63:48] );

PADDUSW (With 128-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] + SRC[15:0]);
    (* Repeat add operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToUnSignedWord (DEST[127:112] + SRC[127:112]);

VPADDUSW (VEX.128 Encoded Version)
    DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat subtract operation for 2nd through 7th words *)
    DEST[127:112] := SaturateToUnsignedWord (SRC1[127:112] + SRC2[127:112]);
    DEST[MAXVL-1:128] := 0

VPADDUSW (VEX.256 Encoded Version)
    DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] + SRC2[15:0]);
    (* Repeat add operation for 2nd through 15th words *)
    DEST[255:240] := SaturateToUnsignedWord (SRC1[255:240] + SRC2[255:240])

VPADDUSB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToUnsignedByte (SRC1[i+7:i] + SRC2[i+7:i])

     ELSE

            IF *merging-masking*            ; merging-masking

                THEN *DEST[i+7:i] remains unchanged*

                ELSE *zeroing-masking*      ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPADDUSW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToUnsignedWord (SRC1[i+15:i] + SRC2[i+15:i])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*    ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
PADDUSB __m64 _mm_adds_pu8(__m64 m1, __m64 m2) PADDUSW __m64 _mm_adds_pu16(__m64 m1, __m64 m2) (V)PADDUSB __m128i _mm_adds_epu8 ( __m128i a, __m128i b) (V)PADDUSW __m128i _mm_adds_epu16 ( __m128i a, __m128i b) VPADDUSB __m256i _mm256_adds_epu8 ( __m256i a, __m256i b) VPADDUSW __m256i _mm256_adds_epu16 ( __m256i a, __m256i b) VPADDUSB __m512i _mm512_adds_epu8 ( __m512i a, __m512i b) VPADDUSW __m512i _mm512_adds_epu16 ( __m512i a, __m512i b) VPADDUSB __m512i _mm512_mask_adds_epu8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDUSW __m512i _mm512_mask_adds_epu16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDUSB __m512i _mm512_maskz_adds_epu8 (__mmask64 m, __m512i a, __m512i b) VPADDUSW __m512i _mm512_maskz_adds_epu16 (__mmask32 m, __m512i a, __m512i b) VPADDUSB __m256i _mm256_mask_adds_epu8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDUSW __m256i _mm256_mask_adds_epu16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDUSB __m256i _mm256_maskz_adds_epu8 (__mmask32 m, __m256i a, __m256i b) VPADDUSW __m256i _mm256_maskz_adds_epu16 (__mmask16 m, __m256i a, __m256i b) VPADDUSB __m128i _mm_mask_adds_epu8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDUSW __m128i _mm_mask_adds_epu16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDUSB __m128i _mm_maskz_adds_epu8 (__mmask16 m, __m128i a, __m128i b) VPADDUSW __m128i _mm_maskz_adds_epu16 (__mmask8 m, __m128i a, __m128i b);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4.nb en Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
