---
summary: Round valores en coma flotante de precisión doble empaquetados
---

## Descripción

Redondear el 2 valores en coma flotante de precisión doble en el operando de origen (segundo operando) utilizando el modo de redondeo especificado en el operando inmediato (tercer operando) y colocar los resultados en el operando de destino (primer operando). El proceso de redondeo ronda cada entrada valor en coma flotante a un valor entero y devuelve el resultado entero como un valor en coma flotante de precisión doble.

El operando inmediato especifica los campos de control para la operación de redondeo, se definen tres bits y se muestran en la Figura 4-24. El bit 3 del comportamiento del procesador de byte inmediato para una excepción de precisión, bit 2 selecciona la fuente del control de modo redondeado. Bits 1:0 especificar un valor de redondeo no pegajoso (tabla 4-21 enumera los valores codificados para el campo de redondeo-modo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el operando de origen segundo operando de origen o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

```text
                     8                                               3210
```

Reserved

P - Máscara de precisión (SPE); 0: normal, 1: inexacto RS - selección de redondeo; 1: MXCSR.RC, 0: Imm8.RC RC - Modo de redondeo

Figura 4-24. Campo de control de bits de Byte inmediato para la instrucción ROUNDxx

** Modos de resonancia y codificación del campo de control de redondeo**

| Ronda | 00B | El resultado redondeado es el más cercano al resultado infinitamente preciso. Si dos valores son iguales, los | resultado | is |
| --- | --- | --- | --- | --- |
| más cercana (incluso) |  | el valor uniforme (es decir, el valor entero con el bit menos significativo de cero). |  |  |
| Regreso | 01B | El resultado redondeado es más cercano pero no mayor que el resultado infinitamente preciso. |  |  |
| (toward -) |  |  |  |  |
| Regreso | 10B | El resultado redondeado es más cercano pero no menos que el resultado infinitamente preciso. |  |  |
| (toward +) |  |  |  |  |
| Vuelta hacia | 11B | El resultado redondeado es más cercano pero no mayor en valor absoluto que el resultado infinitamente preciso. |  |  |
| cero (Truncate) |  |  |  |  |

## Operación

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[63:0] := ConvertDPFPToInteger_M(SRC[63:0]);
          DEST[127:64] := ConvertDPFPToInteger_M(SRC[127:64]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[63:0] := ConvertDPFPToInteger_Imm(SRC[63:0]);
          DEST[127:64] := ConvertDPFPToInteger_Imm(SRC[127:64]);

FI

ROUNDPD (128-bit Legacy SSE Version)
DEST[63:0] := RoundToInteger(SRC[63:0]], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[MAXVL-1:128] (Unmodified)

VROUNDPD (VEX.128 Encoded Version)
DEST[63:0] := RoundToInteger(SRC[63:0]], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[MAXVL-1:128] := 0

VROUNDPD (VEX.256 Encoded Version)
DEST[63:0] := RoundToInteger(SRC[63:0], ROUND_CONTROL)
DEST[127:64] := RoundToInteger(SRC[127:64]], ROUND_CONTROL)
DEST[191:128] := RoundToInteger(SRC[191:128]], ROUND_CONTROL)
DEST[255:192] := RoundToInteger(SRC[255:192] ], ROUND_CONTROL)
```

## Intel C/C++ compilador intrínseco

```c
__m128 _mm_round_pd(__m128d s1, int iRoundMode);
__m128 _mm_floor_pd(__m128d s1);
__m128 _mm_ceil_pd(__m128d s1) __m256 _mm256_round_pd(__m256d s1, int iRoundMode);
__m256 _mm256_floor_pd(__m256d s1);
__m256 _mm256_ceil_pd(__m256d s1);
```

## SIMD coma flotante Excepciones

Inválido (signaled only if SRC = SNaN). Precisión (signaled only if imm[3] = `0; if imm[3] = `1, entonces la máscara de precisión en el MXCSR es ignorada y excepción de precisión no se indica.) Tenga en cuenta que Denormal no es señalizado por ROUNDPD.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
