---
summary: Round valores en coma flotante de precisión doble escalares
---

## Descripción

Ronda el valor en coma flotante de precisión doble en el qword inferior del operando de origen (segundo operando) utilizando el modo de redondeo especificado en el operando inmediato (tercer operando) y colocar el resultado en el operando de destino (primer operando). El proceso de redondeo ronda la entrada una coma flotante de precisión doble a un valor entero y devuelve el resultado entero como un valor en coma flotante de precisión doble en la posición más baja. El valor en coma flotante de precisión doble superior en el destino se mantiene.

El operando inmediato especifica los campos de control para la operación de redondeo, se definen tres bits y se muestran en la Figura 4-24. El bit 3 del comportamiento del procesador de byte inmediato para una excepción de precisión, bit 2 selecciona la fuente del control de modo redondeado. Bits 1:0 especificar un valor de redondeo no pegajoso (tabla 4-21 enumera los valores codificados para el campo de redondeo-modo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:64) del registro de destino YMM correspondiente no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

## Operación

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[63:0] := ConvertDPFPToInteger_M(SRC[63:0]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[63:0] := ConvertDPFPToInteger_Imm(SRC[63:0]);

FI;
DEST[127:63] remains unchanged ;

ROUNDSD (128-bit Legacy SSE Version)
DEST[63:0] := RoundToInteger(SRC[63:0], ROUND_CONTROL)
DEST[MAXVL-1:64] (Unmodified)


VROUNDSD (VEX.128 Encoded Version)
DEST[63:0] := RoundToInteger(SRC2[63:0], ROUND_CONTROL)
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
ROUNDSD __m128d mm_round_sd(__m128d dst, __m128d s1, int iRoundMode);
ROUNDSD __m128d mm_floor_sd(__m128d dst, __m128d s1);
ROUNDSD __m128d mm_ceil_sd(__m128d dst, __m128d s1);
```

## SIMD coma flotante Excepciones

Inválido (signaled only if SRC = SNaN). Precisión (signaled only if imm[3] = `0; if imm[3] = `1, entonces la máscara de precisión en el MXCSR es ignorada y excepción de precisión no se indica.) Tenga en cuenta que Denormal no es señalizado por ROUNDSD.

## Otras excepciones

Ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".
