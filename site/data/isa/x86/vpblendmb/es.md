---
summary: Blend Byte/Word Vectores Usando un Control de Opmask
---

## Descripción

Realiza una mezcla elemento por elemento de elementos byte/word entre el primer operando de origen byte vector register y el segundo operando de origen byte vector de memoria o registro, utilizando la máscara de instrucciones como selector. El resultado está escrito en el registro de vectores byte de destino.

El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El segundo operando de origen puede ser un ZMM/YMM/XMM registro, un 512/256/128-bit ubicación de memoria o un 512/256/128-bit ubicación de memoria.

La máscara no se utiliza como una máscara de escritura para esta instrucción. En su lugar, la máscara se utiliza como selector de elementos: cada elemento del destino se selecciona condicionalmente entre primera fuente o segunda fuente utilizando el valor del bit de máscara relacionado (0 para primera fuente, 1 para segunda fuente).

## Operación

```text
VPBLENDMB (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k1[j] OR *no writemask*

     THEN DEST[i+7:i] := SRC2[i+7:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+7:i] := SRC1[i+7:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+7:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0;

VPBLENDMW (EVEX encoded versions)

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := SRC2[i+15:i]

     ELSE

             IF *merging-masking*                  ; merging-masking

                  THEN DEST[i+15:i] := SRC1[i+15:i]

                  ELSE                             ; zeroing-masking

                    DEST[i+15:i] := 0

             FI;

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPBLENDMB __m512i _mm512_mask_blend_epi8(__mmask64 m, __m512i a, __m512i b);
VPBLENDMB __m256i _mm256_mask_blend_epi8(__mmask32 m, __m256i a, __m256i b);
VPBLENDMB __m128i _mm_mask_blend_epi8(__mmask16 m, __m128i a, __m128i b);
VPBLENDMW __m512i _mm512_mask_blend_epi16(__mmask32 m, __m512i a, __m512i b);
VPBLENDMW __m256i _mm256_mask_blend_epi16(__mmask16 m, __m256i a, __m256i b);
VPBLENDMW __m128i _mm_mask_blend_epi16(__mmask8 m, __m128i a, __m128i b);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
