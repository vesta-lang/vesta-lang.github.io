---
summary: Contar el número de ceros de plomo para Dword empaquetado, valores de Qword empaquetado
---

## Descripción

Cuenta el número de bits mas significativo líderes en cada elemento dword o qword del operando de origen (el segundo operando) y almacena los resultados en el registro de destino (el primer operando) de acuerdo a la máscara de escritura. Si un elemento es cero, el resultado de ese elemento es el tamaño de operando del elemento.

EVEX.512 versión codificada: El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPLZCNTD
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    IF MaskBit(j) OR *no writemask*

          THEN
                temp := 32
                DEST[i+31:i] := 0
                WHILE (temp > 0) AND (SRC[i+temp-1] = 0)
                DO
                      temp := temp  1
                      DEST[i+31:i] := DEST[i+31:i] + 1
                OD

          ELSE
            IF *merging-masking*
                THEN *DEST[i+31:i] remains unchanged*
                ELSE DEST[i+31:i] := 0
            FI

    FI
ENDFOR
DEST[MAXVL-1:VL] := 0

VPLZCNTQ
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j*64
    IF MaskBit(j) OR *no writemask*

          THEN
                temp := 64
                DEST[i+63:i] := 0
                WHILE (temp > 0) AND (SRC[i+temp-1] = 0)
                DO
                      temp := temp  1
                      DEST[i+63:i] := DEST[i+63:i] + 1
                OD

          ELSE
            IF *merging-masking*
                THEN *DEST[i+63:i] remains unchanged*
                ELSE DEST[i+63:i] := 0
            FI

    FI
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPLZCNTD __m512i _mm512_lzcnt_epi32(__m512i a);
VPLZCNTD __m512i _mm512_mask_lzcnt_epi32(__m512i s, __mmask16 m, __m512i a);
VPLZCNTD __m512i _mm512_maskz_lzcnt_epi32( __mmask16 m, __m512i a);
VPLZCNTQ __m512i _mm512_lzcnt_epi64(__m512i a);
VPLZCNTQ __m512i _mm512_mask_lzcnt_epi64(__m512i s, __mmask8 m, __m512i a);
VPLZCNTQ __m512i _mm512_maskz_lzcnt_epi64(__mmask8 m, __m512i a);
VPLZCNTD __m256i _mm256_lzcnt_epi32(__m256i a);
VPLZCNTD __m256i _mm256_mask_lzcnt_epi32(__m256i s, __mmask8 m, __m256i a);
VPLZCNTD __m256i _mm256_maskz_lzcnt_epi32( __mmask8 m, __m256i a);
VPLZCNTQ __m256i _mm256_lzcnt_epi64(__m256i a);
VPLZCNTQ __m256i _mm256_mask_lzcnt_epi64(__m256i s, __mmask8 m, __m256i a);
VPLZCNTQ __m256i _mm256_maskz_lzcnt_epi64(__mmask8 m, __m256i a);
VPLZCNTD __m128i _mm_lzcnt_epi32(__m128i a);
VPLZCNTD __m128i _mm_mask_lzcnt_epi32(__m128i s, __mmask8 m, __m128i a);
VPLZCNTD __m128i _mm_maskz_lzcnt_epi32( __mmask8 m, __m128i a);
VPLZCNTQ __m128i _mm_lzcnt_epi64(__m128i a);
VPLZCNTQ __m128i _mm_mask_lzcnt_epi64(__m128i s, __mmask8 m, __m128i a);
VPLZCNTQ __m128i _mm_maskz_lzcnt_epi64(__mmask8 m, __m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
