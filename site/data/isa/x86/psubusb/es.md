---
summary: Subtract Packed enteros sin signo Con Saturación Insignia
---

## Descripción

Realiza un subtracto SIMD del enteros sin signo empaquetado del operando de origen (segundo operando) del enteros sin signo empaquetado del operando de destino (primer operando), y almacena los resultados enteros sin señalización en el operando de destino. Ver Figura 9-4 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD. El desbordamiento se maneja con saturación insignia, como se describe en los párrafos siguientes.

Estas instrucciones pueden funcionar en operandos de 64 bits o 128 bits.

La instrucción (V)PSUBUSB subtracts packed unsigned byte integers. Cuando un resultado de byte individual es inferior a cero, el valor saturado de 00H está escrito al operando de destino.

La instrucción (V)PSUBUSW subtracts packed unsigned word integers. Cuando un resultado de palabra individual es inferior a cero, el valor saturado de 0000H está escrito al operando de destino.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de destino debe ser un registro de tecnología MMX y el operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versiones codificadas: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX versión codificada: El segundo operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El primer operando de origen y operandos de destino son los registros ZMM/YMM/XMM. El destino está actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
PSUBUSB (With 64-bit Operands)
    DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] - SRC (7:0] );
    (* Repeat add operation for 2nd through 7th bytes *)
    DEST[63:56] := SaturateToUnsignedByte (DEST[63:56] - SRC[63:56];


PSUBUSW (With 64-bit Operands)
    DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] - SRC[15:0] );
    (* Repeat add operation for 2nd and 3rd words *)
    DEST[63:48] := SaturateToUnsignedWord (DEST[63:48] - SRC[63:48] );

VPSUBUSB (EVEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8;

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SaturateToUnsignedByte (SRC1[i+7:i] - SRC2[i+7:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+7:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSUBUSW (EVEX Encoded Versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16;

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SaturateToUnsignedWord (SRC1[i+15:i] - SRC2[i+15:i])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+15:i] := 0;

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0;

VPSUBUSB (VEX.256 Encoded Version)
DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 31st bytes *)
DEST[255:148] := SaturateToUnsignedByte (SRC1[255:248] - SRC2[255:248]);
DEST[MAXVL-1:256] := 0;

VPSUBUSB (VEX.128 Encoded Version)
DEST[7:0] := SaturateToUnsignedByte (SRC1[7:0] - SRC2[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToUnsignedByte (SRC1[127:120] - SRC2[127:120]);
DEST[MAXVL-1:128] := 0

PSUBUSB (128-bit Legacy SSE Version)
DEST[7:0] := SaturateToUnsignedByte (DEST[7:0] - SRC[7:0]);
(* Repeat subtract operation for 2nd through 14th bytes *)
DEST[127:120] := SaturateToUnsignedByte (DEST[127:120] - SRC[127:120]);
DEST[MAXVL-1:128] (Unmodified)


VPSUBUSW (VEX.256 Encoded Version)
DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 15th words *)
DEST[255:240] := SaturateToUnsignedWord (SRC1[255:240] - SRC2[255:240]);
DEST[MAXVL-1:256] := 0;

VPSUBUSW (VEX.128 Encoded Version)
DEST[15:0] := SaturateToUnsignedWord (SRC1[15:0] - SRC2[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToUnsignedWord (SRC1[127:112] - SRC2[127:112]);
DEST[MAXVL-1:128] := 0

PSUBUSW (128-bit Legacy SSE Version)
DEST[15:0] := SaturateToUnsignedWord (DEST[15:0] - SRC[15:0]);
(* Repeat subtract operation for 2nd through 7th words *)
DEST[127:112] := SaturateToUnsignedWord (DEST[127:112] - SRC[127:112]);
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VPSUBUSB __m512i _mm512_subs_epu8(__m512i a, __m512i b);
VPSUBUSB __m512i _mm512_mask_subs_epu8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSUBUSB __m512i _mm512_maskz_subs_epu8( __mmask64 k, __m512i a, __m512i b);
VPSUBUSB __m256i _mm256_mask_subs_epu8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSUBUSB __m256i _mm256_maskz_subs_epu8( __mmask32 k, __m256i a, __m256i b);
VPSUBUSB __m128i _mm_mask_subs_epu8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSUBUSB __m128i _mm_maskz_subs_epu8( __mmask16 k, __m128i a, __m128i b);
VPSUBUSW __m512i _mm512_subs_epu16(__m512i a, __m512i b);
VPSUBUSW __m512i _mm512_mask_subs_epu16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPSUBUSW __m512i _mm512_maskz_subs_epu16( __mmask32 k, __m512i a, __m512i b);
VPSUBUSW __m256i _mm256_mask_subs_epu16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPSUBUSW __m256i _mm256_maskz_subs_epu16( __mmask16 k, __m256i a, __m256i b);
VPSUBUSW __m128i _mm_mask_subs_epu16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPSUBUSW __m128i _mm_maskz_subs_epu16( __mmask8 k, __m128i a, __m128i b);
PSUBUSB __m64 _mm_subs_pu8(__m64 m1, __m64 m2) (V)PSUBUSB __m128i _mm_subs_epu8(__m128i m1, __m128i m2) VPSUBUSB __m256i _mm256_subs_epu8(__m256i m1, __m256i m2) PSUBUSW __m64 _mm_subs_pu16(__m64 m1, __m64 m2) (V)PSUBUSW __m128i _mm_subs_epu16(__m128i m1, __m128i m2) VPSUBUSW __m256i _mm256_subs_epu16(__m256i m1, __m256i m2);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
