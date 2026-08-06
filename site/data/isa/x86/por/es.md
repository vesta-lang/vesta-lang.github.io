---
summary: Bitwise Logical OR
---

## Descripción

Realiza una operación OR lógica poco a poco en el operando de origen (segundo operando) y el operando de destino (primer operando) y almacena el resultado en el operando de destino. Cada bit del resultado se establece a 1 si cualquiera o ambos de los bits correspondientes de la primera y segunda operandos son 1; de lo contrario, se establece a 0.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX.

128-bit Legacy SSE versión: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino pueden ser registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. La primera fuente y operandos de destino pueden ser registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. La primera fuente y operandos de destino pueden ser registros YMM.

EVEX versión codificada: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1 a 32/64-bit granularidad.

## Operación

```text
POR (64-bit Operand)
DEST := DEST OR SRC

POR (128-bit Legacy SSE Version)
DEST := DEST OR SRC
DEST[MAXVL-1:128] (Unmodified)

VPOR (VEX.128 Encoded Version)
DEST := SRC1 OR SRC2
DEST[MAXVL-1:128] := 0

VPOR (VEX.256 Encoded Version)
DEST := SRC1 OR SRC2
DEST[MAXVL-1:256] := 0

VPORD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] BITWISE OR SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] BITWISE OR SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*           ; merging-masking

                  *DEST[i+31:i] remains unchanged*

                  ELSE                      ; zeroing-masking

                         DEST[i+31:i] := 0

             FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPORD __m512i _mm512_or_epi32(__m512i a, __m512i b);
VPORD __m512i _mm512_mask_or_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPORD __m512i _mm512_maskz_or_epi32( __mmask16 k, __m512i a, __m512i b);
VPORD __m256i _mm256_or_epi32(__m256i a, __m256i b);
VPORD __m256i _mm256_mask_or_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b,);
VPORD __m256i _mm256_maskz_or_epi32( __mmask8 k, __m256i a, __m256i b);
VPORD __m128i _mm_or_epi32(__m128i a, __m128i b);
VPORD __m128i _mm_mask_or_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPORD __m128i _mm_maskz_or_epi32( __mmask8 k, __m128i a, __m128i b);
VPORQ __m512i _mm512_or_epi64(__m512i a, __m512i b);
VPORQ __m512i _mm512_mask_or_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPORQ __m512i _mm512_maskz_or_epi64(__mmask8 k, __m512i a, __m512i b);
VPORQ __m256i _mm256_or_epi64(__m256i a, int imm);
VPORQ __m256i _mm256_mask_or_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPORQ __m256i _mm256_maskz_or_epi64( __mmask8 k, __m256i a, __m256i b);
VPORQ __m128i _mm_or_epi64(__m128i a, __m128i b);
VPORQ __m128i _mm_mask_or_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPORQ __m128i _mm_maskz_or_epi64( __mmask8 k, __m128i a, __m128i b);
POR __m64 _mm_or_si64(__m64 m1, __m64 m2) (V)POR __m128i _mm_or_si128(__m128i m1, __m128i m2) VPOR __m256i _mm256_or_si256 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
