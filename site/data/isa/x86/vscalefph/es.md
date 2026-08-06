---
summary: Valores Scale Packed FP16 con valores FP16
---

## Descripción

Esta instrucción realiza escala una coma flotante de los valores de FP16 empaquetados en el primer operando de origen multiplicando por 2 al poder de los valores FP16 en segundo operando de origen. Los elementos de destino se actualizan según la máscara de escritura.

La ecuación de esta operación es dada por:

```text
     zmm1 := zmm2 * 2floor(zmm3).
```

Planta (zmm3) significa valor máximo entero zmm3.

Si el resultado no puede ser representado en FP16, entonces se publica la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización), y en el bit SAE.

En el cuadro 5-39 y el cuadro 5-40 figuran valores de entrada especiales.

** Casos especiales de VSCALEFPH/VSCALEFSH**

| +/-QNaN | QNaN(Src1) | +INF | +0 | QNaN(Src1) | IF o fuente es SNan |
| --- | --- | --- | --- | --- | --- |
| +/-SNaN | QNaN(Src1) | QNaN(Src1) | QNaN(Src1) | QNaN(Src1) | YES |
| +/-INF | QNaN(Src2) | Src1 | QNaN_Indefinite | Src1 | IF Src2 es SNaN o -INF |
| +/-0 | QNaN(Src2) | QNaN_Indefinite | Src1 | Src1 | IF Src2 es SNaN o +INF |

## Operación

```text
def scale_fp16(src1,src2):

    tmp1 := src1
    tmp2 := src2
    return tmp1 * POW(2, FLOOR(tmp2))

VSCALEFPH dest{k1}, src1, src2
VL = 128, 256, or 512
KL := VL / 16

IF (VL = 512) AND (EVEX.b = 1) and no memory operand:
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC2 is memory and (EVEX.b = 1):
                tsrc := src2.fp16[0]
          ELSE:
                tsrc := src2.fp16[i]
          dest.fp16[i] := scale_fp16(src1.fp16[i],tsrc)
    ELSE IF *zeroing*:
          dest.fp16[i] := 0
    //else dest.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFPH __m128h _mm_mask_scalef_ph (__m128h src, __mmask8 k, __m128h a, __m128h b);
VSCALEFPH __m128h _mm_maskz_scalef_ph (__mmask8 k, __m128h a, __m128h b);
VSCALEFPH __m128h _mm_scalef_ph (__m128h a, __m128h b);
VSCALEFPH __m256h _mm256_mask_scalef_ph (__m256h src, __mmask16 k, __m256h a, __m256h b);
VSCALEFPH __m256h _mm256_maskz_scalef_ph (__mmask16 k, __m256h a, __m256h b);
VSCALEFPH __m256h _mm256_scalef_ph (__m256h a, __m256h b);
VSCALEFPH __m512h _mm512_mask_scalef_ph (__m512h src, __mmask32 k, __m512h a, __m512h b);
VSCALEFPH __m512h _mm512_maskz_scalef_ph (__mmask32 k, __m512h a, __m512h b);
VSCALEFPH __m512h _mm512_scalef_ph (__m512h a, __m512h b);
VSCALEFPH __m512h _mm512_mask_scalef_round_ph (__m512h src, __mmask32 k, __m512h a, __m512h b, const int rounding);
VSCALEFPH __m512h _mm512_scalef_round_ph (__m512h a, __m512h b, const int rounding);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal (for Src1).

Denormal no se reporta para Src2.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
