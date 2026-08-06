---
summary: Fused Multiply-Add of escalar Double
---

## Descripción

Realiza una computación multiplicada SIMD en los valores en coma flotante de precisión doble bajo utilizando tres operandos de origen y escribe el resultado multiplicado en el operando de destino. El operando de destino es también el primer operando de origen. El primero y segundo operando son registros XMM. El tercer operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits.

VFMADD132SD: Multiplica el valor en coma flotante de precisión doble bajo del primer operando de origen al valor en coma flotante de precisión doble bajo en el tercer operando de origen, añade el resultado intermedio de precisión infinita al valores en coma flotante de precisión doble bajo en el segundo operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión doble resultante al operando de destino (primer operando de origen).

VFMADD213SD: Multiplica el valor en coma flotante de precisión doble bajo del segundo operando de origen al valor en coma flotante de precisión doble bajo en el primer operando de origen, añade el resultado intermedio de precisión infinita al valor en coma flotante de precisión doble bajo en el tercer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión doble resultante al operando de destino (primer operando de origen).

VFMADD231SD: Multiplica el valor en coma flotante de precisión doble bajo de la segunda fuente al valor en coma flotante de precisión doble bajo en el tercer operando de origen, añade el resultado intermedio de precisión infinita al valor en coma flotante de precisión doble bajo en el primer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión doble resultante al operando de destino (primer operando de origen).

VEX.128 y EVEX versión codificada: El operando de destino (también primer operando de origen) está codificado en reg field. El segundo operando de origen está codificado en VEX.vvvv/EVEX.vvvv. El tercer operando de origen está codificado en rm field. Los bits 127:64 del destino son invariables. Bits MAXVL-1:128 del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de cuádpago bajo del destino se actualiza según la máscara de escritura.

## Operación

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMADD132SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(DEST[63:0]*SRC3[63:0] + SRC2[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMADD213SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*DEST[63:0] + SRC3[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0


VFMADD231SD DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[63:0] := RoundFPControl(SRC2[63:0]*SRC3[63:0] + DEST[63:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := DEST[127:64]

DEST[MAXVL-1:128] := 0

VFMADD132SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := MAXVL-1:128RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0

VFMADD213SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0

VFMADD231SD DEST, SRC2, SRC3 (VEX encoded version)
DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
DEST[127:63] := DEST[127:63]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFMADDxxxSD __m128d _mm_fmadd_round_sd(__m128d a, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_mask_fmadd_sd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMADDxxxSD __m128d _mm_maskz_fmadd_sd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMADDxxxSD __m128d _mm_mask3_fmadd_sd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMADDxxxSD __m128d _mm_mask_fmadd_round_sd(__m128d a, __mmask8 k, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_maskz_fmadd_round_sd(__mmask8 k, __m128d a, __m128d b, __m128d c, int r);
VFMADDxxxSD __m128d _mm_mask3_fmadd_round_sd(__m128d a, __m128d b, __m128d c, __mmask8 k, int r);
VFMADDxxxSD __m128d _mm_fmadd_sd (__m128d a, __m128d b, __m128d c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
