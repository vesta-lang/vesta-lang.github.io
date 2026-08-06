---
summary: Extracto FP16 de Mantissa Normalizado de FP16 escalar
---

## Descripción

Esta instrucción convierte el valor FP16 en el elemento bajo de los valores el segundo operando de origen a FP16 con la normalización de mantissa y el control de signos especificado por el byte imm8, véase Tabla 5-17. El resultado convertido está escrito al elemento bajo del operando de destino usando máscara de escritura k1. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (SC) se especifica por bits 3:2 del byte inmediato.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

Para cada entrada FP16 valor x, La operación de conversión es:

GetMant(x) = +/-2k|x.significand| where:

```text
         1  |x.significand| < 2
```

El exponente imparcial k depende del rango de intervalo definido por interv y si el exponente de la fuente es incluso o extraño. El signo del resultado final está determinado por el control de signos y el signo fuente y el bit de la fracción principal.

El valor codificado de imm8[1:0] y el control de signos se muestran en la tabla 5-17.

Cada resultado FP16 convertido es codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-18 cuando se trata de números especiales coma flotante.

## Operación

```text
VGETMANTSH dest{k1}, src1, src2, imm8
sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

IF k1[0] or *no writemask*:
    dest.fp16[0] := getmant_fp16(src2.fp16[0], // see VGETMANTPH
                                        sign_control,
                                        normalization_interval)

ELSE IF *zeroing*:
    dest.fp16[0] := 0

//else dest.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTSH __m128h _mm_getmant_round_sh (__m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_mask_getmant_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_maskz_getmant_round_sh (__mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTSH __m128h _mm_getmant_sh (__m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTSH __m128h _mm_mask_getmant_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTSH __m128h _mm_maskz_getmant_sh (__mmask8 k, __m128h a, __m128h b, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
```

## SIMD coma flotante Excepciones

Invalid, Denormal

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
