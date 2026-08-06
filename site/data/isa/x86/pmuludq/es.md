---
summary: Multiply Packed Doubleword Integers
---

## Descripción

Multiplica el primer operando (operando de destino) por el segundo operando (operando de origen) y almacena el resultado en el operando de destino.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión 64-bit operando: El operando de origen puede ser un entero de doble palabra sin firmar almacenado en la palabra doble baja de un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino puede ser un entero de doble palabra sin firmar almacenado en el doblepapapato bajo un registro de tecnología MMX. El resultado es un no firmado

quadword integer almacenado en el destino un registro de tecnología MMX. Cuando un resultado de quadword es demasiado grande para ser representado en 64 bits (sobreflujo), el resultado se envuelve alrededor y los 64 bits bajos se escriben al elemento de destino (es decir, el porte es ignorado).

Para operandos de memoria de 64 bits, 64 bits son sacados de la memoria, pero sólo la palabra doble baja se utiliza en la computación.

128-bit Legacy SSE versión: El segundo operando de origen es dos enteros de doble palabra empaquetados almacenados en los primeros (bajo) y terceras palabras dobles de un registro XMM o una ubicación de memoria de 128 bits. Para 128 bits operandos de memoria, 128 bits son sacados de la memoria, pero sólo las primeras y terceras palabras dobles se utilizan en el cálculo. El primer operando de origen es dos enteros de doble palabra empaquetados almacenados en las primeras y terceras palabras dobles de un registro XMM. El destino contiene dos enteros de quadword sin asignar almacenados en un registro XMM. Bits (MAXVL- 1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: El segundo operando de origen es dos enteros de doble palabra empaquetados almacenados en los primeros (bajo) y terceras palabras dobles de un registro XMM o una ubicación de memoria de 128 bits. Para 128 bits operandos de memoria, 128 bits son sacados de la memoria, pero sólo las primeras y terceras palabras dobles se utilizan en el cálculo. El primer operando de origen es dos enteros de doble palabra empaquetados almacenados en las primeras y terceras palabras dobles de un registro XMM. El destino contiene dos enteros de quadword sin asignar almacenados en un registro XMM. Bits (MAXVL- 1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El segundo operando de origen es cuatro enteros de doble palabra embalados almacenados en el primer (bajo), tercero, quinto y séptimo de un registro YMM o una ubicación de memoria de 256 bits. Para 256-bit operandos de memoria, 256 bits son sacados de la memoria, pero sólo las primeras, tercera, quinta y séptima doble palabras se utilizan en la computación. El primer operando de origen es cuatro enteros de doble palabra embalados almacenados en las primeras, tercera, quinta y séptima dobles palabras de un registro YMM. El destino contiene cuatro enteros de quadword no alineados almacenados en un registro YMM.

EVEX versión codificada: Los números integers de doblepalabra no firmados son tomados de los elementos numerados de los operandos de origen. El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El destino es un registro ZMM/YMM/XMM y actualizado según la máscara de escritura a 64 bits de granularidad.

## Operación

```text
PMULUDQ (With 64-Bit Operands)
    DEST[63:0] := DEST[31:0]  SRC[31:0];

PMULUDQ (With 128-Bit Operands)
    DEST[63:0] := DEST[31:0]  SRC[31:0];
    DEST[127:64] := DEST[95:64]  SRC[95:64];

VPMULUDQ (VEX.128 Encoded Version)
DEST[63:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:64] := SRC1[95:64] * SRC2[95:64]
DEST[MAXVL-1:128] := 0

VPMULUDQ (VEX.256 Encoded Version)
DEST[63:0] := SRC1[31:0] * SRC2[31:0]
DEST[127:64] := SRC1[95:64] * SRC2[95:64
DEST[191:128] := SRC1[159:128] * SRC2[159:128]
DEST[255:192] := SRC1[223:192] * SRC2[223:192]
DEST[MAXVL-1:256] := 0


VPMULUDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := ZeroExtend64( SRC1[i+31:i]) * ZeroExtend64( SRC2[31:0] )

                  ELSE DEST[i+63:i] := ZeroExtend64( SRC1[i+31:i]) * ZeroExtend64( SRC2[i+31:i] )

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMULUDQ __m512i _mm512_mul_epu32(__m512i a, __m512i b);
VPMULUDQ __m512i _mm512_mask_mul_epu32(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPMULUDQ __m512i _mm512_maskz_mul_epu32( __mmask8 k, __m512i a, __m512i b);
VPMULUDQ __m256i _mm256_mask_mul_epu32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPMULUDQ __m256i _mm256_maskz_mul_epu32( __mmask8 k, __m256i a, __m256i b);
VPMULUDQ __m128i _mm_mask_mul_epu32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULUDQ __m128i _mm_maskz_mul_epu32( __mmask8 k, __m128i a, __m128i b);
PMULUDQ __m64 _mm_mul_su32 (__m64 a, __m64 b) (V)PMULUDQ __m128i _mm_mul_epu32 ( __m128i a, __m128i b) VPMULUDQ __m256i _mm256_mul_epu32( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Tabla 2-51, "Tipo E4 Condiciones de Excepción de Clase".
