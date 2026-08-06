---
summary: Convertir con Truncation Packed FP16 Valores a Integers de doble palabra firmada
---

## Descripción

Esta instrucción convierte los valores de FP16 empaquetados en el operando de origen para firmar enteros de doble palabra en operando de destino.

Cuando una conversión es inexacta, se devuelve un valor truncado (redondo hacia cero). Si un resultado convertido es mayor que el entero de doble palabra firmado máximo, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero integer indefinido 80000000H es devuelto.

Los elementos de destino se actualizan según la máscara de escritura.

## Operación

```text
VCVTTPH2DQ dest, src
VL = 128, 256 or 512
KL := VL / 32

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp16[0]
          ELSE
                tsrc := SRC.fp16[j]
          DEST.fp32[j] := Convert_fp16_to_integer32_truncate(tsrc)
    ELSE IF *zeroing*:
          DEST.fp32[j] := 0
    // else dest.fp32[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTTPH2DQ __m512i _mm512_cvtt_roundph_epi32 (__m256h a, int sae);
VCVTTPH2DQ __m512i _mm512_mask_cvtt_roundph_epi32 (__m512i src, __mmask16 k, __m256h a, int sae);
VCVTTPH2DQ __m512i _mm512_maskz_cvtt_roundph_epi32 (__mmask16 k, __m256h a, int sae);
VCVTTPH2DQ __m128i _mm_cvttph_epi32 (__m128h a);
VCVTTPH2DQ __m128i _mm_mask_cvttph_epi32 (__m128i src, __mmask8 k, __m128h a);
VCVTTPH2DQ __m128i _mm_maskz_cvttph_epi32 (__mmask8 k, __m128h a);
VCVTTPH2DQ __m256i _mm256_cvttph_epi32 (__m128h a);
VCVTTPH2DQ __m256i _mm256_mask_cvttph_epi32 (__m256i src, __mmask8 k, __m128h a);
VCVTTPH2DQ __m256i _mm256_maskz_cvttph_epi32 (__mmask8 k, __m128h a);
VCVTTPH2DQ __m512i _mm512_cvttph_epi32 (__m256h a);
VCVTTPH2DQ __m512i _mm512_mask_cvttph_epi32 (__m512i src, __mmask16 k, __m256h a);
VCVTTPH2DQ __m512i _mm512_maskz_cvttph_epi32 (__mmask16 k, __m256h a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
