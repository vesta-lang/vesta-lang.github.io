---
summary: Compute Reciprocals of Square Roots of Packed coma flotante de precisión simple
---

## Descripción

Realiza una computación SIMD de los reciprocales aproximados de las raíces cuadradas de los cuatro valores en coma flotante de precisión simple empaquetados en el operando de origen (segundo operando) y almacena los resultados de coma flotante de precisión simple empaquetados en el operando de destino. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Ver Figura 10-5 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD coma flotante de precisión simple.

El error relativo para esta aproximación es:

```text
    |Relative Error|  1.5  2-12
```

La instrucción RSQRTPS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se trata como un 0,0 (del mismo signo). Cuando un valor fuente es un valor negativo (más de -0.0), una coma flotante indefinida es devuelto. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
RSQRTPS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[MAXVL-1:128] (Unmodified)

VRSQRTPS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[MAXVL-1:128] := 0

VRSQRTPS (VEX.256 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC[31:0]))
DEST[63:32] := APPROXIMATE(1/SQRT(SRC1[63:32]))
DEST[95:64] := APPROXIMATE(1/SQRT(SRC1[95:64]))
DEST[127:96] := APPROXIMATE(1/SQRT(SRC2[127:96]))
DEST[159:128] := APPROXIMATE(1/SQRT(SRC2[159:128]))
DEST[191:160] := APPROXIMATE(1/SQRT(SRC2[191:160]))
DEST[223:192] := APPROXIMATE(1/SQRT(SRC2[223:192]))
DEST[255:224] := APPROXIMATE(1/SQRT(SRC2[255:224]))
```

## Intel C/C++ compilador intrínseco

```c
RSQRTPS __m128 _mm_rsqrt_ps(__m128 a) RSQRTPS __m256 _mm256_rsqrt_ps (__m256 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
