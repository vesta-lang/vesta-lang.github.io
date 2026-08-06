---
summary: Compute Reciprocal of escalar FP16 Value
---

## Descripción

Esta instrucción realiza una computación SIMD del recíproco aproximado del valor FP16 bajo en el segundo operando de origen (el tercer operando) y almacena el resultado en el elemento de palabra baja del operando de destino (el primer operando) según la máscara de escritura k1. Los bits 127:16 del destino de registro XMM son copiados de los bits correspondientes en el primer operando de origen (el segundo operando). El error relativo máximo para esta aproximación es inferior a 2-11 + 2-14.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

Para casos especiales, véase el cuadro 5-26.

## Operación

```text
VRCPSH dest{k1}, src1, src2
IF k1[0] or *no writemask*:

    DEST.fp16[0] := APPROXIMATE(1.0 / src2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRCPSH __m128h _mm_mask_rcp_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VRCPSH __m128h _mm_maskz_rcp_sh (__mmask8 k, __m128h a, __m128h b);
VRCPSH __m128h _mm_rcp_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-60, "Tipo E10 Clase Condiciones de Excepción."
