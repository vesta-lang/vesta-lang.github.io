---
summary: Fused Negative Multiply-Add of escalar
---

## Descripción

VFNMADD132SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado del primer operando de origen al valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen, añade el resultado intermedio de precisión infinita negociado al valor en coma flotante de precisión simple bajo empaquetado en el segundo operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empacado resultante al operando de destino (primer operando de origen).

VFNMADD213SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado desde el segundo operando de origen hasta el valor en coma flotante de precisión simple bajo empaquetado en el primer operando de origen, añade el resultado intermedio de precisión infinita negociado al valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empacado resultante al operando de destino (primer operando de origen).

VFNMADD231SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado desde el segundo operando de origen hasta el valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen, añade el resultado intermedio de precisión infinita negociado al valor en coma flotante de precisión simple bajo empaquetado en el primer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empacado resultante al operando de destino (primer operando de origen).

VEX.128 y EVEX versión codificada: El operando de destino (también primer operando de origen) está codificado en reg field. El segundo operando de origen está codificado en VEX.vvvv/EVEX.vvvv. El tercer operando de origen está codificado en rm field. Los bits 127:32 del destino son invariables. Bits MAXVL-1:128 del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de doble palabra bajo del destino se actualiza según la máscara de escritura.

Las herramientas de compilador pueden apoyar opcionalmente una mnemónica complementaria para cada instrucción mnemónica listada en la columna el código de operación/instrucción de la tabla sumaria. El comportamiento de la mnemónica complementaria en situaciones

los NAN se rigen por la definición de la instrucción mnemónica definida en la columna el código de operación/instrucción.

## Operación

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFNMADD132SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(-(DEST[31:0]*SRC3[31:0]) + SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFNMADD213SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(-(SRC2[31:0]*DEST[31:0]) + SRC3[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0


VFNMADD231SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(-(SRC2[31:0]*SRC3[63:0]) + DEST[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFNMADD132SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(- (DEST[31:0]*SRC3[31:0]) + SRC2[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFNMADD213SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(- (SRC2[31:0]*DEST[31:0]) + SRC3[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFNMADD231SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(- (SRC2[31:0]*SRC3[31:0]) + DEST[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFNMADDxxxSS __m128 _mm_fnmadd_round_ss(__m128 a, __m128 b, __m128 c, int r);
VFNMADDxxxSS __m128 _mm_mask_fnmadd_ss(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFNMADDxxxSS __m128 _mm_maskz_fnmadd_ss(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFNMADDxxxSS __m128 _mm_mask3_fnmadd_ss(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFNMADDxxxSS __m128 _mm_mask_fnmadd_round_ss(__m128 a, __mmask8 k, __m128 b, __m128 c, int r);
VFNMADDxxxSS __m128 _mm_maskz_fnmadd_round_ss(__mmask8 k, __m128 a, __m128 b, __m128 c, int r);
VFNMADDxxxSS __m128 _mm_mask3_fnmadd_round_ss(__m128 a, __m128 b, __m128 c, __mmask8 k, int r);
VFNMADDxxxSS __m128 _mm_fnmadd_ss (__m128 a, __m128 b, __m128 c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".
