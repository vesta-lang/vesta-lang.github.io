---
summary: Down Convertir QWord en DWord
---

## Descripción

VPMOVQW abajo convierte elementos enteros de 64 bits en el operando de origen (el segundo operando) en palabras dobles empaquetadas usando truncation. VPMOVSQW convierte integers firmados de 64 bits en doblepalabras firmadas con saturación firmada. VPMOVUSQW convierte los valores de cuádruple no firmados en valores de doble palabra no firmados usando saturación no firmada.

El operando de origen es un registro ZMM/YMM/XMM. El operando de destino es un registro YMM/XMM/XMM o 256/128/64-bit ubicación de memoria.

Los elementos de doble palabra convertidos en fondos son escritos al operando de destino (el primer operando) de la palabra doble menos significativa. Los elementos de doble palabra del operando de destino se actualizan según la máscara de escritura. Bits (MAXVL-1:256/128/64) del destino de registro se ponen a cero.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := TruncateQuadWordToDWord (SRC[m+63:m])

           ELSE *zeroing-masking*           ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := TruncateQuadWordToDWord (SRC[m+63:m])

           ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVSQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

           THEN DEST[i+31:i] := SaturateSignedQuadWordToDWord (SRC[m+63:m])

           ELSE

             IF *merging-masking*                 ; merging-masking

                    THEN *DEST[i+31:i] remains unchanged*

                    ELSE *zeroing-masking*        ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR


DEST[MAXVL-1:VL/2] := 0;

VPMOVSQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateSignedQuadWordToDWord (SRC[m+63:m])

        ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VPMOVUSQD instruction (EVEX encoded version) reg-reg form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateUnsignedQuadWordToDWord (SRC[m+63:m])

        ELSE

             IF *merging-masking*              ; merging-masking

                    THEN *DEST[i+31:i] remains unchanged*

                    ELSE *zeroing-masking*     ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL/2] := 0;

VPMOVUSQD instruction (EVEX encoded version) memory form

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

m := j * 64

IF k1[j] OR *no writemask*

        THEN DEST[i+31:i] := SaturateUnsignedQuadWordToDWord (SRC[m+63:m])

        ELSE *DEST[i+31:i] remains unchanged*  ; merging-masking

FI;

ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VPMOVQD __m256i _mm512_cvtepi64_epi32( __m512i a);
VPMOVQD __m256i _mm512_mask_cvtepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVQD __m256i _mm512_maskz_cvtepi64_epi32( __mmask8 k, __m512i a);
VPMOVQD void _mm512_mask_cvtepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
VPMOVSQD __m256i _mm512_cvtsepi64_epi32( __m512i a);
VPMOVSQD __m256i _mm512_mask_cvtsepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVSQD __m256i _mm512_maskz_cvtsepi64_epi32( __mmask8 k, __m512i a);
VPMOVSQD void _mm512_mask_cvtsepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
VPMOVUSQD __m256i _mm512_cvtusepi64_epi32( __m512i a);
VPMOVUSQD __m256i _mm512_mask_cvtusepi64_epi32(__m256i s, __mmask8 k, __m512i a);
VPMOVUSQD __m256i _mm512_maskz_cvtusepi64_epi32( __mmask8 k, __m512i a);
VPMOVUSQD void _mm512_mask_cvtusepi64_storeu_epi32(void * d, __mmask8 k, __m512i a);
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
