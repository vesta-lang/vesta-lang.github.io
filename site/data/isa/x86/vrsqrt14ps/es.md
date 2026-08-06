---
summary: Computar Reciprocales aproximados de las raíces cuadradas de los valores de Float32 empaquetados
---

## Descripción

Esta instrucción realiza una computación SIMD de los recíprocos aproximados de las raíces cuadradas de 16 valores en coma flotante de precisión simple empaquetados en el operando de origen (el segundo operando) y almacena los resultados de coma flotante de precisión simple empaquetados en el operando de destino (el primer operando) según la máscara de escritura. El error relativo máximo para esta aproximación es inferior a 2-14.

EVEX.512 versión codificada: El operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

La instrucción VRSQRT14PS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Cuando el operando de origen es un valor + entonces +ZERO es devuelto. Un valor de fuente denormal se trata como cero sólo si el bit DAZ se establece en MXCSR. De lo contrario se trata correctamente y realiza la aproximación con la respuesta enmascarada especificada. Cuando un valor fuente es un valor negativo (excepto 0.0) una coma flotante QNaN indefinite es devuelto. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

Nota: EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRSQRT14PS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := APPROXIMATE(1.0/ SQRT(SRC[31:0]));

                  ELSE DEST[i+31:i] := APPROXIMATE(1.0/ SQRT(SRC[i+31:i]));

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;
DEST[MAXVL-1:VL] := 0

                                          Table 5-33. VRSQRT14PS Special Cases

Input value                Result value             Comments
Any denormal
X = 2-2n                   Normal                   Cannot generate overflow
X<0
X = -0                     2n
X = +0
X = +INF                   QNaN_Indefinite          Including -INF

                           -INF

                           +INF

                           +0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRT14PS __m512 _mm512_rsqrt14_ps( __m512 a);
VRSQRT14PS __m512 _mm512_mask_rsqrt14_ps(__m512 s, __mmask16 k, __m512 a);
VRSQRT14PS __m512 _mm512_maskz_rsqrt14_ps( __mmask16 k, __m512 a);
VRSQRT14PS __m256 _mm256_rsqrt14_ps( __m256 a);
VRSQRT14PS __m256 _mm256_mask_rsqrt14_ps(__m256 s, __mmask8 k, __m256 a);
VRSQRT14PS __m256 _mm256_maskz_rsqrt14_ps( __mmask8 k, __m256 a);
VRSQRT14PS __m128 _mm_rsqrt14_ps( __m128 a);
VRSQRT14PS __m128 _mm_mask_rsqrt14_ps(__m128 s, __mmask8 k, __m128 a);
VRSQRT14PS __m128 _mm_maskz_rsqrt14_ps( __mmask8 k, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
