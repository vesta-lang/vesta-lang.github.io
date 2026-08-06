---
summary: Aproximación a la Reciprocal de valores en coma flotante de precisión doble empaquetados
---

## Descripción

Calcula la aproximación recíproca de los valores flotantes64 en el operando de origen (el segundo operando) y almacenar los resultados al operando de destino (el primer operando). El recíproco aproximado se evalúa con menos de 2^-28 de error relativo máximo.

Los valores de entrada denormales se tratan como ceros y no indican #DE, independientemente de MXCSR.DAZ. Los resultados denormales se dividen a ceros y no indican #UE, independientemente de MXCSR.FTZ.

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Si algún elemento fuente es +/-, +/-0.0 se devuelve para ese elemento. Además, si algún elemento fuente es +/-0.0, +/- se devuelve para ese elemento.

El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRCP28PD (EVEX Encoded Versions)
(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := RCP_28_DP(1.0/SRC[63:0]);

                  ELSE DEST[i+63:i] := RCP_28_DP(1.0/SRC[i+63:i]);

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;



                              Table 8-3. VRCP28PD Special Cases

Input Value      Result Value  Comments

NAN              QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-1022
-2-1022 < X  -0  INF           Positive input denormal or zero; #Z
X > 21022
X < -21022       -INF          Negative input denormal or zero; #Z

X = +            +0.0f

X = -            -0.0f
X = 2-n
X = -2-n         +0.0f

                 -0.0f

                 2n            Exact result (unless input/output is a denormal)

                 -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ compilador intrínseco

```c
VRCP28PD __m512d _mm512_rcp28_round_pd ( __m512d a, int sae);
VRCP28PD __m512d _mm512_mask_rcp28_round_pd(__m512d a, __mmask8 m, __m512d b, int sae);
VRCP28PD __m512d _mm512_maskz_rcp28_round_pd( __mmask8 m, __m512d b, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
