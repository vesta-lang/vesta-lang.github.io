---
summary: Ampliar valores Byte/Word
---

## Descripción

Expande (cargas) hasta 64 valores enteros de byte o 32 valores enteros de palabras del operando de origen (operando de memoria) al operando de destino (registr operando), basado en los elementos activos determinados por la máscara de escritura operando.

Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Mueva 128, 256 o 512 bits de valores enteros de byte empaquetados del operando de origen (operando de memoria) al operando de destino (register operando). Esta instrucción se utiliza para cargar desde un registro vectorial int8 o ubicación de memoria

al insertar los datos en elementos escasos del registro vectorial de destino utilizando los elementos activos señalados por el operando máscara de escritura.

Esta instrucción admite la supresión de la falla de memoria.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VPEXPANDB

(KL, VL) = (16, 128), (32, 256), (64, 512)

k := 0

FOR j := 0 TO KL-1:

IF k1[j] OR *no writemask*:

        DEST.byte[j] := SRC.byte[k];

        k := k + 1

        ELSE:

           IF *merging-masking*:

                    *DEST.byte[j] remains unchanged*

                    ELSE:                   ; zeroing-masking

                     DEST.byte[j] := 0

DEST[MAX_VL-1:VL] := 0

VPEXPANDW

(KL, VL) = (8,128), (16,256), (32, 512)

k := 0

FOR j := 0 TO KL-1:

IF k1[j] OR *no writemask*:

        DEST.word[j] := SRC.word[k];

        k := k + 1

        ELSE:

           IF *merging-masking*:

                    *DEST.word[j] remains unchanged*

                    ELSE:                   ; zeroing-masking

                     DEST.word[j] := 0

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPEXPAND __m128i _mm_mask_expand_epi8(__m128i, __mmask16, __m128i);
VPEXPAND __m128i _mm_maskz_expand_epi8(__mmask16, __m128i);
VPEXPAND __m128i _mm_mask_expandloadu_epi8(__m128i, __mmask16, const void*);
VPEXPAND __m128i _mm_maskz_expandloadu_epi8(__mmask16, const void*);
VPEXPAND __m256i _mm256_mask_expand_epi8(__m256i, __mmask32, __m256i);
VPEXPAND __m256i _mm256_maskz_expand_epi8(__mmask32, __m256i);
VPEXPAND __m256i _mm256_mask_expandloadu_epi8(__m256i, __mmask32, const void*);
VPEXPAND __m256i _mm256_maskz_expandloadu_epi8(__mmask32, const void*);
VPEXPAND __m512i _mm512_mask_expand_epi8(__m512i, __mmask64, __m512i);
VPEXPAND __m512i _mm512_maskz_expand_epi8(__mmask64, __m512i);
VPEXPAND __m512i _mm512_mask_expandloadu_epi8(__m512i, __mmask64, const void*);
VPEXPAND __m512i _mm512_maskz_expandloadu_epi8(__mmask64, const void*);
VPEXPANDW __m128i _mm_mask_expand_epi16(__m128i, __mmask8, __m128i);
VPEXPANDW __m128i _mm_maskz_expand_epi16(__mmask8, __m128i);
VPEXPANDW __m128i _mm_mask_expandloadu_epi16(__m128i, __mmask8, const void*);
VPEXPANDW __m128i _mm_maskz_expandloadu_epi16(__mmask8, const void *);
VPEXPANDW __m256i _mm256_mask_expand_epi16(__m256i, __mmask16, __m256i);
VPEXPANDW __m256i _mm256_maskz_expand_epi16(__mmask16, __m256i);
VPEXPANDW __m256i _mm256_mask_expandloadu_epi16(__m256i, __mmask16, const void*);
VPEXPANDW __m256i _mm256_maskz_expandloadu_epi16(__mmask16, const void*);
VPEXPANDW __m512i _mm512_mask_expand_epi16(__m512i, __mmask32, __m512i);
VPEXPANDW __m512i _mm512_maskz_expand_epi16(__mmask32, __m512i);
VPEXPANDW __m512i _mm512_mask_expandloadu_epi16(__m512i, __mmask32, const void*);
VPEXPANDW __m512i _mm512_maskz_expandloadu_epi16(__mmask32, const void*);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
