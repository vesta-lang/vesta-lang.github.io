---
summary: Carga Sparse valores en coma flotante de precisión doble empaquetados De Memoria Dense
---

## Descripción

Ampliar (carga) hasta 8/4/2, contiguo, valores en coma flotante de precisión doble del vector de entrada en el operando de origen (el segundo operando) a elementos escasos en el operando de destino (el primer operando) seleccionado por la máscara de escritura k1.

El operando de destino es un registro ZMM/YMM/XMM, el operando de origen puede ser un registro ZMM/YMM/XMM o un registro 512/256/128-bit ubicación de memoria.

El vector de entrada comienza desde el elemento más bajo del operando de origen. La máscara de escritura registra k1 selecciona los elementos de destino (un vector parcial o elementos escasos si menos de 8 elementos) para ser reemplazados por los elementos ascendentes en el vector de entrada. Los elementos de destino no seleccionados por la máscara de escritura k1 son sin modificar o cero, dependiendo de EVEX.z.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VEXPANDPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

        THEN

             DEST[i+63:i] := SRC[k+63:k];

             k := k + 64

        ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                    THEN DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VEXPANDPD __m512d _mm512_mask_expand_pd( __m512d s, __mmask8 k, __m512d a);
VEXPANDPD __m512d _mm512_maskz_expand_pd( __mmask8 k, __m512d a);
VEXPANDPD __m512d _mm512_mask_expandloadu_pd( __m512d s, __mmask8 k, void * a);
VEXPANDPD __m512d _mm512_maskz_expandloadu_pd( __mmask8 k, void * a);
VEXPANDPD __m256d _mm256_mask_expand_pd( __m256d s, __mmask8 k, __m256d a);
VEXPANDPD __m256d _mm256_maskz_expand_pd( __mmask8 k, __m256d a);
VEXPANDPD __m256d _mm256_mask_expandloadu_pd( __m256d s, __mmask8 k, void * a);
VEXPANDPD __m256d _mm256_maskz_expandloadu_pd( __mmask8 k, void * a);
VEXPANDPD __m128d _mm_mask_expand_pd( __m128d s, __mmask8 k, __m128d a);
VEXPANDPD __m128d _mm_maskz_expand_pd( __mmask8 k, __m128d a);
VEXPANDPD __m128d _mm_mask_expandloadu_pd( __m128d s, __mmask8 k, void * a);
VEXPANDPD __m128d _mm_maskz_expandloadu_pd( __mmask8 k, void * a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."

Additionally:

```text
#UD                       If EVEX.vvvv != 1111B.
```
