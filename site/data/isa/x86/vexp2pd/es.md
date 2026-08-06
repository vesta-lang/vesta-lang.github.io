---
summary: Aproximación a la Exponencial 2^x de Packed coma flotante de precisión doble
---

## Descripción

Computa la evaluación exponencial base-2 aproximada de los valores de doble precisión flotante-punto en el operado fuente (el segundo operand) y almacena los resultados al operado de destino (el primer operand) utilizando el scriptmask k1. El exponencial base-2 aproximado se evalúa con menos de 2^-23 de error relativo.

Los valores de entrada denormales se tratan como ceros y no indican #DE, independientemente de MXCSR.DAZ. Los resultados denormales se dividen a ceros y no indican #UE, independientemente de MXCSR.FTZ.

El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VEXP2PD

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := EXP2_23_DP(SRC[63:0])

                  ELSE DEST[i+63:i] := EXP2_23_DP(SRC[i+63:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-1. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ compilador intrínseco

```c
VEXP2PD __m512d _mm512_exp2a23_round_pd (__m512d a, int sae);
VEXP2PD __m512d _mm512_mask_exp2a23_round_pd (__m512d a, __mmask8 m, __m512d b, int sae);
VEXP2PD __m512d _mm512_maskz_exp2a23_round_pd ( __mmask8 m, __m512d b, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si entrada SNaN), Desbordamiento.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
