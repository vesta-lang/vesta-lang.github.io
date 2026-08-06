---
summary: Permute Packed Bytes Elements
---

## Descripción

Copias de bytes del segundo operando de origen (el tercer operando) al operando de destino (el primer operando) según los índices de byte en el primer operando de origen (el segundo operando). Tenga en cuenta que esta instrucción permite que un byte en el operando de origen sea copiado a más de un lugar en el operando de destino.

Sólo los bits bajos 6(EVEX.512)/5(EVEX.256)/4(EVEX.128) de cada índice de byte se utiliza para seleccionar la ubicación del byte fuente del segundo operando de origen.

El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria. El operando de destino es un registro ZMM/YMM/XMM actualizado a byte granularity por la máscara de escritura k1.

## Operación

```text
VPERMB (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
IF VL = 128:

    n := 3;
ELSE IF VL = 256:

    n := 4;
ELSE IF VL = 512:

    n := 5;
FI;
FOR j := 0 TO KL-1:

    id := SRC1[j*8 + n : j*8] ; // location of the source byte
    IF k1[j] OR *no writemask* THEN

          DEST[j*8 + 7: j*8] := SRC2[id*8 +7: id*8];
    ELSE IF zeroing-masking THEN

          DEST[j*8 + 7: j*8] := 0;
    *ELSE

          DEST[j*8 + 7: j*8] remains unchanged*
    FI
ENDFOR
DEST[MAX_VL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPERMB __m512i _mm512_permutexvar_epi8( __m512i idx, __m512i a);
VPERMB __m512i _mm512_mask_permutexvar_epi8(__m512i s, __mmask64 k, __m512i idx, __m512i a);
VPERMB __m512i _mm512_maskz_permutexvar_epi8( __mmask64 k, __m512i idx, __m512i a);
VPERMB __m256i _mm256_permutexvar_epi8( __m256i idx, __m256i a);
VPERMB __m256i _mm256_mask_permutexvar_epi8(__m256i s, __mmask32 k, __m256i idx, __m256i a);
VPERMB __m256i _mm256_maskz_permutexvar_epi8( __mmask32 k, __m256i idx, __m256i a);
VPERMB __m128i _mm_permutexvar_epi8( __m128i idx, __m128i a);
VPERMB __m128i _mm_mask_permutexvar_epi8(__m128i s, __mmask16 k, __m128i idx, __m128i a);
VPERMB __m128i _mm_maskz_permutexvar_epi8( __mmask16 k, __m128i idx, __m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
