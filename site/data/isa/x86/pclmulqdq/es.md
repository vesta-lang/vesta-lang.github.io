---
summary: Carry-Less Multiplication Quadword
---

## Descripción

Realiza una multiplicación sin carga de pares de cuadriláteros. Las versiones XMM realizan una sola multiplicación de un par de

quadwords. Las versiones de YMM realizan dos multiplicaciones empaquetadas de pares de quadwords. Las versiones de ZMM realizan cuatro multiplicaciones de pares de cuádpagos. Los bits 4 y 0 se utilizan para seleccionar qué 64 bits de cada operando para utilizar de acuerdo a la Tabla 4-14, se ignoran otros bits del byte inmediato.

La forma codificada EVEX de esta instrucción no soporta la supresión de falla de memoria.

**PCLMULQDQ Quadword Selección de Byte Inmediato**

| Imm[4] | Imm[0] | Operación PCLMULQDQ |
| --- | --- | --- |
| 0 | CL_MUL( SRC21[ | 63:0], SRC1[63:0] ) |

**Pseudo-Op and PCLMULQDQ Implementation Imm8 Encoding**

| Pseudo-Op | Imm8 Encoding |
| --- | --- |
| PCLMULLQLQDQ xmm1, xmm2 | 0000_0000B |
| PCLMULHQLQDQ xmm1, xmm2 | 0000_0001B |
| PCLMULLQHQDQ xmm1, xmm2 | 0001_0000B |
| PCLMULHQHQDQ xmm1, xmm2 | 0001_0001B |

## Operación

```text
define PCLMUL128(X,Y):             // helper function

   FOR i := 0 to 63:

   TMP [ i ] := X[ 0 ] and Y[ i ]

   FOR j := 1 to i:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   FOR i := 64 to 126:

   TMP [ i ] := 0

   FOR j := i - 63 to 63:

           TMP [ i ] := TMP [ i ] xor (X[ j ] and Y[ i - j ])

   DEST[ i ] := TMP[ i ]

   DEST[127] := 0;

   RETURN DEST                     // 128b vector


PCLMULQDQ (SSE Version)
IF imm8[0] = 0:

    TEMP1 := SRC1.qword[0]
ELSE:

    TEMP1 := SRC1.qword[1]
IF imm8[4] = 0:

    TEMP2 := SRC2.qword[0]
ELSE:

    TEMP2 := SRC2.qword[1]
DEST[127:0] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:128] (Unmodified)

VPCLMULQDQ (128b and 256b VEX Encoded Versions)
(KL,VL) = (1,128), (2,256)
FOR i= 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0

VPCLMULQDQ (EVEX Encoded Version)
(KL,VL) = (1,128), (2,256), (4,512)
FOR i = 0 to KL-1:

    IF imm8[0] = 0:
          TEMP1 := SRC1.xmm[i].qword[0]

    ELSE:
          TEMP1 := SRC1.xmm[i].qword[1]

    IF imm8[4] = 0:
          TEMP2 := SRC2.xmm[i].qword[0]

    ELSE:
          TEMP2 := SRC2.xmm[i].qword[1]

    DEST.xmm[i] := PCLMUL128(TEMP1, TEMP2)
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
(V)PCLMULQDQ __m128i _mm_clmulepi64_si128 (__m128i, __m128i, const int) VPCLMULQDQ __m256i _mm256_clmulepi64_epi128(__m256i, __m256i, const int);
VPCLMULQDQ __m512i _mm512_clmulepi64_epi128(__m512i, __m512i, const int);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.L = 1.
```

EVEX-encoded: Ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción".
