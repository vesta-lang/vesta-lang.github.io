---
summary: Convertir Integers de doble palabra embalado en coma flotante de precisión simple empacado
---

## Descripción

Convierte cuatro, ocho o dieciséis enteros de doble palabra firmados en el operando de origen a cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados en el operando de destino.

EVEX versiones codificadas: El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El operando de origen es un registro YMM o 256-bit ubicación de memoria. El operando de destino es un registro YMM. Bits (MAXVL-1:256) del destino de registro correspondiente se ponen a cero.

VEX.128 versión codificada: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro correspondiente se ponen a cero.

128-bit Legacy SSE versión: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro correspondiente no están modificados.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTDQ2PS (EVEX Encoded Versions) When SRC Operand is a Register
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC); ; refer to Table 15-4 in the Intel(R) 64 and IA-32 Architectures

Software Developer's Manual, Volume 1
    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC); ; refer to Table 15-4 in the Intel(R) 64 and IA-32 Architectures

Software Developer's Manual, Volume 1
FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] :=

             Convert_Integer_To_Single_Precision_Floating_Point(SRC[i+31:i])

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTDQ2PS (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_Integer_To_Single_Precision_Floating_Point(SRC[i+31:i])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VCVTDQ2PS (VEX.256 Encoded Version)
DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0])
DEST[63:32] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:32])
DEST[95:64] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[95:64])
DEST[127:96] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[127:96)
DEST[159:128] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[159:128])
DEST[191:160] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[191:160])
DEST[223:192] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[223:192])
DEST[255:224] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[255:224)
DEST[MAXVL-1:256] := 0

VCVTDQ2PS (VEX.128 Encoded Version)
DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0])
DEST[63:32] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:32])
DEST[95:64] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[95:64])
DEST[127:96] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[127z:96)
DEST[MAXVL-1:128] := 0

CVTDQ2PS (128-bit Legacy SSE Version)
DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0])
DEST[63:32] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:32])
DEST[95:64] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[95:64])
DEST[127:96] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[127z:96)
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTDQ2PS __m512 _mm512_cvtepi32_ps( __m512i a);
VCVTDQ2PS __m512 _mm512_mask_cvtepi32_ps( __m512 s, __mmask16 k, __m512i a);
VCVTDQ2PS __m512 _mm512_maskz_cvtepi32_ps( __mmask16 k, __m512i a);
VCVTDQ2PS __m512 _mm512_cvt_roundepi32_ps( __m512i a, int r);
VCVTDQ2PS __m512 _mm512_mask_cvt_roundepi_ps( __m512 s, __mmask16 k, __m512i a, int r);
VCVTDQ2PS __m512 _mm512_maskz_cvt_roundepi32_ps( __mmask16 k, __m512i a, int r);
VCVTDQ2PS __m256 _mm256_mask_cvtepi32_ps( __m256 s, __mmask8 k, __m256i a);
VCVTDQ2PS __m256 _mm256_maskz_cvtepi32_ps( __mmask8 k, __m256i a);
VCVTDQ2PS __m128 _mm_mask_cvtepi32_ps( __m128 s, __mmask8 k, __m128i a);
VCVTDQ2PS __m128 _mm_maskz_cvtepi32_ps( __mmask8 k, __m128i a);
CVTDQ2PS __m256 _mm256_cvtepi32_ps (__m256i src) CVTDQ2PS __m128 _mm_cvtepi32_ps (__m128i src);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
