---
summary: Multiply y Add Unsigned y Signed Words With y Without
---

## Descripción

Multiplica las palabras individuales del primer operando de origen por las palabras correspondientes del segundo operando de origen, produciendo resultados intermedios de dword. Los resultados de dword se resumen y se acumulan en el tamaño de elemento dword destino operando.

Para la saturación insignia, cuando un valor de resultado individual está más allá de la gama de una doble palabra insignia (es decir, mayor que FFFF FFFFH), el valor integer saturado de doble palabra integer de FFFF FFFFH se almacena en el destino de doble palabra.

Para la saturación firmada, cuando un resultado individual está más allá de la gama de un entero de doble palabra firmado (es decir, más de 7FFF FFFFH o menos de 8000 0000H), el valor saturado de 7FFF FFH o 8000 0000H, respectivamente, está escrito al operando de destino.

La versión EVEX de VPDPWSSD[,S] fue introducida previamente con AVX512 VNNI. La versión VEX de VPDPWSSD[,S] fue introducida previamente con AVX VNNI.

## Operación

```text
VPDPW[UU,SU,US]D[,S] dest, src1, src2 (VEX encoded version)
VL = (128, 256)
KL = VL/32

ORIGDEST := DEST

IF *src1 is signed*:  // SU

src1extend := SIGN_EXTEND

ELSE:                 // UU, US

src1extend := ZERO_EXTEND

IF *src2 is signed*:  // US

src2extend := SIGN_EXTEND

ELSE:                 // UU, SU

src2extend := ZERO_EXTEND

FOR i := 0 TO KL-1:
    p1dword := src1extend(SRC1.word[2*i+0]) * src2extend(SRC2.word[2*i+0])
    p2dword := src1extend(SRC1.word[2*i+1]) * src2extend(SRC2.word[2*i+1])
    IF *saturating version*:
          IF *UU instruction version*:


                DEST.dword[i] := UNSIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1dword + p2dword)
          ELSE:

                DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1dword + p2dword)
    ELSE:

          DEST.dword[i] := ORIGDEST.dword[i] + p1dword + p2dword
DEST[MAX_VL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VPDPWSUD __m128i _mm_dpwsud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWSUD __m256i _mm256_dpwsud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWSUDS __m128i _mm_dpwsuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWSUDS __m256i _mm256_dpwsuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUSD __m128i _mm_dpwusd_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUSD __m256i _mm256_dpwusd_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUSDS __m128i _mm_dpwusds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUSDS __m256i _mm256_dpwusds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUUD __m128i _mm_dpwuud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUUD __m256i _mm256_dpwuud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPWUUDS __m128i _mm_dpwuuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPWUUDS __m256i _mm256_dpwuuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
