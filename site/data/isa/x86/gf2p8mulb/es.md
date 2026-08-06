---
summary: Galois Field Multiply Bytes
---

## Descripción

La instrucción multiplica elementos en el campo finito GF(28), operando en un byte (elemento de campo) en el primer operando de origen y el byte correspondiente en un segundo operando de origen. El campo GF(28) está representado en representación polinomio con la reducción polinomio x8 + x4 + x3 + x + 1.

Esta instrucción no apoya la transmisión.

La forma codificada EVEX de esta instrucción es compatible con la supresión de fallas de memoria. Las formas codificadas SSE de la instrucción requieren alineación16B en sus operaciones de memoria.

## Operación

```text
define gf2p8mul_byte(src1byte, src2byte):

tword := 0
FOR i := 0 to 7:

IF src2byte.bit[i]:

           tword := tword XOR (src1byte<< i)

* carry out polynomial reduction by the characteristic polynomial p*

FOR i := 14 downto 8:
p := 0x11B << (i-8)
                                        *0x11B = 0000_0001_0001_1011 in binary*

IF tword.bit[i]:

           tword := tword XOR p

return tword.byte[0]

VGF2P8MULB dest, src1, src2 (EVEX Encoded Version)

(KL, VL) = (16, 128), (32, 256), (64, 512)
FOR j := 0 TO KL-1:

    IF k1[j] OR *no writemask*:
         DEST.byte[j] := gf2p8mul_byte(SRC1.byte[j], SRC2.byte[j])

    ELSE IF *zeroing*:
         DEST.byte[j] := 0

    * ELSE DEST.byte[j] remains unchanged*
DEST[MAX_VL-1:VL] := 0

VGF2P8MULB dest, src1, src2 (128b and 256b VEX Encoded Versions)

(KL, VL) = (16, 128), (32, 256)
FOR j := 0 TO KL-1:

    DEST.byte[j] := gf2p8mul_byte(SRC1.byte[j], SRC2.byte[j])
DEST[MAX_VL-1:VL] := 0

GF2P8MULB srcdest, src1 (128b SSE Encoded Version)
FOR j := 0 TO 15:

    SRCDEST.byte[j] :=gf2p8mul_byte(SRCDEST.byte[j], SRC1.byte[j])
```

## Intel C/C++ compilador intrínseco

```c
(V)GF2P8MULB __m128i _mm_gf2p8mul_epi8(__m128i, __m128i);
(V)GF2P8MULB __m128i _mm_mask_gf2p8mul_epi8(__m128i, __mmask16, __m128i, __m128i);
(V)GF2P8MULB __m128i _mm_maskz_gf2p8mul_epi8(__mmask16, __m128i, __m128i);
VGF2P8MULB __m256i _mm256_gf2p8mul_epi8(__m256i, __m256i);
VGF2P8MULB __m256i _mm256_mask_gf2p8mul_epi8(__m256i, __mmask32, __m256i, __m256i);
VGF2P8MULB __m256i _mm256_maskz_gf2p8mul_epi8(__mmask32, __m256i, __m256i);
VGF2P8MULB __m512i _mm512_gf2p8mul_epi8(__m512i, __m512i);
VGF2P8MULB __m512i _mm512_mask_gf2p8mul_epi8(__m512i, __mmask64, __m512i, __m512i);
VGF2P8MULB __m512i _mm512_maskz_gf2p8mul_epi8(__mmask64, __m512i, __m512i);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Legacy-encoded and VEX-encoded: Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." EVEX-encoded: Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
