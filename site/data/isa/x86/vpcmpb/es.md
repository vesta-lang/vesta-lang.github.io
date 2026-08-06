---
summary: Comparar Valores Byte Empaquetados En Mask
---

## Descripción

Realiza una comparación SIMD de los valores de byte empaquetados en el segundo operando de origen y el primer operando de origen y devuelve los resultados de la comparación con la máscara operando de destino. La comparación predicate operando (inmediate byte) especifica el tipo de comparación realizada en cada par de valores empaquetados en los dos operandos de origen. El resultado de cada comparación es un solo resultado de bit de máscara de 1 (comparison true) o 0 (comparison false).

VPCMPB realiza una comparación entre pares de valores de byte firmados.

VPCMPUB realiza una comparación entre pares de valores byte no firmados.

El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM o un 512/256/128-bit ubicación de memoria. El operando de destino (primer operando) es un registro de máscaras k1. Se realizan comparaciones de hasta 64/32/16 con resultados escritos al operando de destino bajo la máscara de escritura k2.

El predicate de comparación operando es un 8-bit inmediato: bits 2:0 definen el tipo de comparación a realizar. Los bits 3 a 7 de los inmediatos están reservados. Compiler puede implementar la pseudo-op mnemónica lista en la tabla 5-19.

:                               Cuadro 5 a 19. Pseudo-Op yVPCMP* AplicaciónPCMPMImplementation Pseudo-OpVPCMP* reg1, reg2, reg3, 0VPCMPEQ* reg1, reg2, reg3VPCMP*reg1, reg2, reg3, 1VPCMPLT* reg1, reg2, reg3VPCMP* reg1, reg2, reg3, 2VPCMPLE* reg1, reg2, reg3VPCMP* reg1, reg2, reg3, 4VPCMPNEQ* reg1, reg2, reg3VPCMP* reg1, reg2, reg3, 5VPPCMPNLT* reg1, reg2, reg3VPCMP* reg1, reg2, reg3, 6VPCMPNLE* reg1, reg2, reg3

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

VPCMPB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            CMP := SRC1[i+7:i] OP SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] = 0                       ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0


VPCMPUB (EVEX encoded versions)

(KL, VL) = (16, 128), (32, 256), (64, 512)

FOR j := 0 TO KL-1

i := j * 8

IF k2[j] OR *no writemask*

     THEN

            CMP := SRC1[i+7:i] OP SRC2[i+7:i];

            IF CMP = TRUE

            THEN DEST[j] := 1;

            ELSE DEST[j] := 0; FI;

     ELSE DEST[j] = 0                       ; zeroing-masking onlyFI;

FI;

ENDFOR

DEST[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCMPB __mmask64 _mm512_cmp_epi8_mask( __m512i a, __m512i b, int cmp);
VPCMPB __mmask64 _mm512_mask_cmp_epi8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPB __mmask32 _mm256_cmp_epi8_mask( __m256i a, __m256i b, int cmp);
VPCMPB __mmask32 _mm256_mask_cmp_epi8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPB __mmask16 _mm_cmp_epi8_mask( __m128i a, __m128i b, int cmp);
VPCMPB __mmask16 _mm_mask_cmp_epi8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
VPCMPB __mmask64 _mm512_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m512i a, __m512i b);
VPCMPB __mmask64 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask64 m, __m512i a, __m512i b);
VPCMPB __mmask32 _mm256_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m256i a, __m256i b);
VPCMPB __mmask32 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask32 m, __m256i a, __m256i b);
VPCMPB __mmask16 _mm_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __m128i a, __m128i b);
VPCMPB __mmask16 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epi8_mask( __mmask16 m, __m128i a, __m128i b);
VPCMPUB __mmask64 _mm512_cmp_epu8_mask( __m512i a, __m512i b, int cmp);
VPCMPUB __mmask64 _mm512_mask_cmp_epu8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPUB __mmask32 _mm256_cmp_epu8_mask( __m256i a, __m256i b, int cmp);
VPCMPUB __mmask32 _mm256_mask_cmp_epu8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPUB __mmask16 _mm_cmp_epu8_mask( __m128i a, __m128i b, int cmp);
VPCMPUB __mmask16 _mm_mask_cmp_epu8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
VPCMPUB __mmask64 _mm512_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m512i a, __m512i b, int cmp);
VPCMPUB __mmask64 _mm512_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask64 m, __m512i a, __m512i b, int cmp);
VPCMPUB __mmask32 _mm256_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m256i a, __m256i b, int cmp);
VPCMPUB __mmask32 _mm256_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask32 m, __m256i a, __m256i b, int cmp);
VPCMPUB __mmask16 _mm_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __m128i a, __m128i b, int cmp);
VPCMPUB __mmask16 _mm_mask_cmp[eq|ge|gt|le|lt|neq]_epu8_mask( __mmask16 m, __m128i a, __m128i b, int cmp);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones de código EVEX, ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
