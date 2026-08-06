---
summary: Carga Sparse valores en coma flotante de precisión simple empaquetados De Memoria Dense
---

## Descripción

Ampliar (carga) hasta 16/8/4, contiguo, valores en coma flotante de precisión simple del vector de entrada en el operando de origen (el segundo operando) a elementos escasos del operando de destino (el primer operando) seleccionado por la máscara de escritura k1.

El operando de destino es un registro ZMM/YMM/XMM, el operando de origen puede ser un registro ZMM/YMM/XMM o un registro 512/256/128-bit ubicación de memoria.

El vector de entrada comienza desde el elemento más bajo del operando de origen. La máscara de escritura k1 selecciona los elementos de destino (un vector parcial o elementos escasos si menos de 16 elementos) para ser reemplazados por los elementos ascendentes en el vector de entrada. Los elementos de destino no seleccionados por la máscara de escritura k1 son sin modificar o cero, dependiendo de EVEX.z.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Tenga en cuenta que el desplazamiento comprimido supone un pre-escalamiento (N) correspondiente al tamaño de un solo elemento en lugar del tamaño del vector completo.

## Operación

```text
VEXPANDPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

k := 0

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

        THEN

             DEST[i+31:i] := SRC[k+31:k];

             k := k + 32

        ELSE

             IF *merging-masking*          ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                      ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VEXPANDPS __m512 _mm512_mask_expand_ps( __m512 s, __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_maskz_expand_ps( __mmask16 k, __m512 a);
VEXPANDPS __m512 _mm512_mask_expandloadu_ps( __m512 s, __mmask16 k, void * a);
VEXPANDPS __m512 _mm512_maskz_expandloadu_ps( __mmask16 k, void * a);
VEXPANDPD __m256 _mm256_mask_expand_ps( __m256 s, __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_maskz_expand_ps( __mmask8 k, __m256 a);
VEXPANDPD __m256 _mm256_mask_expandloadu_ps( __m256 s, __mmask8 k, void * a);
VEXPANDPD __m256 _mm256_maskz_expandloadu_ps( __mmask8 k, void * a);
VEXPANDPD __m128 _mm_mask_expand_ps( __m128 s, __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_maskz_expand_ps( __mmask8 k, __m128 a);
VEXPANDPD __m128 _mm_mask_expandloadu_ps( __m128 s, __mmask8 k, void * a);
VEXPANDPD __m128 _mm_maskz_expandloadu_ps( __mmask8 k, void * a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Excepciones Tipo E4.nb en la tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."

Additionally:

```text
#UD                       If EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed valores en coma flotante

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.256.66.0F3A.W0 19 /r ib A V/V AVX Extracto 128 bits de valores en coma flotante empacado de ymm2 y resultados de la tienda en xmm1/m128. VEXTRACTF128 xmm1/m128, ymm2,

imm8

EVEX.256.66.0F3A.W0 19 /r ib C V/V (AVX512VL AND Extracto 128 bits de una sola precisión empaquetada

```text
                                              AVX512F) OR          floating-point values from ymm2 and store
```

VEXTRACTF32X4 xmm1/m128 {k1}{z},

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 19 /r ib C V/V AVX512F Extracto 128 bits de una sola precisión empaquetada

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32x4 xmm1/m128 {k1}{z},                                   results in xmm1/m128 subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 19 /r ib B V/V (AVX512VL AND Extracto 128 bits de doble precisión embalada

VEXTRACTF64X2 xmm1/m128 {k1}{z}, AVX512DQ) OR valores en coma flotante de ymm2 y tienda

```text
                                              AVX10.1              results in xmm1/m128 subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W119 /r ib B V/VAVX512DQExtraer 128 bits de doble precisión embalada ORAVX10.1 VEXTRACTF64X2 xmm1/m128 {k1}{z}, valores en coma flotantedesdezmm2y los resultados de la tienda enxmm1/m128sujeto amáscara de escritura k1. zmm2, imm8

EVEX.512.66.0F3A.W0 1B /r ib D V/V AVX512DQ Extracto 256 bits de una sola precisión empaquetada

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF32X8 ymm1/m256 {k1}{z}, results in ymm1/m256 subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 1B /r ib C V/V AVX512F Extracto 256 bits de doble precisión embalada

```text
                                              OR AVX10.1           floating-point values from zmm2 and store
```

VEXTRACTF64x4 ymm1/m256 {k1}{z},                                   results in ymm1/m256 subject to writemask k1.

zmm2, imm8

## Descripción

VEXTRACTF128/VEXTRACTF32x4 y VEXTRACTF64x2 extracto 128-bits de valores en coma flotante de precisión simple del operando de origen (el segundo operando) y almacenar a la baja 128-bit del operando de destino (el primer operando). La extracción de datos de 128 bits se produce en un offset granular de 128 bits especificado por imm8[0] (256 bits) o imm8[1:0] como factor multiplicador. El destino puede ser un registro vectorial o una ubicación de memoria de 128 bits.

VEXTRACTF32x4: El bajo 128 bits del operando de destino se actualiza en granularidad de 32 bits según la máscara de escritura.

VEXTRACTF32x8 y VEXTRACTF64x4 extracto 256-bits de valores en coma flotante de precisión doble del operando de origen (segundo operando) y almacenar a los bajos 256-bit del operando de destino (el primer operando). La extracción de datos de 256 bits se produce en un offset granular de 256 bits especificado por imm8[0] (256-bit) o imm8[0] como factor multiplicador El destino puede ser un registro vectorial o una ubicación de memoria de 256-bit.

VEXTRACTF64x4: El bajo 256-bit del operando de destino se actualiza en granularidad de 64 bits según la máscara de escritura.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

Se ignoran los 6 pedazos altos de lo inmediato.

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed valores en coma flotante

Si VEXTRACTF128 está codificado con VEX.L= 0, un intento de ejecutar la instrucción codificada con VEX.L= 0 causará una excepción #UD.

## Operación

```text
VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is a Register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF32x4 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 3
    i := j * 32
    IF k1[j] OR *no writemask*

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]  ; merging-masking
          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is a Register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTF64x2 (EVEX Encoded Versions) When Destination is Memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

    i := j * 64                                  ; merging-masking
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;
ENDFOR

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF32x8 (EVEX.U1.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is a Register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values

        IF *merging-masking*                      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE *zeroing-masking*                ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTF64x4 (EVEX.512 Encoded Version) When Destination is Memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE ; merging-masking
                *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTF128 (Memory Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTF128 (Register Destination Form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VEXTRACTF32x4 __m128 _mm512_extractf32x4_ps(__m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm512_maskz_extractf32x4_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_extractf32x4_ps(__m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_mask_extractf32x4_ps(__m128 s, __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x4 __m128 _mm256_maskz_extractf32x4_ps( __mmask8 k, __m256 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_extractf32x8_ps(__m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_mask_extractf32x8_ps(__m256 s, __mmask8 k, __m512 a, const int nidx);
VEXTRACTF32x8 __m256 _mm512_maskz_extractf32x8_ps( __mmask8 k, __m512 a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_extractf64x2_pd(__m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm512_maskz_extractf64x2_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_extractf64x2_pd(__m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_mask_extractf64x2_pd(__m128d s, __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x2 __m128d _mm256_maskz_extractf64x2_pd( __mmask8 k, __m256d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_extractf64x4_pd( __m512d a, const int nidx);
VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed Floating-Point Values VEXTRACTF64x4 __m256d _mm512_mask_extractf64x4_pd(__m256d s, __mmask8 k, __m512d a, const int nidx);
VEXTRACTF64x4 __m256d _mm512_maskz_extractf64x4_pd( __mmask8 k, __m512d a, const int nidx);
VEXTRACTF128 __m128 _mm256_extractf128_ps (__m256 a, int offset);
VEXTRACTF128 __m128d _mm256_extractf128_pd (__m256d a, int offset);
VEXTRACTF128 __m128i_mm256_extractf128_si256(__m256i a, int offset);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-23, "Tipo 6 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-56, "Tipo E6NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTF128/VEXTRACTF32x4/VEXTRACTF64x2/VEXTRACTF32x8/VEXTRACTF64x4-- Extract Packed valores en coma flotante

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.256.66.0F3A.W0 39 /r ib A V/V AVX2 Extracto 128 bits de datos enteros de ymm2 y resultados de la tienda en xmm1/m128. VEXTRACTI128 xmm1/m128, ymm2, imm8

EVEX.256.66.0F3A.W0 39 /r ib C V/V (AVX512VL AND Extracto 128 bits de valores enteros de doble palabra

```text
                                                 AVX512F) OR       from ymm2 and store results in xmm1/m128
```

VEXTRACTI32X4 xmm1/m128 {k1}{z},

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W0 39 /r ib C V/V AVX512F Extracto 128 bits de valores enteros de doble palabra

```text
                                                 OR AVX10.1        from zmm2 and store results in xmm1/m128
```

VEXTRACTI32x4 xmm1/m128 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

EVEX.256.66.0F3A.W1 39 /r ib B V/V (AVX512VL AND Extracto 128 bits de valores enteros de cuád-palabra

VEXTRACTI64X2 xmm1/m128 {k1}{z}, AVX512DQ) O de ymm2 y resultados de la tienda en xmm1/m128

```text
                                                 AVX10.1           subject to writemask k1.
```

ymm2, imm8

EVEX.512.66.0F3A.W139 /r ib B V/VAVX512DQExtraer 128 bits de valores enteros de cuádruple OAVX10.1 VEXTRACTI64X2 xmm1/m128 {k1}{z}, dezmm2y los resultados de la tienda enxmm1/m128sujeto amáscara de escritura k1. zmm2, imm8

EVEX.512.66.0F3A.W0 3B /r ib D V/V AVX512DQ Extracto 256 bits de valores enteros de doble palabra

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI32X8 ymm1/m256 {k1}{z}, subject to writemask k1. zmm2, imm8

EVEX.512.66.0F3A.W1 3B /r ib C V/V AVX512F Extracto 256 bits de valores enteros de cuadr-palabra

```text
                                                 OR AVX10.1        from zmm2 and store results in ymm1/m256
```

VEXTRACTI64x4 ymm1/m256 {k1}{z},                                   subject to writemask k1.

zmm2, imm8

## Descripción

VEXTRACTI128/VEXTRACTI32x4 y VEXTRACTI64x2 extraen 128-bits de valores enteros de doble palabra del operando de origen (el segundo operando) y almacenan al bajo 128-bit del operando de destino (el primer operando). La extracción de datos de 128 bits se produce en un offset granular de 128 bits especificado por imm8[0] (256 bits) o imm8[1:0] como factor multiplicador. El destino puede ser un registro vectorial o una ubicación de memoria de 128 bits.

VEXTRACTI32x4: El bajo 128 bits del operando de destino se actualiza en granularidad de 32 bits según la máscara de escritura.

VEXTRACTI64x2: El bajo 128 bits del operando de destino se actualiza en granularidad de 64 bits según la máscara de escritura.

VEXTRACTI32x8 y VEXTRACTI64x4 Extracto de 256 bits de valores enteros de cuadio del operando de origen (el segundo operando) y almacenar a los bajos 256 bits del operando de destino (el primer operando). La extracción de datos de 256 bits se produce en un offset granular de 256 bits especificado por imm8[0] (256-bit) o imm8[0] como factor multiplicador El destino puede ser un registro vectorial o una ubicación de memoria de 256-bit.

VEXTRACTI32x8: El bajo 256-bit del operando de destino se actualiza en granularidad de 32 bits según la máscara de escritura.

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

VEXTRACTI64x4: El bajo 256-bit del operando de destino se actualiza en granularidad de 64 bits según la máscara de escritura.

VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

Los 7 bits altos (6 bits en EVEX.512) de los inmediatos son ignorados.

Si VEXTRACTI128 está codificado con VEX.L= 0, un intento de ejecutar la instrucción codificada con VEX.L= 0 causará una excepción #UD.

## Operación

```text
VEXTRACTI32x4 (EVEX encoded versions) when destination is a register

VL = 256, 512

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC1[127:0]

          1: TMP_DEST[127:0] := SRC1[255:128]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC1[127:0]

          01: TMP_DEST[127:0] := SRC1[255:128]

          10: TMP_DEST[127:0] := SRC1[383:256]

          11: TMP_DEST[127:0] := SRC1[511:384]

     ESAC.

FI;

FOR j := 0 TO 3

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI32x4 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

FI;

FOR j := 0 TO 3                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI64x2 (EVEX encoded versions) when destination is a register
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]
          11: TMP_DEST[127:0] := SRC1[511:384]

    ESAC.
FI;

FOR j := 0 TO 1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:128] := 0

VEXTRACTI64x2 (EVEX encoded versions) when destination is memory
VL = 256, 512
IF VL = 256

    CASE (imm8[0]) OF
          0: TMP_DEST[127:0] := SRC1[127:0]
          1: TMP_DEST[127:0] := SRC1[255:128]

    ESAC.
FI;
IF VL = 512

    CASE (imm8[1:0]) OF
          00: TMP_DEST[127:0] := SRC1[127:0]
          01: TMP_DEST[127:0] := SRC1[255:128]
          10: TMP_DEST[127:0] := SRC1[383:256]

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

          11: TMP_DEST[127:0] := SRC1[511:384]
    ESAC.
FI;

FOR j := 0 TO 1                                  ; merging-masking
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN DEST[i+63:i] := TMP_DEST[i+63:i]
          ELSE *DEST[i+63:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := TMP_DEST[i+31:i]

     ELSE

             IF *merging-masking*                ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE *zeroing-masking*          ; zeroing-masking

                 DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI32x8 (EVEX.U1.512 encoded version) when destination is memory
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 7                                  ; merging-masking
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN DEST[i+31:i] := TMP_DEST[i+31:i]
          ELSE *DEST[i+31:i] remains unchanged*
    FI;

ENDFOR

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is a register
VL = 512
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC1[255:0]
    1: TMP_DEST[255:0] := SRC1[511:256]
ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE *zeroing-masking*       ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:256] := 0

VEXTRACTI64x4 (EVEX.512 encoded version) when destination is memory

CASE (imm8[0]) OF

0: TMP_DEST[255:0] := SRC1[255:0]

1: TMP_DEST[255:0] := SRC1[511:256]

ESAC.

FOR j := 0 TO 3

i := j * 64

IF k1[j] OR *no writemask*

       THEN DEST[i+63:i] := TMP_DEST[i+63:i]

       ELSE *DEST[i+63:i] remains unchanged*  ; merging-masking

FI;

ENDFOR

VEXTRACTI128 (memory destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.

VEXTRACTI128 (register destination form)
CASE (imm8[0]) OF

    0: DEST[127:0] := SRC1[127:0]
    1: DEST[127:0] := SRC1[255:128]
ESAC.
DEST[MAXVL-1:128] := 0

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values
```

## Intel C/C++ compilador intrínseco

```c
VEXTRACTI32x4 __m128i _mm512_extracti32x4_epi32(__m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm512_maskz_extracti32x4_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_extracti32x4_epi32(__m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_mask_extracti32x4_epi32(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x4 __m128i _mm256_maskz_extracti32x4_epi32( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_extracti32x8_epi32(__m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_mask_extracti32x8_epi32(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI32x8 __m256i _mm512_maskz_extracti32x8_epi32( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_extracti64x2_epi64(__m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm512_maskz_extracti64x2_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_extracti64x2_epi64(__m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_mask_extracti64x2_epi64(__m128i s, __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x2 __m128i _mm256_maskz_extracti64x2_epi64( __mmask8 k, __m256i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_extracti64x4_epi64(__m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_mask_extracti64x4_epi64(__m256i s, __mmask8 k, __m512i a, const int nidx);
VEXTRACTI64x4 __m256i _mm512_maskz_extracti64x4_epi64( __mmask8 k, __m512i a, const int nidx);
VEXTRACTI128 __m128i _mm256_extracti128_si256(__m256i a, int offset);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-23, "Tipo 6 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-56, "Tipo E6NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               IF VEX.L = 0.
```

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```

VEXTRACTI128/VEXTRACTI32x4/VEXTRACTI64x2/VEXTRACTI32x8/VEXTRACTI64x4--Extract Packed Integer Values
