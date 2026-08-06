---
summary: Scale escalar FP16 Valores con FP16 Valores
---

## Descripción

Esta instrucción realiza escala una coma flotante del elemento FP16 bajo en el primer operando de origen multiplicando por 2 al poder del elemento FP16 bajo en segundo operando de origen, almacenando el resultado en el elemento bajo del operando de destino.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

La ecuación de esta operación es dada por:

```text
     xmm1 := xmm2 * 2floor(xmm3).
```

Planta (xmm3) significa valor máximo entero xmm3.

Si el resultado no puede ser representado en FP16, entonces se publica la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización, bit FTZ) y en el bit SAE.

En el cuadro 5-39 y el cuadro 5-40 figuran valores de entrada especiales.

## Operación

```text
VSCALEFSH dest{k1}, src1, src2
IF (EVEX.b = 1) and no memory operand:

    SET_RM(EVEX.RC)
ELSE

    SET_RM(MXCSR.RC)

IF k1[0] or *no writemask*:
    dest.fp16[0] := scale_fp16(src1.fp16[0], src2.fp16[0]) // see VSCALEFPH

ELSE IF *zeroing*:
    dest.fp16[0] := 0

//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFSH __m128h _mm_mask_scalef_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_maskz_scalef_round_sh (__mmask8 k, __m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_scalef_round_sh (__m128h a, __m128h b, const int rounding);
VSCALEFSH __m128h _mm_mask_scalef_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VSCALEFSH __m128h _mm_maskz_scalef_sh (__mmask8 k, __m128h a, __m128h b);
VSCALEFSH __m128h _mm_scalef_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Overflow, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."

La excepción Denormal-operando (#D) se comprueba y se indica para src1 operando, pero no para src2 operando. La excepción denormal-operando se verifica para src1 operando sólo si el src2 operando no es NaN. Si el src2 operando es NaN, el procesador genera NaN y no indica la excepción denormal-operando, incluso si src1 operando es denormal.
