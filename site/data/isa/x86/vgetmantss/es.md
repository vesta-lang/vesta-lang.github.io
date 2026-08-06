---
summary: Extract Float32 Vector de Mantissa Normalizado de Float32 escalar
---

## Descripción

Convertir los valores flotantes de precisión única en el elemento de palabra doble bajo del segundo operando de origen (el tercer operando) a valor en coma flotante de precisión simple con la normalización de mantissa y el control de signos especificados por el byte imm8, ver Figura 5-15. El resultado convertido está escrito al elemento de doble palabra bajo del operando de destino (el primer operando) utilizando máscara de escritura k1. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. El mantissa normalizado es especificado por interv (imm8[1:0]) y el control de signos (sc) se especifica por bits 3:2 del byte inmediato.

La operación de conversión es:

GetMant(x) = +/-2k|x.significand| where:

1 <= |x.significand| < 2

El exponente imparcial k puede ser de 0 o -1, dependiendo del rango de intervalo definido por interv, el rango del significado y si el exponente de la fuente es incluso o extraño. El signo del resultado final es determinado por sc y el signo fuente. El valor codificado de imm8[1:0] y el control de signos se muestran en la Figura 5-15.

El resultado coma flotante de precisión simple convertido está codificado de acuerdo con el control de signos, el exponente imparcial k (bismos de novia) y un mantissa normalizado a la gama especificada por interv.

La función GetMant() sigue la Tabla 5-16 cuando se trata de números especiales coma flotante.

Si se utiliza la escritura, el elemento de palabra doble bajo del operando de destino se actualiza condicionalmente dependiendo del valor de máscara de escritura registro k1. Si no se utiliza la escritura, el elemento de palabra doble bajo del operando de destino se actualiza incondicionalmente.

## Operación

```text
// getmant_fp32(src, sign_control, normalization_interval) is defined in the operation section of VGETMANTPS

VGETMANTSS (EVEX encoded version)

SignCtrl[1:0] := IMM8[3:2];

Interv[1:0] := IMM8[1:0];

IF k1[0] OR *no writemask*

     THEN DEST[31:0] :=

           getmant_fp32(src, sign_control, normalization_interval)

     ELSE

     IF *merging-masking*          ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                    ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETMANTSS __m128 _mm_getmant_ss( __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_mask_getmant_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_maskz_getmant_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn);
VGETMANTSS __m128 _mm_getmant_round_ss( __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_mask_getmant_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
VGETMANTSS __m128 _mm_maskz_getmant_round_ss( __mmask8 k, __m128 a, __m128 b, enum intv, enum sgn, int r);
```

## SIMD coma flotante Excepciones

Denormal, Invalid

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed valores en coma flotante

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.256.66.0F3A.W0 18 /r ib A V/V AVX Insertar 128 bits de valores en coma flotante empacado

VINSERTF128 ymm1, ymm2, de xmm3/m128 y los valores restantes xmm3/m128, imm8 de ymm2 a ymm1.

EVEX.256.66.0F3A.W0 18 /r ib C V/V (AVX512VL AND Insertar 128 bits de una sola precisión embalada

```text
                                                      AVX512F) OR    floating-point values from xmm3/m128 and the
```

VINSERTF32X4 ymm1 {k1}{z}, ymm2,

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W0 18 /r ib C V/V AVX512F Insertar 128 bits de una sola precisión embalada

```text
                                                      OR AVX10.1     floating-point values from xmm3/m128 and the
```

VINSERTF32X4 zmm1 {k1}{z}, zmm2, valores restantes de zmm2 a zmm1 bajo xmm3/m128, imm8 máscara de escritura k1.

EVEX.256.66.0F3A.W1 18 /r ib B V/V (AVX512VL AND Insertar 128 bits de doble precisión embalada

VINSERTF64X2 ymm1 {k1}{z}, ymm2, AVX512DQ) OR valores en coma flotante de xmm3/m128 y el

```text
                                                      AVX10.1        remaining values from ymm2 into ymm1 under
```

xmm3/m128, imm8                                                      writemask k1.

EVEX.512.66.0F3A.W118 /r ib B V/VAVX512DQInsertar 128 bits de doble precisión embalada ORAVX10.1 VINSERTF64X2 zmm1 {k1}{z}, zmm2, valores en coma flotantedesdexmm3/m128y los valores restanteszmm2enzmm1por debajoxmm3/m128, imm8 máscara de escritura k1.

EVEX.512.66.0F3A.W01A /r ib D V/VAVX512DQInsertar 256 bits de OR de una sola precisión embaladaAVX10.1 VINSERTF32X8 zmm1 {k1}{z}, zmm2, valores en coma flotantedesdeymm3/m256y los valores restanteszmm2enzmm1por debajoymm3/m256, imm8 máscara de escritura k1.

EVEX.512.66.0F3A.W11A /r ib C V/VAVX512FInsertar 256 bits de doble precisión envasado ORAVX10.1 VINSERTF64X4 zmm1 {k1}{z}, zmm2, valores en coma flotantedesdeymm3/m256y los valores restanteszmm2enzmm1por debajoymm3/m256, imm8 máscara de escritura k1.

## Descripción

VINSERTF128/VINSERTF32x4 y VINSERTF64x2 insertar 128-bits de los valores flotantes empaquetados de la segunda fuente operand (el tercer operand) en el destino operand (el primer operand) en un offset de 128-bits multiplicado por imm8[0] (256-bit) o imm8[1:0]. Las partes restantes del operando de destino se copian de los campos correspondientes del primer operando de origen (el segundo operando). El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino y el primer operandos de origen son registros vectoriales.

VINSERTF32x4: El operando de destino es un registro ZMM/YMM y actualizado en granularidad de 32 bits según la máscara de escritura. Los 6/7 bits altos de los inmediatos son ignorados.

VINSERTF64x2: El operando de destino es un registro ZMM/YMM y actualizado en granularidad de 64 bits según la máscara de escritura. Los 6/7 bits altos de los inmediatos son ignorados.

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed valores en coma flotante

VINSERTF32x8 y VINSERTF64x4 insertan 256 bits de valores en coma flotante empacado del segundo operando de origen (el tercer operando) en el operando de destino (el primer operando) a un granular de 256 bits multiplicado por imm8[0]. Las partes restantes del destino se copian de los campos correspondientes del primer operando de origen (el segundo operando). El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. Los 7 pedazos altos de lo inmediato son ignorados. El operando de destino es un registro ZMM y actualizado en granularidad de 32/64 bits según la máscara de escritura.

## Operación

```text
VINSERTF32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed Floating-Point Values

VINSERTF64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := TMP_DEST[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                       ; zeroing-masking

                 DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTF128 (VEX encoded version)
TEMP[255:0] := SRC1[255:0]
CASE (imm8[0]) OF

    0: TEMP[127:0] := SRC2[127:0]
    1: TEMP[255:128] := SRC2[127:0]
ESAC
DEST := TEMP
```

## Intel C/C++ compilador intrínseco

```c
VINSERTF32x4 __m512 _mm512_insertf32x4( __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_mask_insertf32x4(__m512 s, __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m512 _mm512_maskz_insertf32x4( __mmask16 k, __m512 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_insertf32x4( __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_mask_insertf32x4(__m256 s, __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x4 __m256 _mm256_maskz_insertf32x4( __mmask8 k, __m256 a, __m128 b, int imm);
VINSERTF32x8 __m512 _mm512_insertf32x8( __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_mask_insertf32x8(__m512 s, __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF32x8 __m512 _mm512_maskz_insertf32x8( __mmask16 k, __m512 a, __m256 b, int imm);
VINSERTF64x2 __m512d _mm512_insertf64x2( __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_mask_insertf64x2(__m512d s, __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m512d _mm512_maskz_insertf64x2( __mmask8 k, __m512d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_insertf64x2( __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_mask_insertf64x2(__m256d s, __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x2 __m256d _mm256_maskz_insertf64x2( __mmask8 k, __m256d a, __m128d b, int imm);
VINSERTF64x4 __m512d _mm512_insertf64x4( __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_mask_insertf64x4(__m512d s, __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF64x4 __m512d _mm512_maskz_insertf64x4( __mmask8 k, __m512d a, __m256d b, int imm);
VINSERTF128 __m256 _mm256_insertf128_ps (__m256 a, __m128 b, int offset);
VINSERTF128 __m256d _mm256_insertf128_pd (__m256d a, __m128d b, int offset);
VINSERTF128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-23, "Tipo 6 Condiciones de Excepción de Clase".

Additionally:

```text
#UD               If VEX.L = 0.
```

Instrucciones codificadas por EVEX, ver Tabla 2-56, "Tipo E6NF Clase Condiciones de Excepción."

VINSERTF128/VINSERTF32x4/VINSERTF64x2/VINSERTF32x8/VINSERTF64x4--Insert Packed valores en coma flotante

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.256.66.0F3A.W0 38 /r ib A V/V AVX2 Insertar 128 bits de datos enteros de xmm3/m128 y los valores restantes de ymm2 a ymm1. VINSERTI128 ymm1, ymm2, xmm3/m128, imm8

EVEX.256.66.0F3A.W0 38 /r ib C V/V (AVX512VL AND Insertar 128 bits de integer de doble palabra embalado

```text
                                                 AVX512F) OR    values from xmm3/m128 and the remaining
```

VINSERTI32X4 ymm1 {k1}{z}, ymm2,

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W0 38 /r ib C V/V AVX512F Insertar 128 bits de integer de doble palabra embalado

```text
                                                 OR AVX10.1     values from xmm3/m128 and the remaining
```

VINSERTI32X4 zmm1 {k1}{z}, zmm2, valores de zmm2 a zmm1 bajo máscara de escritura xmm3/m128, imm8 k1.

EVEX.256.66.0F3A.W1 38 /r ib B V/V (AVX512VL AND Insertar 128 bits de integer de cuaderno embalado

VINSERTI64X2 ymm1 {k1}{z}, ymm2, AVX512DQ) Los valores OR de xmm3/m128 y el resto

```text
                                                 AVX10.1        values from ymm2 into ymm1 under writemask
```

xmm3/m128, imm8                                                 k1.

EVEX.512.66.0F3A.W138 /r ib B V/VAVX512DQO Insertar 128 bits de integer de cuadword empaquetadoAVX10.1 VINSERTI64X2 zmm1 {k1}{z}, zmm2, valores dexmm3/m128y los valores restanteszmm2enzmm1por debajomáscara de escritura xmm3/m128, imm8 k1.

EVEX.512.66.0F3A.W03A /r ib D V/VAVX512DQO Insertar 256 bits de integer de doblepabradaAVX10.1 VINSERTI32X8 zmm1 {k1}{z}, zmm2, valores deymm3/m256y los valores restanteszmm2enzmm1por debajomáscara de escritura ymm3/m256, imm8 k1.

EVEX.512.66.0F3A.W13A /r ib C V/VAVX512FInsertar 256 bits de integer de cuádword empaquetadoAVX10.1 VINSERTI64X4 zmm1 {k1}{z}, zmm2, valores deymm3/m256y los valores restanteszmm2enzmm1por debajomáscara de escritura ymm3/m256, imm8 k1.

## Descripción

VINSERTI32x4 y VINSERTI64x2 insertan 128 bits de valores enteros empaquetados del segundo operando de origen (el tercer operando) en el operando de destino (el primer operando) en un offset granular de 128 bits multiplicado por imm8[0] (256 bits) o imm8[1: Las partes restantes del destino se copian de los campos correspondientes del primer operando de origen (el segundo operando). El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. Se ignoran los 6/7bitos altos de lo inmediato. El operando de destino es un registro ZMM/YMM y actualizado en la granularidad de 32 y 64 bits según la máscara de escritura.

VINSERTI32x8 y VINSERTI64x4 insertan 256 bits de valores enteros empaquetados del segundo operando de origen (el tercer operando) en el operando de destino (el primer operando) en un offset granular de 256 bits multiplicado por imm8[0]. Las partes restantes del destino se copian de los campos correspondientes del primer operando de origen (el segundo operando). El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

las partes superiores de los inmediatos son ignoradas. El operando de destino es un registro ZMM y actualizado en granularidad de 32 y 64 bits según la máscara de escritura.

VINSERTI128 inserta 128 bits de datos de enteros empaquetados del segundo operando de origen (el tercer operando) en el operando de destino (el primer operando) en un offset granular de 128 bits multiplicado por imm8[0]. Las partes restantes del destino se copian de los campos correspondientes del primer operando de origen (el segundo operando). El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. Los 7 pedazos altos de lo inmediato son ignorados. VEX.L debe ser 1, de lo contrario intentar ejecutar esta instrucción con VEX.L=0 causará #UD.

## Operación

```text
VINSERTI32x4 (EVEX encoded versions)

(KL, VL) = (8, 256), (16, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x2 (EVEX encoded versions)

(KL, VL) = (4, 256), (8, 512)

TEMP_DEST[VL-1:0] := SRC1[VL-1:0]

IF VL = 256

     CASE (imm8[0]) OF

          0: TMP_DEST[127:0] := SRC2[127:0]

          1: TMP_DEST[255:128] := SRC2[127:0]

     ESAC.

FI;

IF VL = 512

     CASE (imm8[1:0]) OF

          00: TMP_DEST[127:0] := SRC2[127:0]

          01: TMP_DEST[255:128] := SRC2[127:0]

          10: TMP_DEST[383:256] := SRC2[127:0]

          11: TMP_DEST[511:384] := SRC2[127:0]

     ESAC.

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI32x8 (EVEX.U1.512 encoded version)
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 15

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                       ; zeroing-masking

                        DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

VINSERTI64x4 (EVEX.512 encoded version)
VL = 512
TEMP_DEST[VL-1:0] := SRC1[VL-1:0]
CASE (imm8[0]) OF

    0: TMP_DEST[255:0] := SRC2[255:0]
    1: TMP_DEST[511:256] := SRC2[255:0]
ESAC.

FOR j := 0 TO 7

i := j * 64

IF k1[j] OR *no writemask*

      THEN DEST[i+63:i] := TMP_DEST[i+63:i]

      ELSE

             IF *merging-masking*            ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE                        ; zeroing-masking

                   DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VINSERTI128

TEMP[255:0] := SRC1[255:0]

CASE (imm8[0]) OF

0: TEMP[127:0] := SRC2[127:0]

1: TEMP[255:128] := SRC2[127:0]

ESAC

DEST := TEMP
```

## Intel C/C++ compilador intrínseco

```c
VINSERTI32x4 _mm512i _inserti32x4( __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _mask_inserti32x4(__m512i s, __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 _mm512i _maskz_inserti32x4( __mmask16 k, __m512i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_inserti32x4( __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_mask_inserti32x4(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x4 __m256i _mm256_maskz_inserti32x4( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI32x8 __m512i _mm512_inserti32x8( __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_mask_inserti32x8(__m512i s, __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI32x8 __m512i _mm512_maskz_inserti32x8( __mmask16 k, __m512i a, __m256i b, int imm);
VINSERTI64x2 __m512i _mm512_inserti64x2( __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_mask_inserti64x2(__m512i s, __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m512i _mm512_maskz_inserti64x2( __mmask8 k, __m512i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_inserti64x2( __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_mask_inserti64x2(__m256i s, __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x2 __m256i _mm256_maskz_inserti64x2( __mmask8 k, __m256i a, __m128i b, int imm);
VINSERTI64x4 _mm512_inserti64x4( __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_mask_inserti64x4(__m512i s, __mmask8 k, __m512i a, __m256i b, int imm);
VINSERTI64x4 _mm512_maskz_inserti64x4( __mmask m, __m512i a, __m256i b, int imm);
VINSERTI128 __m256i _mm256_insertf128_si256 (__m256i a, __m128i b, int offset);
```

## SIMD coma flotante Excepciones

None.

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-23, "Tipo 6 Condiciones de Excepción de Clase".

Additionally:

```text
#UD               If VEX.L = 0.
```

Instrucciones codificadas por EVEX, ver Tabla 2-56, "Tipo E6NF Clase Condiciones de Excepción."

VINSERTI128/VINSERTI32x4/VINSERTI64x2/VINSERTI32x8/VINSERTI64x4--Insert Packed Integer Values
