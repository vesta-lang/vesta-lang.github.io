---
summary: Detectar conflictos dentro de un vector de valores de Dword/Qword embalados
---

## Descripción

Pruebe cada elemento dword/qword del operando de origen (el segundo operando) para la igualdad con todos los demás elementos en el operando de origen más cerca del elemento menos significativo. Los resultados de comparación de cada elemento forman un poco vector, que es entonces cero extendido y escrito al destino según la máscara de escritura.

EVEX.512 versión codificada: El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
VPCONFLICTD
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    IF MaskBit(j) OR *no writemask* THEN

          FOR k := 0 TO j-1
                m := k*32
                IF ((SRC[i+31:i] = SRC[m+31:m])) THEN
                       DEST[i+k] := 1
                ELSE
                       DEST[i+k] := 0
                FI

          ENDFOR
          DEST[i+31:i+j] := 0
    ELSE
          IF *merging-masking* THEN

                *DEST[i+31:i] remains unchanged*
          ELSE

                DEST[i+31:i] := 0
          FI
    FI
ENDFOR

DEST[MAXVL-1:VL] := 0

VPCONFLICTQ
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

      i := j*64
      IF MaskBit(j) OR *no writemask* THEN

          FOR k := 0 TO j-1

                m := k*64
                 IF ((SRC[i+63:i] = SRC[m+63:m])) THEN

                       DEST[i+k] := 1
                 ELSE

                       DEST[i+k] := 0
                 FI
           ENDFOR
           DEST[i+63:i+j] := 0
     ELSE
           IF *merging-masking* THEN
                 *DEST[i+63:i] remains unchanged*
            ELSE
                  DEST[i+63:i] := 0
            FI
     FI
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPCONFLICTD __m512i _mm512_conflict_epi32( __m512i a);
VPCONFLICTD __m512i _mm512_mask_conflict_epi32(__m512i s, __mmask16 m, __m512i a);
VPCONFLICTD __m512i _mm512_maskz_conflict_epi32(__mmask16 m, __m512i a);
VPCONFLICTQ __m512i _mm512_conflict_epi64( __m512i a);
VPCONFLICTQ __m512i _mm512_mask_conflict_epi64(__m512i s, __mmask8 m, __m512i a);
VPCONFLICTQ __m512i _mm512_maskz_conflict_epi64(__mmask8 m, __m512i a);
VPCONFLICTD __m256i _mm256_conflict_epi32( __m256i a);
VPCONFLICTD __m256i _mm256_mask_conflict_epi32(__m256i s, __mmask8 m, __m256i a);
VPCONFLICTD __m256i _mm256_maskz_conflict_epi32(__mmask8 m, __m256i a);
VPCONFLICTQ __m256i _mm256_conflict_epi64( __m256i a);
VPCONFLICTQ __m256i _mm256_mask_conflict_epi64(__m256i s, __mmask8 m, __m256i a);
VPCONFLICTQ __m256i _mm256_maskz_conflict_epi64(__mmask8 m, __m256i a);
VPCONFLICTD __m128i _mm_conflict_epi32( __m128i a);
VPCONFLICTD __m128i _mm_mask_conflict_epi32(__m128i s, __mmask8 m, __m128i a);
VPCONFLICTD __m128i _mm_maskz_conflict_epi32(__mmask8 m, __m128i a);
VPCONFLICTQ __m128i _mm_conflict_epi64( __m128i a);
VPCONFLICTQ __m128i _mm_mask_conflict_epi64(__m128i s, __mmask8 m, __m128i a);
VPCONFLICTQ __m128i _mm_maskz_conflict_epi64(__mmask8 m, __m128i a);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
