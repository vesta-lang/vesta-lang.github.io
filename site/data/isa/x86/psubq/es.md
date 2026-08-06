---
summary: Subtract Packed Quadword Integers
---

## Descripción

Sube el segundo operando (operando de origen) del primer operando (operando de destino) y almacena el resultado en el operando de destino. Cuando se utilizan cuádwords envasadas operandos, se realiza un subtracto SIMD. Cuando un resultado de quadword es demasiado grande para ser representado en 64 bits (sobreflujo), el resultado se envuelve alrededor y los 64 bits bajos se escriben al elemento de destino (es decir, el porte es ignorado).

Tenga en cuenta que la instrucción (V)PSUBQ puede funcionar en enteros no firmados o firmados (notación de dos complementos); sin embargo, no establece bits en el registro EFLAGS para indicar el desbordamiento y/o una carga. Para evitar condiciones de desbordamiento no detectadas, el software debe controlar los rangos de los valores sobre los que opera.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de origen puede ser un entero de cuádpago almacenado en un registro de tecnología MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. El primer operando de origen y operandos de destino son registros XMM. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versiones codificadas: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX codificado VPSUBQ: El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El primer operando de origen y operandos de destino son los registros ZMM/YMM/XMM. El destino está actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
PSUBQ (With 64-Bit Operands)
    DEST[63:0] := DEST[63:0] - SRC[63:0];

PSUBQ (With 128-Bit Operands)

    DEST[63:0] := DEST[63:0] - SRC[63:0];
    DEST[127:64] := DEST[127:64] - SRC[127:64];

VPSUBQ (VEX.128 Encoded Version)
DEST[63:0] := SRC1[63:0]-SRC2[63:0]
DEST[127:64] := SRC1[127:64]-SRC2[127:64]
DEST[MAXVL-1:128] := 0

VPSUBQ (VEX.256 Encoded Version)
DEST[63:0] := SRC1[63:0]-SRC2[63:0]
DEST[127:64] := SRC1[127:64]-SRC2[127:64]
DEST[191:128] := SRC1[191:128]-SRC2[191:128]
DEST[255:192] := SRC1[255:192]-SRC2[255:192]
DEST[MAXVL-1:256] := 0

VPSUBQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] - SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] - SRC2[i+63:i]

             FI;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSUBQ __m512i _mm512_sub_epi64(__m512i a, __m512i b);
VPSUBQ __m512i _mm512_mask_sub_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPSUBQ __m512i _mm512_maskz_sub_epi64( __mmask8 k, __m512i a, __m512i b);
VPSUBQ __m256i _mm256_mask_sub_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPSUBQ __m256i _mm256_maskz_sub_epi64( __mmask8 k, __m256i a, __m256i b);
VPSUBQ __m128i _mm_mask_sub_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPSUBQ __m128i _mm_maskz_sub_epi64( __mmask8 k, __m128i a, __m128i b);
PSUBQ __m64 _mm_sub_si64(__m64 m1, __m64 m2) (V)PSUBQ __m128i _mm_sub_epi64(__m128i m1, __m128i m2) VPSUBQ __m256i _mm256_sub_epi64(__m256i m1, __m256i m2);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX codificado VPSUBQ, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
