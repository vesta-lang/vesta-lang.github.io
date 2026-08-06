---
summary: Convertir valores en coma flotante de precisión doble empaquetados en Precisión única embalada
---

## Descripción

Convierte dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando) a dos, cuatro o ocho valores en coma flotante de precisión simple empaquetados en el operando de destino (primer operando).

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados.

EVEX versiones codificadas: El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un YMM/XMM/XMM (bajo 64-bits) registro actualizado condicionalmente con máscara de escritura k1. Los bits superiores (MAXVL- 1:256/128/64) del destino correspondiente se ponen a cero.

VEX.256 versión codificada: El operando de origen es un registro YMM o 256-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

VEX.128 versión codificada: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:64) del destino de registro ZMM correspondiente se ponen a cero.

128-bit Legacy SSE versión: El operando de origen es un registro XMM o 128 bits ubicación de memoria. El operando de destino es un registro XMM. Bits[127:64] del destino XMM registro se ponen a cero. Sin embargo, los Bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

```text
                 SRC     X3                 X2                 X1          X0
```

```text
                 DEST                    0              X3         X2  X1      X0
```

Figura 3-8. VCVTPD2PS (VEX.256 versión codificada)

## Operación

```text
VCVTPD2PS (EVEX Encoded Version) When SRC Operand is a Register
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

             DEST[i+31:i] := Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[k+63:k])

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                      DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0


VCVTPD2PS (EVEX Encoded Version) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[63:0])

                  ELSE

                    DEST[i+31:i] := Convert_Double_Precision_Floating_Point_To_Single_Precision_Floating_Point(SRC[k+63:k])

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

VCVTPD2PS (VEX.256 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[95:64] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[191:128])
DEST[127:96] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[255:192)
DEST[MAXVL-1:128] := 0

VCVTPD2PS (VEX.128 Encoded Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[MAXVL-1:64] := 0

CVTPD2PS (128-bit Legacy SSE Version)
DEST[31:0] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[63:0])
DEST[63:32] := Convert_Double_Precision_To_Single_Precision_Floating_Point(SRC[127:64])
DEST[127:64] := 0
DEST[MAXVL-1:128] (unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCVTPD2PS __m256 _mm512_cvtpd_ps( __m512d a);
VCVTPD2PS __m256 _mm512_mask_cvtpd_ps( __m256 s, __mmask8 k, __m512d a);
VCVTPD2PS __m256 _mm512_maskz_cvtpd_ps( __mmask8 k, __m512d a);
VCVTPD2PS __m256 _mm512_cvt_roundpd_ps( __m512d a, int r);
VCVTPD2PS __m256 _mm512_mask_cvt_roundpd_ps( __m256 s, __mmask8 k, __m512d a, int r);
VCVTPD2PS __m256 _mm512_maskz_cvt_roundpd_ps( __mmask8 k, __m512d a, int r);
VCVTPD2PS __m128 _mm256_mask_cvtpd_ps( __m128 s, __mmask8 k, __m256d a);
VCVTPD2PS __m128 _mm256_maskz_cvtpd_ps( __mmask8 k, __m256d a);
VCVTPD2PS __m128 _mm_mask_cvtpd_ps( __m128 s, __mmask8 k, __m128d a);
VCVTPD2PS __m128 _mm_maskz_cvtpd_ps( __mmask8 k, __m128d a);
VCVTPD2PS __m128 _mm256_cvtpd_ps (__m256d a) CVTPD2PS __m128 _mm_cvtpd_ps (__m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision, Underflow, Overflow, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:     If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.

```text
#UD
```
