---
summary: Compute Reciprocal of valores en coma flotante de precisión simple escalares
---

## Descripción

Computación de un recíproco aproximado del bajovalor en coma flotante de precisión simpledentroel operando de origen(segundooperando) y tiendasla coma flotante de precisión simpleresultadoel operando de destino. El operando de origen puede ser un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM. Las tres palabras dobles de alto orden del operando de destino no se modifican. Ver Figura 10-6 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación flotante de precisión simple escalar.

El error relativo para esta aproximación es:

```text
    |Relative Error|  1.5  2-12
```

La instrucción RCPSS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se trata como un 0,0 (del mismo signo). Pequeños resultados (ver Sección 4.9.1.5, "Numeric Underflow Excepción (#U)" en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1) siempre se desbordan a 0.0, con el signo del operando. (Los valores de entrada superiores o iguales a tención1.111111110100000000B2125 Las vidas están garantizadas para no producir resultados minúsculos; los valores de entrada menos o igual a TEN1.00000000110000001B*2126 están garantizados para producir resultados minúsculos, que a su vez se desbordan a 0.0; y los valores de entrada entre esta gama pueden o no producir resultados minúsculos, dependiendo de la implementaciónNa

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: El primer operando de origen y el operando de destino son los mismos. Bits (MAXVL- 1:32) del registro de destino YMM correspondiente no se modifican.

VEX.128 versión codificada: Bits (MAXVL-1:128) del destino YMM registro se ponen a cero.

## Operación

```text
RCPSS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[MAXVL-1:32] (Unmodified)


VRCPSS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC2[31:0])
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
RCPSS __m128 _mm_rcp_ss(__m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".
