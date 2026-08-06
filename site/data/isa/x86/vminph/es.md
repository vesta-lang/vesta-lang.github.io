---
summary: Devolución mínima de los valores de FP16 empacado
---

## Descripción

Esta instrucción realiza una comparación SIMD de los valores de FP16 empaquetados en el primer operando de origen y el segundo operando de origen y devuelve el valor mínimo para cada par de valores al operando de destino.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando (operando de origen) es devuelto. Si un valor en el segundo operando es un SNaN, entonces SNaN se envía sin cambios al destino (es decir, una versión QNaN del SNaN no se devuelve).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando (operando de origen), ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que el NaN operando de origen (de la primera o segunda operando) sea devuelto, la acción de VMINPH se puede emular utilizando una secuencia de instrucciones, como, una comparación seguida por AND, ANDN y OR.

EVEX versiones codificadas: El primer operando de origen (el segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 16 bits. El operando de destino es un ZMM/YMM/XMM registro actualizado condicionalmente con máscara de escritura k1.

## Operación

```text
def MIN(SRC1, SRC2):
    IF (SRC1 = 0.0) and (SRC2 = 0.0):
          DEST := SRC2
    ELSE IF (SRC1 = NaN):
          DEST := SRC2
    ELSE IF (SRC2 = NaN):
          DEST := SRC2
    ELSE IF (SRC1 < SRC2):
          DEST := SRC1
    ELSE:
          DEST := SRC2


VMINPH dest, src1, src2
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                tsrc2 := SRC2.fp16[0]
          ELSE:
                tsrc2 := SRC2.fp16[j]
          DEST.fp16[j] := MIN(SRC1.fp16[j], tsrc2)
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VMINPH __m128h _mm_mask_min_ph (__m128h src, __mmask8 k, __m128h a, __m128h b);
VMINPH __m128h _mm_maskz_min_ph (__mmask8 k, __m128h a, __m128h b);
VMINPH __m128h _mm_min_ph (__m128h a, __m128h b);
VMINPH __m256h _mm256_mask_min_ph (__m256h src, __mmask16 k, __m256h a, __m256h b);
VMINPH __m256h _mm256_maskz_min_ph (__mmask16 k, __m256h a, __m256h b);
VMINPH __m256h _mm256_min_ph (__m256h a, __m256h b);
VMINPH __m512h _mm512_mask_min_ph (__m512h src, __mmask32 k, __m512h a, __m512h b);
VMINPH __m512h _mm512_maskz_min_ph (__mmask32 k, __m512h a, __m512h b);
VMINPH __m512h _mm512_min_ph (__m512h a, __m512h b);
VMINPH __m512h _mm512_mask_min_round_ph (__m512h src, __mmask32 k, __m512h a, __m512h b, int sae);
VMINPH __m512h _mm512_maskz_min_round_ph (__mmask32 k, __m512h a, __m512h b, int sae);
VMINPH __m512h _mm512_min_round_ph (__m512h a, __m512h b, int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
