---
summary: Compute Reciprocal aproximado de escalar Float32 Valor
---

## Descripción

Esta instrucción realiza una computación SIMD del recíproco aproximado del valor flotante de baja precisión en el segundo operando de origen (el tercer operando) y almacena el resultado en el elemento de cuádpo bajo del operando de destino (el primer operando) según la máscara de escritura k1. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen (el segundo operando). El error relativo máximo para esta aproximación es inferior a 2-14. El operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM.

La instrucción VRCP14SS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se tratará como cero sólo en caso de DAZ bit set en MXCSR. De lo contrario se trata correctamente (es decir, no como un 0,0). Los resultados de la subida se desbordan a cero sólo en caso de que FTZ se fije en MXCSR. De lo contrario se tratará correctamente (es decir, el resultado correcto de flujo está escrito) con el signo del operando. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta. Ver Tabla 5-25 para valores de entrada especiales.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRCP14SS (EVEX version)

IF k1[0] OR *no writemask*

       THEN DEST[31:0] := APPROXIMATE(1.0/SRC2[31:0]);

     ELSE

       IF *merging-masking*      ; merging-masking

            THEN *DEST[31:0] remains unchanged*

            ELSE                 ; zeroing-masking

             DEST[31:0] := 0

       FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRCP14SS __m128 _mm_rcp14_ss( __m128 a, __m128 b);
VRCP14SS __m128 _mm_mask_rcp14_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VRCP14SS __m128 _mm_maskz_rcp14_ss( __mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-53, "Tipo E5 Condiciones de Excepción Clase".
