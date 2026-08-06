---
summary: Computación aproximada de la raíz cuadrada de escalar FP16 Valor
---

## Descripción

Esta instrucción realiza el cálculo de la raíz cuadrada recíproca aproximada del valor FP16 bajo en el segundo operando de origen (el tercer operando) y almacena el resultado en el elemento palabra baja del operando de destino (el primer operando) según la máscara de escritura k1. El error relativo máximo para esta aproximación es inferior a 2-11 + 2-14.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero.

Para casos especiales, véase el cuadro 5-36.

## Operación

```text
VRSQRTSH dest{k1}, src1, src2
VL = 128, 256 or 512
KL := VL/16

IF k1[0] or *no writemask*:
    DEST.fp16[0] := APPROXIMATE(1.0 / SQRT(src2.fp16[0]))

ELSE IF *zeroing*:
    DEST.fp16[0] := 0

//else DEST.fp16[0] remains unchanged
DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRTSH __m128h _mm_mask_rsqrt_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VRSQRTSH __m128h _mm_maskz_rsqrt_sh (__mmask8 k, __m128h a, __m128h b);
VRSQRTSH __m128h _mm_rsqrt_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-60, "Tipo E10 Clase Condiciones de Excepción."
