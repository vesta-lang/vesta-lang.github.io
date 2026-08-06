---
summary: Convertir valores en coma flotante de precisión doble empaquetados en Packed Unsigned
---

## Descripción

Convierte valores en coma flotante de precisión doble empaquetados en el operando de origen (el segundo operando) para empaquetar enteros de doble palabra sin firma en el operando de destino (el primer operando).

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados. Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1. Los bits superiores (MAXVL-1:256) del destino correspondiente se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VCVTPD2UDQ (EVEX Encoded Versions) When SRC2 Operand is a Register
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1
    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*
          THEN
                DEST[i+31:i] :=
                Convert_Double_Precision_Floating_Point_To_UInteger(SRC[k+63:k])


     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0

VCVTPD2UDQ (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_Double_Precision_Floating_Point_To_UInteger(SRC[63:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_Double_Precision_Floating_Point_To_UInteger(SRC[k+63:k])

             FI;

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTPD2UDQ __m256i _mm512_cvtpd_epu32( __m512d a);
VCVTPD2UDQ __m256i _mm512_mask_cvtpd_epu32( __m256i s, __mmask8 k, __m512d a);
VCVTPD2UDQ __m256i _mm512_maskz_cvtpd_epu32( __mmask8 k, __m512d a);
VCVTPD2UDQ __m256i _mm512_cvt_roundpd_epu32( __m512d a, int r);
VCVTPD2UDQ __m256i _mm512_mask_cvt_roundpd_epu32( __m256i s, __mmask8 k, __m512d a, int r);
VCVTPD2UDQ __m256i _mm512_maskz_cvt_roundpd_epu32( __mmask8 k, __m512d a, int r);
VCVTPD2UDQ __m128i _mm256_mask_cvtpd_epu32( __m128i s, __mmask8 k, __m256d a);
VCVTPD2UDQ __m128i _mm256_maskz_cvtpd_epu32( __mmask8 k, __m256d a);
VCVTPD2UDQ __m128i _mm_mask_cvtpd_epu32( __m128i s, __mmask8 k, __m128d a);
VCVTPD2UDQ __m128i _mm_maskz_cvtpd_epu32( __mmask8 k, __m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:  If EVEX.vvvv != 1111B.

```text
#UD
```
