---
summary: Permute In-Lane of Pairs of valores en coma flotante de precisión doble
---

## Descripción

(Variable versión de control)

Pares de riesgo de valores en coma flotante de precisión doble en el primer operando de origen (segundo operando), cada uno utilizando un campo de control de 1 bit que reside en el elemento de cuádpago correspondiente del segundo operando de origen (tercer operando). Los resultados permutados se almacenan en el operando de destino (primer operando).

Los bits de control se ubican en el bit 0 de cada elemento de cuádpago (ver Figura 5-24). Cada control determina cuál del elemento fuente en un par de entrada es seleccionado para el elemento de destino. Cada par de elementos fuente debe estar en la misma región de 128 bits que el destino.

EVEX versión: El segundo operando de origen (tercer operando) es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. Los resultados permutados se escriben en el destino bajo la máscara de escritura.

```text
                   SRC1  X3                  X2                                X1                 X0
```

```text
                   DEST  X2..X3              X2..X3                            X0..X1             X0..X1
```

Figura 5-23. Operación VPERMILPD

VEX.256 versión codificada: Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

```text
       255               194 193             127                               66 65   63             21  Bit
```

ignorado

```text
                   ignored sel          ...       ignored sel                              ignored sel
```

```text
                   Control Field 4                   Control Field 2                            Control Field1
```

Figura 5-24. Control de Shuffle VPERMILPD

Versión de control inmediata: Pares de riesgo de valores en coma flotante de precisión doble en el primer operando de origen (segundo operando), cada par utilizando un campo de control de 1 bit en el byte imm8. Cada elemento en el operando de destino (primer operando) usa un poco de control separado del byte imm8.

VEX versión: El operando de origen es un registro YMM/XMM o un 256/128-bit ubicación de memoria y el operando de destino es un registro YMM/XMM. El byte Imm8 proporciona la parte inferior de 4/2 bit como campos de control de riesgo.

EVEX versión: El operando de origen (segundo operando) es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. Los resultados permutados se escriben en el destino bajo la máscara de escritura. El byte Imm8 proporciona la parte inferior de 8/4/2 bit como campos de control de velocidad.

Nota: Para las versiones de imm8, VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b de otra manera la instrucción será

```text
#UD.
```

## Operación

```text
VPERMILPD (EVEX immediate versions)

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC1 *is memory*)

          THEN TMP_SRC1[i+63:i] := SRC1[63:0];

          ELSE TMP_SRC1[i+63:i] := SRC1[i+63:i];

     FI;

ENDFOR;

IF (imm8[0] = 0) THEN TMP_DEST[63:0] := SRC1[63:0]; FI;

IF (imm8[0] = 1) THEN TMP_DEST[63:0] := TMP_SRC1[127:64]; FI;

IF (imm8[1] = 0) THEN TMP_DEST[127:64] := TMP_SRC1[63:0]; FI;

IF (imm8[1] = 1) THEN TMP_DEST[127:64] := TMP_SRC1[127:64]; FI;

IF VL >= 256

     IF (imm8[2] = 0) THEN TMP_DEST[191:128] := TMP_SRC1[191:128]; FI;

     IF (imm8[2] = 1) THEN TMP_DEST[191:128] := TMP_SRC1[255:192]; FI;

     IF (imm8[3] = 0) THEN TMP_DEST[255:192] := TMP_SRC1[191:128]; FI;

     IF (imm8[3] = 1) THEN TMP_DEST[255:192] := TMP_SRC1[255:192]; FI;

FI;

IF VL >= 512

     IF (imm8[4] = 0) THEN TMP_DEST[319:256] := TMP_SRC1[319:256]; FI;

     IF (imm8[4] = 1) THEN TMP_DEST[319:256] := TMP_SRC1[383:320]; FI;

     IF (imm8[5] = 0) THEN TMP_DEST[383:320] := TMP_SRC1[319:256]; FI;

     IF (imm8[5] = 1) THEN TMP_DEST[383:320] := TMP_SRC1[383:320]; FI;

     IF (imm8[6] = 0) THEN TMP_DEST[447:384] := TMP_SRC1[447:384]; FI;

     IF (imm8[6] = 1) THEN TMP_DEST[447:384] := TMP_SRC1[511:448]; FI;

     IF (imm8[7] = 0) THEN TMP_DEST[511:448] := TMP_SRC1[447:384]; FI;

     IF (imm8[7] = 1) THEN TMP_DEST[511:448] := TMP_SRC1[511:448]; FI;

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                        ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPERMILPD (256-bit immediate version)
IF (imm8[0] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (imm8[0] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (imm8[1] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (imm8[1] = 1) THEN DEST[127:64] := SRC1[127:64]
IF (imm8[2] = 0) THEN DEST[191:128] := SRC1[191:128]
IF (imm8[2] = 1) THEN DEST[191:128] := SRC1[255:192]
IF (imm8[3] = 0) THEN DEST[255:192] := SRC1[191:128]
IF (imm8[3] = 1) THEN DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPERMILPD (128-bit immediate version)
IF (imm8[0] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (imm8[0] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (imm8[1] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (imm8[1] = 1) THEN DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VPERMILPD (EVEX variable versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0];
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i];
    FI;
ENDFOR;

IF (TMP_SRC2[1] = 0) THEN TMP_DEST[63:0] := SRC1[63:0]; FI;
IF (TMP_SRC2[1] = 1) THEN TMP_DEST[63:0] := SRC1[127:64]; FI;
IF (TMP_SRC2[65] = 0) THEN TMP_DEST[127:64] := SRC1[63:0]; FI;
IF (TMP_SRC2[65] = 1) THEN TMP_DEST[127:64] := SRC1[127:64]; FI;
IF VL >= 256

    IF (TMP_SRC2[129] = 0) THEN TMP_DEST[191:128] := SRC1[191:128]; FI;
    IF (TMP_SRC2[129] = 1) THEN TMP_DEST[191:128] := SRC1[255:192]; FI;
    IF (TMP_SRC2[193] = 0) THEN TMP_DEST[255:192] := SRC1[191:128]; FI;
    IF (TMP_SRC2[193] = 1) THEN TMP_DEST[255:192] := SRC1[255:192]; FI;
FI;
IF VL >= 512
    IF (TMP_SRC2[257] = 0) THEN TMP_DEST[319:256] := SRC1[319:256]; FI;
    IF (TMP_SRC2[257] = 1) THEN TMP_DEST[319:256] := SRC1[383:320]; FI;
    IF (TMP_SRC2[321] = 0) THEN TMP_DEST[383:320] := SRC1[319:256]; FI;
    IF (TMP_SRC2[321] = 1) THEN TMP_DEST[383:320] := SRC1[383:320]; FI;
    IF (TMP_SRC2[385] = 0) THEN TMP_DEST[447:384] := SRC1[447:384]; FI;
    IF (TMP_SRC2[385] = 1) THEN TMP_DEST[447:384] := SRC1[511:448]; FI;
    IF (TMP_SRC2[449] = 0) THEN TMP_DEST[511:448] := SRC1[447:384]; FI;
    IF (TMP_SRC2[449] = 1) THEN TMP_DEST[511:448] := SRC1[511:448]; FI;
FI;

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE


        IF *merging-masking*    ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPERMILPD (256-bit variable version)
IF (SRC2[1] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (SRC2[1] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (SRC2[65] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (SRC2[65] = 1) THEN DEST[127:64] := SRC1[127:64]
IF (SRC2[129] = 0) THEN DEST[191:128] := SRC1[191:128]
IF (SRC2[129] = 1) THEN DEST[191:128] := SRC1[255:192]
IF (SRC2[193] = 0) THEN DEST[255:192] := SRC1[191:128]
IF (SRC2[193] = 1) THEN DEST[255:192] := SRC1[255:192]
DEST[MAXVL-1:256] := 0

VPERMILPD (128-bit variable version)
IF (SRC2[1] = 0) THEN DEST[63:0] := SRC1[63:0]
IF (SRC2[1] = 1) THEN DEST[63:0] := SRC1[127:64]
IF (SRC2[65] = 0) THEN DEST[127:64] := SRC1[63:0]
IF (SRC2[65] = 1) THEN DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPERMILPD __m512d _mm512_permute_pd( __m512d a, int imm);
VPERMILPD __m512d _mm512_mask_permute_pd(__m512d s, __mmask8 k, __m512d a, int imm);
VPERMILPD __m512d _mm512_maskz_permute_pd( __mmask8 k, __m512d a, int imm);
VPERMILPD __m256d _mm256_mask_permute_pd(__m256d s, __mmask8 k, __m256d a, int imm);
VPERMILPD __m256d _mm256_maskz_permute_pd( __mmask8 k, __m256d a, int imm);
VPERMILPD __m128d _mm_mask_permute_pd(__m128d s, __mmask8 k, __m128d a, int imm);
VPERMILPD __m128d _mm_maskz_permute_pd( __mmask8 k, __m128d a, int imm);
VPERMILPD __m512d _mm512_permutevar_pd( __m512i i, __m512d a);
VPERMILPD __m512d _mm512_mask_permutevar_pd(__m512d s, __mmask8 k, __m512i i, __m512d a);
VPERMILPD __m512d _mm512_maskz_permutevar_pd( __mmask8 k, __m512i i, __m512d a);
VPERMILPD __m256d _mm256_mask_permutevar_pd(__m256d s, __mmask8 k, __m256d i, __m256d a);
VPERMILPD __m256d _mm256_maskz_permutevar_pd( __mmask8 k, __m256d i, __m256d a);
VPERMILPD __m128d _mm_mask_permutevar_pd(__m128d s, __mmask8 k, __m128d i, __m128d a);
VPERMILPD __m128d _mm_maskz_permutevar_pd( __mmask8 k, __m128d i, __m128d a);
VPERMILPD __m128d _mm_permute_pd (__m128d a, int control) VPERMILPD __m256d _mm256_permute_pd (__m256d a, int control) VPERMILPD __m128d _mm_permutevar_pd (__m128d a, __m128i control);
VPERMILPD __m256d _mm256_permutevar_pd (__m256d a, __m256i control);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Additionally:

```text
#UD               If VEX.W = 1.
```

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If either (E)VEX.vvvv != 1111B and with imm8.
```
