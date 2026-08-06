---
summary: Extract FP16 Vector de Mantissas Normalizadas de FP16 Vector
---

## Descripción

Esta instrucción convierte los valores FP16 en el operando de origen (el segundo operando) a los valores FP16 con la normalización mantissa y el control de signos especificados por el byte imm8, véase Tabla 5-17. Los resultados convertidos se escriben al operando de destino (el primer operando) utilizando máscara de escritura k1. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (SC) se especifica por bits 3:2 del byte inmediato.

Los elementos de destino se actualizan según la máscara de escritura.

imm8 Bits Tabla 5-17. Controles imm8 para VGETMANTPH/VGETMANTSH imm8[7:4] imm8[3:2] Definición

imm8[1:0]                        Must be zero.

Control de signos (SC) 0b00: Sign(SRC) 0b01: 0 0b1x: QNaN Indefinite if sign(SRC)!=0

Interv 0b00: Interval is [1, 2) 0b01: Interval is [1/2, 2) 0b10: Interval is [1/2, 1) 0b11: Interval is [3/4, 3/2)

Para cada entrada FP16 valor x, La operación de conversión es:

GetMant(x) = +/-2k|x.significand| where:

```text
         1  |x.significand| < 2
```

El exponente imparcial k depende del rango de intervalo definido por interv y si el exponente de la fuente es incluso o extraño. El signo del resultado final está determinado por el control de signos y el signo fuente y el bit de la fracción principal.

El valor codificado de imm8[1:0] y el control de signos se muestran en la tabla 5-17.

Cada resultado FP16 convertido es codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-18 cuando se trata de números especiales coma flotante.

**GetMant() Special Float Values Behavior**

| Input | Resultado | Excepciones / Comentarios |
| --- | --- | --- |
| Nan | QNaN(SRC) | Ignora el interv. Si (SRC = SNaN), entonces #IE. |
| + | 1.0 | Ignora el interv. |
| +0 | 1.0 | Ignora el interv. |
| -0 | IF (SC[0]) THEN +1.0 ELSE -1.0 | Ignora el interv. |
| - | IF (SC[1]) THEN {QNaN_Indefinite} | Ignora el interv. |
|  | ELSE { IF (SC[0]) THEN +1.0 ELSE -1.0 | Si (SC[1]), entonces #IE. |
| negativo | SC[1] Getmant(SRC)1 | Si (SC[1]), entonces #IE. |

## Operación

```text
def getmant_fp16(src, sign_control, normalization_interval):
    bias := 15
    dst.sign := sign_control[0] ? 0 : src.sign
    signed_one := sign_control[0] ? +1.0 : -1.0
    dst.exp := src.exp
    dst.fraction := src.fraction
    zero := (dst.exp = 0) and (dst.fraction = 0)
    denormal := (dst.exp = 0) and (dst.fraction != 0)
    infinity := (dst.exp = 0x1F) and (dst.fraction = 0)
    nan := (dst.exp = 0x1F) and (dst.fraction != 0)
    src_signaling := src.fraction[9]
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

dst.exp := bias              // set exponent to bias value

while jbit = 0:

jbit := dst.fraction[9]

dst.fraction := dst.fraction << 1

dst.exp : = dst.exp - 1

MXCSR.DE := 1

unbaiased_exp := dst.exp - bias
odd_exp := unbaiased_exp[0]
signaling_bit := dst.fraction[9]
if normalization_interval = 0b00:

      dst.exp := bias
else if normalization_interval = 0b01:

      dst.exp := odd_exp ? bias-1 : bias
else if normalization_interval = 0b10:

      dst.exp := bias-1
else if normalization_interval = 0b11:

      dst.exp := signaling_bit ? bias-1 : bias
return dst

VGETMANTPH dest{k1}, src, imm8
VL = 128, 256 or 512
KL := VL/16

sign_control := imm8[3:2]
normalization_interval := imm8[1:0]

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := getmant_fp16(tsrc, sign_control, normalization_interval)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTPH __m128h _mm_getmant_ph (__m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m128h _mm_mask_getmant_ph (__m128h src, __mmask8 k, __m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m128h _mm_maskz_getmant_ph (__mmask8 k, __m128h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_getmant_ph (__m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_mask_getmant_ph (__m256h src, __mmask16 k, __m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m256h _mm256_maskz_getmant_ph (__mmask16 k, __m256h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_getmant_ph (__m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_mask_getmant_ph (__m512h src, __mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_maskz_getmant_ph (__mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign);
VGETMANTPH __m512h _mm512_getmant_round_ph (__m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTPH __m512h _mm512_mask_getmant_round_ph (__m512h src, __mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
VGETMANTPH __m512h _mm512_maskz_getmant_round_ph (__mmask32 k, __m512h a, _MM_MANTISSA_NORM_ENUM norm, _MM_MANTISSA_SIGN_ENUM sign, const int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
