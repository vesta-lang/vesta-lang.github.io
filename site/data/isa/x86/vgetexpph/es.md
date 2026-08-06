---
summary: Convertir Exponents of Packed FP16 Values a FP16 Values
---

## Descripción

Esta instrucción extrae a los exponentes sesgados de la representación normalizada FP16 de cada elemento palabra del operando de origen (el segundo operando) como valor entero firmado imparcial, o convertir la representación denormal de los datos de entrada a valores de entero negativos imparciales. Cada valor entero del exponente imparcial se convierte en un valor FP16 y se escribe a los elementos de palabra correspondientes del operando de destino (el primer operando) como números FP16.

Los elementos de destino se actualizan según la máscara de escritura.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-8 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(Principalidad)) El piso de notación (x) representa el número máximo entero no superior al número real x.

El uso de software de las instrucciones VGETEXPxx y VGETMANTxx generalmente implica una combinación de operación GETEXP y operación GETMANT (ver VGETMANTPH). Así, la instrucción VGETEXPPH no requiere software a las excepciones descriptor SIMD coma flotante.

** Casos especiales de VGETEXPPH/VGETEXPSH**

| Entrada operando | Resultado | Comentarios |
| --- | --- | --- |
| src1 = NaN | QNaN(src1) |  |
| 0 < \|src1\| < INF | floor(log2(\ impersrc1\ eterna)) | Si (SRC = SNaN), entonces #IE. |
| \| src1\| = +INF | +INF | Si (SRC = denormal), entonces #DE. |
| \| src1\| = 0 | -INF |  |

## Operación

```text
def normalize_exponent_tiny_fp16(src):

jbit := 0

// src & dst are FP16 numbers with sign(1b), exp(5b) and fraction (10b) fields

dst.exp := 1                    // write bits 14:10

dst.fraction := src.fraction // copy bits 9:0

while jbit == 0:

       jbit := dst.fraction[9]  // msb of the fraction

       dst.fraction := dst.fraction << 1

       dst.exp := dst.exp - 1

dst.fraction := 0

return dst

def getexp_fp16(src):

src.sign := 0                   // make positive

exponent_all_ones := (src[14:10] == 0x1F)

exponent_all_zeros := (src[14:10] == 0)

mantissa_all_zeros := (src[9:0] == 0)

zero := exponent_all_zeros and mantissa_all_zeros

signaling_bit := src[9]

nan := exponent_all_ones and not(mantissa_all_zeros)
snan := nan and not(signaling_bit)
qnan := nan and signaling_bit
positive_infinity := not(negative) and exponent_all_ones and mantissa_all_zeros
denormal := exponent_all_zeros and not(mantissa_all_zeros)

if nan:

       if snan:

           MXCSR.IE := 1

       return qnan(src)         // convert snan to a qnan

if positive_infinity:

       return src

if zero:

       return -INF

if denormal:

       tmp := normalize_exponent_tiny_fp16(src)

       MXCSR.DE := 1

else:

       tmp := src

tmp := SAR(tmp, 10)             // shift arithmetic right

tmp := tmp - 15                 // subtract bias

return convert_integer_to_fp16(tmp)


VGETEXPPH dest{k1}, src
VL = 128, 256 or 512
KL := VL/16

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
          IF SRC is memory and (EVEX.b = 1):
                tsrc := src.fp16[0]
          ELSE:
                tsrc := src.fp16[i]
          DEST.fp16[i] := getexp_fp16(tsrc)
    ELSE IF *zeroing*:
          DEST.fp16[i] := 0
    //else DEST.fp16[i] remains unchanged

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPPH __m128h _mm_getexp_ph (__m128h a);
VGETEXPPH __m128h _mm_mask_getexp_ph (__m128h src, __mmask8 k, __m128h a);
VGETEXPPH __m128h _mm_maskz_getexp_ph (__mmask8 k, __m128h a);
VGETEXPPH __m256h _mm256_getexp_ph (__m256h a);
VGETEXPPH __m256h _mm256_mask_getexp_ph (__m256h src, __mmask16 k, __m256h a);
VGETEXPPH __m256h _mm256_maskz_getexp_ph (__mmask16 k, __m256h a);
VGETEXPPH __m512h _mm512_getexp_ph (__m512h a);
VGETEXPPH __m512h _mm512_mask_getexp_ph (__m512h src, __mmask32 k, __m512h a);
VGETEXPPH __m512h _mm512_maskz_getexp_ph (__mmask32 k, __m512h a);
VGETEXPPH __m512h _mm512_getexp_round_ph (__m512h a, const int sae);
VGETEXPPH __m512h _mm512_mask_getexp_round_ph (__m512h src, __mmask32 k, __m512h a, const int sae);
VGETEXPPH __m512h _mm512_maskz_getexp_round_ph (__mmask32 k, __m512h a, const int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
