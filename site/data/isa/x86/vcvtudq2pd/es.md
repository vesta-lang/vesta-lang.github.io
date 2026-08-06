---
summary: Convertir Integers de doble palabra sin asignar en doble precisión empaquetada
---

## Descripción

Convierte los enteros de doble palabra sin firmar en el operando de origen (segundo operando) a valores en coma flotante de precisión doble empaquetados en el operando de destino (primer operando).

El operando de origen es un registro YMM/XMM/XMM (bajo 64 bits) de 256/128/64-bit ubicación de memoria o un vector de 256/128/64-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

Se ignora el intento de codificar esta instrucción con redondeo incrustado EVEX.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTUDQ2PD (EVEX Encoded Versions) When SRC Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_UInteger_To_Double_Precision_Floating_Point(SRC[k+31:k])

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTUDQ2PD (EVEX Encoded Versions) When SRC Operand is a Memory Source


(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

k := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+63:i] :=

             Convert_UInteger_To_Double_Precision_Floating_Point(SRC[31:0])

                  ELSE

                    DEST[i+63:i] :=

             Convert_UInteger_To_Double_Precision_Floating_Point(SRC[k+31:k])

             FI;

     ELSE

             IF *merging-masking*        ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE                   ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTUDQ2PD __m512d _mm512_cvtepu32_pd( __m256i a);
VCVTUDQ2PD __m512d _mm512_mask_cvtepu32_pd( __m512d s, __mmask8 k, __m256i a);
VCVTUDQ2PD __m512d _mm512_maskz_cvtepu32_pd( __mmask8 k, __m256i a);
VCVTUDQ2PD __m256d _mm256_cvtepu32_pd( __m128i a);
VCVTUDQ2PD __m256d _mm256_mask_cvtepu32_pd( __m256d s, __mmask8 k, __m128i a);
VCVTUDQ2PD __m256d _mm256_maskz_cvtepu32_pd( __mmask8 k, __m128i a);
VCVTUDQ2PD __m128d _mm_cvtepu32_pd( __m128i a);
VCVTUDQ2PD __m128d _mm_mask_cvtepu32_pd( __m128d s, __mmask8 k, __m128i a);
VCVTUDQ2PD __m128d _mm_maskz_cvtepu32_pd( __mmask8 k, __m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-53, "Tipo E5 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
