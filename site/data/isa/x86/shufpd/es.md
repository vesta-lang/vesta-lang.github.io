---
summary: Empaquetado Interleave Shuffle de Parejas de valores en coma flotante de precisión doble
---

## Descripción

Selecciona un valor en coma flotante de precisión doble de un par de entrada utilizando un poco de control y pasar a un elemento designado del operando de destino. El orden bajo a alto del elemento de doble precisión del operando de destino está entrelazado entre el primer operando de origen y el segundo operando de origen en la granularidad de los pares de entrada de 128 bits. Cada bit en el byte imm8, a partir del bit 0, es el control selecto del elemento correspondiente del destino para recibir el resultado deslumbrado de un par de entrada.

EVEX versiones codificadas: El primer operando de origen es un registro ZMM/YMM/XMM. La segunda fuente puede ser un ZMM/YMM/XMM registro, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits El destino operand es un ZMM/YMM/XMM registro actualizado de acuerdo con el escribmask. Los controles selectos son los 8/4/2 bits inferiores del byte imm8.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM. Los controles selectos son el bit 3:0 del byte imm8, imm8[7:4) son ignorados.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Las partes superiores (MAXVL-1:128) de

el destino de registro ZMM correspondiente se ponen a cero. Los controles selectos son el bit 1:0 del byte imm8, imm8[7:2) son ignorados.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino y el primer operando de origen es el mismo y es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente son sin modificar. Los controles selectos son el bit 1:0 del byte imm8, imm8[7:2) son ignorados.

SRC1  X3        X2                                                                    X1  X0

SRC2  Y3        Y2                                                                    Y1  Y0

DEST  Y2 or Y3  X2 or X3                                        Y0 or Y1                  X0 or X1

Figura 4-25. 256-bit VSHUFPD Operación de cuatro pares de valores en coma flotante de precisión doble

## Operación

```text
VSHUFPD (EVEX Encoded Versions When SRC2 is a Vector Register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF IMM0[0] = 0

    THEN TMP_DEST[63:0] := SRC1[63:0]
    ELSE TMP_DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN TMP_DEST[127:64] := SRC2[63:0]
    ELSE TMP_DEST[127:64] := SRC2[127:64] FI;
IF VL >= 256
    IF IMM0[2] = 0

          THEN TMP_DEST[191:128] := SRC1[191:128]
          ELSE TMP_DEST[191:128] := SRC1[255:192] FI;
    IF IMM0[3] = 0
          THEN TMP_DEST[255:192] := SRC2[191:128]
          ELSE TMP_DEST[255:192] := SRC2[255:192] FI;
FI;
IF VL >= 512
    IF IMM0[4] = 0
          THEN TMP_DEST[319:256] := SRC1[319:256]
          ELSE TMP_DEST[319:256] := SRC1[383:320] FI;
    IF IMM0[5] = 0
          THEN TMP_DEST[383:320] := SRC2[319:256]
          ELSE TMP_DEST[383:320] := SRC2[383:320] FI;
    IF IMM0[6] = 0
          THEN TMP_DEST[447:384] := SRC1[447:384]
          ELSE TMP_DEST[447:384] := SRC1[511:448] FI;
    IF IMM0[7] = 0
          THEN TMP_DEST[511:448] := SRC2[447:384]
          ELSE TMP_DEST[511:448] := SRC2[511:448] FI;
FI;
FOR j := 0 TO KL-1
    i := j * 64


IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

        IF *merging-masking*                ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*          ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFPD (EVEX Encoded Versions When SRC2 is Memory)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF (EVEX.b = 1)
          THEN TMP_SRC2[i+63:i] := SRC2[63:0]
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]
    FI;

ENDFOR;
IF IMM0[0] = 0

    THEN TMP_DEST[63:0] := SRC1[63:0]
    ELSE TMP_DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN TMP_DEST[127:64] := TMP_SRC2[63:0]
    ELSE TMP_DEST[127:64] := TMP_SRC2[127:64] FI;
IF VL >= 256
    IF IMM0[2] = 0

          THEN TMP_DEST[191:128] := SRC1[191:128]
          ELSE TMP_DEST[191:128] := SRC1[255:192] FI;
    IF IMM0[3] = 0
          THEN TMP_DEST[255:192] := TMP_SRC2[191:128]
          ELSE TMP_DEST[255:192] := TMP_SRC2[255:192] FI;
FI;
IF VL >= 512
    IF IMM0[4] = 0
          THEN TMP_DEST[319:256] := SRC1[319:256]
          ELSE TMP_DEST[319:256] := SRC1[383:320] FI;
    IF IMM0[5] = 0
          THEN TMP_DEST[383:320] := TMP_SRC2[319:256]
          ELSE TMP_DEST[383:320] := TMP_SRC2[383:320] FI;
    IF IMM0[6] = 0
          THEN TMP_DEST[447:384] := SRC1[447:384]
          ELSE TMP_DEST[447:384] := SRC1[511:448] FI;
    IF IMM0[7] = 0
          THEN TMP_DEST[511:448] := TMP_SRC2[447:384]
          ELSE TMP_DEST[511:448] := TMP_SRC2[511:448] FI;
FI;
FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]


     ELSE

        IF *merging-masking*                 ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*           ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFPD (VEX.256 Encoded Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
IF IMM0[2] = 0
    THEN DEST[191:128] := SRC1[191:128]
    ELSE DEST[191:128] := SRC1[255:192] FI;
IF IMM0[3] = 0
    THEN DEST[255:192] := SRC2[191:128]
    ELSE DEST[255:192] := SRC2[255:192] FI;
DEST[MAXVL-1:256] (Unmodified)

VSHUFPD (VEX.128 Encoded Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
DEST[MAXVL-1:128] := 0

VSHUFPD (128-bit Legacy SSE Version)
IF IMM0[0] = 0

    THEN DEST[63:0] := SRC1[63:0]
    ELSE DEST[63:0] := SRC1[127:64] FI;
IF IMM0[1] = 0
    THEN DEST[127:64] := SRC2[63:0]
    ELSE DEST[127:64] := SRC2[127:64] FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VSHUFPD __m512d _mm512_shuffle_pd(__m512d a, __m512d b, int imm);
VSHUFPD __m512d _mm512_mask_shuffle_pd(__m512d s, __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFPD __m512d _mm512_maskz_shuffle_pd( __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFPD __m256d _mm256_shuffle_pd (__m256d a, __m256d b, const int select);
VSHUFPD __m256d _mm256_mask_shuffle_pd(__m256d s, __mmask8 k, __m256d a, __m256d b, int imm);
VSHUFPD __m256d _mm256_maskz_shuffle_pd( __mmask8 k, __m256d a, __m256d b, int imm);
SHUFPD __m128d _mm_shuffle_pd (__m128d a, __m128d b, const int select);
VSHUFPD __m128d _mm_mask_shuffle_pd(__m128d s, __mmask8 k, __m128d a, __m128d b, int imm);
VSHUFPD __m128d _mm_maskz_shuffle_pd( __mmask8 k, __m128d a, __m128d b, int imm);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
