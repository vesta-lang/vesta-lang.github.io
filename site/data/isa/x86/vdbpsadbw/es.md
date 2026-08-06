---
summary: Double Block Packed Sum-Absolute-Differences (SAD) on Unsigned Bytes
---

## Descripción

Compute packed SAD (sumo de diferencias absolutas) resultados de palabras de bytes no firmados de dos elementos dword de 32 bits. Los resultados de la palabra SAD empaquetados se calculan en múltiples superblocks de qword, produciendo 4 resultados de la palabra SAD en cada superbloque de 64 bits del registro de destino.

Dentro de cada super bloque de resultados de palabras empaquetadas, los resultados de SAD de dos elementos dword de 32 bits se calculan de la siguiente manera:

* Los resultados de dos palabras inferiores se calculan cada uno de la operación SAD entre un elemento dword deslizante dentro

a qword superblock de un vector intermedio con un elemento de dword estacionario en la superbloque de qword correspondiente del primer operando de origen. El vector intermedio, véase "Tmp1" en la Figura 5-8, se construye a partir del segundo operando de origen el byte imm8 como control de shuffle para seleccionar elementos dword dentro de un carril de 128 bits del segundo operando de origen. Los dos elementos de dword deslizante en una superbloque de qword de Tmp1 se encuentran en byte offset 0 y 1 dentro del superbloque, respectivamente. El elemento dword estacionario en el superbloque qword del primer operando de origen se encuentra en offset 0.

* Los siguientes resultados de dos palabras se calculan cada una de la operación SAD entre un elemento dword deslizante dentro

un superbloque de qword del vector intermedio Tmp1 con un segundo elemento de dword estacionario en el superbloque de qword correspondiente del primer operando de origen. Los dos elementos de dword deslizante en una superbloque de qword de Tmp1 se encuentran en byte offset 2and 3 dentro del superblock, respectivamente. El elemento dword estacionario en el superbloque qword del primer operando de origen se encuentra en offset 4.

* El vector intermedio se construye en carriles de 128 bits. Dentro de cada carril de 128 bits, cada elemento dword del

vector intermedio es seleccionado por un campo de dos bits dentro del byte imm8 en los 128-bits correspondientes del segundo operando de origen. El byte imm8 sirve como control dword shuffle dentro de cada vía de 128 bits del vector intermedio y el segundo operando de origen, de forma similar a PSHUFD.

El primer operando de origen es un registro ZMM/YMM/XMM. El segundo operando de origen es un registro ZMM/YMM/XMM, o un 512/256/128-bit ubicación de memoria. El operando de destino es actualizado condicionalmente basado en máscara de escritura k1 a 16-bit palabra granularidad.

```text
                            127+128*n                   95+128*n                    63+128*n                               31+128*n                 128*n
                                               DW3                    DW2                        DW1                                 DW0
```

128-bit Lane of Src2

```text
                                                    imm8 shuffle control                                                                  00B: DW0
```

01B: DW1

```text
                                                                             7      5            3                 10                     10B: DW2
```

11B: DW3

```text
                                127+128*n               95+128*n                    63+128*n                               31+128*n                 128*n
```

128-bit Lane of Tmp1

Tmp1 qword superblock

55 47 39 31 24                                                                                      39 31 23 15 8

```text
                                      Tmp1 sliding dword                                                                                 Tmp1 sliding dword
```

63 55 47 39 32                                                                                   31 23 15 7 0

```text
                                                    Src1 stationary dword 1                       ____                                    Src1 stationary dword 0
```

_                     _     _                    _                                                abs abs abs abs

abs abs abs abs

```text
                         +                          47 39 31 23 16                                                 +
```

```text
                                                                             Tmp1 sliding dword                              31 23 15 7 0
```

Tmp1 dword deslizante

```text
                                                    63 55 47 39 32                                                     31 23 15 7 0                          Src1 stationary dword 0
```

Dword estacionaria Src1           abdominales abdominales abdominales abdominales abdominales

```text
                                                    +                                                                                     +
```

```text
                                             63     47                          31                                     15                    0
```

Destino qword superblock

Figure 5-8. 64-bit Super Block of SAD Operation in VDBPSADBW

## Operación

```text
VDBPSADBW (EVEX Encoded Versions)
(KL, VL) = (8, 128), (16, 256), (32, 512)
Selection of quadruplets:
FOR I = 0 to VL step 128

    TMP1[I+31:I] := select (SRC2[I+127: I], imm8[1:0])
    TMP1[I+63: I+32] := select (SRC2[I+127: I], imm8[3:2])
    TMP1[I+95: I+64] := select (SRC2[I+127: I], imm8[5:4])
    TMP1[I+127: I+96] := select (SRC2[I+127: I], imm8[7:6])
END FOR

SAD of quadruplets:

FOR I =0 to VL step 64
    TMP_DEST[I+15:I] := ABS(SRC1[I+7: I] - TMP1[I+7: I]) +
          ABS(SRC1[I+15: I+8]- TMP1[I+15: I+8]) +


     ABS(SRC1[I+23: I+16]- TMP1[I+23: I+16]) +
     ABS(SRC1[I+31: I+24]- TMP1[I+31: I+24])

TMP_DEST[I+31: I+16] := ABS(SRC1[I+7: I] - TMP1[I+15: I+8]) +
      ABS(SRC1[I+15: I+8]- TMP1[I+23: I+16]) +
      ABS(SRC1[I+23: I+16]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+31: I+24]- TMP1[I+39: I+32])

TMP_DEST[I+47: I+32] := ABS(SRC1[I+39: I+32] - TMP1[I+23: I+16]) +
      ABS(SRC1[I+47: I+40]- TMP1[I+31: I+24]) +
      ABS(SRC1[I+55: I+48]- TMP1[I+39: I+32]) +
      ABS(SRC1[I+63: I+56]- TMP1[I+47: I+40])

    TMP_DEST[I+63: I+48] := ABS(SRC1[I+39: I+32] - TMP1[I+31: I+24]) +
          ABS(SRC1[I+47: I+40] - TMP1[I+39: I+32]) +
          ABS(SRC1[I+55: I+48] - TMP1[I+47: I+40]) +
          ABS(SRC1[I+63: I+56] - TMP1[I+55: I+48])

ENDFOR

FOR j := 0 TO KL-1

i := j * 16

IF k1[j] OR *no writemask*

     THEN DEST[i+15:i] := TMP_DEST[i+15:i]

     ELSE

        IF *merging-masking*                ; merging-masking

             THEN *DEST[i+15:i] remains unchanged*

             ELSE                           ; zeroing-masking

                    DEST[i+15:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VDBPSADBW __m512i _mm512_dbsad_epu8(__m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_mask_dbsad_epu8(__m512i s, __mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m512i _mm512_maskz_dbsad_epu8(__mmask32 m, __m512i a, __m512i b int imm8);
VDBPSADBW __m256i _mm256_dbsad_epu8(__m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_mask_dbsad_epu8(__m256i s, __mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m256i _mm256_maskz_dbsad_epu8(__mmask16 m, __m256i a, __m256i b int imm8);
VDBPSADBW __m128i _mm_dbsad_epu8(__m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_mask_dbsad_epu8(__m128i s, __mmask8 m, __m128i a, __m128i b int imm8);
VDBPSADBW __m128i _mm_maskz_dbsad_epu8(__mmask8 m, __m128i a, __m128i b int imm8);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Excepciones Tipo E4NF.nb en la tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."
