---
summary: Transformación de reducción de rendimiento en los valores de FP16 empaquetados
---

## Descripción

Esta instrucción realiza una transformación de reducción de los valores binarios codificados FP16 en el operando de origen (el segundo operando) y almacena los resultados reducidos en formato FP binario al operando de destino (el primer operando) bajo la máscara de escritura k1.

La transformación de la reducción resta la parte entero y los bits fraccionales principales M del valor binario fuente FP, donde M es un entero sin firma especificado por imm8[7:4]. Específicamente, la transformación de la reducción se puede expresar como: dest = src - (ROUND(2M * src) * 2-M donde ROUND() trata src, 2M, y su producto como números binarios de FP con exponentes de significado normalizado y parcial. La magnitud del resultado reducido se puede expresar considerando src = 2p * man2, where `man2' is the normalized significand and `p' is the unbiased exponent. Entonces, si RC=RNE: 0 SilencioResultado sometido 2-M-1.

Then if RC  RNE: 0  |ReducedResult| < 2-M.

Esta instrucción podría terminar con una excepción de precisión set. Sin embargo, en caso de SPE set (es decir, Suppress excepción de precisión, que es imm8[3]=1), no se reporta excepción de precisión.

Esta instrucción puede generar un pequeño resultado no cero. Si lo hace, no reporta la excepción de la subida, incluso si las excepciones de la subida son desenmascaradas (la bandera U en el registro MXCSR es 0).

Para casos especiales, véase el cuadro 5-28.

** Casos especiales de VREDUCEPH/VREDUCESH**

| \|Src1\| < 2-M | RU, Src1 | 0 | Src1 |
| --- | --- | --- | --- |
|  | RD, Src1 | 0 | Src1 |
|  | RD, Src1 < | 0 | Round(Src1 + 2-M) |
| Src1 = +/-0 or | NOT RD |  | +0.0 |
| Dest = +/-0 (Src1 ) | RD |  | -0.0 |
| Src1 = +/- | Cualquier |  | +0.0 |
| Src1 = +/-NAN | Cualquier |  | QNaN (Src1) |

## Operación

```text
def reduce_fp16(src, imm8):
    nan := (src.exp = 0x1F) and (src.fraction != 0)
    if nan:
          return QNAN(src)
    m := imm8[7:4]
    rc := imm8[1:0]
    rc_source := imm8[2]
    spe := imm[3] // suppress precision exception
    tmp := 2^(-m) * ROUND(2^m * src, spe, rc_source, rc)
    tmp := src - tmp // using same RC, SPE controls
    return tmp

VREDUCEPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := reduce_fp16(tsrc, imm8)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VREDUCEPH __m128h _mm_mask_reduce_ph (__m128h src, __mmask8 k, __m128h a, int imm8);
VREDUCEPH __m128h _mm_maskz_reduce_ph (__mmask8 k, __m128h a, int imm8);
VREDUCEPH __m128h _mm_reduce_ph (__m128h a, int imm8);
VREDUCEPH __m256h _mm256_mask_reduce_ph (__m256h src, __mmask16 k, __m256h a, int imm8);
VREDUCEPH __m256h _mm256_maskz_reduce_ph (__mmask16 k, __m256h a, int imm8);
VREDUCEPH __m256h _mm256_reduce_ph (__m256h a, int imm8);
VREDUCEPH __m512h _mm512_mask_reduce_ph (__m512h src, __mmask32 k, __m512h a, int imm8);
VREDUCEPH __m512h _mm512_maskz_reduce_ph (__mmask32 k, __m512h a, int imm8);
VREDUCEPH __m512h _mm512_reduce_ph (__m512h a, int imm8);
VREDUCEPH __m512h _mm512_mask_reduce_round_ph (__m512h src, __mmask32 k, __m512h a, int imm8, const int sae);
VREDUCEPH __m512h _mm512_maskz_reduce_round_ph (__mmask32 k, __m512h a, int imm8, const int sae);
VREDUCEPH __m512h _mm512_reduce_round_ph (__m512h a, int imm8, const int sae);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

Si SPE está habilitado, excepción de precisión no se reporta (sin importar la máscara de excepción MXCSR).

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
