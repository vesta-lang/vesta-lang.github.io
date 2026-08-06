---
summary: Convertir un Vector Register en Mask
---

## Descripción

Convierte un registro vectorial en un registro de máscaras. Cada elemento del registro de destino se establece en 1 o 0 dependiendo del valor del bit mas significativo del elemento correspondiente en el registro de origen. El operando de origen es un registro ZMM/YMM/XMM. El operando de destino es un registro de máscaras. EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVB2M (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF SRC[i+7]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVW2M (EVEX encoded versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1

    i := j * 16
    IF SRC[i+15]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVD2M (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF SRC[i+31]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0

VPMOVQ2M (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF SRC[i+63]

          THEN DEST[j] := 1
          ELSE DEST[j] := 0
    FI;
ENDFOR
DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMPOVB2M __mmask64 _mm512_movepi8_mask( __m512i );
VPMPOVD2M __mmask16 _mm512_movepi32_mask( __m512i );
VPMPOVQ2M __mmask8 _mm512_movepi64_mask( __m512i );
VPMPOVW2M __mmask32 _mm512_movepi16_mask( __m512i );
VPMPOVB2M __mmask32 _mm256_movepi8_mask( __m256i );
VPMPOVD2M __mmask8 _mm256_movepi32_mask( __m256i );
VPMPOVQ2M __mmask8 _mm256_movepi64_mask( __m256i );
VPMPOVW2M __mmask16 _mm256_movepi16_mask( __m256i );
VPMPOVB2M __mmask16 _mm_movepi8_mask( __m128i );
VPMPOVD2M __mmask8 _mm_movepi32_mask( __m128i );
VPMPOVQ2M __mmask8 _mm_movepi64_mask( __m128i );
VPMPOVW2M __mmask8 _mm_movepi16_mask( __m128i );
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-57, "Tipo E7NM Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
