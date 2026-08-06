---
summary: Galois Campo Affine Transformación Inversa
---

## Descripción

La instrucción AFFINEINVB compute una transformación afinada en el campo Galois 28. Para esta instrucción, una transformación afinada es definida por A * inv(x) + b donde "A" es una matriz de 8 por 8 bits, y "x" y "b" son vectores de 8 bits. El inverso de los bytes en x se define con respecto a la reducción polinomio x8 + x4 + x3 + x + 1.

Un registro SIMD (operando 1) tiene "x" como 16, 32 o 64 vectores de 8 bits. Un segundo registro SIMD (operando 2) o operando de memoria contiene 2, 4, o 8 valores "A", que son operados por los valores correspondientemente alineados 8 "x" en el primer registro. El vector "b" es constante para todos los cálculos y contenidos en el byte inmediato.

La forma codificada EVEX de esta instrucción no soporta la supresión de falla de memoria. Las formas codificadas SSE de la instrucción requieren alineación 16B en sus operaciones de memoria.

La inversa de cada byte es dada por la siguiente tabla. La nibble superior está en el eje vertical y la nibble inferior está en el eje horizontal. Por ejemplo, el inverso de 0x95 es 0x8A.

**Inverse Byte Listings**

| - | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 8D      F6 |  | CB | 52 | 7B | D1 | E8 | 4F        29 |  | C0 | B0 | E1 | E5 | C7 |
| 1 | 74 | B4 | AA      4B |  | 99 | 2B | 60 | 5F | 58 | 3F        FD |  | CC | FF | 40 | EE | B2 |
| 2 | 3A | 6E | 5A      F1 |  | 55 | 4D | A8 | C9 | C1 | A         98 |  | 15 | 30 | 44 | A2 | C2 |
| 3 | 2C | 45 | 92      6C |  | F3 | 39 | 66 | 42 | F2 | 35        20 |  | 6F | 77 | BB | 59 | 19 |
| 4 | 1D | FE | 37      67 |  | 2D | 31 | F5 | 69 | A7 | 64        AB |  | 13 | 54 | 25 | E9 | 9 |
| 5 | ED | 5C | 5       CA |  | 4C | 24 | 87 | BF | 18 | 3E        22 |  | F0 | 51 | EC | 61 | 17 |
| 6 | 16 | 5E | AF      D3 |  | 49 | A6 | 36 | 43 | F4 | 47        91 |  | DF | 33 | 93 | 21 | 3B |
| 7 | 79 | B7 | 97      85 |  | 10 | B5 | BA | 3C | B6 | 70        D0 |  | 6 | A1 | FA | 81 | 82 |
| 8 | 83 | 7E | 7F      80 |  | 96 | 73 | BE | 56 | 9B | 9E        95 |  | D9 | F7 | 2 | B9 | A4 |
| 9 | DE     6A |  | 32      6D |  | D8 | 8A | 84 | 72 | 2A | 14        9F |  | 88 | F9 | DC | 89 | 9A |
| A | FB | 7C | 2E      C3 |  | 8F | B8 | 65 | 48 | 26 | C8        12 |  | 4A | CE | E7 | D2 | 62 |
| B | C | E0 | 1F | EF | 11 | 75 | 78 | 71 | A5 | 8E        76 |  | 3D | BD | BC | 86 | 57 |
| C | B | 28 | 2F      A3 |  | DA | D4 | E4 | F | A9 | 27        53 |  | 4 | 1B | FC | AC | E6 |
| D | 7A | 7 | AE      63 |  | C5 | DB | E2 | EA | 94 | 8B        C4 |  | D5 | 9D | F8 | 90 | 6B |
| E | B1 | D | D6      EB |  | C6 | E | CF | AD | 8 | 4E        D7 |  | E3 | 5D | 50 | 1E | B3 |
| F | 5B | 23 | 38      34 |  | 68 | 46 | 3 | 8C | DD | 9C        7D |  | A0 | CD | 1A | 41 | 1C |

## Operación

```text
define affine_inverse_byte(tsrc2qw, src1byte, imm):
    FOR i := 0 to 7:
          * parity(x) = 1 if x has an odd number of 1s in it, and 0 otherwise.*
          * inverse(x) is defined in the table above *
         retbyte.bit[i] := parity(tsrc2qw.byte[7-i] AND inverse(src1byte)) XOR imm8.bit[i]
    return retbyte

VGF2P8AFFINEINVQB dest, src1, src2, imm8 (EVEX Encoded Version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1:

    IF SRC2 is memory and EVEX.b==1:
         tsrc2 := SRC2.qword[0]

    ELSE:
         tsrc2 := SRC2.qword[j]

FOR b := 0 to 7:
    IF k1[j*8+b] OR *no writemask*:
         FOR i := 0 to 7:
               DEST.qword[j].byte[b] := affine_inverse_byte(tsrc2, SRC1.qword[j].byte[b], imm8)
    ELSE IF *zeroing*:
         DEST.qword[j].byte[b] := 0
    *ELSE DEST.qword[j].byte[b] remains unchanged*

DEST[MAX_VL-1:VL] := 0


VGF2P8AFFINEINVQB dest, src1, src2, imm8 (128b and 256b VEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256)
FOR j := 0 TO KL-1:

    FOR b := 0 to 7:
         DEST.qword[j].byte[b] := affine_inverse_byte(SRC2.qword[j], SRC1.qword[j].byte[b], imm8)

DEST[MAX_VL-1:VL] := 0

GF2P8AFFINEINVQB srcdest, src1, imm8 (128b SSE Encoded Version)
FOR j := 0 TO 1:

    FOR b := 0 to 7:
         SRCDEST.qword[j].byte[b] := affine_inverse_byte(SRC1.qword[j], SRCDEST.qword[j].byte[b], imm8)
```

## Intel C/C++ compilador intrínseco

```c
(V)GF2P8AFFINEINVQB __m128i _mm_gf2p8affineinv_epi64_epi8(__m128i, __m128i, int);
(V)GF2P8AFFINEINVQB __m128i _mm_mask_gf2p8affineinv_epi64_epi8(__m128i, __mmask16, __m128i, __m128i, int);
(V)GF2P8AFFINEINVQB __m128i _mm_maskz_gf2p8affineinv_epi64_epi8(__mmask16, __m128i, __m128i, int);
VGF2P8AFFINEINVQB __m256i _mm256_gf2p8affineinv_epi64_epi8(__m256i, __m256i, int);
VGF2P8AFFINEINVQB __m256i _mm256_mask_gf2p8affineinv_epi64_epi8(__m256i, __mmask32, __m256i, __m256i, int);
VGF2P8AFFINEINVQB __m256i _mm256_maskz_gf2p8affineinv_epi64_epi8(__mmask32, __m256i, __m256i, int);
VGF2P8AFFINEINVQB __m512i _mm512_gf2p8affineinv_epi64_epi8(__m512i, __m512i, int);
VGF2P8AFFINEINVQB __m512i _mm512_mask_gf2p8affineinv_epi64_epi8(__m512i, __mmask64, __m512i, __m512i, int);
VGF2P8AFFINEINVQB __m512i _mm512_maskz_gf2p8affineinv_epi64_epi8(__mmask64, __m512i, __m512i, int);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Legacy-encoded and VEX-encoded: Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

EVEX-encoded: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
