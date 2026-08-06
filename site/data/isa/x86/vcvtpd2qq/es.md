---
summary: Convertir valores en coma flotante de precisión doble empaquetados en Quadword embalado
---

## Descripción

Convierte valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando) para empaquetar enteros de cuádpo en el operando de destino (primer operando).

EVEX versiones codificadas: El operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. La operación de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados. Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, se devuelve el valor entero indefinido 80000 00000H.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VCVTPD2QQ (EVEX Encoded Version) When SRC Operand is a Register
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

             Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[i+63:i])

ELSE

             IF *merging-masking*               ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                           ; zeroing-masking

                    DEST[i+63:i] := 0

             FI


    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VCVTPD2QQ (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[i+63:i] :=    Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[63:0])

                  ELSE

                    DEST[i+63:i] := Convert_Double_Precision_Floating_Point_To_QuadInteger(SRC[i+63:i])

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
VCVTPD2QQ __m512i _mm512_cvtpd_epi64( __m512d a);
VCVTPD2QQ __m512i _mm512_mask_cvtpd_epi64( __m512i s, __mmask8 k, __m512d a);
VCVTPD2QQ __m512i _mm512_maskz_cvtpd_epi64( __mmask8 k, __m512d a);
VCVTPD2QQ __m512i _mm512_cvt_roundpd_epi64( __m512d a, int r);
VCVTPD2QQ __m512i _mm512_mask_cvt_roundpd_epi64( __m512i s, __mmask8 k, __m512d a, int r);
VCVTPD2QQ __m512i _mm512_maskz_cvt_roundpd_epi64( __mmask8 k, __m512d a, int r);
VCVTPD2QQ __m256i _mm256_mask_cvtpd_epi64( __m256i s, __mmask8 k, __m256d a);
VCVTPD2QQ __m256i _mm256_maskz_cvtpd_epi64( __mmask8 k, __m256d a);
VCVTPD2QQ __m128i _mm_mask_cvtpd_epi64( __m128i s, __mmask8 k, __m128d a);
VCVTPD2QQ __m128i _mm_maskz_cvtpd_epi64( __mmask8 k, __m128d a);
VCVTPD2QQ __m256i _mm256_cvtpd_epi64 (__m256d src) VCVTPD2QQ __m128i _mm_cvtpd_epi64 (__m128d src);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
