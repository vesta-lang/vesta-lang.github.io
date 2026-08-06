---
summary: Convertir valores en coma flotante de precisión simple empaquetados en Packed Unsigned
---

## Descripción

Convierte dieciséis valores en coma flotante de precisión simple empaquetados en el operando de origen a dieciséis enteros sin firmar en el operando de destino.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados. Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VCVTPS2UDQ (EVEX Encoded Versions) When SRC Operand is a Register
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] :=

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[i+31:i])

     ELSE

             IF *merging-masking*      ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE                 ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTPS2UDQ (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no *

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[31:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_Single_Precision_Floating_Point_To_UInteger(SRC[i+31:i])

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
```

## Intel C/C++ compilador intrínseco

```c
VCVTPS2UDQ __m512i _mm512_cvtps_epu32( __m512 a);
VCVTPS2UDQ __m512i _mm512_mask_cvtps_epu32( __m512i s, __mmask16 k, __m512 a);
VCVTPS2UDQ __m512i _mm512_maskz_cvtps_epu32( __mmask16 k, __m512 a);
VCVTPS2UDQ __m512i _mm512_cvt_roundps_epu32( __m512 a, int r);
VCVTPS2UDQ __m512i _mm512_mask_cvt_roundps_epu32( __m512i s, __mmask16 k, __m512 a, int r);
VCVTPS2UDQ __m512i _mm512_maskz_cvt_roundps_epu32( __mmask16 k, __m512 a, int r);
VCVTPS2UDQ __m256i _mm256_cvtps_epu32( __m256d a);
VCVTPS2UDQ __m256i _mm256_mask_cvtps_epu32( __m256i s, __mmask8 k, __m256 a);
VCVTPS2UDQ __m256i _mm256_maskz_cvtps_epu32( __mmask8 k, __m256 a);
VCVTPS2UDQ __m128i _mm_cvtps_epu32( __m128 a);
VCVTPS2UDQ __m128i _mm_mask_cvtps_epu32( __m128i s, __mmask8 k, __m128 a);
VCVTPS2UDQ __m128i _mm_maskz_cvtps_epu32( __mmask8 k, __m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
