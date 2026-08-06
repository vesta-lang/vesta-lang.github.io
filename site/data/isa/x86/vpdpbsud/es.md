---
summary: Multiply y Add Unsigned y Signed Bytes With y Without
---

## Descripción

Multiplica los bytes individuales del primer operando de origen por los bytes correspondientes del segundo operando de origen, produciendo resultados de palabras intermedias. Los resultados de la palabra se resumen y se acumulan en el tamaño del elemento dword destino operando.

Para la saturación insignia, cuando un valor de resultado individual está más allá de la gama de una doble palabra insignia (es decir, mayor que FFFFF FFFFH), el valor integer de doble palabra saturada de FFFF FFFFH se almacena en el destino de doble palabra.

Para la saturación firmada, cuando un resultado individual está más allá de la gama de un entero de doble palabra firmado (es decir, más de 7FFF FFFFH o menos de 8000 0000H), el valor saturado de 7FFF FFH o 8000 0000H, respectivamente, está escrito al operando de destino.

## Operación

```text
VPDPB[SU,UU,SS]D[,S] dest, src1, src2 (VEX encoded version)
VL = (128, 256)
KL = VL/32

ORIGDEST := DEST
FOR i := 0 TO KL-1:

IF *src1 is signed*:
      src1extend := SIGN_EXTEND // SU, SS

ELSE:
      src1extend := ZERO_EXTEND // UU

IF *src2 is signed*:
      src2extend := SIGN_EXTEND // SS

ELSE:
      src2extend := ZERO_EXTEND // UU, SU

p1word := src1extend(SRC1.byte[4*i+0]) * src2extend(SRC2.byte[4*i+0])
p2word := src1extend(SRC1.byte[4*i+1]) * src2extend(SRC2.byte[4*i+1])
p3word := src1extend(SRC1.byte[4*i+2]) * src2extend(SRC2.byte[4*i+2])
p4word := src1extend(SRC1.byte[4*i+3]) * src2extend(SRC2.byte[4*i+3])

IF *saturating*:


          IF *UU instruction version*:
                DEST.dword[i] := UNSIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

          ELSE:
                DEST.dword[i] := SIGNED_DWORD_SATURATE(ORIGDEST.dword[i] + p1word + p2word + p3word + p4word)

    ELSE:
          DEST.dword[i] := ORIGDEST.dword[i] + p1word + p2word + p3word + p4word

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VPDPBSSD __m128i _mm_dpbssd_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSSD __m256i _mm256_dpbssd_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSSDS __m128i _mm_dpbssds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSSDS __m256i _mm256_dpbssds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSUD __m128i _mm_dpbsud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSUD __m256i _mm256_dpbsud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBSUDS __m128i _mm_dpbsuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBSUDS __m256i _mm256_dpbsuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBUUD __m128i _mm_dpbuud_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBUUD __m256i _mm256_dpbuud_epi32 (__m256i __W, __m256i __A, __m256i __B);
VPDPBUUDS __m128i _mm_dpbuuds_epi32 (__m128i __W, __m128i __A, __m128i __B);
VPDPBUUDS __m256i _mm256_dpbuuds_epi32 (__m256i __W, __m256i __A, __m256i __B);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
