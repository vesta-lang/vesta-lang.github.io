---
summary: Full Permute of Bytes De Dos Tablas Sobreescribir el Índice
---

## Descripción

Permutes byte values in the secondoperando (el primer operando de origen) y el tercerooperando (el segundo operando de origen) utilizando los índices de byte en los primerosoperando (el operando de destino) para seleccionar elementos byte de la segunda o terceraoperandos de origen. Los elementos de byte seleccionados se escriben al destino a byte granularity bajo la máscara de escritura k1.

El primero y segundo operandos son los registros ZMM/YMM/XMM. El primer operando contiene índices de entrada para seleccionar elementos de las dos tablas de entrada en el segundo y tercer operandos. El primer operando es también el destino del resultado. El tercer operando puede ser un ZMM/YMM/XMM registrado, o un 512/256/128-bit ubicación de memoria. En cada byte índice, el bit id para la selección de tablas es bit 6/5/4, y bits [5:0]/[4:0]/[3:0] selecciona el elemento dentro de cada tabla de entrada.

Tenga en cuenta que estas instrucciones permiten copiar un valor byte en los operandos de origen a más de un lugar en el operando de destino. Además, las mismas tablas se pueden reutilizar en las iteraciones posteriores, pero los elementos índice son sobrescritos.

Bits (MAX VL-1:256/128) del destino se ponen a cero para VL=256,128.

## Operación

```text
VPERMI2B (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
IF VL = 128:

    id := 3;
ELSE IF VL = 256:

    id := 4;
ELSE IF VL = 512:

    id := 5;
FI;
TMP_DEST[VL-1:0] := DEST[VL-1:0];
FOR j := 0 TO KL-1

    off := 8*SRC1[j*8 + id: j*8] ;
    IF k1[j] OR *no writemask*:

          DEST[j*8 + 7: j*8] := TMP_DEST[j*8+id+1]? SRC2[off+7:off] : SRC1[off+7:off];
    ELSE IF *zeroing-masking*

          DEST[j*8 + 7: j*8] := 0;
    *ELSE

          DEST[j*8 + 7: j*8] remains unchanged*
    FI;
ENDFOR
DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPERMI2B __m512i _mm512_permutex2var_epi8(__m512i a, __m512i idx, __m512i b);
VPERMI2B __m512i _mm512_mask2_permutex2var_epi8(__m512i a, __m512i idx, __mmask64 k, __m512i b);
VPERMI2B __m512i _mm512_maskz_permutex2var_epi8(__mmask64 k, __m512i a, __m512i idx, __m512i b);
VPERMI2B __m256i _mm256_permutex2var_epi8(__m256i a, __m256i idx, __m256i b);
VPERMI2B __m256i _mm256_mask2_permutex2var_epi8(__m256i a, __m256i idx, __mmask32 k, __m256i b);
VPERMI2B __m256i _mm256_maskz_permutex2var_epi8(__mmask32 k, __m256i a, __m256i idx, __m256i b);
VPERMI2B __m128i _mm_permutex2var_epi8(__m128i a, __m128i idx, __m128i b);
VPERMI2B __m128i _mm_mask2_permutex2var_epi8(__m128i a, __m128i idx, __mmask16 k, __m128i b);
VPERMI2B __m128i _mm_maskz_permutex2var_epi8(__mmask16 k, __m128i a, __m128i idx, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
