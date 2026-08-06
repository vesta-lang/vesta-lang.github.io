---
summary: Convertir Integers de doble palabra embalado en coma flotante de precisión doble empacado
---

## Descripción

Convierte dos, cuatro o ocho enteros de doble palabra firmados en el operando de origen (el segundo operando) a dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el operando de destino (el primer operando).

EVEX versiones codificadas: El operando de origen puede ser un registro YMM/XMM/XMM (bajo 64 bits) de 256/128/64-bit ubicación de memoria o un vector de 256/128/64-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1. Se ignora el intento de codificar esta instrucción con redondeo incrustado EVEX.

VEX.256 versión codificada: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro YMM.

VEX.128 versión codificada: El operando de origen es un registro XMM o ubicación de memoria de 64 bits. El operando de destino es un registro XMM. Los Bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: El operando de origen es un registro XMM o ubicación de memoria de 64 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente son sin modificar.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

```text
                        SRC                                     X3              X2             X1      X0
```

```text
                        DEST             X3              X2                 X1                     X0
```

Figura 3-6. CVTDQ2PD (VEX.256 versión codificada)

## Operación

```text
VCVTDQ2PD (EVEX Encoded Versions) When SRC Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[k+31:k])

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                       ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTDQ2PD (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])

                  ELSE

                    DEST[i+63:i] :=

             Convert_Integer_To_Double_Precision_Floating_Point(SRC[k+31:k])

             FI;

     ELSE

             IF *merging-masking*            ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                       ; zeroing-masking


                            DEST[i+63:i] := 0
                FI
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VCVTDQ2PD (VEX.256 Encoded Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[191:128] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[95:64])
DEST[255:192] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[127:96)
DEST[MAXVL-1:256] := 0

VCVTDQ2PD (VEX.128 Encoded Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] := 0

CVTDQ2PD (128-bit Legacy SSE Version)
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0])
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32])
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTDQ2PD __m512d _mm512_cvtepi32_pd( __m256i a);
VCVTDQ2PD __m512d _mm512_mask_cvtepi32_pd( __m512d s, __mmask8 k, __m256i a);
VCVTDQ2PD __m512d _mm512_maskz_cvtepi32_pd( __mmask8 k, __m256i a);
VCVTDQ2PD __m256d _mm256_cvtepi32_pd (__m128i src);
VCVTDQ2PD __m256d _mm256_mask_cvtepi32_pd( __m256d s, __mmask8 k, __m256i a);
VCVTDQ2PD __m256d _mm256_maskz_cvtepi32_pd( __mmask8 k, __m256i a);
VCVTDQ2PD __m128d _mm_mask_cvtepi32_pd( __m128d s, __mmask8 k, __m128i a);
VCVTDQ2PD __m128d _mm_maskz_cvtepi32_pd( __mmask8 k, __m128i a);
CVTDQ2PD __m128d _mm_cvtepi32_pd (__m128i src);
```

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-53, "Tipo E5 Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
