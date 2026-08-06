---
summary: Mochila e Interleave High valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza un paquete entrelazado de la alta valores en coma flotante de precisión doble del primer operando de origen y el segundo operando de origen. Ver Figura 4-15 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados. Al desempacar desde un operando de memoria, una implementación puede buscar sólo los 64 bits apropiados; sin embargo, la alineación a los límites de 16 bytes y la comprobación normal de segmentos seguirá siendo aplicada.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM. El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

## Operación

```text
VUNPCKHPD (EVEX Encoded Versions When SRC2 is a Register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF VL >= 128

     TMP_DEST[63:0] := SRC1[127:64]

     TMP_DEST[127:64] := SRC2[127:64]

FI;

IF VL >= 256

     TMP_DEST[191:128] := SRC1[255:192]

     TMP_DEST[255:192] := SRC2[255:192]

FI;

IF VL >= 512

     TMP_DEST[319:256] := SRC1[383:320]

     TMP_DEST[383:320] := SRC2[383:320]

     TMP_DEST[447:384] := SRC1[511:448]

     TMP_DEST[511:448] := SRC2[511:448]

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VUNPCKHPD (EVEX Encoded Version When SRC2 is Memory)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF (EVEX.b = 1)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]
          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]
    FI;
ENDFOR;
IF VL >= 128
    TMP_DEST[63:0] := SRC1[127:64]
    TMP_DEST[127:64] := TMP_SRC2[127:64]
FI;
IF VL >= 256
    TMP_DEST[191:128] := SRC1[255:192]
    TMP_DEST[255:192] := TMP_SRC2[255:192]
FI;
IF VL >= 512
    TMP_DEST[319:256] := SRC1[383:320]
    TMP_DEST[383:320] := TMP_SRC2[383:320]
    TMP_DEST[447:384] := SRC1[511:448]
    TMP_DEST[511:448] := TMP_SRC2[511:448]
FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VUNPCKHPD (VEX.256 Encoded Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[191:128] := SRC1[255:192]
DEST[255:192] := SRC2[255:192]
DEST[MAXVL-1:256] := 0

VUNPCKHPD (VEX.128 Encoded Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[MAXVL-1:128] := 0

UNPCKHPD (128-bit Legacy SSE Version)
DEST[63:0] := SRC1[127:64]
DEST[127:64] := SRC2[127:64]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VUNPCKHPD __m512d _mm512_unpackhi_pd( __m512d a, __m512d b);
VUNPCKHPD __m512d _mm512_mask_unpackhi_pd(__m512d s, __mmask8 k, __m512d a, __m512d b);
VUNPCKHPD __m512d _mm512_maskz_unpackhi_pd(__mmask8 k, __m512d a, __m512d b);
VUNPCKHPD __m256d _mm256_unpackhi_pd(__m256d a, __m256d b) VUNPCKHPD __m256d _mm256_mask_unpackhi_pd(__m256d s, __mmask8 k, __m256d a, __m256d b);
VUNPCKHPD __m256d _mm256_maskz_unpackhi_pd(__mmask8 k, __m256d a, __m256d b);
UNPCKHPD __m128d _mm_unpackhi_pd(__m128d a, __m128d b) VUNPCKHPD __m128d _mm_mask_unpackhi_pd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VUNPCKHPD __m128d _mm_maskz_unpackhi_pd(__mmask8 k, __m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no código EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
