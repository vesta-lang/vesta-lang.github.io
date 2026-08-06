---
summary: Convertir Integers de Quadword Packed en coma flotante de precisión simple empacado
---

## Descripción

Convierte los enteros de cuadripado en el operando de origen (segundo operando) para empaquetar los valores de punto flotante de precisión simple en el operando de destino (primer operando). El operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. La operación de destino es un YMM/XMM/XMM (más de 64 bits) registro actualizado condicionalmente con máscara de escritura k1. EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VCVTQQ2PS (EVEX Encoded Versions) When SRC Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[i+63:i])

     ELSE

             IF *merging-masking*              ; merging-masking

                 THEN *DEST[k+31:k] remains unchanged*

                 ELSE                          ; zeroing-masking

                    DEST[k+31:k] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0


VCVTQQ2PS (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[63:0])

                  ELSE

                    DEST[k+31:k] :=

             Convert_QuadInteger_To_Single_Precision_Floating_Point(SRC[i+63:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[k+31:k] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[k+31:k] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTQQ2PS __m256 _mm512_cvtepi64_ps( __m512i a);
VCVTQQ2PS __m256 _mm512_mask_cvtepi64_ps( __m256 s, __mmask16 k, __m512i a);
VCVTQQ2PS __m256 _mm512_maskz_cvtepi64_ps( __mmask16 k, __m512i a);
VCVTQQ2PS __m256 _mm512_cvt_roundepi64_ps( __m512i a, int r);
VCVTQQ2PS __m256 _mm512_mask_cvt_roundepi_ps( __m256 s, __mmask8 k, __m512i a, int r);
VCVTQQ2PS __m256 _mm512_maskz_cvt_roundepi64_ps( __mmask8 k, __m512i a, int r);
VCVTQQ2PS __m128 _mm256_cvtepi64_ps( __m256i a);
VCVTQQ2PS __m128 _mm256_mask_cvtepi64_ps( __m128 s, __mmask8 k, __m256i a);
VCVTQQ2PS __m128 _mm256_maskz_cvtepi64_ps( __mmask8 k, __m256i a);
VCVTQQ2PS __m128 _mm_cvtepi64_ps( __m128i a);
VCVTQQ2PS __m128 _mm_mask_cvtepi64_ps( __m128 s, __mmask8 k, __m128i a);
VCVTQQ2PS __m128 _mm_maskz_cvtepi64_ps( __mmask8 k, __m128i a);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
