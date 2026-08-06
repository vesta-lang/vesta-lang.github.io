---
summary: Compare valores en coma flotante de precisión simple escalares
---

## Descripción

Compara el bajo valores en coma flotante de precisión simple en el segundo operando de origen y el primer operando de origen y devuelve el resultado de la comparación al operando de destino. El predicate de comparación operando (operando inmediato) especifica el tipo de comparación realizada.

128-bit Legacy SSE versión: La primera fuente y operando de destino (primer operando) es un registro XMM. El segundo operando de origen (segundo operando) puede ser un registro XMM o ubicación de memoria de 32 bits. Bits (MAXVL-1:32) del registro de destino YMM correspondiente no se modifican. El resultado de la comparación es una máscara de doble palabra de los 1s (comparison true) o todos los 0s (comparison false).

VEX.128 versión codificada: El primer operando de origen (segundo operando) es un registro XMM. El segundo operando de origen (tercer operando) puede ser un registro XMM o una ubicación de memoria de 32 bits. El resultado se almacena en los 32 bits bajos del operando de destino; los bits 127:32 del operando de destino son copiados del primer operando de origen. Bits (MAXVL-1:128) del destino ZMM registro se ponen a cero. El resultado de la comparación es una máscara de doble palabra de los 1s (comparison true) o todos los 0s (comparison false).

EVEX versión codificada: El primer operando de origen (segundo operando) es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino (primer operando) es un registro de opmasco. El resultado de la comparación es una sola máscara bit de 1 (comparison true) o 0 (comparison false), escrito al destino desde el LSB según la máscara de escritura k2. Se eliminan bits (MAX KL-1:128) del registro de destino.

El predicate de comparación operando es un 8-bit inmediato:

* Para instrucciones codificadas con el prefijo VEX, los bits 4:0 definen el tipo de comparación a realizar (ver

Cuadro 3 a 8 Se reservan bits 5 a 7 de los inmediatos.

* Para codificación de instrucciones que no utilizan el prefijo VEX, bits 2:0 definen el tipo de comparación a hacer (ver

las primeras 8 filas de la tabla 3-8). Los bits 3 a 7 de los inmediatos están reservados.

La relación no ordenada es verdadera cuando al menos uno de los dos operandos de origen siendo comparado es un NaN; la relación ordenada es verdadera cuando ni operando de origen es un NaN.

Una instrucción computacional posterior que utiliza el resultado de máscara en el operando de destino como entrada operando no generará una excepción, porque una máscara de los 0s corresponde a un valor en coma flotante de +0.0 y una máscara de los 1s corresponde a un QNaN.

Tenga en cuenta que los procesadores con "CPUID.01H:ECX.AVX[28] = 0" no implementan los predicados "greater-than", "greater-than-orequal", "not-greater-than-or-equal relations". Estas comparaciones se pueden hacer ya sea usando la relación inversa (es decir, utilizar el "no-menos-que-o-igual" para hacer una comparación "más grande que") o mediante la emulación de software. Al utilizar la emulación de software, el programa debe cambiar los operandos (copiar registros cuando sea necesario para proteger los datos que ahora estarán en el destino), y luego realizar la comparación utilizando un predicado diferente.

Los compositores y ensambladores pueden implementar los siguientes pseudo-ops de dos-operando además de la instrucción de tres-operando CMPSS, para procesadores con "CPUID.01H:ECX.AVX[28] = 0". Véase el cuadro 3-15. El compilador debe tratar los valores reservados de imm8 como sintaxis ilegal.

:                                 Cuadro 3 a 15. Pseudo-Op y CMPSS Implementation

Pseudo-Op CMPSS Implementation

CMPEQSS xmm1, xmm2 CMPSS xmm1, xmm2, 0

CMPLTSS xmm1, xmm2 CMPSS xmm1, xmm2, 1

CMPLESS xmm1, xmm2 CMPSS xmm1, xmm2, 2

CMPUNORDSS xmm1, xmm2 CMPSS xmm1, xmm2, 3

CMPNEQSS xmm1, xmm2 CMPSS xmm1, xmm2, 4

CMPNLTSS xmm1, xmm2 CMPSS xmm1, xmm2, 5

CMPNLESS xmm1, xmm2 CMPSS xmm1, xmm2, 6

CMPORDSS xmm1, xmm2 CMPSS xmm1, xmm2, 7

Las relaciones más amplias que el procesador no implementa requieren más de una instrucción para emular en software y por lo tanto no deben ser implementadas como pseudo-ops. (Para ello, el programador debe invertir los operandos de las correspondientes menos que las relaciones y utilizar las instrucciones de movimiento para asegurar que la máscara se mueve al registro de destino correcto y que el operando de origen se deja intacto.)

Los procesadores con "CPUID.01H:ECX.AVX[28] = 1" implementan el complemento completo de 32 predicados mostrado en la Tabla 3-14, la emulación de software ya no es necesaria. Los compositores y ensambladores pueden implementar los siguientes tres pseudo-ops operativos además de la instrucción de cuatro-operando VCMPSS. See Table 3-16, where the notations of reg1 reg2, and reg3 represent either XMM registers or YMM registers. El compilador debe tratar los valores reservados de imm8 como sintaxis ilegal. Alternately, intrinsics puede mapear los pseudo-ops a constantes predefinidas para soportar una interfaz intrínseca más simple. Los compositores y ensambladores pueden implementar tres-operando pseudo-ops para EVEX codificado instrucciones VCMPSS de una manera similar al extender la sintaxis lista en la tabla 3-16.

:                                 Cuadro 3-16. Pseudo-Op y VCMPSS Implementation

Pseudo-Op CMPSS Implementation

VCMPEQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0

VCMPLTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 1

VCMPLESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 2

VCMPUNORDSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 3

VCMPNEQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 4

VCMPNLTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 5

VCMPNLESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 6

VCMPORDSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 7

VCMPEQ UQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 8

VCMPNGESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 9

VCMPNGTSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0AH

VCMPFALSESS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0BH

VCMPNEQ OQSS reg1, reg2, reg3 VCMPSS reg1, reg2, reg3, 0CH

**Pseudo-Op y VCMPSS Implementation (Contd.)**

| Pseudo-Op | CMPSS Implementation |
| --- | --- |
| VCMPGESS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0DH |
| VCMPGTSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0EH |
| VCMPTRUESS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 0FH |
| VCMPEQ_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 10H |
| VCMPLT_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 11H |
| VCMPLE_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 12H |
| VCMPUNORD_SSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 13H |
| VCMPNEQ_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 14H |
| VCMPNLT_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 15H |
| VCMPNLE_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 16H |
| VCMPORD_SSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 17H |
| VCMPEQ_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 18H |
| VCMPNGE_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 19H |
| VCMPNGT_UQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1AH |
| VCMPFALSE_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1BH |
| VCMPNEQ_OSSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1CH |
| VCMPGE_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1DH |
| VCMPGT_OQSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1EH |
| VCMPTRUE_USSS reg1, reg2, reg3 | VCMPSS reg1, reg2, reg3, 1FH |
| El software debe asegurar que VCMPSS esté codificado con VEX.L = 0. Codificación | VCMPSS con VEX.L = 1 puede encontrarse |
| comportamiento impredecible en diferentes generaciones de procesadores. |  |

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

VCMPSS (EVEX Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];

IF k2[0] or *no writemask*                    ; zeroing-masking only
    THEN IF CMP0 = TRUE
                      THEN DEST[0] := 1;
                      ELSE DEST[0] := 0; FI;
    ELSE DEST[0] := 0

FI;
DEST[MAX_KL-1:1] := 0

CMPSS (128-bit Legacy SSE Version)
CMP0 := DEST[31:0] OP3 SRC[31:0];
IF CMP0 = TRUE
THEN DEST[31:0] := FFFFFFFFH;
ELSE DEST[31:0] := 00000000H; FI;
DEST[MAXVL-1:32] (Unmodified)

VCMPSS (VEX.128 Encoded Version)
CMP0 := SRC1[31:0] OP5 SRC2[31:0];
IF CMP0 = TRUE
THEN DEST[31:0] := FFFFFFFFH;
ELSE DEST[31:0] := 00000000H; FI;
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCMPSS __mmask8 _mm_cmp_ss_mask( __m128 a, __m128 b, int imm);
VCMPSS __mmask8 _mm_cmp_round_ss_mask( __m128 a, __m128 b, int imm, int sae);
VCMPSS __mmask8 _mm_mask_cmp_ss_mask( __mmask8 k1, __m128 a, __m128 b, int imm);
VCMPSS __mmask8 _mm_mask_cmp_round_ss_mask( __mmask8 k1, __m128 a, __m128 b, int imm, int sae);
(V)CMPSS __m128 _mm_cmp_ss(__m128 a, __m128 b, const int imm);
```

## SIMD coma flotante Excepciones

Inválido si SNaN operando, inválido si QNaN y predicar como aparece en la tabla 3-8, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción."
