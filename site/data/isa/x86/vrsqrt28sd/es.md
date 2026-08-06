---
summary: Aproximación a la Cuadrícula Recíproca de escalar Doble Precisión
---

## Descripción

Computa la raíz cuadrada recíproca del valor bajo flotador64 en el segundo operando de origen (el tercer operando) y almacenar el resultado al operando de destino (el primer operando). La raíz cuadrada recíproca aproximada se evalúa con menos de 2^-28 de error relativo máximo. El resultado está escrito en el elemento bajo flotador64 de xmm1 según la máscara de escritura k1. Los bits 127:64 del destino se copian de los bits correspondientes del primer operando de origen (el segundo operando).

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Números de origen negativo (no cero), así como -, devolver la NaN canónica y establecer la Bandera Inválida (#I).

Un valor de -0 debe regresar - y establecer las banderas DivByZero (#Z). Los números negativos deben devolver NaN y establecer la bandera Inválida (#I). Note sin embargo que la instrucción desactiva la entrada a cero del mismo signo, por lo que los denormales negativos regresan - y establecer la bandera DivByZero.

El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 64 bits. El operando de destino es un registro XMM.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRSQRT28SD (EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

             DEST[63: 0] := (1.0/ SQRT(SRC[63: 0]));

ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[63: 0] := 0

     FI;

FI;

ENDFOR;

DEST[127:64] := SRC1[127: 64]

DEST[MAXVL-1:128] := 0



                                 Table 8-8. VRSQRT28SD Special Cases

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
VRSQRT28SD __m128d _mm_rsqrt28_round_sd(__m128d a, __m128d b, int rounding);
VRSQRT28SD __m128d _mm_mask_rsqrt28_round_sd(__m128d s, __mmask8 m,__m128d a, __m128d b, int rounding);
VRSQRT28SD __m128d _mm_maskz_rsqrt28_round_sd( __mmask8 m,__m128d a, __m128d b, int rounding);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
