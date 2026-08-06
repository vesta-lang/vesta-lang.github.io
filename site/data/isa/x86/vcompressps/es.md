---
summary: Tienda Sparse valores en coma flotante de precisión simple empaquetados Into Dense Memory
---

## Descripción

Compresss (stores) hasta 16 valores en coma flotante de precisión simple del operando de origen (el segundo operando) al operando de destino (el primer operando). El operando de origen es un registro ZMM/YMM/XMM, el operando de destino puede ser un registro ZMM/YMM/XMM o un registro 512/256/128-bit ubicación de memoria.

El registro de omasco k1 selecciona los elementos activos (un vector parcial o posiblemente no contiguo si menos de 16 elementos activos) del operando de origen para comprimir en un vector contiguo. El vector contiguo está escrito al destino a partir del elemento bajo del operando de destino.

Versión de destino de memoria: Sólo el vector contiguo está escrito al destino ubicación de memoria. EVEX.z debe ser cero.

Versión de destino del registro: Si la longitud vectorial del vector contiguo es menor que la del vector de entrada en el operando de origen, los bits superiores del registro de destino son sin modificar si EVEX.z no está fijado, de lo contrario los bits superiores se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VCOMPRESSPS (EVEX Encoded Versions) Store Form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+31:i]
                k := k + SIZE

    FI;

ENDFOR;

VCOMPRESSPS (EVEX Encoded Versions) Reg-Reg Form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+31:i]
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
VCOMPRESSPS __m512 _mm512_mask_compress_ps( __m512 s, __mmask16 k, __m512 a);
VCOMPRESSPS __m512 _mm512_maskz_compress_ps( __mmask16 k, __m512 a);
VCOMPRESSPS void _mm512_mask_compressstoreu_ps( void * d, __mmask16 k, __m512 a);
VCOMPRESSPS __m256 _mm256_mask_compress_ps( __m256 s, __mmask8 k, __m256 a);
VCOMPRESSPS __m256 _mm256_maskz_compress_ps( __mmask8 k, __m256 a);
VCOMPRESSPS void _mm256_mask_compressstoreu_ps( void * d, __mmask8 k, __m256 a);
VCOMPRESSPS __m128 _mm_mask_compress_ps( __m128 s, __mmask8 k, __m128 a);
VCOMPRESSPS __m128 _mm_maskz_compress_ps( __mmask8 k, __m128 a);
VCOMPRESSPS void _mm_mask_compressstoreu_ps( void * d, __mmask8 k, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb. en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
