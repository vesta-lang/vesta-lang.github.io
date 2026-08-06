---
summary: Convertir un Mask Register en un Vector
---

## Descripción

Convierte un registro de máscaras en un registro vectorial. Cada elemento en el registro de destino se establece en todos los 1's o todos 0's dependiendo del valor del bit correspondiente en el registro de la máscara de origen. El operando de origen es un registro de máscaras. El operando de destino es un registro ZMM/YMM/XMM. EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPMOVM2B (EVEX encoded versions)
(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1

    i := j * 8
    IF SRC[j]

          THEN DEST[i+7:i] := -1
          ELSE DEST[i+7:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2W (EVEX encoded versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
FOR j := 0 TO KL-1

    i := j * 16
    IF SRC[j]

          THEN DEST[i+15:i] := -1
          ELSE DEST[i+15:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2D (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF SRC[j]

          THEN DEST[i+31:i] := -1
          ELSE DEST[i+31:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPMOVM2Q (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF SRC[j]

          THEN DEST[i+63:i] := -1
          ELSE DEST[i+63:i] := 0
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPMOVM2B __m512i _mm512_movm_epi8(__mmask64 );
VPMOVM2D __m512i _mm512_movm_epi32(__mmask8 );
VPMOVM2Q __m512i _mm512_movm_epi64(__mmask16 );
VPMOVM2W __m512i _mm512_movm_epi16(__mmask32 );
VPMOVM2B __m256i _mm256_movm_epi8(__mmask32 );
VPMOVM2D __m256i _mm256_movm_epi32(__mmask8 );
VPMOVM2Q __m256i _mm256_movm_epi64(__mmask8 );
VPMOVM2W __m256i _mm256_movm_epi16(__mmask16 );
VPMOVM2B __m128i _mm_movm_epi8(__mmask16 );
VPMOVM2D __m128i _mm_movm_epi32(__mmask8 );
VPMOVM2Q __m128i _mm_movm_epi64(__mmask8 );
VPMOVM2W __m128i _mm_movm_epi16(__mmask8 );
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-57, "Tipo E7NM Clase Condiciones de Excepción."

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
