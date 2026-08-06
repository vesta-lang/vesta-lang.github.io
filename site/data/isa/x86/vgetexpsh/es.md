---
summary: Convertir Exponents of escalar FP16 Values a FP16 Values
---

## Descripción

Esta instrucción extrae los exponentes sesgados de la representación FP16 normalizada del elemento palabra baja del operando de origen (el segundo operando) como valor entero firmado imparcial, o convertir la representación denormal de los datos de entrada a un valor entero negativo imparcial. El valor entero del exponente imparcial se convierte en un valor FP16 y se escribe al elemento palabra baja del operando de destino (el primer operando) como número FP16.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-14 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(Principalidad)) El piso de notación (x) representa el número máximo entero no superior al número real x.

El uso de software de las instrucciones VGETEXPxx y VGETMANTxx generalmente implica una combinación de operación GETEXP y operación GETMANT (ver VGETMANTSH). Así, la instrucción VGETEXPSH no requiere software a las excepciones descriptor SIMD coma flotante.

## Operación

```text
VGETEXPSH dest{k1}, src1, src2
IF k1[0] or *no writemask*:

    DEST.fp16[0] := getexp_fp16(src2.fp16[0]) // see VGETEXPPH
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
//else DEST.fp16[0] remains unchanged

DEST[127:16] := src1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPSH __m128h _mm_getexp_round_sh (__m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_mask_getexp_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_maskz_getexp_round_sh (__mmask8 k, __m128h a, __m128h b, const int sae);
VGETEXPSH __m128h _mm_getexp_sh (__m128h a, __m128h b);
VGETEXPSH __m128h _mm_mask_getexp_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VGETEXPSH __m128h _mm_maskz_getexp_sh (__mmask8 k, __m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Denormal

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
