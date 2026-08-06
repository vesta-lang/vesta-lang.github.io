---
summary: Extract Float64 de Mantissa normalizada de Float64 escalar
---

## Descripción

Convertir los valores flotantes de doble precisión en el elemento de cuádpago bajo del segundo operando de origen (el tercer operando) a valor en coma flotante de precisión doble con la normalización de mantissa y el control de signos especificados por el byte imm8, ver Figura 5-15. El resultado convertido está escrito al elemento de cuádpago bajo del operando de destino (el primer operando) utilizando máscara de escritura k1. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (sc) se especifica por bits 3:2 del byte inmediato.

La operación de conversión es:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

El exponente imparcial k puede ser de 0 o -1, dependiendo del rango de intervalo definido por interv, el rango del significado y si el exponente de la fuente es incluso o extraño. El signo del resultado final es determinado por sc y el signo fuente. El valor codificado de imm8[1:0] y el control de signos se muestran en la Figura 5-15.

El resultado coma flotante de precisión doble convertido está codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-16 cuando se trata de números especiales coma flotante.

Si se utiliza el escribir, el elemento de cuádpago bajo del operando de destino se actualiza condicionalmente dependiendo del valor del registro máscara de escritura k1. Si no se utiliza el escribir, el elemento de cuádpo bajo del operando de destino se actualiza incondicionalmente.

## Operación

```text
// getmant_fp64(src, sign_control, normalization_interval) is defined in the operation section of VGETMANTPD

VGETMANTSD (EVEX encoded version)

SignCtrl[1:0] := IMM8[3:2];

Interv[1:0] := IMM8[1:0];

IF k1[0] OR *no writemask*

     THEN DEST[63:0] :=

           getmant_fp64(src, sign_control, normalization_interval)

     ELSE

     IF *merging-masking*          ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                    ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTSD __m128d _mm_getmant_sd( __m128d a, __m128 b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_mask_getmant_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_maskz_getmant_sd( __mmask8 k, __m128 a, __m128d b, enum intv, enum sgn);
VGETMANTSD __m128d _mm_getmant_round_sd( __m128d a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSD __m128d _mm_mask_getmant_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn, int r);
VGETMANTSD __m128d _mm_maskz_getmant_round_sd( __mmask8 k, __m128d a, __m128d b, enum intv, enum sgn, int r);
```

## SIMD coma flotante Excepciones

Denormal, Invalid

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
