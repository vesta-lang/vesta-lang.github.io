---
summary: Mochila e Interleave High valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza un paquete entrelazado de la alta valores en coma flotante de precisión simple del primer operando de origen y el segundo operando de origen.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados. Al desempacar desde un operando de memoria, una implementación puede buscar sólo los 64 bits apropiados; sin embargo, la alineación a los límites de 16 bytes y la comprobación normal de segmentos seguirá siendo aplicada.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

VEX.256 versión codificada: El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El primer operando de origen y operandos de destino son registros YMM.

SRC1 X7  X6  X5  X4  X3                                                             X2  X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3                                                             Y2  Y1  Y0

DEST Y7  X7  Y6  X6  Y3                                                             X3  Y2  X2

Figura 4-27. Operación VUNPCKHPS

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM. El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

## Operación

```text
VUNPCKHPS (EVEX Encoded Version When SRC2 is a Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL >= 128

    TMP_DEST[31:0] := SRC1[95:64]
    TMP_DEST[63:32] := SRC2[95:64]
    TMP_DEST[95:64] := SRC1[127:96]
    TMP_DEST[127:96] := SRC2[127:96]
FI;
IF VL >= 256
    TMP_DEST[159:128] := SRC1[223:192]
    TMP_DEST[191:160] := SRC2[223:192]
    TMP_DEST[223:192] := SRC1[255:224]
    TMP_DEST[255:224] := SRC2[255:224]
FI;
IF VL >= 512
    TMP_DEST[287:256] := SRC1[351:320]
    TMP_DEST[319:288] := SRC2[351:320]
    TMP_DEST[351:320] := SRC1[383:352]
    TMP_DEST[383:352] := SRC2[383:352]
    TMP_DEST[415:384] := SRC1[479:448]
    TMP_DEST[447:416] := SRC2[479:448]
    TMP_DEST[479:448] := SRC1[511:480]
    TMP_DEST[511:480] := SRC2[511:480]
FI;


FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VUNPCKHPS (EVEX Encoded Version When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

     TMP_DEST[31:0] := SRC1[95:64]

     TMP_DEST[63:32] := TMP_SRC2[95:64]

     TMP_DEST[95:64] := SRC1[127:96]

     TMP_DEST[127:96] := TMP_SRC2[127:96]

FI;

IF VL >= 256

     TMP_DEST[159:128] := SRC1[223:192]

     TMP_DEST[191:160] := TMP_SRC2[223:192]

     TMP_DEST[223:192] := SRC1[255:224]

     TMP_DEST[255:224] := TMP_SRC2[255:224]

FI;

IF VL >= 512

     TMP_DEST[287:256] := SRC1[351:320]

     TMP_DEST[319:288] := TMP_SRC2[351:320]

     TMP_DEST[351:320] := SRC1[383:352]

     TMP_DEST[383:352] := TMP_SRC2[383:352]

     TMP_DEST[415:384] := SRC1[479:448]

     TMP_DEST[447:416] := TMP_SRC2[479:448]

     TMP_DEST[479:448] := SRC1[511:480]

     TMP_DEST[511:480] := TMP_SRC2[511:480]

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0


                FI;
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VUNPCKHPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[159:128] := SRC1[223:192]
DEST[191:160] := SRC2[223:192]
DEST[223:192] := SRC1[255:224]
DEST[255:224] := SRC2[255:224]
DEST[MAXVL-1:256] := 0

VUNPCKHPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[MAXVL-1:128] := 0

UNPCKHPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[95:64]
DEST[63:32] := SRC2[95:64]
DEST[95:64] := SRC1[127:96]
DEST[127:96] := SRC2[127:96]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VUNPCKHPS __m512 _mm512_unpackhi_ps( __m512 a, __m512 b);
VUNPCKHPS __m512 _mm512_mask_unpackhi_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VUNPCKHPS __m512 _mm512_maskz_unpackhi_ps(__mmask16 k, __m512 a, __m512 b);
VUNPCKHPS __m256 _mm256_unpackhi_ps (__m256 a, __m256 b);
VUNPCKHPS __m256 _mm256_mask_unpackhi_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VUNPCKHPS __m256 _mm256_maskz_unpackhi_ps(__mmask8 k, __m256 a, __m256 b);
UNPCKHPS __m128 _mm_unpackhi_ps (__m128 a, __m128 b);
VUNPCKHPS __m128 _mm_mask_unpackhi_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VUNPCKHPS __m128 _mm_maskz_unpackhi_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no código EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
