---
summary: Compute Reciprocals of Packed FP16 Values
---

## Descripción

Esta instrucción realiza una computación SIMD de los reciprocales aproximados de 8/16/32 valores de FP16 empaquetados en el operando de origen (el segundo operando) y almacena los resultados de FP16 empaquetados en el operando de destino. El error relativo máximo para esta aproximación es inferior a 2-11 + 2-14.

Para casos especiales, véase el cuadro 5-26.

** Casos especiales de VRCPPH/VRCPSH**

| 0 | X | 2-16 | INF | Muy pequeño denormal |
| --- | --- | --- | --- | --- |
| -2- | 16 | X  -0 | -INF | Muy pequeño denormal |
| X > | + |  | +0 |  |
| X < | - |  | -0 |  |
| X = | 2- | n | 2n |  |
| X = | -2 | -n | -2n |  |

## Operación

```text
VRCPPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := APPROXIMATE(1.0 / tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRCPPH __m128h _mm_mask_rcp_ph (__m128h src, __mmask8 k, __m128h a);
VRCPPH __m128h _mm_maskz_rcp_ph (__mmask8 k, __m128h a);
VRCPPH __m128h _mm_rcp_ph (__m128h a);
VRCPPH __m256h _mm256_mask_rcp_ph (__m256h src, __mmask16 k, __m256h a);
VRCPPH __m256h _mm256_maskz_rcp_ph (__mmask16 k, __m256h a);
VRCPPH __m256h _mm256_rcp_ph (__m256h a);
VRCPPH __m512h _mm512_mask_rcp_ph (__m512h src, __mmask32 k, __m512h a);
VRCPPH __m512h _mm512_maskz_rcp_ph (__mmask32 k, __m512h a);
VRCPPH __m512h _mm512_rcp_ph (__m512h a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
