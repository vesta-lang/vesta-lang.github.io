---
summary: Aproximación a la Reciprocal de valores en coma flotante de precisión simple escalares
---

## Descripción

Calcula la aproximación recíproca del valor bajo flotador32 en el segundo operando de origen (el tercer operando) y almacenar el resultado al operando de destino (el primer operando). El recíproco aproximado se evalúa con menos de 2^-28 de error relativo máximo antes de redondeo final. El resultado final es redondeado a < 2^-23 error relativo antes de ser escrito en el elemento flotante bajo32 del destino según máscara de escritura k1. Los bits 127:32 del destino se copian de los bits correspondientes del primer operando de origen (el segundo operando).

Un valor de entrada denormal se trata como cero y no indica #DE, independientemente de MXCSR.DAZ. Un resultado denormal se desborda a cero y no indica #UE, independientemente de MXCSR.FTZ.

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Si algún elemento fuente es +/-, +/-0.0 se devuelve para ese elemento. Además, si algún elemento fuente es +/-0.0, +/- se devuelve para ese elemento.

El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRCP28SS ((EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

           DEST[31: 0] := RCP_28_SP(1.0/SRC2[31: 0]);

ELSE

      IF *merging-masking*          ; merging-masking

           THEN *DEST[31: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[31: 0] := 0

      FI;

FI;

ENDFOR;

DEST[127:32] := SRC1[127: 32]

DEST[MAXVL-1:128] := 0



                              Table 8-6. VRCP28SS Special Cases

Input Value     Result Value  Comments

NAN             QNAN(input)   If (SRC = SNaN) then #I
0  X < 2-126
-2-126 < X  -0  INF           Positive input denormal or zero; #Z
X > 2126
X < -2126       -INF          Negative input denormal or zero; #Z

X = +           +0.0f

X = -           -0.0f
X = 2-n
X = -2-n        +0.0f

                -0.0f

                2n            Exact result (unless input/output is a denormal)

                -2n           Exact result (unless input/output is a denormal)
```

## Intel C/C++ compilador intrínseco

```c
VRCP28SS __m128 _mm_rcp28_round_ss ( __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_mask_rcp28_round_ss(__m128 s, __mmask8 m, __m128 a, __m128 b, int sae);
VRCP28SS __m128 _mm_maskz_rcp28_round_ss(__mmask8 m, __m128 a, __m128 b, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
