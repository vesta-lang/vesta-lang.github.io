---
summary: Extract Float64 Vector de Mantissas Normalizadas De Float64 Vector
---

## Descripción

Convertir valores flotantes de doble precisión en el operando de origen (el segundo operando) a valores flotantes de doble precisión con la normalización de mantissa y el control de signos especificados por el byte imm8, ver Figura 5-15. Los resultados convertidos se escriben al operando de destino (el primer operando) utilizando máscara de escritura k1. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (sc) se especifica por bits 3:2 del byte inmediato.

El operando de destino es un registro ZMM/YMM/XMM actualizado bajo la máscara de escritura. El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits.

```text
             7            6             5   4           3                                           2  1          0
```

```text
       imm8               Must Be Zero                     Sign Control (SC)                           Normaiization Interval
```

```text
                          Imm8[3:2] = 00b : sign(SRC)                                                  Imm8[1:0] = 00b : Interval is [ 1, 2)
                          Imm8[3:2] = 01b : 0                                                          Imm8[1:0] = 01b : Interval is [1/2, 2)
                          Imm8[3] = 1b : qNan_Indefinite if sign(SRC) != 0, regardless of imm8[2].     Imm8[1:0] = 10b : Interval is [ 1/2, 1)
```

Imm8[1:0] = 11b : Interval is [3/4, 3/2)

Figura 5-15. Controles Imm8 para VGETMANTPD/SD/PS/SS

Para cada entrada valor en coma flotante de precisión doble x, La operación de conversión es: GetMant(x) = +/-2k vidasx.significand

where: 1 <= |x.significand| < 2

El exponente imparcial k puede ser de 0 o -1, dependiendo del rango de intervalo definido por interv, el rango del significado y si el exponente de la fuente es incluso o extraño. El signo del resultado final es determinado por sc y el signo fuente. El valor codificado de imm8[1:0] y el control de signos se muestran en la Figura 5-15.

Cada resultado coma flotante de precisión doble convertido es codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-16 cuando se trata de números especiales coma flotante.

Esta instrucción se escribe, por lo que sólo los elementos con el bit correspondiente fijado en el registro de máscaras vectoriales k1 se computan y almacenan en el destino. Elementos en zmm1 con el bit correspondiente claro en k1 conservan sus valores anteriores.

Nota: EVEX.vvvv está reservado y debe ser 1111b; de lo contrario las instrucciones #UD.

Tabla de resultados de entrada 5-16. GetMant() Special Float Values Behavior Excepciones / Comentarios

NaN QNaN(SRC) Ignore interv Si (SRC = SNaN) entonces #IE

+         1.0 Ignore interv Ignore interv +0 1.0

-0        IF (SC[0]) THEN +1.0                                                  Ignore interv

```text
                  ELSE -1.0
```

-         IF (SC[1]) THEN {QNaN_Indefinite}                                     Ignore interv negative  ELSE {                                                                If (SC[1]) then #IE If (SC[1]) then #IE

```text
            IF (SC[0]) THEN +1.0
                         ELSE -1.0
```

SC[1] ? QNaN_Indefinite : Getmant(SRC)1

NOTES: 1. En caso de SC[1]==0, el signo de Getmant (SRC) es declarado según SC[0].

## Operación

```text
def getmant_fp64(src, sign_control, normalization_interval):
    bias := 1023
    dst.sign := sign_control[0] ? 0 : src.sign
    signed_one := sign_control[0] ? +1.0 : -1.0
    dst.exp := src.exp
    dst.fraction := src.fraction
    zero := (dst.exp = 0) and ((dst.fraction = 0) or (MXCSR.DAZ=1))
    denormal := (dst.exp = 0) and (dst.fraction != 0) and (MXCSR.DAZ=0)
    infinity := (dst.exp = 0x7FF) and (dst.fraction = 0)
    nan := (dst.exp = 0x7FF) and (dst.fraction != 0)
    src_signaling := src.fraction[51]
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
            jbit := dst.fraction[51]
            dst.fraction := dst.fraction << 1
            dst.exp : = dst.exp - 1
      MXCSR.DE := 1

unbiased_exp := dst.exp - bias
odd_exp := unbiased_exp[0]
signaling_bit := dst.fraction[51]
if normalization_interval = 0b00:

      dst.exp := bias
else if normalization_interval = 0b01:

      dst.exp := odd_exp ? bias-1 : bias
else if normalization_interval = 0b10:

      dst.exp := bias-1
else if normalization_interval = 0b11:

      dst.exp := signaling_bit ? bias-1 : bias
return dst


VGETMANTPD (EVEX Encoded Versions)
VGETMANTPD dest{k1}, src, imm8
VL = 128, 256, or 512
KL := VL / 64
sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.double[0]
          ELSE:
                tsrc := src.double[i]
          DEST.double[i] := getmant_fp64(tsrc, sign_control, normalization_interval)
    ELSE IF *zeroing*:
          DEST.double[i] := 0
    //else DEST.double[i] remains unchanged

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTPD __m512d _mm512_getmant_pd( __m512d a, enum intv, enum sgn);
VGETMANTPD __m512d _mm512_mask_getmant_pd(__m512d s, __mmask8 k, __m512d a, enum intv, enum sgn);
VGETMANTPD __m512d _mm512_maskz_getmant_pd( __mmask8 k, __m512d a, enum intv, enum sgn);
VGETMANTPD __m512d _mm512_getmant_round_pd( __m512d a, enum intv, enum sgn, int r);
VGETMANTPD __m512d _mm512_mask_getmant_round_pd(__m512d s, __mmask8 k, __m512d a, enum intv, enum sgn, int r);
VGETMANTPD __m512d _mm512_maskz_getmant_round_pd( __mmask8 k, __m512d a, enum intv, enum sgn, int r);
VGETMANTPD __m256d _mm256_getmant_pd( __m256d a, enum intv, enum sgn);
VGETMANTPD __m256d _mm256_mask_getmant_pd(__m256d s, __mmask8 k, __m256d a, enum intv, enum sgn);
VGETMANTPD __m256d _mm256_maskz_getmant_pd( __mmask8 k, __m256d a, enum intv, enum sgn);
VGETMANTPD __m128d _mm_getmant_pd( __m128d a, enum intv, enum sgn);
VGETMANTPD __m128d _mm_mask_getmant_pd(__m128d s, __mmask8 k, __m128d a, enum intv, enum sgn);
VGETMANTPD __m128d _mm_maskz_getmant_pd( __mmask8 k, __m128d a, enum intv, enum sgn);
```

## SIMD coma flotante Excepciones

Denormal, Invalid.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
