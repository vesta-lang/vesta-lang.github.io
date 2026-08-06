---
summary: Round valores en coma flotante de precisión simple empaquetados
---

## Descripción

Redondear el 4 valores en coma flotante de precisión simple en el operando de origen (segundo operando) utilizando el modo de redondeo especificado en el operando inmediato (tercer operando) y colocar los resultados en el operando de destino (primer operando). El proceso de redondeo ronda cada entrada valor en coma flotante a un valor entero y devuelve el resultado entero como un valor en coma flotante de precisión simple.

El operando inmediato especifica los campos de control para la operación de redondeo, se definen tres bits y se muestran en la Figura 4-24. El bit 3 del comportamiento del procesador de byte inmediato para una excepción de precisión, bit 2 selecciona la fuente del control de modo redondeado. Bits 1:0 especificar un valor de redondeo no pegajoso (tabla 4-21 enumera los valores codificados para el campo de redondeo-modo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el operando de origen segundo operando de origen o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El operando de origen es un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

## Operación

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[31:0] := ConvertSPFPToInteger_M(SRC[31:0]);
          DEST[63:32] := ConvertSPFPToInteger_M(SRC[63:32]);
          DEST[95:64] := ConvertSPFPToInteger_M(SRC[95:64]);
          DEST[127:96] := ConvertSPFPToInteger_M(SRC[127:96]);
    ELSE // rounding mode is determined by IMM8.RC


          DEST[31:0] := ConvertSPFPToInteger_Imm(SRC[31:0]);
          DEST[63:32] := ConvertSPFPToInteger_Imm(SRC[63:32]);
          DEST[95:64] := ConvertSPFPToInteger_Imm(SRC[95:64]);
          DEST[127:96] := ConvertSPFPToInteger_Imm(SRC[127:96]);
FI;

ROUNDPS(128-bit Legacy SSE Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[MAXVL-1:128] (Unmodified)

VROUNDPS (VEX.128 Encoded Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[MAXVL-1:128] := 0

VROUNDPS (VEX.256 Encoded Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[63:32] := RoundToInteger(SRC[63:32], ROUND_CONTROL)
DEST[95:64] := RoundToInteger(SRC[95:64]], ROUND_CONTROL)
DEST[127:96] := RoundToInteger(SRC[127:96]], ROUND_CONTROL)
DEST[159:128] := RoundToInteger(SRC[159:128]], ROUND_CONTROL)
DEST[191:160] := RoundToInteger(SRC[191:160]], ROUND_CONTROL)
DEST[223:192] := RoundToInteger(SRC[223:192] ], ROUND_CONTROL)
DEST[255:224] := RoundToInteger(SRC[255:224] ], ROUND_CONTROL)
```

## Intel C/C++ compilador intrínseco

```c
__m128 _mm_round_ps(__m128 s1, int iRoundMode);
__m128 _mm_floor_ps(__m128 s1);
__m128 _mm_ceil_ps(__m128 s1) __m256 _mm256_round_ps(__m256 s1, int iRoundMode);
__m256 _mm256_floor_ps(__m256 s1);
__m256 _mm256_ceil_ps(__m256 s1);
```

## SIMD coma flotante Excepciones

Inválido (signaled only if SRC = SNaN). Precisión (signaled only if imm[3] = `0; if imm[3] = `1, entonces la máscara de precisión en el MXCSR es ignorada y excepción de precisión no se indica.) Tenga en cuenta que Denormal no es señalizado por ROUNDPS.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
