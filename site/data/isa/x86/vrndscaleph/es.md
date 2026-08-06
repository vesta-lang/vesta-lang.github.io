---
summary: Round Packed FP16 Valores para Incluir un número dado de errores de fracción
---

## Descripción

Esta instrucción redondea los valores FP16 en el operando de origen por el modo de redondeo especificado en el operando inmediato (ver Tabla 5-30) y coloca el resultado en el operando de destino. El operando de destino es actualizado condicionalmente según la máscara de escritura.

El proceso de redondeo redondea la entrada a un valor integral, además de los bits de número de fracción especificados por imm8[7:4] (que se incluirán en el resultado), y devuelve el resultado como un valor FP16.

Tenga en cuenta que no se induce el desbordamiento mientras se ejecuta esta instrucción (aunque la fuente es escalada por el valor imm8[7:4]).

El operando inmediato también especifica campos de control para la operación de redondeo. Tres campos de bits se definen y se muestran en la Tabla 5-30, "Imm8 Controles para VRNDSCALEPH/VRNDSCALESH." Bit 3 del byte inmediato controla el comportamiento del procesador para una excepción de precisión, bit 2 selecciona la fuente del control de modo de redondeo, y bits 1:0 especifican un valor de redondeo no resistente.

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN.

El signo del resultado de esta instrucción se conserva, incluyendo el signo de cero. En el cuadro 5-31 se describen casos especiales.

La fórmula de la operación en cada elemento de datos para VRNDSCALEPH es ROUND(x) = 2-M *Round to INT(x * 2M, round ctrl),

round_ctrl = imm[3:0];

M=imm[7:4]; El funcionamiento de x * 2M se calcula como si el rango de exponentes es ilimitado (es decir, no se ha producido ningún desbordamiento).

Si el bit SPE de esta instrucción (bit 3) en el operando inmediato es 1, VRNDSCALEPH puede establecer MXCSR.UE sin MXCSR.PE.

EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

Imm8 Bits Tabla 5-30. Controles Imm8 para VRNDSCALEPH/VRNDSCALESH imm8[7:4] imm8[3] Descripción

imm8[2] Número de puntos fijos para preservar.

imm8[1:0] Suppress excepción de precisión (SPE) 0b00: Implica el uso de la máscara de excepción MXCSR. 0b01: Implica suprimir.

Round Select (RS) 0b00: Implica el uso de imm8[1:0]. 0b01: Implica el uso de MXCSR.

Override de control redondo: 0b00: Ronda más cercana incluso. 0b01: Abajo. Redondeada. Truncate.

Cuadro 5-31. VRNDSCALEPH/VRNDSCALESH Casos especiales Src1 = +/- Valor devuelto Src1 = +/-NaN Src1 Src1 = +/-0 Src1 convertido a QNaN Src1

## Operación

```text
def round_fp16_to_integer(src, imm8):
    if imm8[2] = 1:
          rounding_direction := MXCSR.RC
    else:
          rounding_direction := imm8[1:0]
    m := imm8[7:4] // scaling factor

tsrc1 := 2^m * src

if rounding_direction = 0b00:
      tmp := round_to_nearest_even_integer(trc1)

else if rounding_direction = 0b01:
      tmp := round_to_equal_or_smaller_integer(trc1)

else if rounding_direction = 0b10:
      tmp := round_to_equal_or_larger_integer(trc1)

else if rounding_direction = 0b11:
      tmp := round_to_smallest_magnitude_integer(trc1)

dst := 2^(-m) * tmp

if imm8[3]==0: // check SPE
      if src != dst:
            MXCSR.PE := 1

return dst


VRNDSCALEPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := round_fp16_to_integer(tsrc, imm8)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRNDSCALEPH __m128h _mm_mask_roundscale_ph (__m128h src, __mmask8 k, __m128h a, int imm8);
VRNDSCALEPH __m128h _mm_maskz_roundscale_ph (__mmask8 k, __m128h a, int imm8);
VRNDSCALEPH __m128h _mm_roundscale_ph (__m128h a, int imm8);
VRNDSCALEPH __m256h _mm256_mask_roundscale_ph (__m256h src, __mmask16 k, __m256h a, int imm8);
VRNDSCALEPH __m256h _mm256_maskz_roundscale_ph (__mmask16 k, __m256h a, int imm8);
VRNDSCALEPH __m256h _mm256_roundscale_ph (__m256h a, int imm8);
VRNDSCALEPH __m512h _mm512_mask_roundscale_ph (__m512h src, __mmask32 k, __m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_maskz_roundscale_ph (__mmask32 k, __m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_roundscale_ph (__m512h a, int imm8);
VRNDSCALEPH __m512h _mm512_mask_roundscale_round_ph (__m512h src, __mmask32 k, __m512h a, int imm8, const int sae);
VRNDSCALEPH __m512h _mm512_maskz_roundscale_round_ph (__mmask32 k, __m512h a, int imm8, const int sae);
VRNDSCALEPH __m512h _mm512_roundscale_round_ph (__m512h a, int imm8, const int sae);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Precision.

Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
