---
summary: Exclusivo lógico
---

## Descripción

Realiza una operación lógica poco a poco exclusiva-OR (XOR) en el operando de origen (segundo operando) y el operando de destino (primer operando) y almacena el resultado en el operando de destino. Cada bit del resultado es 1 si los bits correspondientes de los dos operandos son diferentes; cada bit es 0 si los bits correspondientes de los operandos son los mismos.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE instrucciones 64-bit operando: El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX.

128-bit Legacy SSE versión: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los bits superiores (MAXVL-1:256) del destino de registro correspondiente se ponen a cero.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
PXOR (64-bit Operand)
DEST := DEST XOR SRC

PXOR (128-bit Legacy SSE Version)
DEST := DEST XOR SRC
DEST[MAXVL-1:128] (Unmodified)

VPXOR (VEX.128 Encoded Version)
DEST := SRC1 XOR SRC2
DEST[MAXVL-1:128] := 0

VPXOR (VEX.256 Encoded Version)
DEST := SRC1 XOR SRC2
DEST[MAXVL-1:256] := 0

VPXORD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] BITWISE XOR SRC2[i+31:i]

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[31:0] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[31:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPXORQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] BITWISE XOR SRC2[i+63:i]

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[63:0] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[63:0] := 0

     FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPXORD __m512i _mm512_xor_epi32(__m512i a, __m512i b) VPXORD __m512i _mm512_mask_xor_epi32(__m512i s, __mmask16 m, __m512i a, __m512i b) VPXORD __m512i _mm512_maskz_xor_epi32( __mmask16 m, __m512i a, __m512i b) VPXORD __m256i _mm256_xor_epi32(__m256i a, __m256i b) VPXORD __m256i _mm256_mask_xor_epi32(__m256i s, __mmask8 m, __m256i a, __m256i b) VPXORD __m256i _mm256_maskz_xor_epi32( __mmask8 m, __m256i a, __m256i b) VPXORD __m128i _mm_xor_epi32(__m128i a, __m128i b) VPXORD __m128i _mm_mask_xor_epi32(__m128i s, __mmask8 m, __m128i a, __m128i b) VPXORD __m128i _mm_maskz_xor_epi32( __mmask16 m, __m128i a, __m128i b) VPXORQ __m512i _mm512_xor_epi64( __m512i a, __m512i b);
VPXORQ __m512i _mm512_mask_xor_epi64(__m512i s, __mmask8 m, __m512i a, __m512i b);
VPXORQ __m512i _mm512_maskz_xor_epi64(__mmask8 m, __m512i a, __m512i b);
VPXORQ __m256i _mm256_xor_epi64( __m256i a, __m256i b);
VPXORQ __m256i _mm256_mask_xor_epi64(__m256i s, __mmask8 m, __m256i a, __m256i b);
VPXORQ __m256i _mm256_maskz_xor_epi64(__mmask8 m, __m256i a, __m256i b);
VPXORQ __m128i _mm_xor_epi64( __m128i a, __m128i b);
VPXORQ __m128i _mm_mask_xor_epi64(__m128i s, __mmask8 m, __m128i a, __m128i b);
VPXORQ __m128i _mm_maskz_xor_epi64(__mmask8 m, __m128i a, __m128i b);
PXOR:__m64 _mm_xor_si64 (__m64 m1, __m64 m2) (V)PXOR:__m128i _mm_xor_si128 ( __m128i a, __m128i b) VPXOR:__m256i _mm256_xor_si256 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
