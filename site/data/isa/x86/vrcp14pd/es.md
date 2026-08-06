---
summary: Compute Reciprocales aproximados de los valores de Float64 empaquetados
---

## Descripción

Esta instrucción realiza una computación SIMD de los reciprocales aproximados de ocho/cuatro/dos valores en coma flotante de precisión doble empaquetados en el operando de origen (el segundo operando) y almacena los resultados de coma flotante de precisión doble empaquetados en el operando de destino. El error relativo máximo para esta aproximación es inferior a 2- 14.

El operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 64 bits. El operando de destino es un registro ZMM actualizado condicionalmente según la máscara de escritura.

La instrucción VRCP14PD no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se tratará como cero sólo en caso de DAZ bit set en MXCSR. De lo contrario se trata correctamente (es decir, no como un 0,0). Los resultados de la subida se desbordan a cero sólo en caso de que FTZ se fije en MXCSR. De lo contrario se tratará correctamente (es decir, el resultado correcto de flujo está escrito) con el signo del operando. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Las banderas de excepción MXCSR no se ven afectadas por esta instrucción y las excepciones coma flotante no se reportan.

** Casos especiales de VRCP14PD/VRCP14SD**

| 0 | X | 2-1024 | INF | Muy pequeño denormal |
| --- | --- | --- | --- | --- |
| -2- | 102 | 4  X  -0 | -INF | Muy pequeño denormal |

## Operación

```text
VRCP14PD ((EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+63:i] := APPROXIMATE(1.0/SRC[63:0]);

                  ELSE DEST[i+63:i] := APPROXIMATE(1.0/SRC[i+63:i]);

             FI;

ELSE

     IF *merging-masking*                ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                        ; zeroing-masking

                  DEST[i+63:i] := 0

     FI;

FI;

ENDFOR;
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VRCP14PD __m512d _mm512_rcp14_pd( __m512d a);
VRCP14PD __m512d _mm512_mask_rcp14_pd(__m512d s, __mmask8 k, __m512d a);
VRCP14PD __m512d _mm512_maskz_rcp14_pd( __mmask8 k, __m512d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción".
