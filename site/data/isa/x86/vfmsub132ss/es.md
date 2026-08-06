---
summary: Multiply-Subtract de escalar Single
---

## Descripción

Realiza una computación de SIMD multi-subtract en los valores en coma flotante de precisión simple empaquetados bajo utilizando tres operandos de origen y escribe el resultado multi-subtract en el operando de destino. El operando de destino es también el primer operando de origen. El segundo operando debe ser un registro XMM. El tercer operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits.

VFMSUB132SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado desde el primer operando de origen hasta el valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los valores en coma flotante de precisión simple empaquetados bajo en el segundo operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empacado resultante al operando de destino (primer operando de origen).

VFMSUB213SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado del segundo operando de origen al valor en coma flotante de precisión simple bajo empaquetado en el primer operando de origen. Desde el resultado intermedio de precisión infinita, resta el valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empaquetado resultante al operando de destino (primer operando de origen).

VFMSUB231SS: Multiplica el valor en coma flotante de precisión simple bajo empaquetado de la segunda fuente al valor en coma flotante de precisión simple bajo empaquetado en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta el valor en coma flotante de precisión simple bajo empaquetado en el primer operando de origen, realiza redondeo y almacena el valor en coma flotante de precisión simple empacado resultante al operando de destino (primer operando de origen).

VEX.128 y EVEX versión codificada: El operando de destino (también primer operando de origen) está codificado en reg field. El segundo operando de origen está codificado en VEX.vvvv/EVEX.vvvv. El tercer operando de origen está codificado en rm field. Los bits 127:32 del destino son invariables. Bits MAXVL-1:128 del registro de destino se ponen a cero.

EVEX versión codificada: El elemento de doble palabra bajo del destino se actualiza según la máscara de escritura.

Las herramientas de compilador pueden apoyar opcionalmente una mnemónica complementaria para cada instrucción mnemónica listada en la columna el código de operación/instrucción de la tabla sumaria. El comportamiento de la mnemónica complementaria en situaciones que involucran a los NAN se rige por la definición de la instrucción mnemónica definida en la columna el código de operación/instrucción.

## Operación

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).

VFMSUB132SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(DEST[31:0]*SRC3[31:0] - SRC2[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*DEST[31:0] - SRC3[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0


VFMSUB231SS DEST, SRC2, SRC3 (EVEX encoded version)

IF (EVEX.b = 1) and SRC3 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] or *no writemask*

     THEN DEST[31:0] := RoundFPControl(SRC2[31:0]*SRC3[63:0] - DEST[31:0])

     ELSE

     IF *merging-masking*                 ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                           ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := DEST[127:32]

DEST[MAXVL-1:128] := 0

VFMSUB132SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(DEST[31:0]*SRC3[31:0] - SRC2[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB213SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*DEST[31:0] - SRC3[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0

VFMSUB231SS DEST, SRC2, SRC3 (VEX encoded version)
DEST[31:0] := RoundFPControl_MXCSR(SRC2[31:0]*SRC3[31:0] - DEST[31:0])
DEST[127:32] := DEST[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFMSUBxxxSS __m128 _mm_fmsub_round_ss(__m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask_fmsub_ss(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_ss(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_ss(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBxxxSS __m128 _mm_mask_fmsub_round_ss(__m128 a, __mmask8 k, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_maskz_fmsub_round_ss(__mmask8 k, __m128 a, __m128 b, __m128 c, int r);
VFMSUBxxxSS __m128 _mm_mask3_fmsub_round_ss(__m128 a, __m128 b, __m128 c, __mmask8 k, int r);
VFMSUBxxxSS __m128 _mm_fmsub_ss (__m128 a, __m128 b, __m128 c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-20, "Tipo 3 Condiciones de Excepción." Instrucciones codificadas por EVEX, ver Tabla 2-49, "Tipo E3 Condiciones de Excepción".

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of valores en coma flotante de precisión doble empaquetados

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.128.66.0F38.W1 97 /r A V/V FMA Multiply packed coma flotante de precisión doble

VFMSUBADD132PD xmm1, xmm2, valores de xmm1 y xmm3/mem, elementos subtract/add en xmm2 y poner resultado xmm3/m128 en xmm1.

VEX.128.66.0F38.W1 A7 /r A V/V FMA Multiply packed coma flotante de precisión doble

VFMSUBADD213PD xmm1, xmm2, valores de xmm1 y xmm2, elementos de subtract/add en xmm3/mem y dar resultado en xmm1. xmm3/m128

VEX.128.66.0F38.W1 B7 /r A V/V FMA Multiply valores en coma flotante de precisión doble empaquetados de xmm2 y xmm3/mem, VFMSUBADD231PD xmm1, xmm2, subtract/add elements in xmm1 y poner resultado xmm3/m128 en xmm1.

VEX.256.66.0F38.W1 97 /r A V/V FMA Multiply packed coma flotante de precisión doble

VFMSUBADD132PD ymm1, ymm2, valores de ymm1 y ymm3/mem, elementos subtract/add en ymm2 y poner resultado ymm3/m256 en ymm1.

VEX.256.66.0F38.W1 A7 /r A V/V FMA Multiply packed coma flotante de precisión doble

VFMSUBADD213PD ymm1, ymm2, valores de ymm1 y ymm2, elementos de subtract/add en ymm3/mem y dar resultado en ymm1. ymm3/m256

VEX.256.66.0F38.W1 B7 /r A V/V FMA Multiply valores en coma flotante de precisión doble empaquetados de ymm2 y ymm3/mem, VFMSUBADD231PD ymm1, ymm2, subtract/add elements in ymm1 y poner resultado ymm3/m256 en ymm1.

EVEX.128.66.0F38.W1 97 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m64bcst,
```

VFMSUBADD132PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm2 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W1 A7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PD xmm1 {k1}{z},

```text
                                          AVX10.1        elements in xmm3/m128/m64bcst and put
```

xmm2, xmm3/m128/m64bcst result in xmm1 subject to máscara de escritura k1.

EVEX.128.66.0F38.W1 B7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m64bcst,
```

VFMSUBADD231PD xmm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in xmm1 and put result
```

xmm2, xmm3/m128/m64bcst                                  in xmm1 subject to writemask k1.

EVEX.256.66.0F38.W1 97 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m64bcst,
```

VFMSUBADD132PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm2 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W1 A7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PD ymm1 {k1}{z},

```text
                                          AVX10.1        elements in ymm3/m256/m64bcst and put
```

ymm2, ymm3/m256/m64bcst result in ymm1 subject to máscara de escritura k1.

EVEX.256.66.0F38.W1 B7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión doble

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m64bcst,
```

VFMSUBADD231PD ymm1 {k1}{z},

```text
                                          AVX10.1        subtract/add elements in ymm1 and put result
```

ymm2, ymm3/m256/m64bcst                                  in ymm1 subject to writemask k1.

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera

```text
                                         Support                 Multiply packed double precision floating-point
```

EVEX.512.66.0F38.W197 /r valores dezmm1yzmm3/m512/m64bcst,VFMSUBADD132PD zmm1 {k1}{z}, B V/V AVX512Fsubtract/add elements inzmm2y poner resultado enzmm2, zmm3/m512/m64bcst{er} ORAVX10.1 zmm1sujeto amáscara de escritura k1.

EVEX.512.66.0F38.W1 A7 /r B V/V AVX512FMultiply packedcoma flotante de precisión doble VFMSUBADD213PD zmm1 {k1OAVX10.1valores dezmm1yzmm2, subtract/addzmm2, zmm3/m512/m64bcst{er} elementos enzmm3/m512/m64bcst y poner

```text
                              B          V/V      AVX512F        result in zmm1 subject to writemask k1.
```

EVEX.512.66.0F38.W1B7 /r ORAVX10.1 VFMSUBADD231PD zmm1 {k1}{z}, Multiply packedcoma flotante de precisión doble zmm2, zmm3/m512/m64bcst{er} valores dezmm2yzmm3/m512/m64bcst, subtract/add elementos enzmm1y poner resultado enzmm1sujeto amáscara de escritura k1.

## Descripción

VFMSUBADD132PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del primer operando de origen a los dos o cuatro valores en coma flotante de precisión doble empaquetados en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión doble extraños y añade los valores en coma flotante de precisión doble en el segundo operando de origen, realiza redondeo y almacena los dos o cuatro valores en coma flotante de precisión doble empaquetados resultantes al operando de destino (primer operando de origen).

VFMSUBADD213PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del segundo operando de origen a los dos o cuatro valores en coma flotante de precisión doble empaquetados en el primer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión doble impares y añade los valores en coma flotante de precisión doble incluso en el tercer operando de origen, realiza redondeo y almacena los dos o cuatro valores en coma flotante de precisión doble empaquetados resultantes al operando de destino (primer operando de origen).

VFMSUBADD231PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del segundo operando de origen a los dos o cuatro valores en coma flotante de precisión doble empaquetados en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión doble extraños y añade los valores en coma flotante de precisión doble en el primer operando de origen, realiza redondeo y almacena los dos o cuatro valores en coma flotante de precisión doble empaquetados resultantes al operando de destino (primer operando de origen).

EVEX versiones codificadas: El operando de destino (también primer operando de origen) y el segundo operando de origen son ZMM/YMM/XMM registro. El tercer operando de origen es un ZMM/YMM/XMM registrado, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino está actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El operando de destino (también primer operando de origen) es un registro YMM y codificado en reg field. El segundo operando de origen es un registro YMM y codificado en VEX.vvvv. El tercer operando de origen es un registro YMM o una ubicación de memoria de 256 bits y codificado en rm field.

VEX.128 versión codificada: El operando de destino (también primer operando de origen) es un registro XMM y codificado en reg field. El segundo operando de origen es un registro XMM y codificado en VEX.vvvv. El tercer operando de origen es un registro XMM o una ubicación de memoria de 128 bits y codificado en rm field. Los 128 bits superiores del destino YMM registran se ponen a cero.

Las herramientas de compilador pueden apoyar opcionalmente una mnemónica complementaria para cada instrucción mnemónica listada en la columna el código de operación/instrucción de la tabla sumaria. El comportamiento de la mnemónica complementaria en situaciones

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

los NAN se rigen por la definición de la instrucción mnemónica definida en la columna el código de operación/instrucción.

## Operación

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(DEST[63:0]*SRC3[63:0] + SRC2[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(DEST[127:64]*SRC3[127:64] - SRC2[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(DEST[191:128]*SRC3[191:128] + SRC2[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(DEST[255:192]*SRC3[255:192] - SRC2[255:192]
FI

VFMSUBADD213PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*DEST[63:0] + SRC3[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*DEST[127:64] - SRC3[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*DEST[191:128] + SRC3[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*DEST[255:192] - SRC3[255:192]
FI

VFMSUBADD231PD DEST, SRC2, SRC3
IF (VEX.128) THEN

    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[63:0] := RoundFPControl_MXCSR(SRC2[63:0]*SRC3[63:0] + DEST[63:0])
    DEST[127:64] := RoundFPControl_MXCSR(SRC2[127:64]*SRC3[127:64] - DEST[127:64])
    DEST[191:128] := RoundFPControl_MXCSR(SRC2[191:128]*SRC3[191:128] + DEST[191:128])
    DEST[255:192] := RoundFPControl_MXCSR(SRC2[255:192]*SRC3[255:192] - DEST[255:192]
FI

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)
(KL, VL) = (2, 128), (4, 256), (8, 512)
IF (VL = 512) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

     THEN

        IF j *is even*

            THEN DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])

            ELSE DEST[i+63:i] :=

            RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])

        FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] + SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] + SRC2[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] - SRC2[i+63:i])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])
                            FI;
                FI

     ELSE

        IF *merging-masking*      ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                  ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] + SRC3[i+63:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[63:0])
                                  ELSE
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                      FI;

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (2, 128), (4, 256), (8, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])

                      ELSE DEST[i+63:i] :=

                      RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+63:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PD DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1
    i := j * 64
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+63:i] :=
                            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] + DEST[i+63:i])
                                  ELSE

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

                              DEST[i+63:i] :=
                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] + DEST[i+63:i])
                  FI;
            ELSE
                  IF (EVEX.b = 1)

                        THEN
                              DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] - DEST[i+63:i])

                       ELSE

                       DEST[i+63:i] :=

            RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

            FI;

        FI

     ELSE

        IF *merging-masking*            ; merging-masking

            THEN *DEST[i+63:i] remains unchanged*

            ELSE                        ; zeroing-masking

            DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_pd(__m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_pd(__m512d a, __mmask8 k, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_pd(__mmask8 k, __m512d a, __m512d b, __m512d c);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_pd(__m512d a, __m512d b, __m512d c, __mmask8 k);
VFMSUBADDxxxPD __m512d _mm512_mask_fmsubadd_round_pd(__m512d a, __mmask8 k, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_maskz_fmsubadd_round_pd(__mmask8 k, __m512d a, __m512d b, __m512d c, int r);
VFMSUBADDxxxPD __m512d _mm512_mask3_fmsubadd_round_pd(__m512d a, __m512d b, __m512d c, __mmask8 k, int r);
VFMSUBADDxxxPD __m256d _mm256_mask_fmsubadd_pd(__m256d a, __mmask8 k, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_maskz_fmsubadd_pd(__mmask8 k, __m256d a, __m256d b, __m256d c);
VFMSUBADDxxxPD __m256d _mm256_mask3_fmsubadd_pd(__m256d a, __m256d b, __m256d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_mask_fmsubadd_pd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_maskz_fmsubadd_pd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m128d _mm_mask3_fmsubadd_pd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMSUBADDxxxPD __m128d _mm_fmsubadd_pd (__m128d a, __m128d b, __m128d c);
VFMSUBADDxxxPD __m256d _mm256_fmsubadd_pd (__m256d a, __m256d b, __m256d c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción". Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

VFMSUBADD132PD/VFMSUBADD213PD/VFMSUBADD231PD--Fused Multiply-Alternating Subtract/Add of Packed Double Precision

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

Código de operación/ Op/ 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte

EVEX.128.66.MAP6.W0 97 /r A V/V (AVX512 FP16 Multiply packed FP16 values from xmm1 y

VFMSUBADD132PH xmm1{k1}{z}, AND AVX512VL) xmm3/m128/m16bcst, subtract/add elementos enxmm2, xmm3/m128/m16bcst ORAVX10.1 xmm2, y almacenar el resultado enxmm1sujeto amáscara de escritura k1.

EVEX.256.66.MAP6.W0 97 /r A V/V (AVX512 FP16 Multiply packed FP16 values from ymm1 y

VFMSUBADD132PH ymm1{k1}{z}, AND AVX512VL) ymm3/m256/m16bcst, subtract/add elementos enymm2, ymm3/m256/m16bcst ORAVX10.1 ymm2, y almacenar el resultado enymm1sujeto amáscara de escritura k1.

EVEX.512.66.MAP6.W097 /r A V/V AVX512 FP16 Multiply packedFP16valores dezmm1y OAVX10.1 VFMSUBADD132PH zmm1{k1}{z}, zmm3/m512/m16bcst, subtract/add elementos enzmm2, zmm3/m512/m16bcst {er}zmm2, y almacenar el resultado enzmm1sujeto a

writemask k1.

EVEX.128.66.MAP6.W0A7 /r A V/V (AVX512 FP16 Multiply packedFP16valores dexmm1yVFMSUBADD213PH xmm1{k1}{z}, AND AVX512VL) xmm2, elementos de subtracción/add enxmm2, xmm3/m128/m16bcst ORAVX10.1 xmm3/m128/m16bcst, y almacenar el resultado en

xmm1 subject to writemask k1.

EVEX.256.66.MAP6.W0A7 /r A V/V (AVX512 FP16 Multiply packedFP16valores deymm1yVFMSUBADD213PH ymm1{k1}{z}, AND AVX512VL) ymm2, elementos de subtracción/add enymm2, ymm3/m256/m16bcst ORAVX10.1 ymm3/m256/m16bcst, y almacenar el resultado en

ymm1 subject to writemask k1.

EVEX.512.66.MAP6.W0A7 /r A V/V AVX512 FP16 Multiply packedFP16valores dezmm1yVFMSUBADD213PH zmm1{k1OAVX10.1 zmm2, elementos de subtracción/add enzmm2, zmm3/m512/m16bcst {er}zmm3/m512/m16bcst, y almacenar el resultado en

zmm1 subject to writemask k1.

EVEX.128.66.MAP6.W0B7 /r A V/V (AVX512 FP16 Multiply packedFP16valores dexmm2yVFMSUBADD231PH xmm1{k1}{z}, AND AVX512VL) xmm3/m128/m16bcst, subtract/add elementos enxmm2, xmm3/m128/m16bcst ORAVX10.1 xmm1, y almacenar el resultado enxmm1sujeto a

writemask k1.

EVEX.256.66.MAP6.W0B7 /r A V/V (AVX512 FP16 Multiply packedFP16valores deymm2yVFMSUBADD231PH ymm1{k1}{z}, AND AVX512VL) ymm3/m256/m16bcst, subtract/add elementos enymm2, ymm3/m256/m16bcst ORAVX10.1 ymm1, y almacenar el resultado enymm1sujeto a

writemask k1.

EVEX.512.66.MAP6.W0B7 /r A V/V AVX512 FP16 Multiply packedFP16valores dezmm2yVFMSUBADD231PH zmm1{k1OAVX10.1 zmm3/m512/m16bcst, subtract/add elementos enzmm2, zmm3/m512/m16bcst {er}zmm1, y almacenar el resultado enzmm1sujeto a

writemask k1.

## Descripción

Esta instrucción realiza una computación multiadd (incluso elementos) o multi-sutract (elementos dóciles) en los valores FP16 utilizando tres operandos de origen y escribe los resultados en el operando de destino. El operando de destino es también el primer operando de origen. La notación "132", "213" y "231" indican el uso de los operandos en A * B +/- C, donde cada dígito corresponde al número el operando, siendo el destino operando 1; véase Tabla 5-10.

Los elementos de destino se actualizan según la máscara de escritura.

**VFMSUBADD[132,213,231]PH Notation for Odd and Even Elements**

| Notación | Odd Elements | Incluso elementos |
| --- | --- | --- |
| 132 dest = | dest*src3-src2 de | st = dest*src3+src2 |

## Operación

```text
VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j]*SRC3.fp16[j] - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 + SRC2.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(DEST.fp16[j] * t3 - SRC2.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] + SRC3.fp16[j])
          ELSE
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*DEST.fp16[j] - SRC3.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] + t3 )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * DEST.fp16[j] - t3 )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0:

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a register
VL = 128, 256 or 512
KL := VL/16

IF (VL = 512) AND (EVEX.b = 1):
    SET_RM(EVEX.RC)

ELSE
    SET_RM(MXCSR.RC)

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF *j is even:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] + DEST.fp16[j])
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j]*SRC3.fp16[j] - DEST.fp16[j])
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PH DEST, SRC2, SRC3 (EVEX encoded versions) when src3 operand is a memory source
VL = 128, 256 or 512
KL := VL/16

FOR j := 0 TO KL-1:
    IF k1[j] OR *no writemask*:
          IF EVEX.b = 1:
                t3 := SRC3.fp16[0]
          ELSE:
                t3 := SRC3.fp16[j]
          IF *j is even*:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 + DEST.fp16[j] )
          ELSE:
                DEST.fp16[j] := RoundFPControl(SRC2.fp16[j] * t3 - DEST.fp16[j] )
    ELSE IF *zeroing*:
          DEST.fp16[j] := 0
    // else dest.fp16[j] remains unchanged

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values
```

## Intel C/C++ compilador intrínseco

```c
VFMSUBADD132PH, VFMSUBADD213PH, and VFMSUBADD231PH: __m128h _mm_fmsubadd_ph (__m128h a, __m128h b, __m128h c);
__m128h _mm_mask_fmsubadd_ph (__m128h a, __mmask8 k, __m128h b, __m128h c);
__m128h _mm_mask3_fmsubadd_ph (__m128h a, __m128h b, __m128h c, __mmask8 k);
__m128h _mm_maskz_fmsubadd_ph (__mmask8 k, __m128h a, __m128h b, __m128h c);
__m256h _mm256_fmsubadd_ph (__m256h a, __m256h b, __m256h c);
__m256h _mm256_mask_fmsubadd_ph (__m256h a, __mmask16 k, __m256h b, __m256h c);
__m256h _mm256_mask3_fmsubadd_ph (__m256h a, __m256h b, __m256h c, __mmask16 k);
__m256h _mm256_maskz_fmsubadd_ph (__mmask16 k, __m256h a, __m256h b, __m256h c);
__m512h _mm512_fmsubadd_ph (__m512h a, __m512h b, __m512h c);
__m512h _mm512_mask_fmsubadd_ph (__m512h a, __mmask32 k, __m512h b, __m512h c);
__m512h _mm512_mask3_fmsubadd_ph (__m512h a, __m512h b, __m512h c, __mmask32 k);
__m512h _mm512_maskz_fmsubadd_ph (__mmask32 k, __m512h a, __m512h b, __m512h c);
__m512h _mm512_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask_fmsubadd_round_ph (__m512h a, __mmask32 k, __m512h b, __m512h c, const int rounding);
__m512h _mm512_mask3_fmsubadd_round_ph (__m512h a, __m512h b, __m512h c, __mmask32 k, const int rounding);
__m512h _mm512_maskz_fmsubadd_round_ph (__mmask32 k, __m512h a, __m512h b, __m512h c, const int rounding);
```

## SIMD coma flotante Excepciones

Invalid, Underflow, Overflow, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

VFMSUBADD132PH/VFMSUBADD213PH/VFMSUBADD231PH--Fused Multiply-Alternating Subtract/Add of Packed FP16 Values

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of valores en coma flotante de precisión simple empaquetados

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera Soporte Soporte Bandera

VEX.128.66.0F38.W0 97 /r A V/V FMA Multiply packed coma flotante de precisión simple

VFMSUBADD132PS xmm1, xmm2, valores de xmm1 y xmm3/mem, elementos de subtract/add en xmm2 y dar resultado en xmm1. xmm3/m128

VEX.128.66.0F38.W0 A7 /r A V/V FMA Multiply valores en coma flotante de precisión simple empaquetados de xmm1 y xmm2, subtract/add VFMSUBADD213PS xmm1, xmm2, elementos en xmm3/mem y poner resultado en xmm1. xmm3/m128

VEX.128.66.0F38.W0 B7 /r A V/V FMA Multiply valores en coma flotante de precisión simple empaquetados de xmm2 y xmm3/mem, subtract/add VFMSUBADD231PS xmm1, xmm2, elementos en xmm1 y dar resultado en xmm1.

xmm3/m128

VEX.256.66.0F38.W0 97 /r A V/V FMA Multiply packed coma flotante de precisión simple

VFMSUBADD132PS ymm1, ymm2, valores de ymm1 y ymm3/mem, elementos de subtract/add en ymm2 y dar resultado en ymm1. ymm3/m256

VEX.256.66.0F38.W0 A7 /r A V/V FMA Multiply packed coma flotante de precisión simple

VFMSUBADD213PS ymm1, ymm2, valores de ymm1 y ymm2, elementos de subtract/add en ymm3/mem y dar resultado en ymm1. ymm3/m256

VEX.256.66.0F38.W0 B7 /r A V/V FMA Multiply valores en coma flotante de precisión simple empaquetados de ymm2 y ymm3/mem, subtract/add VFMSUBADD231PS ymm1, ymm2, elementos en ymm1 y dar resultado en ymm1. ymm3/m256

EVEX.128.66.0F38.W0 97 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from xmm1 and xmm3/m128/m32bcst,
```

VFMSUBADD132PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm2 and put result in

xmm2, xmm3/m128/m32bcst xmm1 sujeto a máscara de escritura k1.

EVEX.128.66.0F38.W0 A7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from xmm1 and xmm2, subtract/add
```

VFMSUBADD213PS xmm1 {k1}{z}, AVX10.1 elementos en xmm3/m128/m32bcst y poner el resultado

xmm2, xmm3/m128/m32bcst                                  in xmm1 subject to writemask k1.

EVEX.128.66.0F38.W0 B7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from xmm2 and xmm3/m128/m32bcst,
```

VFMSUBADD231PS xmm1 {k1}{z},              AVX10.1        subtract/add elements in xmm1 and put result in

xmm2, xmm3/m128/m32bcst xmm1 sujeto a máscara de escritura k1.

EVEX.256.66.0F38.W0 97 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from ymm1 and ymm3/m256/m32bcst,
```

VFMSUBADD132PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm2 and put result in

ymm2, ymm3/m256/m32bcst ymm1 sujeto a máscara de escritura k1.

EVEX.256.66.0F38.W0 A7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from ymm1 and ymm2, subtract/add
```

VFMSUBADD213PS ymm1 {k1}{z}, AVX10.1 elementos en ymm3/m256/m32bcst y poner el resultado

ymm2, ymm3/m256/m32bcst                                  in ymm1 subject to writemask k1.

EVEX.256.66.0F38.W0 B7 /r B V/V (AVX512VL AND Multiply packed coma flotante de precisión simple

```text
                                          AVX512F) OR    values from ymm2 and ymm3/m256/m32bcst,
```

VFMSUBADD231PS ymm1 {k1}{z},              AVX10.1        subtract/add elements in ymm1 and put result in

ymm2, ymm3/m256/m32bcst ymm1 sujeto a máscara de escritura k1.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

Código de operación/ Op / 64/32 CPUID Característica Descripción Instrucción En modo Bit Bandera

```text
                                 Support                      Multiply packed single precision floating-point
```

EVEX.512.66.0F38.W097 /r valores dezmm1yzmm3/m512/m32bcst,VFMSUBADD132PS zmm1 {k1}{z}, B V/V AVX512Fsubtract/add elements inzmm2y poner resultado enzmm2, zmm3/m512/m32bcst{er} ORAVX10.1 zmm1sujeto amáscara de escritura k1.

EVEX.512.66.0F38.W0 A7 /r B V/V AVX512F Multiply packed coma flotante de precisión simple

```text
                                               OR AVX10.1     values from zmm1 and zmm2, subtract/add
```

VFMSUBADD213PS zmm1 {k1}{z} elementos enzmm3/m512/m32bcst y poner resultado enzmm1sujeto amáscara de escritura k1. zmm2, zmm3/m512Multiply packedcoma flotante de precisión simple EVEX.512.66.0F38.W0 B7 /r B V/V AVX512Fvalores dezmm2yzmm3/m512/m32bcst,

```text
                                               OR AVX10.1     subtract/add elements in zmm1 and put result in
```

VFMSUBADD231PS zmm1 {k1}{z},                                  zmm1 subject to writemask k1.

zmm2, zmm3/m512/m32bcst{er}

## Descripción

VFMSUBADD132PS: Multiplica los cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados del primer operando de origen al valores en coma flotante de precisión simple empaquetados correspondiente en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión simple extraños y añade los valores en coma flotante de precisión simple en el segundo operando de origen, realiza redondeo y almacena los valores en coma flotante de precisión simple empaquetados resultantes al operando de destino (primer operando de origen).

VFMSUBADD213PS: Multiplica los cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados del segundo operando de origen al valores en coma flotante de precisión simple empaquetados correspondiente en el primer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión simple impares y añade los valores en coma flotante de precisión simple incluso en el tercer operando de origen, realiza redondeo y almacena los valores en coma flotante de precisión simple empaquetados resultante al operando de destino (primer operando de origen).

VFMSUBADD231PS: Multiplica los cuatro, ocho o dieciséis valores en coma flotante de precisión simple empaquetados del segundo operando de origen al valores en coma flotante de precisión simple empaquetados correspondiente en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los elementos coma flotante de precisión simple extraños y añade los valores en coma flotante de precisión simple en el primer operando de origen, realiza redondeo y almacena los valores en coma flotante de precisión simple empaquetados resultantes al operando de destino (primer operando de origen).

EVEX versiones codificadas: El operando de destino (también primer operando de origen) y el segundo operando de origen son ZMM/YMM/XMM registro. El tercer operando de origen es un ZMM/YMM/XMM registrado, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits. El operando de destino está actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El operando de destino (también primer operando de origen) es un registro YMM y codificado en reg field. El segundo operando de origen es un registro YMM y codificado en VEX.vvvv. El tercer operando de origen es un registro YMM o una ubicación de memoria de 256 bits y codificado en rm field.

VEX.128 versión codificada: El operando de destino (también primer operando de origen) es un registro XMM y codificado en reg field. El segundo operando de origen es un registro XMM y codificado en VEX.vvvv. El tercer operando de origen es un registro XMM o una ubicación de memoria de 128 bits y codificado en rm field. Los 128 bits superiores del destino YMM registran se ponen a cero.

Las herramientas de compilador pueden apoyar opcionalmente una mnemónica complementaria para cada instrucción mnemónica listada en la columna el código de operación/instrucción de la tabla sumaria. El comportamiento de la mnemónica complementaria en situaciones que involucran a los NAN se rige por la definición de la instrucción mnemónica definida en la columna el código de operación/instrucción.

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

## Operación

```text
In the operations below, "*" and "+" symbols represent multiplication and addition with infinite precision inputs and outputs (no
rounding).

VFMSUBADD132PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(DEST[n+31:n]*SRC3[n+31:n] + SRC2[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(DEST[n+63:n+32]*SRC3[n+63:n+32] -SRC2[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD213PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*DEST[n+31:n] +SRC3[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*DEST[n+63:n+32] -SRC3[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD231PS DEST, SRC2, SRC3
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM -1{

    n := 64*i;
    DEST[n+31:n] := RoundFPControl_MXCSR(SRC2[n+31:n]*SRC3[n+31:n] + DEST[n+31:n])
    DEST[n+63:n+32] := RoundFPControl_MXCSR(SRC2[n+63:n+32]*SRC3[n+63:n+32] -DEST[n+63:n+32])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD132PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] + SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                                  RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] + SRC2[i+31:i])
                            FI;
                      ELSE
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[31:0] - SRC2[i+31:i])
                                  ELSE
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(DEST[i+31:i]*SRC3[i+31:i] - SRC2[i+31:i])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                              FI;
                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      ELSE DEST[i+31:i] :=

                      RoundFPControl(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*      ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                  ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD213PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1
    i := j * 32
    IF k1[j] OR *no writemask*
          THEN
                IF j *is even*
                      THEN
                            IF (EVEX.b = 1)
                                  THEN
                                        DEST[i+31:i] :=
                            RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[31:0])

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

                           ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] + SRC3[i+31:i])

                      FI;

                      ELSE

                           IF (EVEX.b = 1)

                                  THEN

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[i+31:i])

                                  ELSE

                                  DEST[i+31:i] :=

                           RoundFPControl_MXCSR(SRC2[i+31:i]*DEST[i+31:i] - SRC3[31:0])

                           FI;

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a register)

(KL, VL) = (4, 128), (8, 256), (16, 512)

IF (VL = 512) AND (EVEX.b = 1)

     THEN

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN

                  IF j *is even*

                      THEN DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                      ELSE DEST[i+31:i] :=

                           RoundFPControl(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                  FI

          ELSE

                  IF *merging-masking*             ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE                         ; zeroing-masking

                           DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUBADD231PS DEST, SRC2, SRC3 (EVEX encoded version, when src3 operand is a memory source)
(KL, VL) = (4, 128), (8, 256), (16, 512)

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN

             IF j *is even*

                 THEN

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] + DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                             RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] + DEST[i+31:i])

                    FI;

                 ELSE

                    IF (EVEX.b = 1)

                             THEN

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[31:0] - DEST[i+31:i])

                             ELSE

                             DEST[i+31:i] :=

                    RoundFPControl_MXCSR(SRC2[i+31:i]*SRC3[i+31:i] - DEST[i+31:i])

                    FI;

             FI

     ELSE

             IF *merging-masking*             ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE                         ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_ps(__m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_ps(__m512 a, __mmask16 k, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_ps(__mmask16 k, __m512 a, __m512 b, __m512 c);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_ps(__m512 a, __m512 b, __m512 c, __mmask16 k);
VFMSUBADDxxxPS __m512 _mm512_mask_fmsubadd_round_ps(__m512 a, __mmask16 k, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_maskz_fmsubadd_round_ps(__mmask16 k, __m512 a, __m512 b, __m512 c, int r);
VFMSUBADDxxxPS __m512 _mm512_mask3_fmsubadd_round_ps(__m512 a, __m512 b, __m512 c, __mmask16 k, int r);
VFMSUBADDxxxPS __m256 _mm256_mask_fmsubadd_ps(__m256 a, __mmask8 k, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_maskz_fmsubadd_ps(__mmask8 k, __m256 a, __m256 b, __m256 c);
VFMSUBADDxxxPS __m256 _mm256_mask3_fmsubadd_ps(__m256 a, __m256 b, __m256 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_mask_fmsubadd_ps(__m128 a, __mmask8 k, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_maskz_fmsubadd_ps(__mmask8 k, __m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m128 _mm_mask3_fmsubadd_ps(__m128 a, __m128 b, __m128 c, __mmask8 k);
VFMSUBADDxxxPS __m128 _mm_fmsubadd_ps (__m128 a, __m128 b, __m128 c);
VFMSUBADDxxxPS __m256 _mm256_fmsubadd_ps (__m256 a, __m256 b, __m256 c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción". Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."

VFMSUBADD132PS/VFMSUBADD213PS/VFMSUBADD231PS--Fused Multiply-Alternating Subtract/Add of Packed Single Precision
