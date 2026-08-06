---
summary: Multiply y Add Packed Integers
---

## Descripción

Multiplica las palabras firmadas individuales del operando de destino (primer operando) por las palabras firmadas correspondientes del operando de origen (segundo operando), produciendo resultados temporales firmados, de doble palabra. Los resultados de la palabra doble adyacente se resumen y almacenan en el operando de destino. Por ejemplo, las palabras de orden inferior correspondientes (15-0) y (31-16) en la fuente y operandos de destino se multiplican entre sí y los resultados de la palabra doble se agregan y almacenan en la palabra doble baja del registro de destino (31-0). La misma operación se realiza en los otros pares de palabras adyacentes. (Figura 4-11 muestra esta operación al usar operandos de 64 bits).

La instrucción (V)PMADDWD se envuelve sólo en una situación: cuando los 2 pares de palabras que se están operando en un grupo son todos 8000H. En este caso, el resultado se envuelve a 80000000H.

En modo de 64 bits y no codificado con VEX/EVEX, utilizando un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Legacy SSE versión: La primera fuente y operandos de destino son registros MMX. El segundo operando de origen es un registro MMX o una ubicación de memoria de 64 bits.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

VEX.256 versión codificada: El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. La primera fuente y operandos de destino son registros YMM.

EVEX.512 versión codificada: El segundo operando de origen puede ser un registro ZMM o una ubicación de memoria de 512 bits. La primera fuente y operandos de destino son registros ZMM.

```text
                                           SRC   X3  X2      X1  X0
```

DEST

```text
                                                 Y3  Y2      Y1  Y0
```

TEMP  X3  Y3                                         X2  Y2      X1  Y1           X0  Y0

```text
                                           DEST  (X3Y3) + (X2Y2) (X1Y1) + (X0Y0)
```

Figura 4-11. Modelo de ejecución PMADDWD Usando operandos de 64 bits

## Operación

```text
PMADDWD (With 64-bit Operands)
    DEST[31:0] := (DEST[15:0]  SRC[15:0]) + (DEST[31:16]  SRC[31:16]);
    DEST[63:32] := (DEST[47:32]  SRC[47:32]) + (DEST[63:48]  SRC[63:48]);

PMADDWD (With 128-bit Operands)
    DEST[31:0] := (DEST[15:0]  SRC[15:0]) + (DEST[31:16]  SRC[31:16]);
    DEST[63:32] := (DEST[47:32]  SRC[47:32]) + (DEST[63:48]  SRC[63:48]);
    DEST[95:64] := (DEST[79:64]  SRC[79:64]) + (DEST[95:80]  SRC[95:80]);
    DEST[127:96] := (DEST[111:96]  SRC[111:96]) + (DEST[127:112]  SRC[127:112]);

VPMADDWD (VEX.128 Encoded Version)
DEST[31:0] := (SRC1[15:0] * SRC2[15:0]) + (SRC1[31:16] * SRC2[31:16])
DEST[63:32] := (SRC1[47:32] * SRC2[47:32]) + (SRC1[63:48] * SRC2[63:48])
DEST[95:64] := (SRC1[79:64] * SRC2[79:64]) + (SRC1[95:80] * SRC2[95:80])
DEST[127:96] := (SRC1[111:96] * SRC2[111:96]) + (SRC1[127:112] * SRC2[127:112])
DEST[MAXVL-1:128] := 0


VPMADDWD (VEX.256 Encoded Version)
DEST[31:0] := (SRC1[15:0] * SRC2[15:0]) + (SRC1[31:16] * SRC2[31:16])
DEST[63:32] := (SRC1[47:32] * SRC2[47:32]) + (SRC1[63:48] * SRC2[63:48])
DEST[95:64] := (SRC1[79:64] * SRC2[79:64]) + (SRC1[95:80] * SRC2[95:80])
DEST[127:96] := (SRC1[111:96] * SRC2[111:96]) + (SRC1[127:112] * SRC2[127:112])
DEST[159:128] := (SRC1[143:128] * SRC2[143:128]) + (SRC1[159:144] * SRC2[159:144])
DEST[191:160] := (SRC1[175:160] * SRC2[175:160]) + (SRC1[191:176] * SRC2[191:176])
DEST[223:192] := (SRC1[207:192] * SRC2[207:192]) + (SRC1[223:208] * SRC2[223:208])
DEST[255:224] := (SRC1[239:224] * SRC2[239:224]) + (SRC1[255:240] * SRC2[255:240])
DEST[MAXVL-1:256] := 0

VPMADDWD (EVEX Encoded Versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := (SRC2[i+31:i+16]* SRC1[i+31:i+16]) + (SRC2[i+15:i]*SRC1[i+15:i])

     ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*    ; zeroing-masking

                    DEST[i+31:i] = 0

             FI

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMADDWD __m512i _mm512_madd_epi16( __m512i a, __m512i b);
VPMADDWD __m512i _mm512_mask_madd_epi16(__m512i s, __mmask32 k, __m512i a, __m512i b);
VPMADDWD __m512i _mm512_maskz_madd_epi16( __mmask32 k, __m512i a, __m512i b);
VPMADDWD __m256i _mm256_mask_madd_epi16(__m256i s, __mmask16 k, __m256i a, __m256i b);
VPMADDWD __m256i _mm256_maskz_madd_epi16( __mmask16 k, __m256i a, __m256i b);
VPMADDWD __m128i _mm_mask_madd_epi16(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMADDWD __m128i _mm_maskz_madd_epi16( __mmask8 k, __m128i a, __m128i b);
PMADDWD __m64 _mm_madd_pi16(__m64 m1, __m64 m2) (V)PMADDWD __m128i _mm_madd_epi16 ( __m128i a, __m128i b) VPMADDWD __m256i _mm256_madd_epi16 ( __m256i a, __m256i b);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4NF.nb en Tabla 2-52, "Tipo E4NF Condiciones de Excepción de Clase".
