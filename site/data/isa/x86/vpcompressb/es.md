---
summary: Tienda Sparse Packed Byte/Word Integer Values Into Dense
---

## Descripción

Compress (stores) hasta 64 valores byte o 32 valores de palabras del operando de origen (segundo operando) al operando de destino (primer operando), basado en los elementos activos determinados por la máscara de escritura operando. Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Se mueve hasta 512 bits de valores de byte empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se utiliza para almacenar contenidos parciales de un registro vectorial en un vector de byte o ubicación de memoria simple utilizando los elementos activos en operando máscara de escritura.

Versión de destino de memoria: Sólo el vector contiguo está escrito al destino ubicación de memoria. EVEX.z debe ser cero.

Versión de destino del registro: Si la longitud vectorial del vector contiguo es menor que la del vector de entrada en el operando de origen, los bits superiores del registro de destino son sin modificar si EVEX.z no está fijado, de lo contrario los bits superiores se ponen a cero.

Esta instrucción admite la supresión de la falla de memoria.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VPCOMPRESSB store form
(KL, VL) = (16, 128), (32, 256), (64, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.byte[k] := SRC.byte[j]
          k := k +1

VPCOMPRESSB reg-reg form
(KL, VL) = (16, 128), (32, 256), (64, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.byte[k] := SRC.byte[j]
          k := k + 1

IF *merging-masking*:
    *DEST[VL-1:k*8] remains unchanged*
    ELSE DEST[VL-1:k*8] := 0

DEST[MAX_VL-1:VL] := 0

VPCOMPRESSW store form
(KL, VL) = (8, 128), (16, 256), (32, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.word[k] := SRC.word[j]
          k := k + 1


VPCOMPRESSW reg-reg form
(KL, VL) = (8, 128), (16, 256), (32, 512)
k := 0
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
          DEST.word[k] := SRC.word[j]
          k := k + 1

IF *merging-masking*:
    *DEST[VL-1:k*16] remains unchanged*
    ELSE DEST[VL-1:k*16] := 0

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCOMPRESSB __m128i _mm_mask_compress_epi8(__m128i, __mmask16, __m128i);
VPCOMPRESSB __m128i _mm_maskz_compress_epi8(__mmask16, __m128i);
VPCOMPRESSB __m256i _mm256_mask_compress_epi8(__m256i, __mmask32, __m256i);
VPCOMPRESSB __m256i _mm256_maskz_compress_epi8(__mmask32, __m256i);
VPCOMPRESSB __m512i _mm512_mask_compress_epi8(__m512i, __mmask64, __m512i);
VPCOMPRESSB __m512i _mm512_maskz_compress_epi8(__mmask64, __m512i);
VPCOMPRESSB void _mm_mask_compressstoreu_epi8(void*, __mmask16, __m128i);
VPCOMPRESSB void _mm256_mask_compressstoreu_epi8(void*, __mmask32, __m256i);
VPCOMPRESSB void _mm512_mask_compressstoreu_epi8(void*, __mmask64, __m512i);
VPCOMPRESSW __m128i _mm_mask_compress_epi16(__m128i, __mmask8, __m128i);
VPCOMPRESSW __m128i _mm_maskz_compress_epi16(__mmask8, __m128i);
VPCOMPRESSW __m256i _mm256_mask_compress_epi16(__m256i, __mmask16, __m256i);
VPCOMPRESSW __m256i _mm256_maskz_compress_epi16(__mmask16, __m256i);
VPCOMPRESSW __m512i _mm512_mask_compress_epi16(__m512i, __mmask32, __m512i);
VPCOMPRESSW __m512i _mm512_maskz_compress_epi16(__mmask32, __m512i);
VPCOMPRESSW void _mm_mask_compressstoreu_epi16(void*, __mmask8, __m128i);
VPCOMPRESSW void _mm256_mask_compressstoreu_epi16(void*, __mmask16, __m256i);
VPCOMPRESSW void _mm512_mask_compressstoreu_epi16(void*, __mmask32, __m512i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
