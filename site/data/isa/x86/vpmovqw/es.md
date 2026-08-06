---
summary: Convertir QWord en Word
---

## Descripción

VPMOVQW abajo convierte elementos enteros de 64 bits en el operando de origen (el segundo operando) en palabras empaquetadas utilizando truncación. VPMOVSQW convierte los enteros firmados de 64 bits en palabras firmadas empaquetadas usando saturación firmada. VPMOVUSQW convierte valores de palabras cuádruples no firmados en valores de palabras no firmados usando saturación no firmada.

El operando de origen es un registro ZMM/YMM/XMM. El operando de destino es un registro XMM o un 128/64/32-bit ubicación de memoria.

Los elementos de palabras de baja conversión se escriben al operando de destino (el primer operando) de la palabra menos significativa. Los elementos de palabras del operando de destino se actualizan según la máscara de escritura. Bits (MAXVL- 1:128/64/32) del destino de registro se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := TruncateQuadWordToWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := TruncateQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := SaturateSignedQuadWordToWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0


                  FI
      FI;
ENDFOR
DEST[MAXVL-1:VL/4] := 0;

VPMOVSQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateSignedQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSQW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+15:i] := SaturateUnsignedQuadWordToWord (SRC[m+63:m])

        ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/4] := 0;

VPMOVUSQW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (2, 128), (4, 256), (8, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 64
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateUnsignedQuadWordToWord (SRC[m+63:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VPMOVQW __m128i _mm512_cvtepi64_epi16( __m512i a);
VPMOVQW __m128i _mm512_mask_cvtepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVQW __m128i _mm512_maskz_cvtepi64_epi16( __mmask8 k, __m512i a);
VPMOVQW void _mm512_mask_cvtepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVSQW __m128i _mm512_cvtsepi64_epi16( __m512i a);
VPMOVSQW __m128i _mm512_mask_cvtsepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVSQW __m128i _mm512_maskz_cvtsepi64_epi16( __mmask8 k, __m512i a);
VPMOVSQW void _mm512_mask_cvtsepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVUSQW __m128i _mm512_cvtusepi64_epi16( __m512i a);
VPMOVUSQW __m128i _mm512_mask_cvtusepi64_epi16(__m128i s, __mmask8 k, __m512i a);
VPMOVUSQW __m128i _mm512_maskz_cvtusepi64_epi16( __mmask8 k, __m512i a);
VPMOVUSQW void _mm512_mask_cvtusepi64_storeu_epi16(void * d, __mmask8 k, __m512i a);
VPMOVUSQD __m128i _mm256_cvtusepi64_epi32(__m256i a);
VPMOVUSQD __m128i _mm256_mask_cvtusepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVUSQD __m128i _mm256_maskz_cvtusepi64_epi32( __mmask8 k, __m256i b);
VPMOVUSQD void _mm256_mask_cvtusepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVUSQD __m128i _mm_cvtusepi64_epi32(__m128i a);
VPMOVUSQD __m128i _mm_mask_cvtusepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVUSQD __m128i _mm_maskz_cvtusepi64_epi32( __mmask8 k, __m128i b);
VPMOVUSQD void _mm_mask_cvtusepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
VPMOVSQD __m128i _mm256_cvtsepi64_epi32(__m256i a);
VPMOVSQD __m128i _mm256_mask_cvtsepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVSQD __m128i _mm256_maskz_cvtsepi64_epi32( __mmask8 k, __m256i b);
VPMOVSQD void _mm256_mask_cvtsepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVSQD __m128i _mm_cvtsepi64_epi32(__m128i a);
VPMOVSQD __m128i _mm_mask_cvtsepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVSQD __m128i _mm_maskz_cvtsepi64_epi32( __mmask8 k, __m128i b);
VPMOVSQD void _mm_mask_cvtsepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
VPMOVQD __m128i _mm256_cvtepi64_epi32(__m256i a);
VPMOVQD __m128i _mm256_mask_cvtepi64_epi32(__m128i a, __mmask8 k, __m256i b);
VPMOVQD __m128i _mm256_maskz_cvtepi64_epi32( __mmask8 k, __m256i b);
VPMOVQD void _mm256_mask_cvtepi64_storeu_epi32(void * , __mmask8 k, __m256i b);
VPMOVQD __m128i _mm_cvtepi64_epi32(__m128i a);
VPMOVQD __m128i _mm_mask_cvtepi64_epi32(__m128i a, __mmask8 k, __m128i b);
VPMOVQD __m128i _mm_maskz_cvtepi64_epi32( __mmask8 k, __m128i b);
VPMOVQD void _mm_mask_cvtepi64_storeu_epi32(void * , __mmask8 k, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-55, "Tipo E6 Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
