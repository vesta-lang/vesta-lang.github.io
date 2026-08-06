---
summary: Bitwise Ternary Logic
---

## Descripción

VPTERNLOGD/Q toma tres bits de longitud de 512 bits (en el primero, segundo y tercer operando) como datos de entrada para formar un conjunto de 512 índices, cada índice se compone de un poco de cada vector de entrada. El byte imm8 especifica una tabla lógica booleana que produce un valor binario para cada valor índice de 3 bits. El resultado booleano final de 512 bits está escrito al operando de destino (el primer operando) utilizando la máscara de escritura k1 con la granularidad del elemento de doble palabra o elemento de cuadripa en el destino.

El operando de destino es un registro ZMM (EVEX.512)/YMM (EVEX.256)/XMM (EVEX.128). El primer operando de origen es un registro ZMM/YMM/XMM. La segunda fuente puede ser un ZMM/YMM/XMM registro, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32/64-bit El destino que operand es un ZMM registro actualizado condicionalmente con writemask k1.

En el cuadro 5-20 se muestran dos ejemplos de funciones booleanas especificadas por valores inmediatos 0xE2 y 0xE4, con el resultado de búsqueda enumerado en la cuarta columna siguiendo las tres columnas que contienen todos los valores posibles del índice de 3 bits.

**Ejemplos de VPTERNLOGD/Q Imm8 Valores de la función booleana e índice de entrada**

| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

## Operación

```text
VPTERNLOGD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

        THEN

                FOR k := 0 TO 31

                IF (EVEX.b = 1) AND (SRC2 *is memory*)

                      THEN DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ k ]]

                      ELSE DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ i+k ]]

                FI;

                           ; table lookup of immediate bellow;

   ELSE

        IF *merging-masking*                 ; merging-masking

                THEN *DEST[31+i:i] remains unchanged*

                ELSE                         ; zeroing-masking

                DEST[31+i:i] := 0

        FI;

   FI;

ENDFOR;


DEST[MAXVL-1:VL] := 0

VPTERNLOGQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN

             FOR k := 0 TO 63

                  IF (EVEX.b = 1) AND (SRC2 *is memory*)

                       THEN DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ k ]]

                       ELSE DEST[j][k] := imm[(DEST[i+k] << 2) + (SRC1[ i+k ] << 1) + SRC2[ i+k ]]

                  FI;                    ; table lookup of immediate bellow;

     ELSE

             IF *merging-masking*             ; merging-masking

                  THEN *DEST[63+i:i] remains unchanged*

                  ELSE                        ; zeroing-masking

                       DEST[63+i:i] := 0

             FI;

FI;

ENDFOR;

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPTERNLOGD __m512i _mm512_ternarylogic_epi32(__m512i a, __m512i b, int imm);
VPTERNLOGD __m512i _mm512_mask_ternarylogic_epi32(__m512i s, __mmask16 m, __m512i a, __m512i b, int imm);
VPTERNLOGD __m512i _mm512_maskz_ternarylogic_epi32(__mmask m, __m512i a, __m512i b, int imm);
VPTERNLOGD __m256i _mm256_ternarylogic_epi32(__m256i a, __m256i b, int imm);
VPTERNLOGD __m256i _mm256_mask_ternarylogic_epi32(__m256i s, __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGD __m256i _mm256_maskz_ternarylogic_epi32( __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGD __m128i _mm_ternarylogic_epi32(__m128i a, __m128i b, int imm);
VPTERNLOGD __m128i _mm_mask_ternarylogic_epi32(__m128i s, __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGD __m128i _mm_maskz_ternarylogic_epi32( __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGQ __m512i _mm512_ternarylogic_epi64(__m512i a, __m512i b, int imm);
VPTERNLOGQ __m512i _mm512_mask_ternarylogic_epi64(__m512i s, __mmask8 m, __m512i a, __m512i b, int imm);
VPTERNLOGQ __m512i _mm512_maskz_ternarylogic_epi64( __mmask8 m, __m512i a, __m512i b, int imm);
VPTERNLOGQ __m256i _mm256_ternarylogic_epi64(__m256i a, __m256i b, int imm);
VPTERNLOGQ __m256i _mm256_mask_ternarylogic_epi64(__m256i s, __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGQ __m256i _mm256_maskz_ternarylogic_epi64( __mmask8 m, __m256i a, __m256i b, int imm);
VPTERNLOGQ __m128i _mm_ternarylogic_epi64(__m128i a, __m128i b, int imm);
VPTERNLOGQ __m128i _mm_mask_ternarylogic_epi64(__m128i s, __mmask8 m, __m128i a, __m128i b, int imm);
VPTERNLOGQ __m128i _mm_maskz_ternarylogic_epi64( __mmask8 m, __m128i a, __m128i b, int imm);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
