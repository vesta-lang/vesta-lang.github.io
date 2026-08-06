---
summary: Down Convertir DWord en Word
---

## Descripción

VPMOVDW abajo convierte elementos enteros de 32 bits en el operando de origen (el segundo operando) en palabras empaquetadas utilizando truncación. VPMOVSDW convierte integers de 32 bits en palabras firmadas empaquetadas usando saturación firmada. VPMOVUSDW convierte valores de doble palabra no firmados en valores de palabras no firmados usando saturación no firmada.

El operando de origen es un registro ZMM/YMM/XMM. El operando de destino es un registro YMM/XMM/XMM o 256/128/64-bit ubicación de memoria.

Los elementos de palabras de baja conversión se escriben al operando de destino (el primer operando) de la palabra menos significativa. Los elementos de palabras del operando de destino se actualizan según la máscara de escritura. Bits (MAXVL- 1:256/128/64) del destino de registro se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := TruncateDoubleWordToWord (SRC[m+31:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := TruncateDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

           THEN DEST[i+15:i] := SaturateSignedDoubleWordToWord (SRC[m+31:m])

           ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0


                  FI
      FI;
ENDFOR
DEST[MAXVL-1:VL/2] := 0;

VPMOVSDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateSignedDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSDW instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 16

m := j * 32

IF k1[j] OR *no writemask*

        THEN DEST[i+15:i] := SaturateUnsignedDoubleWordToWord (SRC[m+31:m])

        ELSE

             IF *merging-masking*           ; merging-masking

                    THEN *DEST[i+15:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+15:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSDW instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (4, 128), (8, 256), (16, 512)
    FOR j := 0 TO KL-1
          i := j * 16
          m := j * 32
          IF k1[j] OR *no writemask*
                THEN DEST[i+15:i] := SaturateUnsignedDoubleWordToWord (SRC[m+31:m])
                ELSE
                      *DEST[i+15:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VPMOVDW __m256i _mm512_cvtepi32_epi16( __m512i a);
VPMOVDW __m256i _mm512_mask_cvtepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVDW __m256i _mm512_maskz_cvtepi32_epi16( __mmask16 k, __m512i a);
VPMOVDW void _mm512_mask_cvtepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVSDW __m256i _mm512_cvtsepi32_epi16( __m512i a);
VPMOVSDW __m256i _mm512_mask_cvtsepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVSDW __m256i _mm512_maskz_cvtsepi32_epi16( __mmask16 k, __m512i a);
VPMOVSDW void _mm512_mask_cvtsepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVUSDW __m256i _mm512_mask_cvtusepi32_epi16(__m256i s, __mmask16 k, __m512i a);
VPMOVUSDW __m256i _mm512_maskz_cvtusepi32_epi16( __mmask16 k, __m512i a);
VPMOVUSDW void _mm512_mask_cvtusepi32_storeu_epi16(void * d, __mmask16 k, __m512i a);
VPMOVUSDW __m128i _mm256_cvtusepi32_epi16(__m256i a);
VPMOVUSDW __m128i _mm256_mask_cvtusepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVUSDW __m128i _mm256_maskz_cvtusepi32_epi16( __mmask8 k, __m256i b);
VPMOVUSDW void _mm256_mask_cvtusepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVUSDW __m128i _mm_cvtusepi32_epi16(__m128i a);
VPMOVUSDW __m128i _mm_mask_cvtusepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVUSDW __m128i _mm_maskz_cvtusepi32_epi16( __mmask8 k, __m128i b);
VPMOVUSDW void _mm_mask_cvtusepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
VPMOVSDW __m128i _mm256_cvtsepi32_epi16(__m256i a);
VPMOVSDW __m128i _mm256_mask_cvtsepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVSDW __m128i _mm256_maskz_cvtsepi32_epi16( __mmask8 k, __m256i b);
VPMOVSDW void _mm256_mask_cvtsepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVSDW __m128i _mm_cvtsepi32_epi16(__m128i a);
VPMOVSDW __m128i _mm_mask_cvtsepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVSDW __m128i _mm_maskz_cvtsepi32_epi16( __mmask8 k, __m128i b);
VPMOVSDW void _mm_mask_cvtsepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
VPMOVDW __m128i _mm256_cvtepi32_epi16(__m256i a);
VPMOVDW __m128i _mm256_mask_cvtepi32_epi16(__m128i a, __mmask8 k, __m256i b);
VPMOVDW __m128i _mm256_maskz_cvtepi32_epi16( __mmask8 k, __m256i b);
VPMOVDW void _mm256_mask_cvtepi32_storeu_epi16(void * , __mmask8 k, __m256i b);
VPMOVDW __m128i _mm_cvtepi32_epi16(__m128i a);
VPMOVDW __m128i _mm_mask_cvtepi32_epi16(__m128i a, __mmask8 k, __m128i b);
VPMOVDW __m128i _mm_maskz_cvtepi32_epi16( __mmask8 k, __m128i b);
VPMOVDW void _mm_mask_cvtepi32_storeu_epi16(void * , __mmask8 k, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-55, "Tipo E6 Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
