---
summary: Compute Reciprocal of Square Root of valores en coma flotante de precisión simple escalares
---

## Descripción

Computa un recíproco aproximado de la raíz cuadrada del valor flotante de precisión baja en el operado fuente (segundo operado) almacena el resultado de un único punto flotante de precisión en el operado de destino. El operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM. Las tres palabras dobles de alto orden del operando de destino no se modifican. Ver Figura 10-6 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación flotante de precisión simple escalar.

El error relativo para esta aproximación es:

```text
    |Relative Error|  1.5  2-12
```

La instrucción RSQRTSS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se trata como un 0,0 (del mismo signo). Cuando un valor fuente es un valor negativo (más de -0.0), una coma flotante indefinida es devuelto. Cuando un valor fuente es un SNaN o QNaN, el SNaN se convierte en un QNaN o la fuente QNaN es devuelta.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

## Operación

```text
RSQRTSS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC2[31:0]))
DEST[MAXVL-1:32] (Unmodified)

VRSQRTSS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SQRT(SRC2[31:0]))
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
RSQRTSS __m128 _mm_rsqrt_ss(__m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".
