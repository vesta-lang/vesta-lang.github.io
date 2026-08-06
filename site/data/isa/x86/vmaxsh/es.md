---
summary: Máximo retorno de escalar FP16 Valores
---

## Descripción

Esta instrucción realiza una comparación de los valores FP16 bajos en el primer operando de origen y el segundo operando de origen y devuelve el valor máximo para el par de valores al operando de destino.

Si los valores que se comparan son tanto 0.0s (de cualquier signo), el valor en el segundo operando (operando de origen) es devuelto. Si un valor en el segundo operando es un SNaN, entonces SNaN se envía sin cambios al destino (es decir, una versión QNaN del SNaN no se devuelve).

Si sólo un valor es un NaN (SNaN o QNaN) para esta instrucción, el segundo operando (operando de origen), ya sea un NaN o un valor en coma flotante válido, está escrito al resultado. Si en lugar de este comportamiento, se requiere que el NaN operando de origen (a partir del primer o segundo operando) sea devuelto, la acción de VMAXSH se puede emular utilizando una secuencia de instrucciones, como, una comparación seguida por AND, ANDN y OR.

Los bits 127:16 del operando de destino son copiados de los bits correspondientes del primer operando de origen. Bits MAXVL-1:128 del operando de destino se ponen a cero. El elemento FP16 bajo del destino se actualiza según la máscara de escritura.

## Operación

```text
def MAX(SRC1, SRC2):
    IF (SRC1 = 0.0) and (SRC2 = 0.0):
          DEST := SRC2
    ELSE IF (SRC1 = NaN):
          DEST := SRC2
    ELSE IF (SRC2 = NaN):
          DEST := SRC2
    ELSE IF (SRC1 > SRC2):
          DEST := SRC1
    ELSE:
          DEST := SRC2


VMAXSH dest, src1, src2
IF k1[0] OR *no writemask*:

    DEST.fp16[0] := MAX(SRC1.fp16[0], SRC2.fp16[0])
ELSE IF *zeroing*:

    DEST.fp16[0] := 0
// else dest.fp16[j] remains unchanged

DEST[127:16] := SRC1[127:16]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VMAXSH __m128h _mm_mask_max_round_sh (__m128h src, __mmask8 k, __m128h a, __m128h b, int sae);
VMAXSH __m128h _mm_maskz_max_round_sh (__mmask8 k, __m128h a, __m128h b, int sae);
VMAXSH __m128h _mm_max_round_sh (__m128h a, __m128h b, int sae);
VMAXSH __m128h _mm_mask_max_sh (__m128h src, __mmask8 k, __m128h a, __m128h b);
VMAXSH __m128h _mm_maskz_max_sh (__mmask8 k, __m128h a, __m128h b);
VMAXSH __m128h _mm_max_sh (__m128h a, __m128h b);
```

## SIMD coma flotante Excepciones

Invalid, Denormal

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
