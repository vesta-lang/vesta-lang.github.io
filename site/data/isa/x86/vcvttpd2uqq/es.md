---
summary: Convertir Con Truncation valores en coma flotante de precisión doble empaquetados en
---

## Descripción

Convierte con truncation valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando) para empaquetar enteros de quadword sin señal en el operando de destino (primer operando).

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero). Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFFFH es devuelto.

EVEX versiones codificadas: El operando de origen es un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. La operación de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VCVTTPD2UQQ (EVEX Encoded Versions) When SRC Operand is a Register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] :=

             Convert_Double_Precision_Floating_Point_To_UQuadInteger_Truncate(SRC[i+63:i])

     ELSE

             IF *merging-masking*                   ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                               ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VCVTTPD2UQQ (EVEX Encoded Versions) When SRC Operand is a Memory Source


(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             IF (EVEX.b == 1)

                  THEN

                    DEST[i+63:i] :=

             Convert_Double_Precision_Floating_Point_To_UQuadInteger_Truncate(SRC[63:0])

                  ELSE

                    DEST[i+63:i] :=

             Convert_Double_Precision_Floating_Point_To_UQuadInteger_Truncate(SRC[i+63:i])

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
VCVTTPD2UQQ _mm<size>[_mask[z]]_cvtt[_round]pd_epu64 VCVTTPD2UQQ __m512i _mm512_cvttpd_epu64( __m512d a);
VCVTTPD2UQQ __m512i _mm512_mask_cvttpd_epu64( __m512i s, __mmask8 k, __m512d a);
VCVTTPD2UQQ __m512i _mm512_maskz_cvttpd_epu64( __mmask8 k, __m512d a);
VCVTTPD2UQQ __m512i _mm512_cvtt_roundpd_epu64( __m512d a, int sae);
VCVTTPD2UQQ __m512i _mm512_mask_cvtt_roundpd_epu64( __m512i s, __mmask8 k, __m512d a, int sae);
VCVTTPD2UQQ __m512i _mm512_maskz_cvtt_roundpd_epu64( __mmask8 k, __m512d a, int sae);
VCVTTPD2UQQ __m256i _mm256_mask_cvttpd_epu64( __m256i s, __mmask8 k, __m256d a);
VCVTTPD2UQQ __m256i _mm256_maskz_cvttpd_epu64( __mmask8 k, __m256d a);
VCVTTPD2UQQ __m128i _mm_mask_cvttpd_epu64( __m128i s, __mmask8 k, __m128d a);
VCVTTPD2UQQ __m128i _mm_maskz_cvttpd_epu64( __mmask8 k, __m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

Additionally:

```text
#UD                     If EVEX.vvvv != 1111B.
```
