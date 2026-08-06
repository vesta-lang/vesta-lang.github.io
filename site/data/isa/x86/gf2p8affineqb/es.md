---
summary: Galois Field Affine Transformation
---

## Descripción

La instrucción AFFINEB compute una transformación afinada en el campo Galois 28. Para esta instrucción, una transformación afinada es definida por A * x + b donde "A" es una matriz de 8 por 8 bits, y "x" y "b" son vectores de 8 bits. Un registro SIMD (operando 1) tiene "x" como 16, 32 o 64 vectores de 8 bits. Un segundo registro SIMD (operando 2) o operando de memoria contiene 2, 4, o 8 valores "A", que son operados por los valores correspondientemente alineados 8 "x" en el primer registro. El vector "b" es constante para todos los cálculos y contenidos en el byte inmediato.

La forma codificada EVEX de esta instrucción no soporta la supresión de falla de memoria. Las formas codificadas SSE de la instrucción requieren alineación16B en sus operaciones de memoria.

## Operación

```text
define parity(x):

t := 0              // single bit

FOR i := 0 to 7:

t = t xor x.bit[i]

return t

define affine_byte(tsrc2qw, src1byte, imm):

    FOR i := 0 to 7:
          * parity(x) = 1 if x has an odd number of 1s in it, and 0 otherwise.*

         retbyte.bit[i] := parity(tsrc2qw.byte[7-i] AND src1byte) XOR imm8.bit[i]
    return retbyte


VGF2P8AFFINEQB dest, src1, src2, imm8 (EVEX Encoded Version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC2 is memory and EVEX.b==1:
         tsrc2 := SRC2.qword[0]

    ELSE:
         tsrc2 := SRC2.qword[j]

    FOR b := 0 to 7:
          IF k1[j*8+b] OR *no writemask*:
               DEST.qword[j].byte[b] := affine_byte(tsrc2, SRC1.qword[j].byte[b], imm8)
          ELSE IF *zeroing*:
               DEST.qword[j].byte[b] := 0
          *ELSE DEST.qword[j].byte[b] remains unchanged*

DEST[MAX_VL-1:VL] := 0

VGF2P8AFFINEQB dest, src1, src2, imm8 (128b and 256b VEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256)
FOR j := 0 TO KL-1:

    FOR b := 0 to 7:
         DEST.qword[j].byte[b] := affine_byte(SRC2.qword[j], SRC1.qword[j].byte[b], imm8)

DEST[MAX_VL-1:VL] := 0

GF2P8AFFINEQB srcdest, src1, imm8 (128b SSE Encoded Version)
FOR j := 0 TO 1:

    FOR b := 0 to 7:
         SRCDEST.qword[j].byte[b] := affine_byte(SRC1.qword[j], SRCDEST.qword[j].byte[b], imm8)
```

## Intel C/C++ compilador intrínseco

```c
(V)GF2P8AFFINEQB __m128i _mm_gf2p8affine_epi64_epi8(__m128i, __m128i, int);
(V)GF2P8AFFINEQB __m128i _mm_mask_gf2p8affine_epi64_epi8(__m128i, __mmask16, __m128i, __m128i, int);
(V)GF2P8AFFINEQB __m128i _mm_maskz_gf2p8affine_epi64_epi8(__mmask16, __m128i, __m128i, int);
VGF2P8AFFINEQB __m256i _mm256_gf2p8affine_epi64_epi8(__m256i, __m256i, int);
VGF2P8AFFINEQB __m256i _mm256_mask_gf2p8affine_epi64_epi8(__m256i, __mmask32, __m256i, __m256i, int);
VGF2P8AFFINEQB __m256i _mm256_maskz_gf2p8affine_epi64_epi8(__mmask32, __m256i, __m256i, int);
VGF2P8AFFINEQB __m512i _mm512_gf2p8affine_epi64_epi8(__m512i, __m512i, int);
VGF2P8AFFINEQB __m512i _mm512_mask_gf2p8affine_epi64_epi8(__m512i, __mmask64, __m512i, __m512i, int);
VGF2P8AFFINEQB __m512i _mm512_maskz_gf2p8affine_epi64_epi8(__mmask64, __m512i, __m512i, int);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Legacy-encoded and VEX-encoded: Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

EVEX-encoded: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
