---
summary: Select Packed Noligned Bytes From Quadword Sources
---

## Descripción

Esta instrucción selecciona ocho bytes no alineados de cada elemento qword de entrada del segundo operando de origen (el tercer operando) y escribe ocho bytes montados para cada elemento qword en el operando de destino (el primer operando). Cada resultado de byte se selecciona usando un control de cambio de byte-granular dentro del elemento qword correspondiente del primer operando de origen (el segundo operando). Cada resultado byte en el operando de destino se actualiza bajo la máscara de escritura k1.

Sólo los 6 bits bajos de cada byte de control se utilizan para seleccionar una ranura de 8 bits para extraer el byte de salida de los datos de qword en el segundo operando de origen. El bit inicial de la ranura de 8 bits puede ser no aligeado en relación a cualquier límite de byte y se extrae de la fuente de entrada qword en la ubicación especificada en el bajo 6 bit del byte de control. Si la ranura de 8 bits excedería el límite de qword, la porción de salida de la ranura de 8 bits se envuelve de nuevo para comenzar desde el bit 0 del elemento qword de entrada.

El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM/YMM/XMM.

## Operación

```text
VPMULTISHIFTQB DEST, SRC1, SRC2 (EVEX encoded version)
(KL, VL) = (2, 128),(4, 256), (8, 512)
FOR i := 0 TO KL-1

    IF EVEX.b=1 AND src2 is memory THEN
                tcur := src2.qword[0]; //broadcasting

    ELSE
                tcur := src2.qword[i];

    FI;
    FOR j := 0 to 7

          ctrl := src1.qword[i].byte[j] & 63;
          FOR k := 0 to 7

                res.bit[k] := tcur.bit[ (ctrl+k) mod 64 ];
          ENDFOR
          IF k1[i*8+j] or no writemask THEN

                DEST.qword[i].byte[j] := res;
          ELSE IF zeroing-masking THEN

                DEST.qword[i].byte[j] := 0;
    ENDFOR
ENDFOR
DEST.qword[MAX_VL-1:VL] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPMULTISHIFTQB __m512i _mm512_multishift_epi64_epi8( __m512i a, __m512i b);
VPMULTISHIFTQB __m512i _mm512_mask_multishift_epi64_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPMULTISHIFTQB __m512i _mm512_maskz_multishift_epi64_epi8( __mmask64 k, __m512i a, __m512i b);
VPMULTISHIFTQB __m256i _mm256_multishift_epi64_epi8( __m256i a, __m256i b);
VPMULTISHIFTQB __m256i _mm256_mask_multishift_epi64_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPMULTISHIFTQB __m256i _mm256_maskz_multishift_epi64_epi8( __mmask32 k, __m256i a, __m256i b);
VPMULTISHIFTQB __m128i _mm_multishift_epi64_epi8( __m128i a, __m128i b);
VPMULTISHIFTQB __m128i _mm_mask_multishift_epi64_epi8(__m128i s, __mmask8 k, __m128i a, __m128i b);
VPMULTISHIFTQB __m128i _mm_maskz_multishift_epi64_epi8( __mmask8 k, __m128i a, __m128i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
