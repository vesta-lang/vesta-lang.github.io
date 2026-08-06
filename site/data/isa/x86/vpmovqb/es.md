---
summary: Down Convertir QWord en Byte
---

## Descripción

VPMOVQB abajo convierte elementos enteros de 64 bits en el operando de origen (el segundo operando) en elementos de byte empaquetados utilizando truncation. VPMOVSQB convierte los enteros firmados de 64 bits en los bytes firmados mediante saturación firmada. VPMOVUSQB convierte los valores de cuádruple no firmados en valores byte no firmados usando saturación no firmada. El operando de origen es un registro de vectores. El operando de destino es un registro XMM o una ubicación de memoria.

Los elementos de byte de baja conversión están escritos al operando de destino (el primer operando) del byte menos significativo. Los elementos Byte del operando de destino se actualizan según la máscara de escritura. Bits (MAXVL-1:64) del destino se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateQuadWordToByte (SRC[m+63:m])

           ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/8] := 0;

VPMOVQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateQuadWordToByte (SRC[m+63:m])

           ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVSQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := SaturateSignedQuadWordToByte (SRC[m+63:m])

           ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI


      FI;
ENDFOR
DEST[MAXVL-1:VL/8] := 0;

VPMOVSQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateSignedQuadWordToByte (SRC[m+63:m])

        ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVUSQB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedQuadWordToByte (SRC[m+63:m])

        ELSE

            IF *merging-masking*             ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*   ; zeroing-masking

                    DEST[i+7:i] := 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/8] := 0;

VPMOVUSQB instruction (EVEX encoded versions) when dest is memory

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 8

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedQuadWordToByte (SRC[m+63:m])

        ELSE

            *DEST[i+7:i] remains unchanged*  ; merging-masking

FI;

ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VPMOVQB __m128i _mm512_cvtepi64_epi8( __m512i a);
VPMOVQB __m128i _mm512_mask_cvtepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVQB __m128i _mm512_maskz_cvtepi64_epi8( __mmask8 k, __m512i a);
VPMOVQB void _mm512_mask_cvtepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVSQB __m128i _mm512_cvtsepi64_epi8( __m512i a);
VPMOVSQB __m128i _mm512_mask_cvtsepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVSQB __m128i _mm512_maskz_cvtsepi64_epi8( __mmask8 k, __m512i a);
VPMOVSQB void _mm512_mask_cvtsepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm512_cvtusepi64_epi8( __m512i a);
VPMOVUSQB __m128i _mm512_mask_cvtusepi64_epi8(__m128i s, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm512_maskz_cvtusepi64_epi8( __mmask8 k, __m512i a);
VPMOVUSQB void _mm512_mask_cvtusepi64_storeu_epi8(void * d, __mmask8 k, __m512i a);
VPMOVUSQB __m128i _mm256_cvtusepi64_epi8(__m256i a);
VPMOVUSQB __m128i _mm256_mask_cvtusepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVUSQB __m128i _mm256_maskz_cvtusepi64_epi8( __mmask8 k, __m256i b);
VPMOVUSQB void _mm256_mask_cvtusepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVUSQB __m128i _mm_cvtusepi64_epi8(__m128i a);
VPMOVUSQB __m128i _mm_mask_cvtusepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVUSQB __m128i _mm_maskz_cvtusepi64_epi8( __mmask8 k, __m128i b);
VPMOVUSQB void _mm_mask_cvtusepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVSQB __m128i _mm256_cvtsepi64_epi8(__m256i a);
VPMOVSQB __m128i _mm256_mask_cvtsepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVSQB __m128i _mm256_maskz_cvtsepi64_epi8( __mmask8 k, __m256i b);
VPMOVSQB void _mm256_mask_cvtsepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVSQB __m128i _mm_cvtsepi64_epi8(__m128i a);
VPMOVSQB __m128i _mm_mask_cvtsepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVSQB __m128i _mm_maskz_cvtsepi64_epi8( __mmask8 k, __m128i b);
VPMOVSQB void _mm_mask_cvtsepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVQB __m128i _mm256_cvtepi64_epi8(__m256i a);
VPMOVQB __m128i _mm256_mask_cvtepi64_epi8(__m128i a, __mmask8 k, __m256i b);
VPMOVQB __m128i _mm256_maskz_cvtepi64_epi8( __mmask8 k, __m256i b);
VPMOVQB void _mm256_mask_cvtepi64_storeu_epi8(void * , __mmask8 k, __m256i b);
VPMOVQB __m128i _mm_cvtepi64_epi8(__m128i a);
VPMOVQB __m128i _mm_mask_cvtepi64_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVQB __m128i _mm_maskz_cvtepi64_epi8( __mmask8 k, __m128i b);
VPMOVQB void _mm_mask_cvtepi64_storeu_epi8(void * , __mmask8 k, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-55, "Tipo E6 Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
