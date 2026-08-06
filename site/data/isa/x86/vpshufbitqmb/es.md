---
summary: Los fragmentos de Shuffle de los elementos de Quadword usando índices de byte Into Mask
---

## Descripción

La instrucción VPSHUFBITQMB realiza un poco de recogida selecciona usando la segunda fuente como control y primera fuente como datos. Cada bit utiliza 6 bits de control (2nd operando de origen) para seleccionar qué bit de datos se va a recopilar (primer operando de origen). Un bit dado sólo puede acceder a 64 bits diferentes de datos (los primeros 64 bits de destino pueden acceder a los primeros 64 bits de datos, los segundos 64 bits de destino pueden acceder a los segundos 64 bits de datos, etc.).

Los datos de control para cada bit de salida se almacenan en 8 bits de SRC2, pero sólo se utilizan los 6 bits menos significativo de cada elemento.

Esta instrucción utiliza enmascaramiento de escritura (sólo cero). Esta instrucción admite la supresión de la falla de memoria.

El primer operando de origen es un registro ZMM. El segundo operando de origen es un registro ZMM o una ubicación de memoria. El operando de destino es un registro de máscaras.

## Operación

```text
VPSHUFBITQMB DEST, SRC1, SRC2

(KL, VL) = (16,128), (32,256), (64, 512)

FOR i := 0 TO KL/8-1:      //Qword

FOR j := 0 to 7:           // Byte

IF k2[i*8+j] or *no writemask*:

           m := SRC2.qword[i].byte[j] & 0x3F

           k1[i*8+j] := SRC1.qword[i].bit[m]

ELSE:

           k1[i*8+j] := 0

k1[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSHUFBITQMB __mmask16 _mm_bitshuffle_epi64_mask(__m128i, __m128i);
VPSHUFBITQMB __mmask16 _mm_mask_bitshuffle_epi64_mask(__mmask16, __m128i, __m128i);
VPSHUFBITQMB __mmask32 _mm256_bitshuffle_epi64_mask(__m256i, __m256i);
VPSHUFBITQMB __mmask32 _mm256_mask_bitshuffle_epi64_mask(__mmask32, __m256i, __m256i);
VPSHUFBITQMB __mmask64 _mm512_bitshuffle_epi64_mask(__m512i, __m512i);
VPSHUFBITQMB __mmask64 _mm512_mask_bitshuffle_epi64_mask(__mmask64, __m512i, __m512i);
```
