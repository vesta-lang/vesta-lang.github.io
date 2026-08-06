---
summary: Compare valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza una comparación SIMD de los valores en coma flotante de precisión simple empaquetados en el segundo operando de origen y el primer operando de origen y devuelve el resultado de la comparación al operando de destino. La comparación predicate operando (inmediate byte) especifica el tipo de comparación realizada en cada uno de los pares de valores empaquetados.

EVEX versiones codificadas: El primer operando de origen (segundo operando) es un registro ZMM/YMM/XMM. El segundo operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino (primer operando) es un registro de opmasco. Los resultados de comparación se escriben al operando de destino bajo la máscara de escritura k2. Cada resultado de comparación es una sola máscara bit de 1 (comparison true) o 0 (comparison false).

VEX.256 versión codificada: El primer operando de origen (segundo operando) es un registro YMM. El segundo operando de origen (tercer operando) puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino (primer operando) es un registro YMM. Se realizan ocho comparaciones con los resultados escritos al operando de destino. El resultado de cada comparación es una máscara de doble palabra de todos los 1s (comparison true) o todos los 0s (comparison false).

128-bit Legacy SSE versión: La primera fuente y operando de destino (primer operando) es un registro XMM. El segundo operando de origen (segundo operando) puede ser un registro XMM o 128 bits ubicación de memoria. Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican. Cuatro comparaciones se realizan con resultados escritos a bits 127:0 del operando de destino. El resultado de cada comparación es una máscara de doble palabra de todos los 1s (comparison true) o todos los 0s (comparison false).

VEX.128 versión codificada: El primer operando de origen (segundo operando) es un registro XMM. El segundo operando de origen (tercer operando) puede ser un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino ZMM registro se ponen a cero. Cuatro comparaciones se realizan con resultados escritos a bits 127:0 del operando de destino.

El predicate de comparación operando es un 8-bit inmediato:

* Para instrucciones codificadas con el prefijo VEX y el prefijo EVEX, bits 4:0 definen el tipo de comparación a ser

(véase el cuadro 3-8). Se reservan bits 5 a 7 de los inmediatos.

* Para codificación de instrucciones que no utilizan el prefijo VEX, bits 2:0 definen el tipo de comparación a hacer (ver

las primeras 8 filas de la tabla 3-8). Los bits 3 a 7 de los inmediatos están reservados.

La relación no ordenada es verdadera cuando al menos uno de los dos operandos de origen siendo comparado es un NaN; la relación ordenada es verdadera cuando ni operando de origen es un NaN.

Una instrucción computacional posterior que utiliza el resultado de máscara en el operando de destino como entrada operando no generará una excepción, porque una máscara de los 0s corresponde a un valor en coma flotante de +0.0 y una máscara de los 1s corresponde a un QNaN.

Tenga en cuenta que los procesadores con "CPUID.01H:ECX.AVX[28] = 0" no implementan los predicados de relaciones "greater-than", "greater-than-orequal", "not-greater-than-or-equal". Estas comparaciones se pueden hacer ya sea usando la relación inversa (es decir, utilizar el "no-menos-que-o-igual" para hacer una comparación "más grande que") o mediante la emulación de software. Al utilizar la emulación de software, el programa debe cambiar los operandos (copiar registros cuando sea necesario para proteger los datos que ahora estarán en el destino), y luego realizar la comparación utilizando un predicado diferente.

Los compositores y ensambladores pueden implementar los siguientes pseudo-ops de dos-operando además de la instrucción de tres-operando CMPPS, para procesadores con "CPUID.01H:ECX.AVX[28] = 0". Véase el cuadro 3-11. El compilador debe tratar los valores reservados de imm8 como sintaxis ilegal.

:                         Cuadro 3 a 11. Pseudo-Op y CMPPS Implementation

Pseudo-Op CMPPS Implementation

CMPEQPS xmm1, xmm2 CMPPS xmm1, xmm2, 0

CMPLTPS xmm1, xmm2 CMPPS xmm1, xmm2, 1

CMPLEPS xmm1, xmm2 CMPPS xmm1, xmm2, 2

CMPUNORDPS xmm1, xmm2 CMPPS xmm1, xmm2, 3

CMPNEQPS xmm1, xmm2 CMPPS xmm1, xmm2, 4

CMPNLTPS xmm1, xmm2 CMPPS xmm1, xmm2, 5

CMPNLEPS xmm1, xmm2 CMPPS xmm1, xmm2, 6

CMPORDPS xmm1, xmm2 CMPPS xmm1, xmm2, 7

Las relaciones más amplias que el procesador no implementa requieren más de una instrucción para emular en software y por lo tanto no deben ser implementadas como pseudo-ops. (Para ello, el programador debe invertir los operandos de las correspondientes menos que las relaciones y utilizar las instrucciones de movimiento para asegurar que la máscara se mueve al registro de destino correcto y que el operando de origen se deja intacto.)

Los procesadores con "CPUID.01H:ECX.AVX[28] = 1" implementan el complemento completo de 32 predicados mostrados en la Tabla 3-12, la emulación de software ya no es necesaria. Los compositores y ensambladores pueden implementar los siguientes tres pseudo-ops operativos además de la instrucción de cuatro-operando VCMPPS. Véase el cuadro 3-12, donde la notación de reg1 y reg2 representan los registros XMM o los registros YMM. El compilador debe tratar los valores reservados de imm8 como sintaxis ilegal. Alternately, intrinsics puede mapear los pseudo-ops a constantes predefinidas para soportar una interfaz intrínseca más simple. Los compositores y ensambladores pueden implementar tres-operando pseudo-ops para EVEX codificado instrucciones VCMPPS de una manera similar al extender la sintaxis lista en la tabla 3-12.

:

**Pseudo-Op y VCMPPS Implementation**

| Pseudo-Op | CMPPS Implementation |
| --- | --- |
| VCMPEQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0 |
| VCMPLTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1 |
| VCMPLEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 2 |
| VCMPUNORDPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 3 |
| VCMPNEQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 4 |
| VCMPNLTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 5 |
| VCMPNLEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 6 |
| VCMPORDPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 7 |
| VCMPEQ_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 8 |
| VCMPNGEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 9 |
| VCMPNGTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0AH |
| VCMPFALSEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0BH |
| VCMPNEQ_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0CH |
| VCMPGEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0DH |
| VCMPGTPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0EH |
| VCMPTRUEPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 0FH |
| VCMPEQ_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 10H |
| VCMPLT_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 11H |
| VCMPLE_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 12H |
| VCMPUNORD_SPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 13H |
| VCMPNEQ_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 14H |
| VCMPNLT_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 15H |
| VCMPNLE_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 16H |
| VCMPORD_SPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 17H |
| VCMPEQ_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 18H |
| VCMPNGE_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 19H |
| VCMPNGT_UQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1AH |
| VCMPFALSE_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1BH |
| VCMPNEQ_OSPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1CH |
| VCMPGE_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1DH |
| VCMPGT_OQPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1EH |
| VCMPTRUE_USPS reg1, reg2, reg3 | VCMPPS reg1, reg2, reg3, 1FH |
| CMPPS--Compare valores en coma flotante de precisión simple empaquetados |  |

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
    DEFAULT: Reserved

ESAC;

VCMPPS (EVEX Encoded Versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k2[j] OR *no writemask*

     THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN

                    CMP := SRC1[i+31:i] OP5 SRC2[31:0]

                  ELSE

                    CMP := SRC1[i+31:i] OP5 SRC2[i+31:i]

             FI;

             IF CMP = TRUE

                  THEN DEST[j] := 1;

                  ELSE DEST[j] := 0; FI;

     ELSE DEST[j] := 0                    ; zeroing-masking onlyFI;

FI;


ENDFOR
DEST[MAX_KL-1:KL] := 0

VCMPPS (VEX.256 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
CMP1 := SRC1[63:32] OP5 SRC2[63:32];
CMP2 := SRC1[95:64] OP5 SRC2[95:64];
CMP3 := SRC1[127:96] OP5 SRC2[127:96];
CMP4 := SRC1[159:128] OP5 SRC2[159:128];
CMP5 := SRC1[191:160] OP5 SRC2[191:160];
CMP6 := SRC1[223:192] OP5 SRC2[223:192];
CMP7 := SRC1[255:224] OP5 SRC2[255:224];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] :=000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] := 000000000H; FI;
IF CMP4 = TRUE
    THEN DEST[159:128] := FFFFFFFFH;
    ELSE DEST[159:128] := 000000000H; FI;
IF CMP5 = TRUE
    THEN DEST[191:160] := FFFFFFFFH;
    ELSE DEST[191:160] := 000000000H; FI;
IF CMP6 = TRUE
    THEN DEST[223:192] := FFFFFFFFH;
    ELSE DEST[223:192] :=000000000H; FI;
IF CMP7 = TRUE
    THEN DEST[255:224] := FFFFFFFFH;
    ELSE DEST[255:224] := 000000000H; FI;
DEST[MAXVL-1:256] := 0

VCMPPS (VEX.128 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
CMP1 := SRC1[63:32] OP5 SRC2[63:32];
CMP2 := SRC1[95:64] OP5 SRC2[95:64];
CMP3 := SRC1[127:96] OP5 SRC2[127:96];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] := 000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;


    ELSE DEST[127:96] :=000000000H; FI;
DEST[MAXVL-1:128] := 0

CMPPS (128-bit Legacy SSE Version)
CMP0 := SRC1[31:0] OP3 SRC2[31:0];
CMP1 := SRC1[63:32] OP3 SRC2[63:32];
CMP2 := SRC1[95:64] OP3 SRC2[95:64];
CMP3 := SRC1[127:96] OP3 SRC2[127:96];
IF CMP0 = TRUE

    THEN DEST[31:0] :=FFFFFFFFH;
    ELSE DEST[31:0] := 000000000H; FI;
IF CMP1 = TRUE
    THEN DEST[63:32] := FFFFFFFFH;
    ELSE DEST[63:32] := 000000000H; FI;
IF CMP2 = TRUE
    THEN DEST[95:64] := FFFFFFFFH;
    ELSE DEST[95:64] := 000000000H; FI;
IF CMP3 = TRUE
    THEN DEST[127:96] := FFFFFFFFH;
    ELSE DEST[127:96] :=000000000H; FI;
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VCMPPS __mmask16 _mm512_cmp_ps_mask( __m512 a, __m512 b, int imm);
VCMPPS __mmask16 _mm512_cmp_round_ps_mask( __m512 a, __m512 b, int imm, int sae);
VCMPPS __mmask16 _mm512_mask_cmp_ps_mask( __mmask16 k1, __m512 a, __m512 b, int imm);
VCMPPS __mmask16 _mm512_mask_cmp_round_ps_mask( __mmask16 k1, __m512 a, __m512 b, int imm, int sae);
VCMPPS __mmask8 _mm256_cmp_ps_mask( __m256 a, __m256 b, int imm);
VCMPPS __mmask8 _mm256_mask_cmp_ps_mask( __mmask8 k1, __m256 a, __m256 b, int imm);
VCMPPS __mmask8 _mm_cmp_ps_mask( __m128 a, __m128 b, int imm);
VCMPPS __mmask8 _mm_mask_cmp_ps_mask( __mmask8 k1, __m128 a, __m128 b, int imm);
VCMPPS __m256 _mm256_cmp_ps(__m256 a, __m256 b, int imm) CMPPS __m128 _mm_cmp_ps(__m128 a, __m128 b, int imm);
```

## SIMD coma flotante Excepciones

Inválido si SNaN operando e inválido si QNaN y predicar como aparece en la tabla 3-8, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
