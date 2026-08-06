---
summary: Multiply y Add Signed Word Integers
---

## Descripción

Multiplica las palabras firmadas individuales del primer operando de origen por las correspondientes palabras firmadas del segundo operando de origen, produciendo resultados intermedios firmados y de doble palabra. Los resultados de la palabra doble adyacente se resumen y se acumulan en el operando de destino.

Esta instrucción admite la supresión de la falla de memoria.

## Operación

```text
VPDPWSSD dest, src1, src2 (VEX encoded versions)
VL=(128, 256)
KL=VL/32
ORIGDEST := DEST
FOR i := 0 TO KL-1:

    p1dword := SIGN_EXTEND(SRC1.word[2*i+0]) * SIGN_EXTEND(SRC2.word[2*i+0] )
    p2dword := SIGN_EXTEND(SRC1.word[2*i+1]) * SIGN_EXTEND(SRC2.word[2*i+1] )
    DEST.dword[i] := ORIGDEST.dword[i] + p1dword + p2dword
DEST[MAX_VL-1:VL] := 0

VPDPWSSD dest, src1, src2 (EVEX encoded versions)
(KL,VL)=(4,128), (8,256), (16,512)
ORIGDEST := DEST
FOR i := 0 TO KL-1:

    IF k1[i] or *no writemask*:
          IF SRC2 is memory and EVEX.b == 1:
                t := SRC2.dword[0]
          ELSE:
                t := SRC2.dword[i]
          p1dword := SIGN_EXTEND(SRC1.word[2*i]) * SIGN_EXTEND(t.word[0])
          p2dword := SIGN_EXTEND(SRC1.word[2*i+1]) * SIGN_EXTEND(t.word[1])
          DEST.dword[i] := ORIGDEST.dword[i] + p1dword + p2dword

    ELSE IF *zeroing*:
          DEST.dword[i] := 0

    ELSE: // Merge masking, dest element unchanged
          DEST.dword[i] := ORIGDEST.dword[i]

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPDPWSSD __m128i _mm_dpwssd_avx_epi32(__m128i, __m128i, __m128i);
VPDPWSSD __m128i _mm_dpwssd_epi32(__m128i, __m128i, __m128i);
VPDPWSSD __m128i _mm_mask_dpwssd_epi32(__m128i, __mmask8, __m128i, __m128i);
VPDPWSSD __m128i _mm_maskz_dpwssd_epi32(__mmask8, __m128i, __m128i, __m128i);
VPDPWSSD __m256i _mm256_dpwssd_avx_epi32(__m256i, __m256i, __m256i);
VPDPWSSD __m256i _mm256_dpwssd_epi32(__m256i, __m256i, __m256i);
VPDPWSSD __m256i _mm256_mask_dpwssd_epi32(__m256i, __mmask8, __m256i, __m256i);
VPDPWSSD __m256i _mm256_maskz_dpwssd_epi32(__mmask8, __m256i, __m256i, __m256i);
VPDPWSSD __m512i _mm512_dpwssd_epi32(__m512i, __m512i, __m512i);
VPDPWSSD __m512i _mm512_mask_dpwssd_epi32(__m512i, __mmask16, __m512i, __m512i);
VPDPWSSD __m512i _mm512_maskz_dpwssd_epi32(__mmask16, __m512i, __m512i, __m512i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
