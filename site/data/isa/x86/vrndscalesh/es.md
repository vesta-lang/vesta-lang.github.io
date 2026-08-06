---
summary: Round escalar FP16 Valor para Incluir un número dado de bits de fracción
---

## Descripción

Esta instrucción redondea el bajo valor FP16 en el segundo operando de origen por el modo de redondeo especificado en el operando inmediato (ver Tabla 5-30) y coloca el resultado en el operando de destino.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

El proceso de redondeo redondea la entrada a un valor integral, además de los bits de número de fracción especificados por imm8[7:4] (que se incluirán en el resultado), y devuelve el resultado como un valor FP16.

Tenga en cuenta que no se induce el desbordamiento mientras se ejecuta esta instrucción (aunque la fuente es escalada por el valor imm8[7:4]).

El operando inmediato también especifica campos de control para la operación de redondeo. Tres campos de bits se definen y se muestran en la Tabla 5-30, "Imm8 Controles para VRNDSCALEPH/VRNDSCALESH." Bit 3 del byte inmediato controla el comportamiento del procesador para una excepción de precisión, bit 2 selecciona la fuente del control de modo de redondeo, y bits 1:0 especifican un valor de redondeo no resistente.

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN.

El signo del resultado de esta instrucción se conserva, incluyendo el signo de cero. En el cuadro 5-31 se describen casos especiales.

Si el bit SPE de esta instrucción (bit 3) en el operando inmediato es 1, VRNDSCALESH puede establecer MXCSR.UE sin MXCSR.PE.

La fórmula de la operación en cada elemento de datos para VRNDSCALESH es: ROUND(x) = 2-M *Round to INT(x) * 2M, round ctrl),

round_ctrl = imm[3:0];

M=imm[7:4]; El funcionamiento de x * 2M se calcula como si el rango de exponentes es ilimitado (es decir, no se ha producido ningún desbordamiento).

## Operación

```text
VRNDSCALESH dest{k1}, src1, src2, imm8
IF k1[0] or *no writemask*:

    DEST.fp16[0] := round_fp16_to_integer(src2.fp16[0], imm8) // see VRNDSCALEPH
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] = src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRNDSCALESH __m128h _mm_mask_roundscale_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_maskz_roundscale_round_sh (__mmask8 k, __m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_roundscale_round_sh (__m128h a, __m128h b, int imm8, const int sae);
VRNDSCALESH __m128h _mm_mask_roundscale_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int imm8);
VRNDSCALESH __m128h _mm_maskz_roundscale_sh (__mmask8 k, __m128h a, __m128h b, int imm8);
VRNDSCALESH __m128h _mm_roundscale_sh (__m128h a, __m128h b, int imm8);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Precision.

Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
