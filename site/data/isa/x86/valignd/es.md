---
summary: Align Doubleword/Quadword Vectores
---

## Descripción

Concatena y cambia los elementos derecho de doble palabra/cuadword del primer operando de origen (el segundo operando) y el segundo operando de origen (el tercer operando) en un vector intermedio de 1024/512/256 bits. El bajo 512/256/128-bit del vector intermedio está escrito al operando de destino (el primer operando) utilizando la máscara de escritura k1. El destino y el primer operandos de origen son los registros ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit.

Esta instrucción se escribe, por lo que sólo los elementos con el bit correspondiente fijado en el registro de máscaras vectoriales k1 se computan y almacenan en zmm1. Elementos en zmm1 con el bit correspondiente claro en k1 conservan sus valores anteriores (enmascaramiento emergente) o se fijan en 0 (enmascaramiento).

## Operación

```text
VALIGND (EVEX Encoded Versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (SRC2 *is memory*) (AND EVEX.b = 1)

     THEN

          FOR j := 0 TO KL-1

                  i := j * 32

                  src[i+31:i] := SRC2[31:0]

          ENDFOR;

     ELSE src := SRC2

FI

; Concatenate sources

tmp[VL-1:0] := src[VL-1:0]

tmp[2VL-1:VL] := SRC1[VL-1:0]

; Shift right doubleword elements

IF VL = 128

     THEN SHIFT = imm8[1:0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[2:0]

                  ELSE SHIFT = imm8[3:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (32*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := tmp[i+31:i]

          ELSE

                  IF *merging-masking*            ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                        ; zeroing-masking

                               DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0

VALIGNQ (EVEX Encoded Versions)
(KL, VL) = (2, 128), (4, 256),(8, 512)
IF (SRC2 *is memory*) (AND EVEX.b = 1)

    THEN
          FOR j := 0 TO KL-1
                i := j * 64
                src[i+63:i] := SRC2[63:0]
          ENDFOR;

    ELSE src := SRC2
FI
; Concatenate sources
tmp[VL-1:0] := src[VL-1:0]
tmp[2VL-1:VL] := SRC1[VL-1:0]
; Shift right quadword elements


IF VL = 128

     THEN SHIFT = imm8[0]

     ELSE

          IF VL = 256

                  THEN SHIFT = imm8[1:0]

                  ELSE SHIFT = imm8[2:0]

          FI

FI;

tmp[2VL-1:0] := tmp[2VL-1:0] >> (64*SHIFT)

; Apply writemask

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := tmp[i+63:i]

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VALIGND __m512i _mm512_alignr_epi32( __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_mask_alignr_epi32(__m512i s, __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m512i _mm512_maskz_alignr_epi32( __mmask16 k, __m512i a, __m512i b, int cnt);
VALIGND __m256i _mm256_mask_alignr_epi32(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m256i _mm256_maskz_alignr_epi32( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGND __m128i _mm_mask_alignr_epi32(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGND __m128i _mm_maskz_alignr_epi32( __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m512i _mm512_alignr_epi64( __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_mask_alignr_epi64(__m512i s, __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m512i _mm512_maskz_alignr_epi64( __mmask8 k, __m512i a, __m512i b, int cnt);
VALIGNQ __m256i _mm256_mask_alignr_epi64(__m256i s, __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m256i _mm256_maskz_alignr_epi64( __mmask8 k, __m256i a, __m256i b, int cnt);
VALIGNQ __m128i _mm_mask_alignr_epi64(__m128i s, __mmask8 k, __m128i a, __m128i b, int cnt);
VALIGNQ __m128i _mm_maskz_alignr_epi64( __mmask8 k, __m128i a, __m128i b, int cnt);
```
