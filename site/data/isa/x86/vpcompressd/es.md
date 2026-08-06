---
summary: Tienda Sparse Packed Doubleword Integer Values Into Dense Memory/Register
---

## Descripción

Compress (store) hasta 16/8/4 valores enteros de doble palabra del operando de origen (segundo operando) al operando de destino (primer operando). El operando de origen es un registro ZMM/YMM/XMM, el operando de destino puede ser un registro ZMM/YMM/XMM o un registro 512/256/128-bit ubicación de memoria.

El registro de omasco k1 selecciona los elementos activos ( vector parcial o posiblemente no contiguo si menos de 16 elementos activos) del operando de origen para comprimir en un vector contiguo. El vector contiguo está escrito al destino a partir del elemento bajo del operando de destino.

Versión de destino de memoria: Sólo el vector contiguo está escrito al destino ubicación de memoria. EVEX.z debe ser cero.

Versión de destino del registro: Si la longitud vectorial del vector contiguo es menor que la del vector de entrada en el operando de origen, los bits superiores del registro de destino son sin modificar si EVEX.z no está fijado, de lo contrario los bits superiores se ponen a cero.

Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VPCOMPRESSD (EVEX encoded versions) store form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no controlmask*

          THEN
                DEST[k+SIZE-1:k] := SRC[i+31:i]
                k := k + SIZE

    FI;

ENDFOR;

VPCOMPRESSD (EVEX encoded versions) reg-reg form
(KL, VL) = (4, 128), (8, 256), (16, 512)
SIZE := 32
k := 0
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no controlmask*

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
VPCOMPRESSD __m512i _mm512_mask_compress_epi32(__m512i s, __mmask16 c, __m512i a);
VPCOMPRESSD __m512i _mm512_maskz_compress_epi32( __mmask16 c, __m512i a);
VPCOMPRESSD void _mm512_mask_compressstoreu_epi32(void * a, __mmask16 c, __m512i s);
VPCOMPRESSD __m256i _mm256_mask_compress_epi32(__m256i s, __mmask8 c, __m256i a);
VPCOMPRESSD __m256i _mm256_maskz_compress_epi32( __mmask8 c, __m256i a);
VPCOMPRESSD void _mm256_mask_compressstoreu_epi32(void * a, __mmask8 c, __m256i s);
VPCOMPRESSD __m128i _mm_mask_compress_epi32(__m128i s, __mmask8 c, __m128i a);
VPCOMPRESSD __m128i _mm_maskz_compress_epi32( __mmask8 c, __m128i a);
VPCOMPRESSD void _mm_mask_compressstoreu_epi32(void * a, __mmask8 c, __m128i s);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
