---
summary: Compute Reciprocales aproximados de los valores de Float32 empaquetados
---

## Descripción

Esta instrucción realiza una computación SIMD de los reciprocales aproximados de los valores en coma flotante de precisión simple empaquetados en el operando de origen (el segundo operando) y almacena los resultados de punto flotante de precisión simple empaquetado en el operando de destino (el primer operando). El error relativo máximo para esta aproximación es inferior a 2-14.

El operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM actualizado condicionalmente según la máscara de escritura.

La instrucción VRCP14PS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se tratará como cero sólo en caso de DAZ bit set en MXCSR. De lo contrario se trata correctamente (es decir, no como un 0,0). Los resultados de la subida se desbordan a cero sólo en caso de que FTZ se fije en MXCSR. De lo contrario se tratará correctamente (es decir, el resultado correcto de flujo está escrito) con el signo del operando. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

** Casos especiales de VRCP14PS/VRCP14SS**

| 0 | X | 2-128 | INF | Muy pequeño denormal |
| --- | --- | --- | --- | --- |
| -2- | 128 | X  -0 | -INF | Muy pequeño denormal |

## Operación

```text
VRCP14PS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := APPROXIMATE(1.0/SRC[31:0]);

                  ELSE DEST[i+31:i] := APPROXIMATE(1.0/SRC[i+31:i]);

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
```

## Intel C/C++ compilador intrínseco

```c
VRCP14PS __m512 _mm512_rcp14_ps( __m512 a);
VRCP14PS __m512 _mm512_mask_rcp14_ps(__m512 s, __mmask16 k, __m512 a);
VRCP14PS __m512 _mm512_maskz_rcp14_ps( __mmask16 k, __m512 a);
VRCP14PS __m256 _mm256_rcp14_ps( __m256 a);
VRCP14PS __m256 _mm512_mask_rcp14_ps(__m256 s, __mmask8 k, __m256 a);
VRCP14PS __m256 _mm512_maskz_rcp14_ps( __mmask8 k, __m256 a);
VRCP14PS __m128 _mm_rcp14_ps( __m128 a);
VRCP14PS __m128 _mm_mask_rcp14_ps(__m128 s, __mmask8 k, __m128 a);
VRCP14PS __m128 _mm_maskz_rcp14_ps( __mmask8 k, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
