---
summary: Tienda Sparse valores en coma flotante de precisión doble empaquetados Into Dense
---

## Descripción

Compresss (store) hasta 8valores en coma flotante de precisión dobledesdeel operando de origen(el segundo)operando) como un vector contiguoel operando de destino(el primero)operando) el operando de origenes unZMM/YMM/XMMregistro,el operando de destinopuede serZMM/YMM/XMMregistro o un 512/256/128-bitubicación de memoria.

El registro de omasco k1 selecciona los elementos activos ( vector parcial o posiblemente no contiguo si menos de 8 elementos activos) del operando de origen para comprimir en un vector contiguo. El vector contiguo está escrito al destino a partir del elemento bajo del operando de destino.

Versión de destino de memoria: Sólo el vector contiguo está escrito al destino ubicación de memoria. EVEX.z debe ser cero.

Versión de destino del registro: Si la longitud vectorial del vector contiguo es menor que la del vector de entrada en el operando de origen, los bits superiores del registro de destino son sin modificar si EVEX.z no está fijado, de lo contrario los bits superiores se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VCOMPRESSPD (EVEX Encoded Versions) Store Form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+63:i]
                k := k + SIZE

    FI;

ENDFOR

VCOMPRESSPD (EVEX Encoded Versions) Reg-Reg Form
(KL, VL) = (2, 128), (4, 256), (8, 512)
SIZE := 64
k := 0
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+63:i]
                k := k + SIZE

    FI;
ENDFOR

IF *merging-masking*

            THEN *DEST[VL-1:k] remains unchanged*

            ELSE DEST[VL-1:k] := 0

FI

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCOMPRESSPD __m512d _mm512_mask_compress_pd( __m512d s, __mmask8 k, __m512d a);
VCOMPRESSPD __m512d _mm512_maskz_compress_pd( __mmask8 k, __m512d a);
VCOMPRESSPD void _mm512_mask_compressstoreu_pd( void * d, __mmask8 k, __m512d a);
VCOMPRESSPD __m256d _mm256_mask_compress_pd( __m256d s, __mmask8 k, __m256d a);
VCOMPRESSPD __m256d _mm256_maskz_compress_pd( __mmask8 k, __m256d a);
VCOMPRESSPD void _mm256_mask_compressstoreu_pd( void * d, __mmask8 k, __m256d a);
VCOMPRESSPD __m128d _mm_mask_compress_pd( __m128d s, __mmask8 k, __m128d a);
VCOMPRESSPD __m128d _mm_maskz_compress_pd( __mmask8 k, __m128d a);
VCOMPRESSPD void _mm_mask_compressstoreu_pd( void * d, __mmask8 k, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
