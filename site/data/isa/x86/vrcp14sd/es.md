---
summary: Computar Reciprocal aproximado de escalar Float64 Valor
---

## Descripción

Esta instrucción realiza una computación SIMD de la reciprocal aproximada del valor flotante de doble precisión bajo en el segundo operando de origen (el tercer operando) almacena el resultado en el elemento de cuádpo bajo del operando de destino (el primer operando) según la máscara de escritura k1. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen (el segundo operando). El error relativo máximo para esta aproximación es inferior a 2-14. El operando de origen puede ser un registro XMM o una ubicación de memoria de 64 bits. El operando de destino es un registro XMM.

La instrucción VRCP14SD no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se tratará como cero sólo en caso de DAZ bit set en MXCSR. De lo contrario se trata correctamente (es decir, no como un 0,0). Los resultados de la subida se desbordan a cero sólo en caso de que FTZ se fije en MXCSR. De lo contrario se tratará correctamente (es decir, el resultado correcto de flujo está escrito) con el signo del operando. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta. Ver Tabla 5-24 para valores de entrada especiales.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

Una implementación numéricamente exacta de VRCP14xx se puede encontrar en:

https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vexp2.

## Operación

```text
VRCP14SD (EVEX version)

IF k1[0] OR *no writemask*

       THEN DEST[63:0] := APPROXIMATE(1.0/SRC2[63:0]);

     ELSE

       IF *merging-masking*      ; merging-masking

            THEN *DEST[63:0] remains unchanged*

            ELSE                 ; zeroing-masking

             DEST[63:0] := 0

       FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRCP14SD __m128d _mm_rcp14_sd( __m128d a, __m128d b);
VRCP14SD __m128d _mm_mask_rcp14_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VRCP14SD __m128d _mm_maskz_rcp14_sd( __mmask8 k, __m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-53, "Tipo E5 Condiciones de Excepción Clase".
