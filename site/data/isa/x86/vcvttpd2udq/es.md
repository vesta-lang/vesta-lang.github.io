---
summary: Convertir Con Truncation valores en coma flotante de precisión doble empaquetados en
---

## Descripción

Convierte con truncation valores en coma flotante de precisión doble empaquetados en el operando de origen (el segundo operando) para empaquetar enteros sin firmar en el operando de destino (el primer operando).

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero). Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFFFFH es devuelto.

El operando de origen es un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un YMM/XMM/XMM (bajo 64 bits) registro actualizado condicionalmente con máscara de escritura k1. Los bits superiores (MAXVL-1:256) del destino correspondiente se ponen a cero.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTTPD2UDQ (EVEX Encoded Versions) When SRC2 Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             DEST[i+31:i] :=

             Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[k+63:k])

     ELSE

             IF *merging-masking*                   ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;


ENDFOR
DEST[MAXVL-1:VL/2] := 0

VCVTTPD2UDQ (EVEX Encoded Versions) When SRC Operand is a Memory Source
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1)

                  THEN

                    DEST[i+31:i] :=

             Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[63:0])

                  ELSE

                    DEST[i+31:i] :=

             Convert_Double_Precision_Floating_Point_To_UInteger_Truncate(SRC[k+63:k])

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
VCVTTPD2UDQ __m256i _mm512_cvttpd_epu32( __m512d a);
VCVTTPD2UDQ __m256i _mm512_mask_cvttpd_epu32( __m256i s, __mmask8 k, __m512d a);
VCVTTPD2UDQ __m256i _mm512_maskz_cvttpd_epu32( __mmask8 k, __m512d a);
VCVTTPD2UDQ __m256i _mm512_cvtt_roundpd_epu32( __m512d a, int sae);
VCVTTPD2UDQ __m256i _mm512_mask_cvtt_roundpd_epu32( __m256i s, __mmask8 k, __m512d a, int sae);
VCVTTPD2UDQ __m256i _mm512_maskz_cvtt_roundpd_epu32( __mmask8 k, __m512d a, int sae);
VCVTTPD2UDQ __m128i _mm256_mask_cvttpd_epu32( __m128i s, __mmask8 k, __m256d a);
VCVTTPD2UDQ __m128i _mm256_maskz_cvttpd_epu32( __mmask8 k, __m256d a);
VCVTTPD2UDQ __m128i _mm_mask_cvttpd_epu32( __m128i s, __mmask8 k, __m128d a);
VCVTTPD2UDQ __m128i _mm_maskz_cvttpd_epu32( __mmask8 k, __m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
