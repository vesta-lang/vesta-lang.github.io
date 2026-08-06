---
summary: Multiply Packed Doubleword Integers
---

## Descripción

Multiplicas empaquetados de integers de doble palabra firmados en los elementos de referencia uniformemente numerados (con base en cero) del primer operando de origen con los enteros de doble palabra firmados empaquetados en los elementos correspondientes del segundo operando de origen y las tiendas empaquetadas firmadas cuádwords resultados en el operando de destino.

128-bit Legacy SSE versión: Los enteros de doble palabra firmados son tomados de los elementos numerados de los operandos de origen, es decir, el primer (bajo) y tercer elemento de doble palabra. Para 128 bits operandos de memoria, 128 bits son sacados de la memoria, pero sólo las primeras y terceras palabras dobles se utilizan en el cálculo. El primer operando de origen y el destino XMM operando es el mismo. El segundo operando de origen puede ser un registro XMM o ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente no se modifican.

VEX.128 versión codificada: Los enteros de doble palabra firmados son tomados de los elementos numerados de los operandos de origen, es decir, el primer (bajo) y tercer elemento de doble palabra. Para 128 bits operandos de memoria, 128 bits son sacados de la memoria, pero sólo las primeras y terceras palabras dobles se utilizan en el cálculo.el primer operando de origen y el operando de destino son registros XMM. El segundo operando de origen puede ser un registro XMM o ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX.256 versión codificada: Los enteros de doblepalabra firmados son tomados de los elementos numerados de los operandos de origen, es decir, el primer, 3, 5to, 7o elemento de doblepalabra. Para 256-bit operandos de memoria, 256 bits son sacados de la memoria, pero sólo las cuatro dobles incluso numeradas se utilizan en la computación. El primer operando de origen y el operando de destino son registros YMM. El segundo operando de origen puede ser un registro YMM o 256-bit ubicación de memoria. Bits (MAXVL-1:256) del destino correspondiente ZMM registro se ponen a cero.

EVEX versión codificada: Los enteros de doble palabra firmados son tomados de los elementos numerados de los operandos de origen. El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El destino es un registro ZMM/YMM/XMM y actualizado según la máscara de escritura a 64 bits de granularidad.

## Operación

```text
VPMULDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SignExtend64( SRC1[i+31:i]) * SignExtend64( SRC2[31:0])

                  ELSE DEST[i+63:i] := SignExtend64( SRC1[i+31:i]) * SignExtend64( SRC2[i+31:i])

             FI;

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPMULDQ (VEX.256 Encoded Version)
DEST[63:0] := SignExtend64( SRC1[31:0]) * SignExtend64( SRC2[31:0])
DEST[127:64] := SignExtend64( SRC1[95:64]) * SignExtend64( SRC2[95:64])
DEST[191:128] := SignExtend64( SRC1[159:128]) * SignExtend64( SRC2[159:128])
DEST[255:192] := SignExtend64( SRC1[223:192]) * SignExtend64( SRC2[223:192])
DEST[MAXVL-1:256] := 0

VPMULDQ (VEX.128 Encoded Version)
DEST[63:0] := SignExtend64( SRC1[31:0]) * SignExtend64( SRC2[31:0])
DEST[127:64] := SignExtend64( SRC1[95:64]) * SignExtend64( SRC2[95:64])
DEST[MAXVL-1:128] := 0

PMULDQ (128-bit Legacy SSE Version)
DEST[63:0] := SignExtend64( DEST[31:0]) * SignExtend64( SRC[31:0])
DEST[127:64] := SignExtend64( DEST[95:64]) * SignExtend64( SRC[95:64])
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VPMULDQ __m512i _mm512_mul_epi32(__m512i a, __m512i b);
VPMULDQ __m512i _mm512_mask_mul_epi32(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMULDQ __m512i _mm512_maskz_mul_epi32( __mmask8 k, __m512i a, __m512i b);
VPMULDQ __m256i _mm256_mask_mul_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMULDQ __m256i _mm256_mask_mul_epi32( __mmask8 k, __m256i a, __m256i b);
VPMULDQ __m128i _mm_mask_mul_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULDQ __m128i _mm_mask_mul_epi32( __mmask8 k, __m128i a, __m128i b);
(V)PMULDQ __m128i _mm_mul_epi32( __m128i a, __m128i b);
VPMULDQ __m256i _mm256_mul_epi32( __m256i a, __m256i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
