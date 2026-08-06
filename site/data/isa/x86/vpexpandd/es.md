---
summary: Carga Sparse Packed Doubleword Integer Values From Dense Memory/Register
---

## Descripción

Ampliar (carga) hasta 16 valores enteros de doble palabra contiguos del vector de entrada en el operando de origen (el segundo operando) a elementos escasos en el operando de destino (el primer operando), seleccionado por la máscara de escritura k1. El operando de destino es un registro ZMM, el operando de origen puede ser un registro ZMM o ubicación de memoria.

El vector de entrada comienza desde el elemento más bajo del operando de origen. El registro de opmasco k1 selecciona los elementos de destino (un vector parcial o elementos escasos si menos de 8 elementos) para ser reemplazados por los elementos ascendentes en el vector de entrada. Los elementos de destino no seleccionados por la máscara de escritura k1 son sin modificar o cero, dependiendo de EVEX.z.

Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VPEXPANDD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

        THEN

             DEST[i+31:i] := SRC[k+31:k];

             k := k + 32

        ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPEXPANDD __m512i _mm512_mask_expandloadu_epi32(__m512i s, __mmask16 k, void * a);
VPEXPANDD __m512i _mm512_maskz_expandloadu_epi32( __mmask16 k, void * a);
VPEXPANDD __m512i _mm512_mask_expand_epi32(__m512i s, __mmask16 k, __m512i a);
VPEXPANDD __m512i _mm512_maskz_expand_epi32( __mmask16 k, __m512i a);
VPEXPANDD __m256i _mm256_mask_expandloadu_epi32(__m256i s, __mmask8 k, void * a);
VPEXPANDD __m256i _mm256_maskz_expandloadu_epi32( __mmask8 k, void * a);
VPEXPANDD __m256i _mm256_mask_expand_epi32(__m256i s, __mmask8 k, __m256i a);
VPEXPANDD __m256i _mm256_maskz_expand_epi32( __mmask8 k, __m256i a);
VPEXPANDD __m128i _mm_mask_expandloadu_epi32(__m128i s, __mmask8 k, void * a);
VPEXPANDD __m128i _mm_maskz_expandloadu_epi32( __mmask8 k, void * a);
VPEXPANDD __m128i _mm_mask_expand_epi32(__m128i s, __mmask8 k, __m128i a);
VPEXPANDD __m128i _mm_maskz_expand_epi32( __mmask8 k, __m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
