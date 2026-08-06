---
summary: Transformación de reducción de rendimiento en escalar FP16 Valor
---

## Descripción

Esta instrucción realiza una transformación de reducción del valor FP16 bajo codificado binario en el operando de origen (el segundo operando) y almacena el resultado reducido en formato FP binario al elemento bajo del operando de destino (el primer operando) bajo la máscara de escritura k1. Para más detalles, consulte la descripción de VREDUCEPH.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

Esta instrucción podría terminar con una excepción de precisión set. Sin embargo, en caso de SPE set (es decir, Suppress excepción de precisión, que es imm8[3]=1), no se reporta excepción de precisión.

Esta instrucción puede generar un pequeño resultado no cero. Si lo hace, no reporta la excepción de la subida, incluso si las excepciones de la subida son desenmascaradas (la bandera U en el registro MXCSR es 0).

Para casos especiales, véase el cuadro 5-28.

## Operación

```text
// see VREDUCEPH

VREDUCESH dest{k1}, src, imm8
IF k1[0] or *no writemask*:

    dest.fp16[0] := reduce_fp16(src2.fp16[0], imm8)
ELSE IF *zeroing*:

    dest.fp16[0] := 0
//else dest.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VREDUCESH __m128h _mm_mask_reduce_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_maskz_reduce_round_sh (__mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_reduce_round_sh (__m128h a, __m128h b, int imm8, const int sae);
VREDUCESH __m128h _mm_mask_reduce_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8);
VREDUCESH __m128h _mm_maskz_reduce_sh (__mmask8 k, __m128h a, __m128h b, int imm8);
VREDUCESH __m128h _mm_reduce_sh (__m128h a, __m128h b, int imm8);
```

## SIMD coma flotante Excepciones

Inválido, Precisión. Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
