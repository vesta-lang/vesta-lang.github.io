---
summary: Añadir Packed Integers
---

## Descripción

Realiza una adición SIMD de los enteros empaquetados del operando de origen (segundo operando) y el operando de destino (primer operando), y almacena los resultados del entero empaquetado en el operando de destino. Ver Figura 9-4 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD. El desbordamiento se maneja con envoltura, como se describe en los párrafos siguientes.

Las instrucciones PADDB y VPADDB añaden enteros de byte del primer operando de origen y segundo operando de origen y almacenan los resultados de enteros empaquetados en el operando de destino. Cuando un resultado individual es demasiado grande para ser representado en 8 bits (sobreflujo), el resultado se envuelve alrededor y los 8 bits bajos se escriben al operando de destino (es decir, el porte es ignorado).

Las instrucciones PADDW y VPADDW añaden enteros de palabras empaquetados del primer operando de origen y segundo operando de origen y almacenan los resultados de enteros empaquetados en el operando de destino. Cuando un resultado individual es demasiado grande

estar representado en 16 bits (sobreflujo), el resultado se envuelve alrededor y los 16 bits bajos se escriben al operando de destino (es decir, el porte es ignorado).

Las instrucciones de PADDD y VPADDD añaden enteros de doble palabra del primer operando de origen y segundo operando de origen y almacenan los resultados del entero empaquetado en el operando de destino. Cuando un resultado individual es demasiado grande para ser representado en 32 bits (sobreflujo), el resultado se envuelve alrededor y los 32 bits bajos se escriben al operando de destino (es decir, el porte es ignorado).

Las instrucciones de PADDQ y VPADDQ agregan enteros de cuadripado del primer operando de origen y segundo operando de origen y almacenan los resultados de enteros empaquetados en el operando de destino. Cuando un resultado de cuádword es demasiado grande para ser representado en 64 bits (sobreflujo), el resultado se envuelve alrededor y los 64 bits bajos se escriben al operando de destino (es decir, el porte es ignorado).

Tenga en cuenta que las instrucciones (V)PADDB, (V)PADDW, (V)PADDD y (V)PADDQ pueden funcionar en los enteros empaquetados o no firmados (notación de dos complementos), sin embargo, no establece bits en el registro EFLAGS para indicar el desbordamiento y/o una carga. Para evitar condiciones de desbordamiento no detectadas, el software debe controlar los rangos de valores operados en.

EVEX codificado VPADDD/Q: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura.

EVEX codificado VPADDB/W: El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM actualizado según la máscara de escritura.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. los bits superiores (MAXVL-1:256) del destino se limpian.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: El primer operando de origen es un registro XMM. El segundo operando puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados.

## Operación

```text
PADDB (With 64-bit Operands)
    DEST[7:0] := DEST[7:0] + SRC[7:0];
    (* Repeat add operation for 2nd through 7th byte *)
    DEST[63:56] := DEST[63:56] + SRC[63:56];

PADDW (With 64-bit Operands)
    DEST[15:0] := DEST[15:0] + SRC[15:0];
    (* Repeat add operation for 2nd and 3th word *)
    DEST[63:48] := DEST[63:48] + SRC[63:48];

PADDD (With 64-bit Operands)
    DEST[31:0] := DEST[31:0] + SRC[31:0];
    DEST[63:32] := DEST[63:32] + SRC[63:32];

PADDQ (With 64-Bit Operands)
    DEST[63:0] := DEST[63:0] + SRC[63:0];


PADDB (Legacy SSE Instruction)
    DEST[7:0] := DEST[7:0] + SRC[7:0];
    (* Repeat add operation for 2nd through 15th byte *)
    DEST[127:120] := DEST[127:120] + SRC[127:120];
    DEST[MAXVL-1:128] (Unmodified)

PADDW (Legacy SSE Instruction)
    DEST[15:0] := DEST[15:0] + SRC[15:0];
    (* Repeat add operation for 2nd through 7th word *)
    DEST[127:112] := DEST[127:112] + SRC[127:112];
    DEST[MAXVL-1:128] (Unmodified)

PADDD (Legacy SSE Instruction)
    DEST[31:0] := DEST[31:0] + SRC[31:0];
    (* Repeat add operation for 2nd and 3th doubleword *)
    DEST[127:96] := DEST[127:96] + SRC[127:96];
    DEST[MAXVL-1:128] (Unmodified)

PADDQ (Legacy SSE Instruction)
    DEST[63:0] := DEST[63:0] + SRC[63:0];
    DEST[127:64] := DEST[127:64] + SRC[127:64];
    DEST[MAXVL-1:128] (Unmodified)

VPADDB (VEX.128 Encoded Instruction)
    DEST[7:0] := SRC1[7:0] + SRC2[7:0];
    (* Repeat add operation for 2nd through 15th byte *)
    DEST[127:120] := SRC1[127:120] + SRC2[127:120];
    DEST[MAXVL-1:128] := 0;

VPADDW (VEX.128 Encoded Instruction)
    DEST[15:0] := SRC1[15:0] + SRC2[15:0];
    (* Repeat add operation for 2nd through 7th word *)
    DEST[127:112] := SRC1[127:112] + SRC2[127:112];
    DEST[MAXVL-1:128] := 0;

VPADDD (VEX.128 Encoded Instruction)
    DEST[31:0] := SRC1[31:0] + SRC2[31:0];
    (* Repeat add operation for 2nd and 3th doubleword *)
    DEST[127:96] := SRC1[127:96] + SRC2[127:96];
    DEST[MAXVL-1:128] := 0;

VPADDQ (VEX.128 Encoded Instruction)
    DEST[63:0] := SRC1[63:0] + SRC2[63:0];
    DEST[127:64] := SRC1[127:64] + SRC2[127:64];
    DEST[MAXVL-1:128] := 0;

VPADDB (VEX.256 Encoded Instruction)
    DEST[7:0] := SRC1[7:0] + SRC2[7:0];
    (* Repeat add operation for 2nd through 31th byte *)
    DEST[255:248] := SRC1[255:248] + SRC2[255:248];


VPADDW (VEX.256 Encoded Instruction)
    DEST[15:0] := SRC1[15:0] + SRC2[15:0];
    (* Repeat add operation for 2nd through 15th word *)
    DEST[255:240] := SRC1[255:240] + SRC2[255:240];

VPADDD (VEX.256 Encoded Instruction)
    DEST[31:0] := SRC1[31:0] + SRC2[31:0];
    (* Repeat add operation for 2nd and 7th doubleword *)
    DEST[255:224] := SRC1[255:224] + SRC2[255:224];

VPADDQ (VEX.256 Encoded Instruction)
    DEST[63:0] := SRC1[63:0] + SRC2[63:0];
    DEST[127:64] := SRC1[127:64] + SRC2[127:64];
    DEST[191:128] := SRC1[191:128] + SRC2[191:128];
    DEST[255:192] := SRC1[255:192] + SRC2[255:192];

VPADDB (EVEX Encoded Versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC1[i+7:i] + SRC2[i+7:i]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+7:i] remains unchanged*

                 ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+7:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPADDW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC1[i+15:i] + SRC2[i+15:i]

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+15:i] remains unchanged*

                 ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+15:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0


VPADDD (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+31:i] := SRC1[i+31:i] + SRC2[31:0]

                  ELSE DEST[i+31:i] := SRC1[i+31:i] + SRC2[i+31:i]

             FI;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VPADDQ (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := SRC1[i+63:i] + SRC2[63:0]

                  ELSE DEST[i+63:i] := SRC1[i+63:i] + SRC2[i+63:i]

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
VPADDB__m512i _mm512_add_epi8 ( __m512i a, __m512i b) VPADDW__m512i _mm512_add_epi16 ( __m512i a, __m512i b) VPADDB__m512i _mm512_mask_add_epi8 ( __m512i s, __mmask64 m, __m512i a, __m512i b) VPADDW__m512i _mm512_mask_add_epi16 ( __m512i s, __mmask32 m, __m512i a, __m512i b) VPADDB__m512i _mm512_maskz_add_epi8 (__mmask64 m, __m512i a, __m512i b) VPADDW__m512i _mm512_maskz_add_epi16 (__mmask32 m, __m512i a, __m512i b) VPADDB__m256i _mm256_mask_add_epi8 (__m256i s, __mmask32 m, __m256i a, __m256i b) VPADDW__m256i _mm256_mask_add_epi16 (__m256i s, __mmask16 m, __m256i a, __m256i b) VPADDB__m256i _mm256_maskz_add_epi8 (__mmask32 m, __m256i a, __m256i b) VPADDW__m256i _mm256_maskz_add_epi16 (__mmask16 m, __m256i a, __m256i b) VPADDB__m128i _mm_mask_add_epi8 (__m128i s, __mmask16 m, __m128i a, __m128i b) VPADDW__m128i _mm_mask_add_epi16 (__m128i s, __mmask8 m, __m128i a, __m128i b) VPADDB__m128i _mm_maskz_add_epi8 (__mmask16 m, __m128i a, __m128i b) VPADDW__m128i _mm_maskz_add_epi16 (__mmask8 m, __m128i a, __m128i b) VPADDD __m512i _mm512_add_epi32( __m512i a, __m512i b);
VPADDD __m512i _mm512_mask_add_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b);
VPADDD __m512i _mm512_maskz_add_epi32( __mmask16 k, __m512i a, __m512i b);
VPADDD __m256i _mm256_mask_add_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPADDD __m256i _mm256_maskz_add_epi32( __mmask8 k, __m256i a, __m256i b);
VPADDD __m128i _mm_mask_add_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPADDD __m128i _mm_maskz_add_epi32( __mmask8 k, __m128i a, __m128i b);
VPADDQ __m512i _mm512_add_epi64( __m512i a, __m512i b);
VPADDQ __m512i _mm512_mask_add_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b);
VPADDQ __m512i _mm512_maskz_add_epi64( __mmask8 k, __m512i a, __m512i b);
VPADDQ __m256i _mm256_mask_add_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b);
VPADDQ __m256i _mm256_maskz_add_epi64( __mmask8 k, __m256i a, __m256i b);
VPADDQ __m128i _mm_mask_add_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPADDQ __m128i _mm_maskz_add_epi64( __mmask8 k, __m128i a, __m128i b);
PADDB __m128i _mm_add_epi8 (__m128i a,__m128i b );
PADDW __m128i _mm_add_epi16 ( __m128i a, __m128i b);
PADDD __m128i _mm_add_epi32 ( __m128i a, __m128i b);
PADDQ __m128i _mm_add_epi64 ( __m128i a, __m128i b);
VPADDB __m256i _mm256_add_epi8 (__m256ia,__m256i b );
VPADDW __m256i _mm256_add_epi16 ( __m256i a, __m256i b);
VPADDD __m256i _mm256_add_epi32 ( __m256i a, __m256i b);
VPADDQ __m256i _mm256_add_epi64 ( __m256i a, __m256i b);
PADDB __m64 _mm_add_pi8(__m64 m1, __m64 m2) PADDW __m64 _mm_add_pi16(__m64 m1, __m64 m2) PADDD __m64 _mm_add_pi32(__m64 m1, __m64 m2) PADDQ __m64 _mm_add_si64(__m64 m1, __m64 m2);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

EVEX-encoded VPADDD/Q, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

EVEX-encoded VPADDB/W, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
