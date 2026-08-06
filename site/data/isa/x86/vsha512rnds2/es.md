---
summary: Realizar dos rondas de operación SHA512
---

## Descripción

La instrucción VSHA512RNDS2 realiza dos rondas de operación SHA512 utilizando el estado inicial SHA512 (C,D,G,H) del primer operado, un estado inicial SHA512 (A,B,E,F) del segundo operado, y una suma pre-computada de los dos próximos mensajes qwords y las correspondientes constantes redondas del tercer operado (). El estado SHA512 actualizado (A,B,E,F) está escrito al primer operando, y el segundo operando se puede utilizar como el estado actualizado (C,D,G,H) en rondas posteriores.

See https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf for more information on the SHA512 standard.

## Operación

```text
define ROR64(qword, n):

    count := n % 64
    dest := (qword >> count) | (qword << (64-count))
    return dest

define SHR64(qword, n):
    return qword >> n

define cap_sigma0(qword):
    return ROR64(qword,28) ^ ROR64(qword, 34) ^ ROR64(qword, 39)

define cap_sigma1(qword):
    return ROR64(qword,14) ^ ROR64(qword, 18) ^ ROR64(qword, 41)

define MAJ(a,b,c):
    return (a & b) ^ (a & c) ^ (b & c)

define CH(e,f,g):
    return (e & f) ^ (g & ~e)


VSHA512RNDS2 SRCDEST, SRC1, SRC2
A[0] := SRC1.qword[3]
B[0] := SRC1.qword[2]
C[0] := SRCDEST.qword[3]
D[0] := SRCDEST.qword[2]
E[0] := SRC1.qword[1]
F[0] := SRC1.qword[0]
G[0] := SRCDEST.qword[1]
H[0] := SRCDEST.qword[0]
WK[0]:= SRC2.qword[0]
WK[1]:= SRC2.qword[1]

FOR i in 0..1:
    A[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] +
          MAJ(A[i], B[i], C[i]) +
          cap_sigma0(A[i])
    B[i+1] := A[i]
    C[i+1] := B[i]
    D[i+1] := C[i]
    E[i+1] := CH(E[i], F[i], G[i]) +
          cap_sigma1(E[i]) + WK[i] + H[i] + D[i]
    F[i+1] := E[i]
    G[i+1] := F[i]
    H[i+1] := G[i]

SRCDEST.qword[3] = A[2]
SRCDEST.qword[2] = B[2]
SRCDEST.qword[1] = E[2]
SRCDEST.qword[0] = F[2]
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VSHA512RNDS2 __m256i _mm256_sha512rnds2_epi64 (__m256i __A, __m256i __B, __m128i __C);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-23, "Tipo 6 Condiciones de Excepción de Clase".

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Valores empaquetados en 128-Bit Granularity

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En bit Mode Soporte Bandera Soporte Soporte

EVEX.256.66.0F3A.W0 23 /r ib A V/V (AVX512VL AND Shuffle 128-bit paquete de una sola precisión flotante-

VSHUFF32X4 ymm1{k1}{z}, ymm2, AVX512F) O valores de puntos seleccionados por imm8 de ymm2

```text
                                              AVX10.1        ymm3/m256/m32bcst and place results in ymm1
```

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W023 /r ib A V/VAVX512FShuffle flotante de 128 bits de una sola precisiónAVX10.1VSHUFF32x4zmm1{k1}{z}, zmm2, valores de puntos seleccionadosimm8desdezmm2yzmm3/m512/m32bcst y resultados de lugar enzmm1 zmm3/m512/m32bcst,imm8sujeto amáscara de escritura k1.

EVEX.256.66.0F3A.W1 23 /r ib A V/V (AVX512VL AND Shuffle 128-bit empaquetado doble precisión flotante-

VSHUFF64X2 ymm1{k1}{z}, ymm2, AVX512F) O valores de puntos seleccionados por imm8 de ymm2

```text
                                              AVX10.1        ymm3/m256/m64bcst and place results in ymm1
```

ymm3/m256/m64bcst, imm8 subject to writemask k1.

EVEX.512.66.0F3A.W1 23 /r ib A V/V AVX512F Shuffle 128-bit de doble precisión flotante-

```text
                                              OR AVX10.1     point values selected by imm8 from zmm2 and
```

VSHUFF64x2 zmm1{k1}{z}, zmm2, zmm3/m512/m64bcst and place results in zmm1

zmm3/m512/m64bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W0 43 /r ib A V/V (AVX512VL AND Shuffle 128 bits de valores de doble palabra empaquetados

```text
                                              AVX512F) OR    selected by imm8 from ymm2 and
```

VSHUFI32X4 ymm1{k1}{z}, ymm2, AVX10.1 ymm3/m256/m32bcst and place results in ymm1

ymm3/m256/m32bcst, imm8                                      subject to writemask k1.

EVEX.512.66.0F3A.W0 43 /r ib A V/V AVX512F Shuffle Valores de doble palabra de 128 bits

```text
                                              OR AVX10.1     selected by imm8 from zmm2 and
```

VSHUFI32x4 zmm1{k1}{z}, zmm2, zmm3/m512/m32bcst and place results in zmm1

zmm3/m512/m32bcst, imm8                                      subject to writemask k1.

EVEX.256.66.0F3A.W1 43 /r ib A V/V (AVX512VL AND Shuffle Valores de 128 bits de cuádruples seleccionados

```text
                                              AVX512F) OR    by imm8 from ymm2 and ymm3/m256/m64bcst
```

VSHUFI64X2 ymm1{k1}{z}, ymm2, AVX10.1 y los resultados del lugar en ymm1 sujeto a máscara de escritura k1.

ymm3/m256/m64bcst, imm8

EVEX.512.66.0F3A.W143 /r ib A V/VAVX512FValores de cuádruple de 128 bits seleccionados ORAVX10.1VSHUFI64x2zmm1{k1}{z}, zmm2, porimm8desdezmm2yzmm3/m512/m64bcst y resultados de lugar enzmm1sujeto amáscara de escritura k1. zmm3/m512/m64bcst,imm8

## Descripción

Versión 256-bit: Se mueve uno de los dos valores en coma flotante de precisión simple empaquetados de 128 bits del primer operando de origen (segundo operando) en el bajo 128-bit del operando de destino (primer operando); mueve uno de los dos valores en coma flotante empaquetados del segundo operando de origen (tercer operando) en el alto 128-bit del operando de destino. El selector operando (tercer operando) determina qué valores se mueven al operando de destino.

Versión 512-bit: Mueva dos de los cuatro valores de 128 bits de una sola precisión flotante de la primera fuente operand (segundo operado) en el bajo 256 bits de cada doble qword del destino operand (primer operand); mueve dos de los cuatro valores de 128 bits flotantes de la segunda fuente operand (tercera fuente) en el alto 256 bit del destino operand. El selector operando (tercer operando) determina qué valores se mueven al operando de destino.

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Valores empaquetados en 128-Bit Granularity

El primer operando de origen es un registro de vectores. El segundo operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32/64 bits. El operando de destino es un registro de vectores.

La máscara de escritura actualiza el operando de destino con la granularidad de elementos de datos de 32/64 bits.

## Operación

```text
Select2(SRC, control) {
CASE (control[0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
ESAC;
RETURN TMP
}

Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[127:0];
    1: TMP := SRC[255:128];
    2: TMP := SRC[383:256];
    3: TMP := SRC[511:384];
ESAC;
RETURN TMP
}

VSHUFF32x4 (EVEX versions)

(KL, VL) = (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE *zeroing-masking*    ; zeroing-masking

                       THEN DEST[i+31:i] := 0

                  FI;

     FI;

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

ENDFOR
DEST[MAXVL-1:VL] := 0

VSHUFF64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI32x4 (EVEX 512-bit version)
(KL, VL) = (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]
          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]
    FI;
ENDFOR;
IF VL = 256
    TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);
    TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);
FI;
IF VL = 512
    TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);
    TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);
    TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);
    TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFI64x2 (EVEX 512-bit version)

(KL, VL) = (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+63:i] := SRC2[63:0]

          ELSE TMP_SRC2[i+63:i] := SRC2[i+63:i]

     FI;

ENDFOR;

IF VL = 256

     TMP_DEST[127:0] := Select2(SRC1[255:0], imm8[0]);

     TMP_DEST[255:128] := Select2(SRC2[255:0], imm8[1]);

FI;

IF VL = 512

     TMP_DEST[127:0] := Select4(SRC1[511:0], imm8[1:0]);

     TMP_DEST[255:128] := Select4(SRC1[511:0], imm8[3:2]);

     TMP_DEST[383:256] := Select4(TMP_SRC2[511:0], imm8[5:4]);

     TMP_DEST[511:384] := Select4(TMP_SRC2[511:0], imm8[7:6]);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := TMP_DEST[i+63:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      THEN DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Packed Values at 128-Bit Granularity
```

## Intel C/C++ compilador intrínseco

```c
VSHUFI32x4 __m512i _mm512_shuffle_i32x4(__m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_mask_shuffle_i32x4(__m512i s, __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m512i _mm512_maskz_shuffle_i32x4( __mmask16 k, __m512i a, __m512i b, int imm);
VSHUFI32x4 __m256i _mm256_shuffle_i32x4(__m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_mask_shuffle_i32x4(__m256i s, __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFI32x4 __m256i _mm256_maskz_shuffle_i32x4( __mmask8 k, __m256i a, __m256i b, int imm);
VSHUFF32x4 __m512 _mm512_shuffle_f32x4(__m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_mask_shuffle_f32x4(__m512 s, __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFF32x4 __m512 _mm512_maskz_shuffle_f32x4( __mmask16 k, __m512 a, __m512 b, int imm);
VSHUFI64x2 __m512i _mm512_shuffle_i64x2(__m512i a, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_mask_shuffle_i64x2(__m512i s, __mmask8 k, __m512i b, __m512i b, int imm);
VSHUFI64x2 __m512i _mm512_maskz_shuffle_i64x2( __mmask8 k, __m512i a, __m512i b, int imm);
VSHUFF64x2 __m512d _mm512_shuffle_f64x2(__m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_mask_shuffle_f64x2(__m512d s, __mmask8 k, __m512d a, __m512d b, int imm);
VSHUFF64x2 __m512d _mm512_maskz_shuffle_f64x2( __mmask8 k, __m512d a, __m512d b, int imm);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.L'L = 0 for VSHUFF32x4/VSHUFF64x2.
```

VSHUFF32x4/VSHUFF64x2/VSHUFI32x4/VSHUFI64x2--Shuffle Valores empaquetados en 128-Bit Granularity
