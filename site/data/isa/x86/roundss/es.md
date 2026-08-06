---
summary: Round valores en coma flotante de precisión simple escalares
---

## Descripción

Round el valor en coma flotante de precisión simple en el dword más bajo del operando de origen (segundo operando) utilizando el modo de redondeo especificado en el operando inmediato (tercer operando) y colocar el resultado en el operando de destino (primer operando). El proceso de redondeo ronda la entrada una coma flotante de precisión simple a un valor entero y devuelve el resultado como un valor en coma flotante de precisión simple en la posición más baja. Los tres primeros valores en coma flotante de precisión simple en el destino se mantienen.

El operando inmediato especifica los campos de control para la operación de redondeo, se definen tres bits y se muestran en la Figura 4-24. El bit 3 del comportamiento del procesador de byte inmediato para una excepción de precisión, bit 2 selecciona la fuente del control de modo redondeado. Bits 1:0 especificar un valor de redondeo no pegajoso (tabla 4-21 enumera los valores codificados para el campo de redondeo-modo).

La Precisión coma flotante Excepción se señaliza según el operando inmediato. Si cualquier operando de origen es un SNaN entonces será convertido a un QNaN. Si DAZ se establece a `1 entonces los denormales se convertirán a cero antes de redondear.

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

## Operación

```text
IF (imm[2] = `1)
    THEN // rounding mode is determined by MXCSR.RC
          DEST[31:0] := ConvertSPFPToInteger_M(SRC[31:0]);
    ELSE // rounding mode is determined by IMM8.RC
          DEST[31:0] := ConvertSPFPToInteger_Imm(SRC[31:0]);

FI;
DEST[127:32] remains unchanged ;

ROUNDSS (128-bit Legacy SSE Version)
DEST[31:0] := RoundToInteger(SRC[31:0], ROUND_CONTROL)
DEST[MAXVL-1:32] (Unmodified)


VROUNDSS (VEX.128 Encoded Version)
DEST[31:0] := RoundToInteger(SRC2[31:0], ROUND_CONTROL)
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
ROUNDSS __m128 mm_round_ss(__m128 dst, __m128 s1, int iRoundMode);
ROUNDSS __m128 mm_floor_ss(__m128 dst, __m128 s1);
ROUNDSS __m128 mm_ceil_ss(__m128 dst, __m128 s1);
```

## SIMD coma flotante Excepciones

Inválido (signaled only if SRC = SNaN). Precisión (signaled only if imm[3] = `0; if imm[3] = `1, entonces la máscara de precisión en el MXCSR es ignorada y excepción de precisión no se indica.) Tenga en cuenta que Denormal no es señalizado por ROUNDSS.

## Otras excepciones

Ver Tabla 2-20, "Tipo 3 Condiciones de Excepción".
