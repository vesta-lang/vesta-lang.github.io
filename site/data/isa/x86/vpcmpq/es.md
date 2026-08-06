---
summary: Comparar los valores de entero empaquetado en Mask
---

## Descripción

Realiza una comparación SIMD de los valores enteros empaquetados en el segundo operando de origen y el primer operando de origen y devuelve los resultados de la comparación con la máscara operando de destino. La comparación predicate operando (inmediate byte) especifica el tipo de comparación realizada en cada par de valores empaquetados en los dos operandos de origen. El resultado de cada comparación es un solo resultado de bit de máscara de 1 (comparison true) o 0 (comparison false).

VPCMPQ/VPCMPUQ realiza una comparación entre pares de valores integer de quadword firmados/no firmados.

El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un ZMM/YMM/XMM registrado o un 512/256/128-bit ubicación de memoria o un vector de 512-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino (primer operando) es un registro de máscaras k1. Se realizan hasta 8/4/2 comparaciones con los resultados escritos al operando de destino bajo la máscara de escritura k2.

El predicate de comparación operando es un 8-bit inmediato: bits 2:0 definen el tipo de comparación a realizar. Los bits 3 a 7 de los inmediatos están reservados. Compiler puede implementar la pseudo-op mnemónica lista en la tabla 5-19.

## Operación

```text
CASE (COMPARISON PREDICATE) OF
    0: OP := EQ;
    1: OP := LT;
    2: OP := LE;
    3: OP := FALSE;
    4: OP := NEQ;
    5: OP := NLT;
    6: OP := NLE;
    7: OP := TRUE;

ESAC;

VPCMPQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+63:i] OP SRC2[63:0];

                  ELSE CMP := SRC1[i+63:i] OP SRC2[i+63:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0

VPCMPUQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN CMP := SRC1[i+63:i] OP SRC2[63:0];

                  ELSE CMP := SRC1[i+63:i] OP SRC2[i+63:i];

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCMPQ __mmask8 _mm512_cmp_epi64_mask( __m512i a, __m512i b, int imm);
VPCMPQ __mmask8 _mm512_mask_cmp_epi64_mask(__mmask8 k, __m512i a, __m512i b, int imm);
VPCMPQ __mmask8 _mm512_cmp[eq|ge|gt|le|lt|neq]_epi64_mask( __m512i a, __m512i b);
VPCMPQ __mmask8 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epi64_mask(__mmask8 k, __m512i a, __m512i b);
VPCMPUQ __mmask8 _mm512_cmp_epu64_mask( __m512i a, __m512i b, int imm);
VPCMPUQ __mmask8 _mm512_mask_cmp_epu64_mask(__mmask8 k, __m512i a, __m512i b, int imm);
VPCMPUQ __mmask8 _mm512_cmp[eq|ge|gt|le|lt|neq]_epu64_mask( __m512i a, __m512i b);
VPCMPUQ __mmask8 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epu64_mask(__mmask8 k, __m512i a, __m512i b);
VPCMPQ __mmask8 _mm256_cmp_epi64_mask( __m256i a, __m256i b, int imm);
VPCMPQ __mmask8 _mm256_mask_cmp_epi64_mask(__mmask8 k, __m256i a, __m256i b, int imm);
VPCMPQ __mmask8 _mm256_cmp[eq|ge|gt|le|lt|neq]_epi64_mask( __m256i a, __m256i b);
VPCMPQ __mmask8 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epi64_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPUQ __mmask8 _mm256_cmp_epu64_mask( __m256i a, __m256i b, int imm);
VPCMPUQ __mmask8 _mm256_mask_cmp_epu64_mask(__mmask8 k, __m256i a, __m256i b, int imm);
VPCMPUQ __mmask8 _mm256_cmp[eq|ge|gt|le|lt|neq]_epu64_mask( __m256i a, __m256i b);
VPCMPUQ __mmask8 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epu64_mask(__mmask8 k, __m256i a, __m256i b);
VPCMPQ __mmask8 _mm_cmp_epi64_mask( __m128i a, __m128i b, int imm);
VPCMPQ __mmask8 _mm_mask_cmp_epi64_mask(__mmask8 k, __m128i a, __m128i b, int imm);
VPCMPQ __mmask8 _mm_cmp[eq|ge|gt|le|lt|neq]_epi64_mask( __m128i a, __m128i b);
VPCMPQ __mmask8 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epi64_mask(__mmask8 k, __m128i a, __m128i b);
VPCMPUQ __mmask8 _mm_cmp_epu64_mask( __m128i a, __m128i b, int imm);
VPCMPUQ __mmask8 _mm_mask_cmp_epu64_mask(__mmask8 k, __m128i a, __m128i b, int imm);
VPCMPUQ __mmask8 _mm_cmp[eq|ge|gt|le|lt|neq]_epu64_mask( __m128i a, __m128i b);
VPCMPUQ __mmask8 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epu64_mask(__mmask8 k, __m128i a, __m128i b);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."
