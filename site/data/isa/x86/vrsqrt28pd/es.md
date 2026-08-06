---
summary: Aproximación a la Cuadrícula Recíproca Root de Doble Precisión Empaquetada
---

## Descripción

Computa la raíz cuadrada recíproca de los valores flotantes64 en el operando de origen (el segundo operando) y almacenar los resultados al operando de destino (el primer operando). El recíproco aproximado se evalúa con menos de 2^-28 de error relativo máximo.

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Números de origen negativo (no cero), así como -, devolver la NaN canónica y establecer la Bandera Inválida (#I). Un valor de -0 debe regresar - y establecer las banderas DivByZero (#Z). Los números negativos deben devolver NaN y establecer la bandera Inválida (#I). Note sin embargo que la instrucción desactiva la entrada a cero del mismo signo, por lo que los denormales negativos regresan - y establecer la bandera DivByZero.

El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRSQRT28PD (EVEX Encoded Versions)

(KL, VL) = (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := (1.0/ SQRT(SRC[63:0]));

                  ELSE DEST[i+63:i] := (1.0/ SQRT(SRC[i+63:i]));

             FI;

ELSE

       IF *merging-masking*               ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+63:i] := 0

       FI;

FI;

ENDFOR;



                                 Table 8-7. VRSQRT28PD Special Cases

Input Value                  Result Value              Comments
NAN
X = 2-2n                     QNAN(input)               If (SRC = SNaN) then #I
X<0
X = -0 or negative denormal  2n
X = +0 or positive denormal
X = +INF                     QNaN_Indefinite           Including -INF

                             -INF                      #Z

                             +INF                      #Z

                             +0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRT28PD __m512d _mm512_rsqrt28_round_pd(__m512d a, int sae);
VRSQRT28PD __m512d _mm512_mask_rsqrt28_round_pd(__m512d s, __mmask8 m,__m512d a, int sae);
VRSQRT28PD __m512d _mm512_maskz_rsqrt28_round_pd(__mmask8 m,__m512d a, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".
