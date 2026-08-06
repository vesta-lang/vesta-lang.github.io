---
summary: Convertir palabra en Byte
---

## Descripción

VPMOVWB abajo convierte los enteros de 16 bits en los bytes empaquetados usando truncation. VPMOVSWB convierte los enteros firmados de 16 bits en los bytes firmados mediante saturación firmada. VPMOVUSWB convierte valores de palabras no firmados en valores byte no firmados usando saturación no firmada.

El operando de origen es un registro ZMM/YMM/XMM. El operando de destino es un registro YMM/XMM/XMM o 256/128/64-bit ubicación de memoria.

Los elementos de byte de baja conversión están escritos al operando de destino (el primer operando) del byte menos significativo. Los elementos Byte del operando de destino se actualizan según la máscara de escritura. Bits (MAXVL- 1:256/128/64) del destino de registro se ponen a cero.

Nota: EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := TruncateWordToByte (SRC[m+15:m])

           ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := TruncateWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVSWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

           THEN DEST[i+7:i] := SaturateSignedWordToByte (SRC[m+15:m])

           ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;


VPMOVSWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := SaturateSignedWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR

VPMOVUSWB instruction (EVEX encoded versions) when dest is a register

(KL, VL) = (8, 128), (16, 256), (32, 512)

FOR j := 0 TO Kl-1

i := j * 8

m := j * 16

IF k1[j] OR *no writemask*

        THEN DEST[i+7:i] := SaturateUnsignedWordToByte (SRC[m+15:m])

        ELSE

            IF *merging-masking*            ; merging-masking

                    THEN *DEST[i+7:i] remains unchanged*

                    ELSE *zeroing-masking*  ; zeroing-masking

                    DEST[i+7:i] = 0

            FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSWB instruction (EVEX encoded versions) when dest is memory
    (KL, VL) = (8, 128), (16, 256), (32, 512)
    FOR j := 0 TO Kl-1
          i := j * 8
          m := j * 16
          IF k1[j] OR *no writemask*
                THEN DEST[i+7:i] := SaturateUnsignedWordToByte (SRC[m+15:m])
                ELSE
                      *DEST[i+7:i] remains unchanged* ; merging-masking
          FI;
    ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VPMOVUSWB __m256i _mm512_cvtusepi16_epi8(__m512i a);
VPMOVUSWB __m256i _mm512_mask_cvtusepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVUSWB __m256i _mm512_maskz_cvtusepi16_epi8( __mmask32 k, __m512i b);
VPMOVUSWB void _mm512_mask_cvtusepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVSWB __m256i _mm512_cvtsepi16_epi8(__m512i a);
VPMOVSWB __m256i _mm512_mask_cvtsepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVSWB __m256i _mm512_maskz_cvtsepi16_epi8( __mmask32 k, __m512i b);
VPMOVSWB void _mm512_mask_cvtsepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVWB __m256i _mm512_cvtepi16_epi8(__m512i a);
VPMOVWB __m256i _mm512_mask_cvtepi16_epi8(__m256i a, __mmask32 k, __m512i b);
VPMOVWB __m256i _mm512_maskz_cvtepi16_epi8( __mmask32 k, __m512i b);
VPMOVWB void _mm512_mask_cvtepi16_storeu_epi8(void * , __mmask32 k, __m512i b);
VPMOVUSWB __m128i _mm256_cvtusepi16_epi8(__m256i a);
VPMOVUSWB __m128i _mm256_mask_cvtusepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVUSWB __m128i _mm256_maskz_cvtusepi16_epi8( __mmask16 k, __m256i b);
VPMOVUSWB void _mm256_mask_cvtusepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVUSWB __m128i _mm_cvtusepi16_epi8(__m128i a);
VPMOVUSWB __m128i _mm_mask_cvtusepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVUSWB __m128i _mm_maskz_cvtusepi16_epi8( __mmask8 k, __m128i b);
VPMOVUSWB void _mm_mask_cvtusepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVSWB __m128i _mm256_cvtsepi16_epi8(__m256i a);
VPMOVSWB __m128i _mm256_mask_cvtsepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVSWB __m128i _mm256_maskz_cvtsepi16_epi8( __mmask16 k, __m256i b);
VPMOVSWB void _mm256_mask_cvtsepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVSWB __m128i _mm_cvtsepi16_epi8(__m128i a);
VPMOVSWB __m128i _mm_mask_cvtsepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVSWB __m128i _mm_maskz_cvtsepi16_epi8( __mmask8 k, __m128i b);
VPMOVSWB void _mm_mask_cvtsepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
VPMOVWB __m128i _mm256_cvtepi16_epi8(__m256i a);
VPMOVWB __m128i _mm256_mask_cvtepi16_epi8(__m128i a, __mmask16 k, __m256i b);
VPMOVWB __m128i _mm256_maskz_cvtepi16_epi8( __mmask16 k, __m256i b);
VPMOVWB void _mm256_mask_cvtepi16_storeu_epi8(void * , __mmask16 k, __m256i b);
VPMOVWB __m128i _mm_cvtepi16_epi8(__m128i a);
VPMOVWB __m128i _mm_mask_cvtepi16_epi8(__m128i a, __mmask8 k, __m128i b);
VPMOVWB __m128i _mm_maskz_cvtepi16_epi8( __mmask8 k, __m128i b);
VPMOVWB void _mm_mask_cvtepi16_storeu_epi8(void * , __mmask8 k, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-55, "Tipo E6 Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
