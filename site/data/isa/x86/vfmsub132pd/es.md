---
summary: Multiply-Subtract of Packed Double
---

## Descripción

Realiza un conjunto de computación de SIMD multi-subtract en valores en coma flotante de precisión doble empaquetados usando tres operandos de origen y escribe los resultados multi-subtract en el operando de destino. El operando de destino es también el primer operando de origen. El segundo operando debe ser un registro SIMD. El tercer operando de origen puede ser un registro SIMD o una ubicación de memoria.

VFMSUB132PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del primer operando de origen a los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el segundo operando de origen, realiza redondeo y almacena los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados al operando de destino (primer operando de origen).

VFMSUB213PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados del segundo operando de origen a los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el primer operando de origen. Desde el resultado intermedio de precisión infinita, resta los dos, cuatro o ocho valores de doble precisión en el tercer operando de origen, realiza redondeo y almacena los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados resultantes al operando de destino (primer operando de origen).

VFMSUB231PD: Multiplica los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados de la segunda fuente a los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el tercer operando de origen. Desde el resultado intermedio de precisión infinita, resta los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados en el primer operando de origen, realiza redondeo y almacena los dos, cuatro o ocho valores en coma flotante de precisión doble empaquetados al operando de destino (primer operando de origen).

EVEX versiones codificadas: El operando de destino (también primer operando de origen) y el segundo operando de origen son ZMM/YMM/XMM registro. El tercer operando de origen es un ZMM/YMM/XMM registrado, un 512/256/128-bit ubicación de memoria o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits. El operando de destino está actualizado condicionalmente con máscara de escritura k1.

VEX.256 versión codificada: El operando de destino (también primer operando de origen) es un registro YMM y codificado en reg field. El segundo operando de origen es un registro YMM y codificado en VEX.vvvv. El tercer operando de origen es un registro YMM o una ubicación de memoria de 256 bits y codificado en rm field.

VEX.128 versión codificada: El operando de destino (también primer operando de origen) es un registro XMM y codificado en reg field. El segundo operando de origen es un registro XMM y codificado en VEX.vvvv. El tercer operando de origen es un registro XMM o una ubicación de memoria de 128 bits y codificado en rm field. Los 128 bits superiores del destino YMM registran se ponen a cero.

## Operación

```text
In the operations below, "*" and "-" symbols represent multiplication and subtraction with infinite precision inputs and outputs (no
rounding).

VFMSUB132PD DEST, SRC2, SRC3 (VEX Encoded Versions)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 64*i;
    DEST[n+63:n] := RoundFPControl_MXCSR(DEST[n+63:n]*SRC3[n+63:n] - SRC2[n+63:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUB213PD DEST, SRC2, SRC3 (VEX Encoded Versions)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 64*i;
    DEST[n+63:n] := RoundFPControl_MXCSR(SRC2[n+63:n]*DEST[n+63:n] - SRC3[n+63:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUB231PD DEST, SRC2, SRC3 (VEX Encoded Versions)
IF (VEX.128) THEN

    MAXNUM := 2
ELSEIF (VEX.256)

    MAXNUM := 4
FI
For i = 0 to MAXNUM-1 {

    n := 64*i;
    DEST[n+63:n] := RoundFPControl_MXCSR(SRC2[n+63:n]*SRC3[n+63:n] - DEST[n+63:n])
}
IF (VEX.128) THEN
    DEST[MAXVL-1:128] := 0
ELSEIF (VEX.256)
    DEST[MAXVL-1:256] := 0
FI

VFMSUB132PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Register)
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

          THEN DEST[i+63:i] :=

                  RoundFPControl(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])

          ELSE

                  IF *merging-masking*     ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUB132PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Memory Source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                        DEST[i+63:i] :=

                  RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[63:0] - SRC2[i+63:i])

                       ELSE

                        DEST[i+63:i] :=

                  RoundFPControl_MXCSR(DEST[i+63:i]*SRC3[i+63:i] - SRC2[i+63:i])

                  FI;

                  ELSE

                  IF *merging-masking*     ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE                ; zeroing-masking

                        DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VFMSUB213PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Register)

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

          THEN DEST[i+63:i] :=

                  RoundFPControl(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUB213PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Memory Source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[63:0])

+31:i])

                       ELSE

                       DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*DEST[i+63:i] - SRC3[i+63:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VFMSUB231PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Register)

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

          THEN DEST[i+63:i] :=

                  RoundFPControl(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VFMSUB231PD DEST, SRC2, SRC3 (EVEX Encoded Versions, When SRC3 Operand is a Memory Source)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

     i := j * 64

     IF k1[j] OR *no writemask*

          THEN

                  IF (EVEX.b = 1)

                       THEN

                       DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[63:0] - DEST[i+63:i])

                       ELSE

                       DEST[i+63:i] :=

                  RoundFPControl_MXCSR(SRC2[i+63:i]*SRC3[i+63:i] - DEST[i+63:i])

                  FI;

          ELSE

                  IF *merging-masking*    ; merging-masking

                       THEN *DEST[i+63:i] remains unchanged*

                       ELSE               ; zeroing-masking

                       DEST[i+63:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VFMSUBxxxPD __m512d _mm512_fmsub_pd(__m512d a, __m512d b, __m512d c);
VFMSUBxxxPD __m512d _mm512_fmsub_round_pd(__m512d a, __m512d b, __m512d c, int r);
VFMSUBxxxPD __m512d _mm512_mask_fmsub_pd(__m512d a, __mmask8 k, __m512d b, __m512d c);
VFMSUBxxxPD __m512d _mm512_maskz_fmsub_pd(__mmask8 k, __m512d a, __m512d b, __m512d c);
VFMSUBxxxPD __m512d _mm512_mask3_fmsub_pd(__m512d a, __m512d b, __m512d c, __mmask8 k);
VFMSUBxxxPD __m512d _mm512_mask_fmsub_round_pd(__m512d a, __mmask8 k, __m512d b, __m512d c, int r);
VFMSUBxxxPD __m512d _mm512_maskz_fmsub_round_pd(__mmask8 k, __m512d a, __m512d b, __m512d c, int r);
VFMSUBxxxPD __m512d _mm512_mask3_fmsub_round_pd(__m512d a, __m512d b, __m512d c, __mmask8 k, int r);
VFMSUBxxxPD __m256d _mm256_mask_fmsub_pd(__m256d a, __mmask8 k, __m256d b, __m256d c);
VFMSUBxxxPD __m256d _mm256_maskz_fmsub_pd(__mmask8 k, __m256d a, __m256d b, __m256d c);
VFMSUBxxxPD __m256d _mm256_mask3_fmsub_pd(__m256d a, __m256d b, __m256d c, __mmask8 k);
VFMSUBxxxPD __m128d _mm_mask_fmsub_pd(__m128d a, __mmask8 k, __m128d b, __m128d c);
VFMSUBxxxPD __m128d _mm_maskz_fmsub_pd(__mmask8 k, __m128d a, __m128d b, __m128d c);
VFMSUBxxxPD __m128d _mm_mask3_fmsub_pd(__m128d a, __m128d b, __m128d c, __mmask8 k);
VFMSUBxxxPD __m128d _mm_fmsub_pd (__m128d a, __m128d b, __m128d c);
VFMSUBxxxPD __m256d _mm256_fmsub_pd (__m256d a, __m256d b, __m256d c);
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Instrucciones codificadas por VEX, ver Tabla 2-19, "Tipo 2 Condiciones de Excepción".

Instrucciones codificadas por EVEX, ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción."
