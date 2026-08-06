---
summary: Extract Float32 Vector de Mantissas Normalizadas de Float32 Vector
---

## Descripción

Convertir valores flotantes de precisión única en el operando de origen (el segundo operando) a valores de punto flotante de precisión simple con la normalización de mantissa y el control de signos especificados por el byte imm8, ver Figura 5-15. Los resultados convertidos se escriben al operando de destino (el primer operando) utilizando máscara de escritura k1. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (sc) se especifica por bits 3:2 del byte inmediato.

El operando de destino es un registro ZMM/YMM/XMM actualizado bajo la máscara de escritura. El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits.

Para cada entrada valor en coma flotante de precisión simple x, La operación de conversión es:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

El exponente imparcial k puede ser de 0 o -1, dependiendo del rango de intervalo definido por interv, el rango del significado y si el exponente de la fuente es incluso o extraño. El signo del resultado final es determinado por sc y el signo fuente. El valor codificado de imm8[1:0] y el control de signos se muestran en la Figura 5-15.

Cada resultado coma flotante de precisión simple convertido es codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-16 cuando se trata de números especiales coma flotante.

Esta instrucción se escribe, por lo que sólo los elementos con el bit correspondiente fijado en el registro de máscaras vectoriales k1 se computan y almacenan en el destino. Elementos en zmm1 con el bit correspondiente claro en k1 conservan sus valores anteriores.

Nota: EVEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0; de lo contrario las instrucciones #UD.

## Operación

```text
def getmant_fp32(src, sign_control, normalization_interval):
    bias := 127
    dst.sign := sign_control[0] ? 0 : src.sign
    signed_one := sign_control[0] ? +1.0 : -1.0
    dst.exp := src.exp
    dst.fraction := src.fraction
    zero := (dst.exp = 0) and ((dst.fraction = 0) or (MXCSR.DAZ=1))
    denormal := (dst.exp = 0) and (dst.fraction != 0) and (MXCSR.DAZ=0)
    infinity := (dst.exp = 0xFF) and (dst.fraction = 0)
    nan := (dst.exp = 0xFF) and (dst.fraction != 0)
    src_signaling := src.fraction[22]
    snan := nan and (src_signaling = 0)
    positive := (src.sign = 0)
    negative := (src.sign = 1)
    if nan:
          if snan:
                MXCSR.IE := 1
          return qnan(src)

    if positive and (zero or infinity):
          return 1.0

    if negative:
          if zero:
                return signed_one
          if infinity:
                if sign_control[1]:
                       MXCSR.IE := 1
                       return QNaN_Indefinite
                return signed_one
          if sign_control[1]:
                MXCSR.IE := 1
                return QNaN_Indefinite

    if denormal:
          jbit := 0
          dst.exp := bias
          while jbit = 0:
                jbit := dst.fraction[22]
                dst.fraction := dst.fraction << 1
                dst.exp : = dst.exp - 1
          MXCSR.DE := 1

    unbiased_exp := dst.exp - bias
    odd_exp := unbiased_exp[0]
    signaling_bit := dst.fraction[22]
    if normalization_interval = 0b00:

          dst.exp := bias
    else if normalization_interval = 0b01:

          dst.exp := odd_exp ? bias-1 : bias
    else if normalization_interval = 0b10:

          dst.exp := bias-1
    else if normalization_interval = 0b11:

          dst.exp := signaling_bit ? bias-1 : bias


return dst

VGETMANTPS (EVEX encoded versions)
VGETMANTPS dest{k1}, src, imm8
VL = 128, 256, or 512
KL := VL / 32
sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.float[0]
          ELSE:
                tsrc := src.float[i]
          DEST.float[i] := getmant_fp32(tsrc, sign_control, normalization_interval)
    ELSE IF *zeroing*:
          DEST.float[i] := 0
    //else DEST.float[i] remains unchanged

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTPS __m512 _mm512_getmant_ps( __m512 a, enum intv, enum sgn);
VGETMANTPS __m512 _mm512_maskz_getmant_ps(__mmask16 k, __m512 a, enum intv, enum sgn);
VGETMANTPS __m512 _mm512_getmant_round_ps( __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m512 _mm512_mask_getmant_round_ps(__m512 s, __mmask16 k, __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m512 _mm512_maskz_getmant_round_ps(__mmask16 k, __m512 a, enum intv, enum sgn, int r);
VGETMANTPS __m256 _mm256_getmant_ps( __m256 a, enum intv, enum sgn);
VGETMANTPS __m256 _mm256_mask_getmant_ps(__m256 s, __mmask8 k, __m256 a, enum intv, enum sgn);
VGETMANTPS __m256 _mm256_maskz_getmant_ps( __mmask8 k, __m256 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_getmant_ps( __m128 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_mask_getmant_ps(__m128 s, __mmask8 k, __m128 a, enum intv, enum sgn);
VGETMANTPS __m128 _mm_maskz_getmant_ps( __mmask8 k, __m128 a, enum intv, enum sgn);
```

## SIMD coma flotante Excepciones

Denormal, Invalid.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

```text
#UD               If EVEX.vvvv != 1111B.
```
