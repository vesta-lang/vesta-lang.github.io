---
summary: Convertir Valores FP16 empaquetados en Integers de Quadword sin firma
---

## Descripción

Esta instrucción convierte los valores de FP16 empaquetados en el operando de origen a enteros de cuádpago no firmados en operando de destino.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR o los bits de control de redondeo incrustados. Si un resultado convertido no puede ser representado en el formato de destino, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero FFFFFF FFFFFFH es devuelto.

Los elementos de destino se actualizan según la máscara de escritura.

## Operación

```text
VCVTPH2UQQ DEST, SRC
VL = 128, 256 or 512
KL := VL / 64

IF *SRC is a register* and (VL = 512) and (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE:
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *SRC is memory* and EVEX.b = 1:
                tsrc := SRC.fp16[0]
          ELSE
                tsrc := SRC.fp16[j]
          DEST.qword[j] := Convert_fp16_to_unsigned_integer64(tsrc)
    ELSE IF *zeroing*:
          DEST.qword[j] := 0
    // else dest.qword[j] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTPH2UQQ __m512i _mm512_cvt_roundph_epu64 (__m128h a, int rounding);
VCVTPH2UQQ __m512i _mm512_mask_cvt_roundph_epu64 (__m512i src, __mmask8 k, __m128h a, int rounding);
VCVTPH2UQQ __m512i _mm512_maskz_cvt_roundph_epu64 (__mmask8 k, __m128h a, int rounding);
VCVTPH2UQQ __m128i _mm_cvtph_epu64 (__m128h a);
VCVTPH2UQQ __m128i _mm_mask_cvtph_epu64 (__m128i src, __mmask8 k, __m128h a);
VCVTPH2UQQ __m128i _mm_maskz_cvtph_epu64 (__mmask8 k, __m128h a);
VCVTPH2UQQ __m256i _mm256_cvtph_epu64 (__m128h a);
VCVTPH2UQQ __m256i _mm256_mask_cvtph_epu64 (__m256i src, __mmask8 k, __m128h a);
VCVTPH2UQQ __m256i _mm256_maskz_cvtph_epu64 (__mmask8 k, __m128h a);
VCVTPH2UQQ __m512i _mm512_cvtph_epu64 (__m128h a);
VCVTPH2UQQ __m512i _mm512_mask_cvtph_epu64 (__m512i src, __mmask8 k, __m128h a);
VCVTPH2UQQ __m512i _mm512_maskz_cvtph_epu64 (__mmask8 k, __m128h a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
