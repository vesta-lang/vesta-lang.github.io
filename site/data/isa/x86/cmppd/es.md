---
summary: Compare valores en coma flotante de precisión doble empaquetados
---

## Descripción

Realiza una comparación SIMD de los valores en coma flotante de precisión doble empaquetados en el segundo operando de origen y el primer operando de origen y devuelve el resultado de la comparación al operando de destino. La comparación predicate operando (inmediate byte) especifica el tipo de comparación realizada en cada par de valores empaquetados en los dos operandos de origen.

EVEX versiones codificadas: El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino (primer operando) es un registro de opmasco. Los resultados de comparación se escriben al operando de destino bajo la máscara de escritura k2. Cada resultado de comparación es una sola máscara bit de 1 (comparison true) o 0 (comparison false).

VEX.256 versión codificada: El primer operando de origen (segundo operando) es un registro YMM. El segundo operando de origen (tercer operando) puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino (primer operando) es un registro YMM. Se realizan cuatro comparaciones con los resultados escritos al operando de destino. El resultado de cada comparación es una máscara de quadword de todos los 1s (comparison true) o todos los 0s (comparison false).

128-bit Legacy SSE versión: La primera fuente y operando de destino (primer operando) es un registro XMM. El segundo operando de origen (segundo operando) puede ser un registro XMM o 128 bits ubicación de memoria. Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican. Se realizan dos comparaciones con resultados

escrito a bits 127:0 del operando de destino. El resultado de cada comparación es una máscara de quadword de todos los 1s (comparison true) o todos los 0s (comparison false).

VEX.128 versión codificada: El primer operando de origen (segundo operando) es un registro XMM. El segundo operando de origen (tercer operando) puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino ZMM registro se ponen a cero. Dos comparaciones se realizan con resultados escritos a bits 127:0 del operando de destino.

El predicate de comparación operando es un 8-bit inmediato:

* Para instrucciones codificadas con el prefijo VEX o EVEX, bits 4:0 definen el tipo de comparación a realizar

(véase el cuadro 3-8). Se reservan bits 5 a 7 de los inmediatos.

* Para codificación de instrucciones que no utilizan el prefijo VEX, bits 2:0 definen el tipo de comparación a hacer (ver

las primeras 8 filas de la tabla 3-8). Los bits 3 a 7 de los inmediatos están reservados.

**Predicado de comparación para las instrucciones CMPPD y CMPPS**

| EQ_OQ (EQ) | 0H | Igualdad (ordenada, no firma) | Falso | Falso | Cierto. | Falso | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | Menos que (ordenada, señalización) | Falso | Cierto. | Falso | Falso | Sí. |
| LE_OS (LE) | 2H | Menos que igual (ordenada, señalización) | Falso | Cierto. | Cierto. | Falso | Sí. |
| UNORD_Q (UNORD) | 3H | Desordenados (no firmantes) | Falso | Falso | Falso | Cierto. | No |
| NEQ_UQ (NEQ) | 4H | No igual (no ordenado, no firmado) | Cierto. | Cierto. | Falso | Cierto. | No |
| NLT_US (NLT) | 5H | No menos que (sin orden, señalización) | Cierto. | Falso | Cierto. | Cierto. | Sí. |
| NLE_US (NLE) | 6H | No menos que igual (sin orden, señalización) | Cierto. | Falso | Falso | Cierto. | Sí. |
| ORD_Q (ORD) | 7H | Ordenados (no firmantes) | Cierto. | Cierto. | Cierto. | Falso | No |
| EQ_UQ | 8H | Igualdad (no autorizada, no firma) | Falso | Falso | Cierto. | Cierto. | No |
| NGE_US (NGE) | 9H | No-más-que-o-igual (sin orden, señalización) | Falso | Cierto. | Falso | Cierto. | Sí. |
| NGT_US (NGT) | AH | No-más-que (sin orden, señalización) | Falso | Cierto. | Cierto. | Cierto. | Sí. |
| FALSE_OQ(FALSE) | BH | Falso (ordenado, no firmante) | Falso | Falso | Falso | Falso | No |
| NEQ_OQ | CH | No igual (ordenada, no firma) | Cierto. | Cierto. | Falso | Falso | No |
| GE_OS (GE) | DH | Más grande que igual (ordenada, señalización) | Cierto. | Falso | Cierto. | Falso | Sí. |
| GT_OS (GT) | EH | Más grande que (ordenada, señalización) | Cierto. | Falso | Falso | Falso | Sí. |
| TRUE_UQ(TRUE) | FH | Verdadero (no ordenado, no firmado) | Cierto. | Cierto. | Cierto. | Cierto. | No |
| EQ_OS | 10H | Igualdad (ordenada, señalización) | Falso | Falso | Cierto. | Falso | Sí. |
| LT_OQ | 11H | Menos que (ordenada, no firmante) | Falso | Cierto. | Falso | Falso | No |
| LE_OQ | 12H | Menos que igual (ordenada, no firmante) | Falso | Cierto. | Cierto. | Falso | No |
| UNORD_S | 13H | Sin orden (signaling) | Falso | Falso | Falso | Cierto. | Sí. |
| NEQ_US | 14H | No igual (sin orden, señalización) | Cierto. | Cierto. | Falso | Cierto. | Sí. |
| NLT_UQ | 15H | No menos que (no ordenado, no firmado) | Cierto. | Falso | Cierto. | Cierto. | No |
| NLE_UQ | 16H | No-a-que-o-igual (no-ordenada, no-sig- naling) | Cierto. | Falso | Falso | Cierto. | No |
| ORD_S | 17H | Ordenado (signaling) | Cierto. | Cierto. | Cierto. | Falso | Sí. |
| EQ_US | 18H | Igualdad (no ordenada, señalización) | Falso | Falso | Cierto. | Cierto. | Sí. |

**Predicado de comparación para CMPPD y CMPPS Instrucciones (Contd.)**

| EQ_OQ (EQ) | 0H | Igualdad (ordenada, no firma) | Falso | Falso | Cierto. | Falso | No |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LT_OS (LT) | 1H | Menos que (ordenada, señalización) | Falso | Cierto. | Falso | Falso | Sí. |
| LE_OS (LE) | 2H | Menos que igual (ordenada, señalización) | Falso | Cierto. | Cierto. | Falso | Sí. |
| UNORD_Q (UNORD) | 3H | Desordenados (no firmantes) | Falso | Falso | Falso | Cierto. | No |
| NEQ_UQ (NEQ) | 4H | No igual (no ordenado, no firmado) | Cierto. | Cierto. | Falso | Cierto. | No |
| NLT_US (NLT) | 5H | No menos que (sin orden, señalización) | Cierto. | Falso | Cierto. | Cierto. | Sí. |
| NLE_US (NLE) | 6H | No menos que igual (sin orden, señalización) | Cierto. | Falso | Falso | Cierto. | Sí. |
| ORD_Q (ORD) | 7H | Ordenados (no firmantes) | Cierto. | Cierto. | Cierto. | Falso | No |
| EQ_UQ | 8H | Igualdad (no autorizada, no firma) | Falso | Falso | Cierto. | Cierto. | No |
| NGE_US (NGE) | 9H | No-más-que-o-igual (sin orden, señalización) | Falso | Cierto. | Falso | Cierto. | Sí. |
| NGT_US (NGT) | AH | No-más-que (sin orden, señalización) | Falso | Cierto. | Cierto. | Cierto. | Sí. |
| FALSE_OQ(FALSE) | BH | Falso (ordenado, no firmante) | Falso | Falso | Falso | Falso | No |
| NEQ_OQ | CH | No igual (ordenada, no firma) | Cierto. | Cierto. | Falso | Falso | No |
| GE_OS (GE) | DH | Más grande que igual (ordenada, señalización) | Cierto. | Falso | Cierto. | Falso | Sí. |
| GT_OS (GT) | EH | Más grande que (ordenada, señalización) | Cierto. | Falso | Falso | Falso | Sí. |
| TRUE_UQ(TRUE) | FH | Verdadero (no ordenado, no firmado) | Cierto. | Cierto. | Cierto. | Cierto. | No |
| EQ_OS | 10H | Igualdad (ordenada, señalización) | Falso | Falso | Cierto. | Falso | Sí. |
| LT_OQ | 11H | Menos que (ordenada, no firmante) | Falso | Cierto. | Falso | Falso | No |
| LE_OQ | 12H | Menos que igual (ordenada, no firmante) | Falso | Cierto. | Cierto. | Falso | No |
| UNORD_S | 13H | Sin orden (signaling) | Falso | Falso | Falso | Cierto. | Sí. |
| NEQ_US | 14H | No igual (sin orden, señalización) | Cierto. | Cierto. | Falso | Cierto. | Sí. |
| NLT_UQ | 15H | No menos que (no ordenado, no firmado) | Cierto. | Falso | Cierto. | Cierto. | No |
| NLE_UQ | 16H | No-a-que-o-igual (no-ordenada, no-sig- naling) | Cierto. | Falso | Falso | Cierto. | No |
| ORD_S | 17H | Ordenado (signaling) | Cierto. | Cierto. | Cierto. | Falso | Sí. |
| EQ_US | 18H | Igualdad (no ordenada, señalización) | Falso | Falso | Cierto. | Cierto. | Sí. |

## Operación

```text
CASE (COMPARISON PREDICATE) OF
0: OP3 := EQ_OQ; OP5 := EQ_OQ;

    1: OP3 := LT_OS; OP5 := LT_OS;
    2: OP3 := LE_OS; OP5 := LE_OS;
    3: OP3 := UNORD_Q; OP5 := UNORD_Q;
    4: OP3 := NEQ_UQ; OP5 := NEQ_UQ;
    5: OP3 := NLT_US; OP5 := NLT_US;
    6: OP3 := NLE_US; OP5 := NLE_US;
    7: OP3 := ORD_Q; OP5 := ORD_Q;
    8: OP5 := EQ_UQ;
    9: OP5 := NGE_US;
    10: OP5 := NGT_US;
    11: OP5 := FALSE_OQ;
    12: OP5 := NEQ_OQ;
    13: OP5 := GE_OS;
    14: OP5 := GT_OS;
    15: OP5 := TRUE_UQ;
    16: OP5 := EQ_OS;
    17: OP5 := LT_OQ;
    18: OP5 := LE_OQ;
    19: OP5 := UNORD_S;
    20: OP5 := NEQ_US;
    21: OP5 := NLT_UQ;
    22: OP5 := NLE_UQ;
    23: OP5 := ORD_S;
    24: OP5 := EQ_US;
    25: OP5 := NGE_UQ;
    26: OP5 := NGT_UQ;
    27: OP5 := FALSE_OS;
    28: OP5 := NEQ_OS;
    29: OP5 := GE_OQ;
    30: OP5 := GT_OQ;
    31: OP5 := TRUE_US;
    DEFAULT: Reserved;
ESAC;

VCMPPD (EVEX Encoded Versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    CMP := SRC1[i+63:i] OP5 SRC2[63:0]

                  ELSE

                    CMP := SRC1[i+63:i] OP5 SRC2[i+63:i]

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking only

FI;


ENDFOR
DEST[MAX_KL-1:KL] := 0

VCMPPD (VEX.256 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
CMP2 := SRC1[191:128] OP5 SRC2[191:128];
CMP3 := SRC1[255:192] OP5 SRC2[255:192];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[191:128] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[191:128] := 0000000000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[255:192] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[255:192] := 0000000000000000H; FI;
DEST[MAXVL-1:256] := 0

VCMPPD (VEX.128 Encoded Version)
CMP0 := SRC1[63:0] OP5 SRC2[63:0];
CMP1 := SRC1[127:64] OP5 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] := 0

CMPPD (128-bit Legacy SSE Version)
CMP0 := SRC1[63:0] OP3 SRC2[63:0];
CMP1 := SRC1[127:64] OP3 SRC2[127:64];
IF CMP0 = TRUE

    THEN DEST[63:0] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[63:0] := 0000000000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[127:64] := FFFFFFFFFFFFFFFFH;
    ELSE DEST[127:64] := 0000000000000000H; FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCMPPD __mmask8 _mm512_cmp_pd_mask( __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_cmp_round_pd_mask( __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm512_mask_cmp_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm);
VCMPPD __mmask8 _mm512_mask_cmp_round_pd_mask( __mmask8 k1, __m512d a, __m512d b, int imm, int sae);
VCMPPD __mmask8 _mm256_cmp_pd_mask( __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm256_mask_cmp_pd_mask( __mmask8 k1, __m256d a, __m256d b, int imm);
VCMPPD __mmask8 _mm_cmp_pd_mask( __m128d a, __m128d b, int imm);
VCMPPD __mmask8 _mm_mask_cmp_pd_mask( __mmask8 k1, __m128d a, __m128d b, int imm);
VCMPPD __m256 _mm256_cmp_pd(__m256d a, __m256d b, int imm) (V)CMPPD __m128 _mm_cmp_pd(__m128d a, __m128d b, int imm);
```

## SIMD coma flotante Excepciones

Inválido si SNaN operando e inválido si QNaN y predicar como aparece en la tabla 3-8, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción". Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
