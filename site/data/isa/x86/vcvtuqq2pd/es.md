---
summary: Convertir Integers de cuádpago sin asignar en Precisión doble empaquetada
---

## Descripción

Convierte los enteros de cuádpago sin firmar en el operando de origen (segundo operando) a valores en coma flotante de precisión doble empaquetados en el operando de destino (primer operando).

El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTUQQ2PD (EVEX Encoded Version) When SRC Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL == 512) AND (EVEX.b == 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_UQuadInteger_To_Double_Precision_Floating_Point(SRC[i+63:i])

     ELSE

             IF *merging-masking*                 ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR


DEST[MAXVL-1:VL] := 0

VCVTUQQ2PD (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[i+63:i] :=

             Convert_UQuadInteger_To_Double_Precision_Floating_Point(SRC[63:0])

                  ELSE

                    DEST[i+63:i] :=

             Convert_UQuadInteger_To_Double_Precision_Floating_Point(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTUQQ2PD __m512d _mm512_cvtepu64_ps( __m512i a);
VCVTUQQ2PD __m512d _mm512_mask_cvtepu64_ps( __m512d s, __mmask8 k, __m512i a);
VCVTUQQ2PD __m512d _mm512_maskz_cvtepu64_ps( __mmask8 k, __m512i a);
VCVTUQQ2PD __m512d _mm512_cvt_roundepu64_ps( __m512i a, int r);
VCVTUQQ2PD __m512d _mm512_mask_cvt_roundepu64_ps( __m512d s, __mmask8 k, __m512i a, int r);
VCVTUQQ2PD __m512d _mm512_maskz_cvt_roundepu64_ps( __mmask8 k, __m512i a, int r);
VCVTUQQ2PD __m256d _mm256_cvtepu64_ps( __m256i a);
VCVTUQQ2PD __m256d _mm256_mask_cvtepu64_ps( __m256d s, __mmask8 k, __m256i a);
VCVTUQQ2PD __m256d _mm256_maskz_cvtepu64_ps( __mmask8 k, __m256i a);
VCVTUQQ2PD __m128d _mm_cvtepu64_ps( __m128i a);
VCVTUQQ2PD __m128d _mm_mask_cvtepu64_ps( __m128d s, __mmask8 k, __m128i a);
VCVTUQQ2PD __m128d _mm_maskz_cvtepu64_ps( __mmask8 k, __m128i a);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
