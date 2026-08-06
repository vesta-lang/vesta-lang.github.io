---
summary: Compute Reciprocals of Square Roots of Packed FP16 Values
---

## Descripción

Esta instrucción realiza una computación SIMD de los reciprocales aproximados cuadrados de 8/16/32 empaquetados FP16 valores en coma flotante en el operando de origen (el segundo operando) y almacena los resultados de FP16 coma flotante empaquetados en el operando de destino. El error relativo máximo para esta aproximación es inferior a 2-11 + 2-14. Para casos especiales, véase el cuadro 5-36.

Los elementos de destino se actualizan según la máscara de escritura.

** Casos especiales de VRSQRTPH/VRSQRTSH**

| Valor de entrada | Valor de restauración | Comentarios |
| --- | --- | --- |
| Cualquier anormal | Normal | No puede generar desbordamiento |
| X = 2-2n | 2n |  |
| X<0 | QNaN_Indefinite | Incluyendo - |
| X = -0 | - |  |
| X = +0 | + |  |
| X = + | +0 |  |
| VRSQRTPH--Compute Reciprocals | de Cuadrados de Empaquetados | Valores FP16 |

## Operación

```text
VRSQRTPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := APPROXIMATE(1.0 / SQRT(tsrc) )
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRTPH __m128h _mm_mask_rsqrt_ph (__m128h src, __mmask8 k, __m128h a);
VRSQRTPH __m128h _mm_maskz_rsqrt_ph (__mmask8 k, __m128h a);
VRSQRTPH __m128h _mm_rsqrt_ph (__m128h a);
VRSQRTPH __m256h _mm256_mask_rsqrt_ph (__m256h src, __mmask16 k, __m256h a);
VRSQRTPH __m256h _mm256_maskz_rsqrt_ph (__mmask16 k, __m256h a);
VRSQRTPH __m256h _mm256_rsqrt_ph (__m256h a);
VRSQRTPH __m512h _mm512_mask_rsqrt_ph (__m512h src, __mmask32 k, __m512h a);
VRSQRTPH __m512h _mm512_maskz_rsqrt_ph (__mmask32 k, __m512h a);
VRSQRTPH __m512h _mm512_rsqrt_ph (__m512h a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
