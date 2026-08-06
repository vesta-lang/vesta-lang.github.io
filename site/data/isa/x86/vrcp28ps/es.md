---
summary: Aproximación a la Reciprocal de valores en coma flotante de precisión simple empaquetados
---

## Descripción

Cubre la aproximación recíproca de los valores flotantes32 en el operando de origen (el segundo operando) y almacenar los resultados al operando de destino (el primer operando) utilizando la máscara de escritura k1. El recíproco aproximado se evalúa con menos de 2^-28 de error relativo máximo antes de redondeo final. Los resultados finales se redondean al error relativo < 2^-23 antes de ser escrito al destino.

Los valores de entrada denormales se tratan como ceros y no indican #DE, independientemente de MXCSR.DAZ. Los resultados denormales se dividen a ceros y no indican #UE, independientemente de MXCSR.FTZ.

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Si algún elemento fuente es +/-, +/-0.0 se devuelve para ese elemento. Además, si algún elemento fuente es +/-0.0, +/- se devuelve para ese elemento.

El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRCP28PS (EVEX Encoded Versions)
(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := RCP_28_SP(1.0/SRC[31:0]);

                  ELSE DEST[i+31:i] := RCP_28_SP(1.0/SRC[i+31:i]);

             FI;

ELSE

     IF *merging-masking*               ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                       ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



                             Table 8-5. VRCP28PS Special Cases

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
VRCP28PS _mm512_rcp28_round_ps ( __m512 a, int sae);
VRCP28PS __m512 _mm512_mask_rcp28_round_ps(__m512 s, __mmask16 m, __m512 a, int sae);
VRCP28PS __m512 _mm512_maskz_rcp28_round_ps( __mmask16 m, __m512 a, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
